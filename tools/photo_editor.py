"""Local editor for the photo gallery (titles, places, hidden, featured).

Double-click tools/open-photo-editor.bat, or run:  python tools/photo_editor.py
It serves this folder on 127.0.0.1 only, opens tools/photo-editor.html in your browser,
and lets that page save js/photos.js and publish it (git commit + push) with one click.
Only the editable fields are ever copied into js/photos.js; everything else stays as it is.
Standard library only."""
import argparse
import http.server
import json
import os
import secrets
import subprocess
import sys
import webbrowser
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "js", "photos.js")
MAX_TEXT = 160


def read_data():
    with open(DATA, encoding="utf-8") as f:
        s = f.read()
    head = s[: s.index("window.PHOTOS")]
    return head, json.loads(s[s.index("{"): s.rindex("}") + 1])


def write_data(head, data):
    text = head + "window.PHOTOS = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
    tmp = DATA + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    os.replace(tmp, DATA)


def bilingual(v):
    """{'en','zh'} with both filled (one copied from the other), or None when both are empty."""
    if not isinstance(v, dict):
        return None
    en = str(v.get("en") or "").strip()[:MAX_TEXT]
    zh = str(v.get("zh") or "").strip()[:MAX_TEXT]
    if not en and not zh:
        return None
    return {"en": en or zh, "zh": zh or en}


def set_optional(obj, key, value):
    if value in (None, False):
        if key in obj:
            del obj[key]
            return 1
        return 0
    if obj.get(key) != value:
        obj[key] = value
        return 1
    return 0


def merge(cur, new):
    """Copy only the editable fields from `new` onto `cur`; returns how many fields changed."""
    changed = 0
    new_albums = new.get("albums") if isinstance(new.get("albums"), dict) else {}
    for key, album in cur["albums"].items():
        src = new_albums.get(key)
        if not isinstance(src, dict):
            continue
        title = bilingual(src.get("title"))
        if title and title != album.get("title"):  # an album always keeps a name
            album["title"] = title
            changed += 1
        changed += set_optional(album, "place", bilingual(src.get("place")))
    new_items = {i.get("id"): i for i in new.get("items", []) if isinstance(i, dict)}
    for item in cur["items"]:
        src = new_items.get(item["id"])
        if not src:
            continue
        title = bilingual(src.get("title"))
        if title and title != item.get("title"):
            item["title"] = title
            changed += 1
        changed += set_optional(item, "place", bilingual(src.get("place")))
        changed += set_optional(item, "hidden", True if src.get("hidden") else None)
        feat = src.get("featured")
        feat = int(feat) if isinstance(feat, (int, float)) and not isinstance(feat, bool) and feat > 0 else None
        changed += set_optional(item, "featured", feat)
    return changed


def git(*args, timeout=120):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True,
                          encoding="utf-8", errors="replace", timeout=timeout)


def unpublished():
    r = git("status", "--porcelain", "--", "js/photos.js")
    return r.returncode == 0 and bool(r.stdout.strip())


def publish():
    if not unpublished():
        return True, "没有需要发布的新修改：js/photos.js 和上次发布的一样。\nNothing new to publish."
    c = git("commit", "-m", "Update photo titles and places", "--", "js/photos.js")
    if c.returncode:
        return False, (c.stdout + c.stderr).strip()
    p = git("push", timeout=300)
    return p.returncode == 0, "\n".join(x for x in (c.stdout.strip(), p.stdout.strip(), p.stderr.strip()) if x)


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml",
                      ".jpg": "image/jpeg", ".webp": "image/webp", ".json": "application/json"}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def log_message(self, *args):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _host_ok(self):
        return self.headers.get("Host", "") in self.server.hosts

    def _reply(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _static_ok(self):
        path = urlparse(self.path).path
        if not self._host_ok() or path.startswith("/.git") or path.startswith("/api/"):
            self.send_error(404)
            return False
        return True

    def do_GET(self):
        if self._static_ok():
            super().do_GET()

    def do_HEAD(self):
        if self._static_ok():
            super().do_HEAD()

    def do_POST(self):
        origin_ok = self.headers.get("Origin") in {f"http://{h}" for h in self.server.hosts}
        token_ok = secrets.compare_digest(self.headers.get("X-Editor-Token", ""), self.server.token)
        if not (self._host_ok() and origin_ok and token_ok):
            self._reply(403, {"ok": False, "error": "forbidden"})
            return
        path = urlparse(self.path).path
        length = int(self.headers.get("Content-Length") or 0)
        if length > 4_000_000:
            self._reply(413, {"ok": False, "error": "too large"})
            return
        body = self.rfile.read(length) if length else b""
        try:
            if path == "/api/ping":
                self._reply(200, {"ok": True, "unpublished": unpublished()})
            elif path == "/api/save":
                new = json.loads(body.decode("utf-8"))
                head, cur = read_data()
                changed = merge(cur, new)
                if changed:
                    write_data(head, cur)
                self._reply(200, {"ok": True, "changed": changed, "unpublished": unpublished()})
            elif path == "/api/publish":
                ok, out = publish()
                self._reply(200, {"ok": ok, "output": out, "unpublished": unpublished()})
            else:
                self._reply(404, {"ok": False, "error": "not found"})
        except Exception as e:  # report anything unexpected to the page instead of dropping the request
            self._reply(500, {"ok": False, "error": f"{type(e).__name__}: {e}"})


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--port", type=int, default=0, help="port to use (default: first free one from 8765)")
    ap.add_argument("--no-browser", action="store_true", help="don't open the browser")
    ap.add_argument("--token", default=None, help=argparse.SUPPRESS)  # for automated tests
    args = ap.parse_args()
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

    server = None
    for port in ([args.port] if args.port else range(8765, 8800)):
        try:
            server = http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler)
            break
        except OSError:
            continue
    if server is None:
        print("找不到可用端口 / no free port found")
        return 1
    port = server.server_address[1]
    server.hosts = {f"127.0.0.1:{port}", f"localhost:{port}"}
    server.token = args.token or secrets.token_urlsafe(18)
    url = f"http://127.0.0.1:{port}/tools/photo-editor.html#t={server.token}"

    print("🎞️  暗房编辑器已启动 / Darkroom editor is running")
    print(f"    {url}")
    print("    改完在网页里点「保存」「发布上线」；关掉这个窗口就会退出。")
    print("    Save and publish from the page. Close this window to stop.")
    if not args.no_browser:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    return 0


if __name__ == "__main__":
    sys.exit(main())
