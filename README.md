# juice-zhi.github.io

郭智 Zhi Guo（a.k.a. Juice）的个人主页，风格是科幻 × 可爱、卡通 × 酷炫。
纯静态网页，没有框架、没有构建步骤，GitHub Pages 直接托管。

🔗 https://juice-zhi.github.io/

## 目录结构

```
index.html        页面骨架（各个 section 的容器、吉祥物 SVG、导航）
404.html          「迷失太空」404 页面
css/style.css     全部样式与动画
js/content.js     ★ 所有文字内容（中英双语），改简历只需要改这个文件
js/main.js        渲染 content.js + 各种交互（语言切换、滚动显现、计数器、成就、彩蛋…）
js/fx.js          星空背景、流星、鼠标星光拖尾、点击爆炸特效、彩纸
js/labviz.js      研究卡片上的 4 个实时小动画（目标检测 / 光子成像 / 体积云 / 室内定位）
js/mascot.js      机器猫 Byte：眼睛跟随鼠标、眨眼、说话气泡、打瞌睡
js/drive.js       试驾小游戏：按 D 在网页上开车（空格漂移、Shift 加速、Esc 退出）
assets/           头像、相册照片（gallery/，已去除 EXIF）、香港天际线照片、favicon、分享预览图 og.jpg
```

## 怎么改内容

打开 `js/content.js`，每个字段都可以写成普通字符串，或者 `{ en: "...", zh: "..." }` 的双语形式：

- `profile`：邮箱、GitHub、LinkedIn、时区（联系区的「麦迪逊当地时间」用它）
- `bio` / `stats` / `charsheet` / `now`：关于我
- `experience`：工作经历（任务日志）
- `research`：研究项目，`viz` 字段决定卡片顶部的小动画；`compact: true` 的卡片只显示实验室信息
- `projects` / `moreLoot`：GitHub 项目
- `education` / `skills` / `achievements`：教育、技能、成就
- `gallery`：「拍照模式」相册，每张照片有原图 `src` 和缩略图 `thumb`，加新照片时记得先去掉 EXIF 定位信息
- `ui`：页面上的按钮、标题等固定文案
- `mascot`：机器猫的台词

## 本地预览

直接双击 `index.html` 就能看。也可以起一个本地服务器：

```bash
python -m http.server 8000 --bind 127.0.0.1
```

然后访问 http://127.0.0.1:8000 。

## 部署到 GitHub Pages

1. 在 GitHub 上新建仓库，名字必须是 `Juice-zhi.github.io`
2. 把本目录的所有文件推到 `main` 分支
3. 仓库 Settings → Pages → Source 选 `Deploy from a branch`，分支选 `main` / `(root)`
4. 等一两分钟，访问 https://juice-zhi.github.io/

## 彩蛋

- 按 **D**：在网页上开车，空格漂移，Shift 加速，Esc 退出
- **↑↑↓↓←→←→BA**：派对模式
- 点一下右下角的机器猫
- 一直滚到页面最底部
- 切到别的标签页，再切回来看看标题

## 无障碍

尊重系统的「减少动态效果」（`prefers-reduced-motion`）设置：开启后跳过开机动画，大部分动效都会关闭。
