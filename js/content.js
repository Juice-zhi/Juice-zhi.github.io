/* ==========================================================================
   content.js — every word on the page lives here (English + 中文).
   Edit this file to update the site. No build step needed.
   A field can be a plain string, or { en: "...", zh: "..." }.
   ========================================================================== */
window.SITE = (() => {
  const A = (url, text) =>
    `<a class="ln" href="${url}" target="_blank" rel="noopener">${text}</a>`;

  const L = {
    uw: "https://www.wisc.edu/",
    uwcs: "https://www.cs.wisc.edu/",
    hkust: "https://hkust.edu.hk/",
    cpeg: "https://cpeg.hkust.edu.hk/",
    utah: "https://www.utah.edu/",
    eae: "https://games.utah.edu/",
    lightspeed: "https://www.lightspeed-studios.com/",
    gfp: "https://gp.qq.com/",
    wision: "https://wisionlab.com/",
    mohit: "https://pages.cs.wisc.edu/~mohitg/",
    yinli: "https://yinli-vision.github.io/",
    mrpnnPaper: "https://doi.org/10.1145/3588432.3591493",
    mrpnnCode: "https://github.com/What-a-stupid-username/MRPNN",
    autoresearch: "https://github.com/karpathy/autoresearch",
    urop: "https://urop.hkust.edu.hk/",
    firebird: "https://ctftime.org/team/65249/",
    recipesSite: "https://juice-zhi.github.io/recipes/",
    gh: "https://github.com/Juice-zhi",
    linkedin: "https://www.linkedin.com/in/zhi-guo-418296225",
  };
  const repo = (name) => `${L.gh}/${name}`;

  return {
    links: L,

    profile: {
      name: { en: "Zhi Guo", zh: "郭智" },
      nick: "Juice",
      email: "540393671@qq.com",
      github: L.gh,
      linkedin: L.linkedin,
      timezone: "America/Chicago",
    },

    roles: {
      en: [
        "Game Client Developer",
        "Vehicle Physics Tamer",
        "Real-time Graphics Nerd",
        "Computational Imaging Researcher",
        "Unreal Engine Wrangler",
        "CTF Player",
        "Golden-hour Photographer",
      ],
      zh: [
        "游戏客户端开发",
        "载具物理驯兽师",
        "实时图形发烧友",
        "计算成像研究者",
        "虚幻引擎老玩家",
        "CTF 选手",
        "黄金时刻摄影师",
      ],
    },

    /* ---------------- About ---------------- */
    bio: {
      en: [
        `Hi! I'm Zhi. Online I go by <b>Juice</b> 🧃. I'm a first-year M.S. Computer Science student at the ${A(L.uw, "University of Wisconsin–Madison")}. Before that I spent two years as a game client developer at ${A(L.lightspeed, "Tencent LightSpeed Studios")}, building gameplay for ${A(L.gfp, "Game for Peace")} (PUBG Mobile China), a live multiplayer shooter that roughly <b>40 million</b> people play every day.`,
        `I love the spot where real-time systems meet light and physics. On the game side I've owned features end to end in C++ and Unreal Engine: vehicle mechanics, physics-driven interactions, network resilience and client-side anti-cheat. I also built the tooling that lets designers ship new content without waiting on engineers. On the research side I care about how light behaves, from neural approximations of multiple scattering in clouds and smoke to computational cameras that see what ordinary ones can't.`,
        `Right now I'm doing research at UW–Madison in ${A(L.yinli, "Prof. Yin Li")}'s group and at ${A(L.mohit, "Prof. Mohit Gupta")}'s ${A(L.wision, "WISION Lab")}. Outside the lab you'll find me playing CTFs, shooting city skylines at golden hour (and the occasional paper target at the range), hanging out at game cons, and building oddly specific tools, from a fully local voice-practice agent to a full-stack quant-trading playground.`,
      ],
      zh: [
        `你好！我是 Zhi，网上常用的名字是 <b>Juice</b> 🧃。目前在${A(L.uw, "威斯康星大学麦迪逊分校")}读计算机科学硕士一年级。在此之前，我在${A(L.lightspeed, "腾讯光子工作室群")}做了两年游戏客户端开发，参与${A(L.gfp, "《和平精英》")}的玩法研发。这是一款每天约有 <b>4000 万</b>玩家在线的多人射击手游。`,
        `我最感兴趣的是实时系统与光、物理交汇的地方。游戏这边，我用 C++ 和 Unreal Engine 端到端负责过载具机制、物理交互、弱网韧性与客户端反外挂，也做过让策划不必等程序、自己就能产出内容的工具链。研究这边，我关心光的行为：从用神经网络近似云和烟雾里的多次散射，到能看见普通相机看不见的东西的计算相机。`,
        `现在我在 UW–Madison 的 ${A(L.yinli, "Yin Li 教授")}课题组和 ${A(L.mohit, "Mohit Gupta 教授")}的 ${A(L.wision, "WISION 实验室")}做研究。实验室之外，我打 CTF，在黄金时刻拍城市天际线（偶尔也去靶场打打纸靶），逛逛漫展，也喜欢做一些用途很具体的小工具，从完全本地运行的口语陪练 Agent 到全栈量化交易实验场。`,
      ],
    },

    stats: [
      { count: 40, suffix: "M+", label: { en: "players a day on the live game I helped build", zh: "我参与开发的游戏每日活跃玩家" } },
      { count: 2, suffix: { en: " yrs", zh: " 年" }, label: { en: "shipping a live-service mobile shooter", zh: "一线在线手游研发经验" } },
      { count: 3, suffix: "", label: { en: "universities · HK → Utah → Madison", zh: "所大学 · 香港 → 犹他 → 麦迪逊" } },
      { display: "∞", label: { en: "cups of juice (unverified)", zh: "杯果汁（尚未核实）" } },
    ],

    charsheet: [
      { k: { en: "CLASS", zh: "职业" }, v: { en: "Gameplay × Graphics Engineer", zh: "玩法 × 图形工程师" } },
      { k: { en: "GUILD", zh: "公会" }, v: { en: "UW–Madison Computer Sciences", zh: "UW–Madison 计算机系" } },
      { k: { en: "BASE", zh: "据点" }, v: { en: "Madison, WI, USA", zh: "美国 · 威斯康星州麦迪逊" } },
      { k: { en: "LAST GUILD", zh: "前公会" }, v: { en: "Tencent LightSpeed Studios", zh: "腾讯光子工作室群" } },
      { k: { en: "LANGUAGES", zh: "语言" }, v: { en: "Mandarin (native) · English (fluent)", zh: "中文（母语）· 英语（流利）" } },
    ],

    now: [
      { icon: "🔬", text: { en: "Doing research in Prof. Yin Li's group", zh: "在 Yin Li 教授的课题组做研究" } },
      { icon: "📷", text: { en: "Doing research at the WISION Lab with Prof. Mohit Gupta", zh: "在 WISION 实验室跟随 Mohit Gupta 教授做研究" } },
      { icon: "📚", text: { en: "Taking Computer Architecture, NLP & High-Performance Computing", zh: "在修计算机体系结构、自然语言处理与高性能计算" } },
      { icon: "🧃", text: { en: "Probably refilling my juice", zh: "大概率在续杯果汁" } },
    ],

    /* ---------------- Experience ---------------- */
    experience: [
      {
        icon: "🚗",
        badge: { en: "MAIN QUEST", zh: "主线任务" },
        badgeClass: "b-main",
        org: { en: "Tencent LightSpeed Studios", zh: "腾讯光子工作室群" },
        orgUrl: L.lightspeed,
        project: { en: "Game for Peace (PUBG Mobile China)", zh: "《和平精英》" },
        role: { en: "Software Engineer · Game Client (Full-time)", zh: "软件工程师 · 游戏客户端（全职）" },
        date: { en: "Jul 2024 – Aug 2026", zh: "2024.07 – 2026.08" },
        place: { en: "Hong Kong SAR, China", zh: "中国香港" },
        summary: {
          en: "Two years on the client team of one of the world's biggest live mobile shooters. I owned vehicle gameplay end to end, from C++ gameplay code and physics interactions inside Unreal Engine to the configuration pipeline designers use to ship new vehicle content. I also worked on keeping the game playable on bad networks and on catching cheaters.",
          zh: "在全球体量最大的在线射击手游之一的客户端团队工作了两年。我端到端负责载具玩法，从 Unreal Engine 里的 C++ 玩法代码与物理交互，到策划用来产出新载具内容的配置管线。另外也做弱网下的可玩性优化和反外挂。",
        },
        bullets: [
          {
            icon: "🚗",
            title: { en: "Vehicle mechanics & physics interactions", zh: "载具机制与物理交互" },
            text: {
              en: "Owned the design and implementation of vehicle mechanics and physics-based interactions in C++ and Unreal Engine for a live multiplayer title with ~40M daily active users. Built reusable gameplay systems and content workflows so new vehicle features could ship reliably on a live-service cadence.",
              zh: "使用 C++ 与 Unreal Engine，主导设计并实现载具机制与基于物理的交互，服务日活约 4000 万的在线多人游戏。沉淀可复用的玩法系统与内容生产流程，让新载具功能能按线上运营节奏稳定交付。",
            },
          },
          {
            icon: "📡",
            title: { en: "Network resilience & runtime stability", zh: "弱网韧性与运行时稳定性" },
            text: {
              en: "Implemented runtime and network-resilience optimizations across the engine and gameplay layers, improving performance stability and keeping matches smooth and continuous for players on high-latency or unstable mobile networks.",
              zh: "在引擎层与玩法层做运行时与网络韧性优化，提升性能稳定性，让处在高延迟、网络不稳定环境下的玩家也能获得流畅、连贯的对局体验。",
            },
          },
          {
            icon: "🛡️",
            title: { en: "Client-side anti-cheat", zh: "客户端反外挂" },
            text: {
              en: "Improved client-side checks for abnormal gameplay behavior, broadening anti-cheat detection coverage and making the production multiplayer detection systems more robust.",
              zh: "改进针对异常游戏行为的客户端检测逻辑，扩大反外挂检测覆盖面，提升线上多人对局检测系统的鲁棒性。",
            },
          },
          {
            icon: "🧰",
            title: { en: "Designer tooling & troubleshooting workflows", zh: "策划工具链与排障流程" },
            text: {
              en: "Standardized vehicle-scenario configuration across maps, routes and vehicle types so designers could set up new scenarios on their own, and streamlined the troubleshooting workflow so developers could pinpoint issues faster.",
              zh: "统一跨地图、路线与载具类型的载具场景配置流程，让策划能独立配置新场景；同时梳理排障流程，帮助开发同学更快定位问题。",
            },
          },
        ],
        // shipped features, shown as video cards (gameplay videos by players on Bilibili)
        works: [
          {
            url: "https://www.bilibili.com/video/BV1JNo2YLEpF/",
            thumb: "assets/works/arms-truck.jpg",
            sticker: "🚚",
            tag: "CG31",
            duration: "1:14",
            map: { en: "Island map", zh: "海岛" },
            title: { en: "Arms Transport Truck", zh: "海岛军火运输车" },
            desc: {
              en: "An armored supply truck that rolls across the Island on six different routes, dropping loot along the way.",
              zh: "会掉落物资的军火运输车，沿六条运输路线在海岛上穿行。",
            },
            uploader: "哆啦和平精英",
          },
          {
            url: "https://www.bilibili.com/video/BV1FUqcBFEDa/",
            thumb: "assets/works/dunhuang-camel.jpg",
            sticker: "🐫",
            tag: "CG35",
            duration: "0:16",
            map: { en: "Island map · Lunar New Year", zh: "海岛 · 新春" },
            title: { en: "Dunhuang Camel", zh: "海岛新春敦煌骆驼" },
            desc: {
              en: "A festive Dunhuang-style camel for the Lunar New Year update. Hop on and ride it across the Island.",
              zh: "新春版本上线的敦煌风骆驼，跳上去就能骑着它在海岛上奔跑。",
            },
            uploader: "羞蕊",
          },
          {
            url: "https://www.bilibili.com/video/BV1FZMg6XEPR/",
            thumb: "assets/works/haunted-palanquin.jpg",
            sticker: "🏮",
            tag: { en: "LOST TOMB", zh: "古墓迷途" },
            duration: "2:01",
            map: { en: "Changbai Celestial Palace", zh: "长白仙宫" },
            title: { en: "Haunted Palanquin", zh: "仙宫诡轿" },
            desc: {
              en: "Eerie sedan chairs you can drive or ride through the Changbai Celestial Palace in the Lost Tomb mode.",
              zh: "古墓迷途模式中长白仙宫里的诡轿，既可以驾驶，也可以乘坐。",
            },
            uploader: "小新新看动漫玩游戏",
          },
        ],
        tags: ["C++", "Unreal Engine", "Gameplay Systems", "Vehicle Physics", "Network Resilience", "Anti-Cheat", "Tools & Pipelines", "Live Ops"],
        links: [
          { label: { en: "LightSpeed Studios", zh: "光子工作室群" }, url: L.lightspeed },
          { label: { en: "Game for Peace", zh: "和平精英官网" }, url: L.gfp },
        ],
      },
      {
        icon: "🎯",
        badge: { en: "SIDE QUEST · CLASSIFIED", zh: "支线任务 · 保密" },
        badgeClass: "b-secret",
        org: { en: "Tencent LightSpeed Studios", zh: "腾讯光子工作室群" },
        orgUrl: L.lightspeed,
        project: { en: "Unannounced AAA Shooter", zh: "未公布的 3A 射击项目" },
        role: { en: "Game Client Developer Intern", zh: "游戏客户端开发实习生" },
        date: { en: "May 2023 – Aug 2023", zh: "2023.05 – 2023.08" },
        place: { en: "Shenzhen, China", zh: "中国深圳" },
        summary: {
          en: "A summer inside AAA production on an unannounced multiplayer shooter. The details are under NDA, so this is the declassified version 🤫",
          zh: "在一个尚未公布的 3A 多人射击项目里度过的夏天。具体内容受保密协议约束，下面是解密版 🤫",
        },
        bullets: [
          {
            icon: "🎯",
            title: { en: "Client-side gameplay systems", zh: "客户端玩法系统" },
            text: {
              en: "Implemented client-side gameplay functionality by developing gameplay systems and integrating them into the project's Unreal Engine codebase.",
              zh: "开发客户端玩法系统并集成进项目的 Unreal Engine 工程，实现客户端玩法功能。",
            },
          },
          {
            icon: "🏗️",
            title: { en: "Learning the AAA production rhythm", zh: "体验 3A 研发节奏" },
            text: {
              en: "Got hands-on with how a large team ships: working in a big Unreal Engine codebase, following the team's integration workflow and iterating on features in-engine.",
              zh: "亲身体验大型团队如何交付：在大体量的 Unreal Engine 工程中开发，遵循团队的集成流程，在引擎内迭代功能。",
            },
          },
        ],
        tags: ["Unreal Engine", "C++", "Gameplay", "Multiplayer"],
        links: [{ label: { en: "LightSpeed Studios", zh: "光子工作室群" }, url: L.lightspeed }],
      },
      {
        icon: "🕹️",
        badge: { en: "SIDE QUEST", zh: "支线任务" },
        badgeClass: "b-side",
        org: { en: "Hoopoe Technology", zh: "Hoopoe Technology" },
        project: null,
        role: { en: "Unity Programmer Intern", zh: "Unity 程序实习生" },
        date: { en: "Jul 2022 – Aug 2022", zh: "2022.07 – 2022.08" },
        place: null,
        summary: {
          en: "Took a game idea from an empty Unity scene to something you could actually pick up and play.",
          zh: "把一个游戏点子从空白的 Unity 场景，做成真正可以上手玩的原型。",
        },
        bullets: [
          {
            icon: "🕹️",
            title: { en: "Playable prototype, end to end", zh: "端到端的可玩原型" },
            text: {
              en: "Built a playable game prototype in Unity by bringing scene construction, visual effects and core gameplay logic together into one working gameplay experience.",
              zh: "在 Unity 中把场景搭建、视觉特效与核心玩法逻辑整合在一起，完成一个可玩的游戏原型。",
            },
          },
          {
            icon: "✨",
            title: { en: "Scenes, VFX & game feel", zh: "场景、特效与手感" },
            text: {
              en: "Assembled the levels, wired up the visual effects and scripted the core gameplay loop in C#, iterating until the prototype felt good to play.",
              zh: "搭建关卡、接入视觉特效，用 C# 编写核心玩法循环，反复打磨直到原型玩起来顺手。",
            },
          },
        ],
        tags: ["Unity", "C#", "VFX", "Prototyping"],
        links: [],
      },
      {
        icon: "🎨",
        badge: { en: "SIDE QUEST", zh: "支线任务" },
        badgeClass: "b-side",
        org: { en: "GREMOD", zh: "GREMOD" },
        project: null,
        role: { en: "UI/UX Designer Intern", zh: "UI/UX 设计实习生" },
        date: { en: "Dec 2021 – Jan 2022", zh: "2021.12 – 2022.01" },
        place: null,
        summary: {
          en: "A detour into design that taught me to think about players and users first.",
          zh: "一次设计方向的「绕路」，让我学会先站在玩家和用户的角度思考。",
        },
        bullets: [
          {
            icon: "🎨",
            title: { en: "Web & handbook UI", zh: "网站与手册 UI" },
            text: {
              en: "Designed UI assets for the company website and handbook in Photoshop and Illustrator.",
              zh: "使用 Photoshop 与 Illustrator 设计公司网站与手册的 UI 素材。",
            },
          },
          {
            icon: "🧭",
            title: { en: "Interactive onboarding in Unity", zh: "Unity 交互式新手引导" },
            text: {
              en: "Developed a Unity onboarding tutorial that walked new users through the core interactions step by step.",
              zh: "在 Unity 中开发新手引导教程，一步步带新用户熟悉核心交互。",
            },
          },
        ],
        tags: ["UI/UX", "Photoshop", "Illustrator", "Unity"],
        links: [],
      },
    ],

    /* ---------------- Research ---------------- */
    research: [
      {
        viz: "vision",
        compact: true,
        vizLabel: { en: "computer vision", zh: "计算机视觉" },
        status: { en: "ONGOING", zh: "进行中" },
        org: { en: "UW–Madison", zh: "威斯康星大学麦迪逊分校" },
        title: { en: "Prof. Yin Li's Group", zh: "Yin Li 教授课题组" },
        sub: { en: "Computer vision & machine learning", zh: "计算机视觉与机器学习" },
        advisor: { name: { en: "Prof. Yin Li", zh: "Yin Li 教授" }, url: L.yinli },
        date: { en: "2026 – Present", zh: "2026 – 至今" },
        summary: {
          en: "Graduate research in Prof. Yin Li's group, whose work centers on computer vision and machine learning.",
          zh: "在 Yin Li 教授的课题组做研究，课题组的主要方向是计算机视觉与机器学习。",
        },
        links: [{ label: { en: "Prof. Yin Li", zh: "Yin Li 教授主页" }, url: L.yinli }],
      },
      {
        viz: "photon",
        compact: true,
        vizLabel: { en: "computational imaging", zh: "计算成像" },
        status: { en: "ONGOING", zh: "进行中" },
        org: { en: "UW–Madison", zh: "威斯康星大学麦迪逊分校" },
        title: { en: "WISION Lab", zh: "WISION 实验室" },
        sub: { en: "Wisconsin Computational Imaging and Vision Lab", zh: "威斯康星计算成像与视觉实验室" },
        advisor: { name: { en: "Prof. Mohit Gupta", zh: "Mohit Gupta 教授" }, url: L.mohit },
        date: { en: "2026 – Present", zh: "2026 – 至今" },
        summary: {
          en: "Graduate research at the WISION Lab, which builds next-generation computer vision systems: novel computational cameras, plus physics- and learning-based algorithms for understanding scenes.",
          zh: "在 WISION 实验室做研究。实验室致力于打造下一代计算机视觉系统：设计新型计算相机，并用物理与学习相结合的算法来理解场景。",
        },
        links: [
          { label: { en: "WISION Lab", zh: "WISION 实验室" }, url: L.wision },
          { label: { en: "Prof. Mohit Gupta", zh: "Mohit Gupta 教授主页" }, url: L.mohit },
        ],
      },
      {
        viz: "cloud",
        vizLabel: { en: "multi-scatter ≈ tiny neural net", zh: "多次散射 ≈ 小型神经网络" },
        status: { en: "SHIPPED", zh: "已完成" },
        org: { en: "Tencent · Tech Future 7th", zh: "腾讯 · Tech Future 第七期" },
        title: { en: "Aerosols AI: Neural Volumetric Rendering", zh: "Aerosols AI：神经体积渲染" },
        sub: { en: "ML Team", zh: "机器学习组" },
        advisor: null,
        date: { en: "2025 – 2026", zh: "2025 – 2026" },
        summary: {
          en: "Clouds, smoke and fog get their soft, glowing look from light scattering many times inside the medium. That looks beautiful offline and is brutally expensive in real time. We built an Unreal Engine 5 volumetric-rendering extension that uses deep learning to approximate multi-order light scattering at interactive frame rates, aiming for near-offline visual quality.",
          zh: "云、烟与雾看起来柔和通透，是因为光在介质内部发生了多次散射。离线渲染很美，实时计算却极其昂贵。我们开发了一个 Unreal Engine 5 体积渲染扩展，用深度学习近似多阶光散射，在可交互帧率下追求接近离线渲染的画质。",
        },
        bullets: [
          { icon: "☁️", text: { en: `<b>Built on MRPNN</b> (${A(L.mrpnnPaper, "SIGGRAPH 2023")}), a lightweight radiance-predicting network that uses cheap transmittance-field features to estimate high-order in-scattering in real time.`, zh: `<b>基于 MRPNN</b>（${A(L.mrpnnPaper, "SIGGRAPH 2023")}）：一个轻量级辐射度预测网络，借助低成本的透射率场特征实时估计高阶内散射。` } },
          { icon: "🎮", text: { en: "<b>Engine integration:</b> brought neural scattering into a UE5 extension for participating media, balancing frame-time budgets against visual fidelity.", zh: "<b>引擎集成：</b>把神经散射集成进面向参与介质的 UE5 扩展，在帧时间预算与画面保真度之间取得平衡。" } },
          { icon: "🤖", text: { en: `<b>Side experiment:</b> ${A(repo("autoresearch-mrpnn"), "autoresearch-mrpnn")} lets an AI agent edit the training code, run 5-minute experiments, keep improvements and revert regressions on a ~49K-parameter SE-attention MLP.`, zh: `<b>延伸实验：</b>${A(repo("autoresearch-mrpnn"), "autoresearch-mrpnn")} 让 AI Agent 自主修改训练代码、跑 5 分钟实验、保留改进并回滚退化，持续优化约 4.9 万参数的 SE-attention MLP。` } },
        ],
        tags: ["Unreal Engine 5", "CUDA", "PyTorch", "Neural Rendering", "Participating Media"],
        links: [
          { label: { en: "MRPNN paper", zh: "MRPNN 论文" }, url: L.mrpnnPaper },
          { label: { en: "MRPNN code", zh: "MRPNN 代码" }, url: L.mrpnnCode },
          { label: { en: "autoresearch-mrpnn", zh: "autoresearch-mrpnn" }, url: repo("autoresearch-mrpnn") },
        ],
      },
      {
        viz: "indoor",
        vizLabel: { en: "where am I? (indoors)", zh: "我在哪？（室内）" },
        status: { en: "CLEARED", zh: "已通关" },
        org: { en: "HKUST · UROP", zh: "香港科技大学 · UROP" },
        title: { en: "Indoor Localization & Mobile Computing", zh: "室内定位与移动计算" },
        sub: { en: "Undergraduate Research Opportunities Program", zh: "本科生科研计划" },
        advisor: null,
        date: { en: "2021", zh: "2021" },
        summary: {
          en: "My first taste of research. GPS falls apart indoors, so through HKUST's Undergraduate Research Opportunities Program I studied positioning methods that let mobile devices work out where they are inside buildings.",
          zh: "我的科研初体验。GPS 在室内几乎失效，于是我通过港科大本科生科研计划（UROP）研究让移动设备在建筑物内确定自身位置的定位方法。",
        },
        bullets: [
          { icon: "📶", text: { en: "Studied positioning methods for indoor mobile environments, where signals are noisy and devices are power-limited.", zh: "研究面向室内移动环境的定位方法：那里信号嘈杂，设备功耗也受限。" } },
          { icon: "🧪", text: { en: "Learned the research loop: reading papers, running experiments and presenting results.", zh: "完整走了一遍科研流程：读论文、做实验、汇报结果。" } },
        ],
        tags: ["Mobile Computing", "Indoor Positioning", "Research"],
        links: [{ label: { en: "HKUST UROP", zh: "港科大 UROP" }, url: L.urop }],
      },
    ],

    /* ---------------- Projects (GitHub) ---------------- */
    projects: [
      {
        name: "QuantTrader",
        icon: "📈",
        rarity: "legendary",
        desc: {
          en: "A full-stack quantitative trading playground: a 26-factor library (technical, momentum, volatility, volume-price and a composite score), 5 built-in strategies, and a backtest engine that simulates fees, slippage and stop-losses and reports 16 performance metrics. It also has a paper-trading engine, all driven from a React + Electron dashboard talking to a FastAPI REST/WebSocket backend.",
          zh: "一个全栈量化交易实验场：26 个因子（技术、动量、波动率、量价与复合评分）、5 个内置策略，以及模拟手续费、滑点与止损并输出 16 项绩效指标的回测引擎。另有模拟盘交易引擎，前端是 React + Electron 控制台，后端是 FastAPI（REST + WebSocket）。",
        },
        tags: ["Python", "FastAPI", "React", "Electron", "SQLite / PostgreSQL"],
        links: [{ label: { en: "Code", zh: "代码" }, url: repo("QuantTrader") }],
      },
      {
        name: "local-speaking-agent",
        icon: "🎙️",
        rarity: "epic",
        desc: {
          en: "A fully local, always-listening speaking partner. faster-whisper handles speech-to-text, an Ollama-hosted LLM does the talking and Kokoro ONNX speaks back. It notices when you start talking, sends after a pause, detects the language of each turn and gives grammar & pronunciation tips. No cloud, and it starts with one click on Windows.",
          zh: "完全本地运行、随时聆听的口语陪练：faster-whisper 负责语音识别，Ollama 托管的大模型负责对话，Kokoro ONNX 负责语音合成。能自动检测开口、停顿后自动发送、逐轮识别语种，并给出语法与发音建议。不需要云端，Windows 上一键启动。",
        },
        tags: ["Python", "Whisper", "Ollama", "LLM", "TTS"],
        links: [{ label: { en: "Code", zh: "代码" }, url: repo("local-speaking-agent") }],
      },
      {
        name: "autoresearch-mrpnn",
        icon: "🤖",
        rarity: "epic",
        desc: {
          en: "Hands the grad-student loop to an AI agent: it edits the MRPNN training script, runs 5-minute experiments, keeps what lowers validation MSE and reverts what doesn't. It adapts karpathy/autoresearch from language modeling to real-time radiance prediction.",
          zh: "把「研究生循环」交给 AI Agent：自动修改 MRPNN 训练脚本、跑 5 分钟实验，保留能降低验证集 MSE 的改动，回滚无效改动。这是把 karpathy/autoresearch 从语言建模迁移到了实时辐射度预测。",
        },
        tags: ["Python", "PyTorch", "AI Agents", "Neural Rendering"],
        links: [
          { label: { en: "Code", zh: "代码" }, url: repo("autoresearch-mrpnn") },
          { label: { en: "Upstream", zh: "上游项目" }, url: L.autoresearch },
        ],
      },
    ],

    moreLoot: [
      { name: "spx_gamma_indicator", url: repo("spx_gamma_indicator"), desc: { en: "Options gamma distribution for SPX/SPY/QQQ/MES/MNQ, turned into TradingView Pine indicators", zh: "计算 SPX/SPY/QQQ/MES/MNQ 期权 Gamma 分布，自动生成 TradingView Pine 指标" } },
      { name: "focus-switcher", url: repo("focus-switcher"), desc: { en: "Day-trading helper that brings your charting app to the front automatically", zh: "日内交易助手，自动把焦点切换到看盘软件" } },
      { name: "endfield-auto-signin", url: repo("endfield-auto-signin"), desc: { en: "Selenium bot for Arknights: Endfield daily check-in rewards", zh: "基于 Selenium 的《明日方舟：终末地》每日自动签到" } },
    ],

    /* ---------------- Education ---------------- */
    education: [
      {
        school: { en: "Hong Kong University of Science and Technology", zh: "香港科技大学" },
        short: "HKUST",
        url: L.hkust,
        badge: { en: "CLEARED", zh: "已通关" },
        degree: { en: "B.Eng. in Computer Engineering", zh: "计算机工程 · 工学学士" },
        date: { en: "Sep 2020 – May 2024", zh: "2020.09 – 2024.05" },
        place: { en: "Hong Kong SAR, China", zh: "中国香港" },
        stamp: { city: "HONG KONG", year: "2020", color: "var(--pink)" },
        courses: {
          en: ["Computer Vision", "Computer Graphics", "Operating Systems", "Cybersecurity"],
          zh: ["计算机视觉", "计算机图形学", "操作系统", "网络安全"],
        },
        note: {
          en: `Member of the ${A(L.firebird, "HKUST CTF Team (Firebird)")} and the ACM Team. First research project through ${A(L.urop, "UROP")}.`,
          zh: `${A(L.firebird, "港科大 CTF 战队（Firebird）")}与 ACM 队成员，通过 ${A(L.urop, "UROP")} 开始第一个科研项目。`,
        },
        links: [
          { label: { en: "HKUST", zh: "港科大" }, url: L.hkust },
          { label: { en: "Computer Engineering", zh: "计算机工程专业" }, url: L.cpeg },
        ],
      },
      {
        school: { en: "University of Utah", zh: "犹他大学" },
        short: "UTAH",
        url: L.utah,
        badge: { en: "BONUS LEVEL", zh: "奖励关卡" },
        degree: { en: "Exchange · Entertainment Arts & Engineering", zh: "交换生 · 娱乐艺术与工程（EAE）" },
        date: { en: "Aug 2023 – Jan 2024", zh: "2023.08 – 2024.01" },
        place: { en: "Salt Lake City, UT, USA", zh: "美国 · 盐湖城" },
        stamp: { city: "SALT LAKE CITY", year: "2023", color: "var(--lemon)" },
        courses: {
          en: ["Motion Capture", "VFX", "Interactive Machinima", "Artificial Intelligence"],
          zh: ["动作捕捉", "视觉特效", "交互式电影（Machinima）", "人工智能"],
        },
        note: {
          en: "A semester of game studios, mocap stages and VFX pipelines at the foot of the Rockies.",
          zh: "在落基山脚下，和游戏工作室、动捕棚、特效管线一起度过的一个学期。",
        },
        links: [
          { label: { en: "EAE program", zh: "EAE 项目" }, url: L.eae },
          { label: { en: "University of Utah", zh: "犹他大学" }, url: L.utah },
        ],
      },
      {
        school: { en: "University of Wisconsin–Madison", zh: "威斯康星大学麦迪逊分校" },
        short: "UW–MADISON",
        url: L.uw,
        badge: { en: "NOW PLAYING", zh: "进行中" },
        degree: { en: "Master of Computer Science", zh: "计算机科学 · 硕士" },
        date: { en: "Sep 2026 – May 2028", zh: "2026.09 – 2028.05" },
        place: { en: "Madison, WI, USA", zh: "美国 · 麦迪逊" },
        stamp: { city: "MADISON", year: "2026", color: "var(--cyan)" },
        courses: {
          en: ["Computer Architecture", "Natural Language Processing", "High-Performance Computing"],
          zh: ["计算机体系结构", "自然语言处理", "高性能计算"],
        },
        note: {
          en: `Research with ${A(L.yinli, "Prof. Yin Li")} and the ${A(L.wision, "WISION Lab")}.`,
          zh: `与 ${A(L.yinli, "Yin Li 教授")}及 ${A(L.wision, "WISION 实验室")}开展研究。`,
        },
        links: [
          { label: { en: "UW–Madison", zh: "威斯康星大学" }, url: L.uw },
          { label: { en: "Computer Sciences", zh: "计算机系" }, url: L.uwcs },
        ],
      },
    ],

    /* ---------------- Skills ---------------- */
    skills: [
      {
        icon: "🎮", color: "var(--pink)",
        name: { en: "Game Dev", zh: "游戏开发" },
        items: [
          { n: "Unreal Engine 5", core: true }, { n: "C++", core: true },
          { n: { en: "Gameplay Systems", zh: "玩法系统" } }, { n: { en: "Vehicle Physics", zh: "载具物理" } },
          { n: { en: "Network Resilience", zh: "弱网优化" } }, { n: { en: "Anti-Cheat", zh: "反外挂" } },
          { n: "Unity" }, { n: "C#" },
        ],
      },
      {
        icon: "✨", color: "var(--cyan)",
        name: { en: "Graphics & Imaging", zh: "图形与成像" },
        items: [
          { n: { en: "Volumetric Rendering", zh: "体积渲染" }, core: true }, { n: { en: "Computer Graphics", zh: "计算机图形学" } },
          { n: { en: "Neural Rendering", zh: "神经渲染" } }, { n: { en: "Computational Imaging", zh: "计算成像" } },
          { n: { en: "Computer Vision", zh: "计算机视觉" } }, { n: "Blender" },
          { n: { en: "Motion Capture & VFX", zh: "动捕与特效" } },
        ],
      },
      {
        icon: "🧠", color: "var(--lav)",
        name: { en: "AI / ML", zh: "人工智能" },
        items: [
          { n: { en: "Deep Learning", zh: "深度学习" }, core: true }, { n: { en: "Machine Learning", zh: "机器学习" } },
          { n: "PyTorch" }, { n: { en: "LLM Agents", zh: "大模型 Agent" } },
          { n: { en: "Speech (STT / TTS)", zh: "语音识别与合成" } },
        ],
      },
      {
        icon: "⚡", color: "var(--lemon)",
        name: { en: "Systems & HPC", zh: "系统与高性能" },
        items: [
          { n: "CUDA", core: true }, { n: { en: "High-Performance Computing", zh: "高性能计算" } },
          { n: { en: "Computer Architecture", zh: "计算机体系结构" } }, { n: { en: "Operating Systems", zh: "操作系统" } },
          { n: { en: "Cybersecurity & CTF", zh: "网络安全与 CTF" } },
        ],
      },
      {
        icon: "🧰", color: "var(--mint)",
        name: { en: "Languages & Tools", zh: "语言与工具" },
        items: [
          { n: "Python", core: true }, { n: { en: "Object-Oriented Design", zh: "面向对象设计" } },
          { n: "FastAPI" }, { n: "Flask" }, { n: "React" }, { n: "Electron" }, { n: "Git" },
        ],
      },
      {
        icon: "🎨", color: "var(--candy)",
        name: { en: "Design & Languages", zh: "设计与语言" },
        items: [
          { n: "Photoshop" }, { n: "Illustrator" }, { n: "UI / UX" },
          { n: { en: "Mandarin (native)", zh: "中文（母语）" } }, { n: { en: "English (fluent)", zh: "英语（流利）" } },
        ],
      },
    ],

    /* ---------------- Achievements ---------------- */
    achievements: [
      { icon: "🚗", name: { en: "Road Warrior", zh: "公路之王" }, desc: { en: "Shipped vehicle gameplay to ~40M daily players", zh: "为约 4000 万日活玩家交付载具玩法" }, url: L.gfp },
      { icon: "🛡️", name: { en: "Cheater's Nightmare", zh: "外挂克星" }, desc: { en: "Hardened client-side anti-cheat in production", zh: "在线上环境加固客户端反外挂" } },
      { icon: "🏴", name: { en: "Flag Hunter", zh: "夺旗猎人" }, desc: { en: "HKUST CTF Team (Firebird)", zh: "港科大 CTF 战队（Firebird）" }, url: L.firebird },
      { icon: "🧮", name: { en: "Algorithm Adept", zh: "算法修行者" }, desc: { en: "HKUST ACM Team", zh: "港科大 ACM 队" } },
      { icon: "✈️", name: { en: "Globetrotter", zh: "环球旅人" }, desc: { en: "HKUST → Utah → UW–Madison", zh: "港科大 → 犹他 → 威斯康星" } },
      { icon: "✨", name: { en: "Light Bender", zh: "驭光者" }, desc: { en: "Neural volumetric rendering @ Tencent Tech Future 7th", zh: "腾讯 Tech Future 第七期 · 神经体积渲染" } },
      { icon: "🌐", name: { en: "Bridge Builder", zh: "语言桥梁" }, desc: { en: "Tencent GDS Translator Group", zh: "腾讯 GDS 翻译组" } },
      { icon: "🍰", name: { en: "Head Chef", zh: "主厨" }, desc: { en: "Curated 200 recipes. Yes, really.", zh: "整理了 200 份菜谱，是真的。" }, url: L.recipesSite },
    ],

    /* ---------------- Photo mode (gallery) ---------------- */
    gallery: [
      {
        src: "assets/gallery/headphones.jpg", thumb: "assets/gallery/headphones-sm.jpg", w: 1200, h: 1600, tw: 570, th: 760,
        caption: { en: "Headphones on, world muted 🎧", zh: "戴上耳机，世界静音 🎧" },
        alt: { en: "Zhi in a denim jacket with headphones around the neck", zh: "穿牛仔外套、脖子上挂着耳机的 Zhi" },
      },
      {
        src: "assets/gallery/range.jpg", thumb: "assets/gallery/range-sm.jpg", w: 1200, h: 1600, tw: 570, th: 760,
        caption: { en: "Range day: real life has no aim assist 🎯", zh: "靶场日：现实世界可没有辅助瞄准 🎯" },
        alt: { en: "Zhi at an outdoor shooting range, aiming at paper targets", zh: "Zhi 在户外靶场瞄准纸靶" },
      },
      {
        src: "assets/gallery/home.jpg", thumb: "assets/gallery/home-sm.jpg", w: 1200, h: 1600, tw: 570, th: 760,
        caption: { en: "Home base. Probably thinking about shaders ✨", zh: "在家待机，大概在想 shader ✨" },
        alt: { en: "Selfie of Zhi at home in a white T-shirt", zh: "Zhi 在家穿白 T 恤的自拍" },
      },
      {
        src: "assets/gallery/blonde-cafe.jpg", thumb: "assets/gallery/blonde-cafe-sm.jpg", w: 1600, h: 1200, tw: 760, th: 570,
        caption: { en: "Blonde era: sunshine, coffee & good company ☕", zh: "金毛时期：阳光、咖啡和好朋友 ☕" },
        alt: { en: "Zhi with blonde hair and sunglasses at a café with a friend", zh: "金发戴墨镜的 Zhi 和朋友在咖啡店" },
      },
      {
        src: "assets/gallery/con-day.jpg", thumb: "assets/gallery/con-day-sm.jpg", w: 1600, h: 1200, tw: 760, th: 570,
        caption: { en: "Con day with two very foxy friends 🦊", zh: "漫展日，和两只小狐狸合影 🦊" },
        alt: { en: "Zhi posing with two fox-eared cosplayers at a game convention", zh: "Zhi 在漫展和两位狐耳 coser 合影" },
      },
    ],

    /* ---------------- UI strings ---------------- */
    ui: {
      "nav.about": { en: "About", zh: "关于" },
      "nav.quests": { en: "Experience", zh: "经历" },
      "nav.lab": { en: "Research", zh: "研究" },
      "nav.gadgets": { en: "Projects", zh: "项目" },
      "nav.academy": { en: "Education", zh: "教育" },
      "nav.skills": { en: "Skills", zh: "技能" },
      "nav.photos": { en: "Photos", zh: "相册" },
      "nav.contact": { en: "Contact", zh: "联系" },
      "nav.drive": { en: "Test drive (D)", zh: "试驾（D 键）" },
      "nav.lang": { en: "切换到中文", zh: "Switch to English" },
      "nav.menu": { en: "Menu", zh: "菜单" },

      "hero.hud": { en: "PLAYER 01 · ONLINE", zh: "玩家 01 · 在线" },
      "hero.hello": { en: "Hi, I'm", zh: "你好，我是" },
      "hero.aka": { en: "a.k.a. Juice · 郭智", zh: "Zhi Guo · a.k.a. Juice" },
      "hero.intro": {
        en: "M.S. CS @ UW–Madison · ex-Tencent LightSpeed (Game for Peace). I build real-time worlds and teach computers to see light, one photon at a time.",
        zh: "UW–Madison 计算机硕士 · 前腾讯光子《和平精英》客户端开发。我构建实时的虚拟世界，也教计算机「看见」光，一次一个光子。",
      },
      "hero.cta1": { en: "▶ Start the quest", zh: "▶ 开始冒险" },
      "hero.cta2": { en: "📡 Say hi", zh: "📡 打个招呼" },
      "hero.scroll": { en: "scroll to explore", zh: "向下探索" },

      "card.name": { en: "Zhi Guo", zh: "郭智" },
      "card.type": { en: "🎮 Gameplay · ✨ Graphics", zh: "🎮 玩法 · ✨ 图形" },
      "card.m1": { en: "Drift King", zh: "漂移之王" },
      "card.m1d": { en: "Ships vehicle gameplay to ~40M daily players.", zh: "为约 4000 万日活玩家打造载具玩法。" },
      "card.m2": { en: "Photon Beam", zh: "光子光束" },
      "card.m2d": { en: "Chases light in two UW–Madison vision labs.", zh: "在 UW–Madison 的两个视觉实验室里追光。" },
      "card.foot": { en: "★ HOLO RARE · 001/001", zh: "★ 闪卡 · 001/001" },

      "about.eyebrow": { en: "LEVEL 01 · ABOUT", zh: "第 01 关 · 关于我" },
      "about.title": { en: "Player Bio", zh: "玩家档案" },
      "about.sub": { en: "The human behind the hologram.", zh: "全息影像背后的那个人。" },
      "about.file": { en: "about_me.md", zh: "关于我.md" },
      "about.sheet": { en: "CHARACTER SHEET", zh: "角色面板" },
      "about.now": { en: "NOW LOADING…", zh: "正在进行…" },

      "quests.eyebrow": { en: "LEVEL 02 · EXPERIENCE", zh: "第 02 关 · 工作经历" },
      "quests.title": { en: "Quest Log", zh: "任务日志" },
      "quests.sub": { en: "Main quests, side quests and one classified mission.", zh: "主线、支线，还有一个保密任务。" },
      "works.title": { en: "Shipped in the live game", zh: "上线作品" },
      "works.sub": { en: "Some of the features I worked on, in action. Click to watch on Bilibili (gameplay videos by community creators).", zh: "我参与开发并已上线的部分内容，点击去 B 站看实机视频（视频来自社区 UP 主）。" },
      "works.watch": { en: "Watch on Bilibili", zh: "在 B 站观看" },
      "works.by": { en: "video by", zh: "UP 主" },

      "lab.eyebrow": { en: "LEVEL 03 · RESEARCH", zh: "第 03 关 · 科研" },
      "lab.title": { en: "The Photon Lab", zh: "光子实验室" },
      "lab.sub": { en: "Where light scatters, photons get counted and pixels learn to see. The little animations are live.", zh: "在这里，光在散射，光子被计数，像素学会了看。卡片上的小动画都是实时运行的。" },
      "lab.with": { en: "with", zh: "合作导师：" },

      "gadgets.eyebrow": { en: "LEVEL 04 · PROJECTS", zh: "第 04 关 · 项目" },
      "gadgets.title": { en: "Gadget Inventory", zh: "道具背包" },
      "gadgets.sub": { en: "Open-source loot from my GitHub. Hover a card for holo-shine ✨", zh: "来自我 GitHub 的开源战利品，鼠标放上去有闪卡特效 ✨" },
      "gadgets.more": { en: "More loot in the chest", zh: "箱子里还有更多" },
      "gadgets.all": { en: "Open the full chest on GitHub", zh: "去 GitHub 打开整个宝箱" },
      "rarity.legendary": { en: "LEGENDARY", zh: "传说" },
      "rarity.epic": { en: "EPIC", zh: "史诗" },
      "rarity.rare": { en: "RARE", zh: "稀有" },
      "rarity.cozy": { en: "COZY", zh: "治愈" },

      "academy.eyebrow": { en: "LEVEL 05 · EDUCATION", zh: "第 05 关 · 教育" },
      "academy.title": { en: "Academy Map", zh: "学院地图" },
      "academy.sub": { en: "Three campuses, two continents, one very long flight path.", zh: "三所大学，两块大陆，一条很长的航线。" },
      "academy.courses": { en: "SELECTED COURSEWORK", zh: "部分课程" },

      "skills.eyebrow": { en: "LEVEL 06 · SKILLS", zh: "第 06 关 · 技能" },
      "skills.title": { en: "Skill Tree", zh: "技能树" },
      "skills.sub": { en: "Skill points allocated. ★ marks the main build.", zh: "技能点已分配，★ 为主修流派。" },

      "ach.eyebrow": { en: "LEVEL 07 · HIGHLIGHTS", zh: "第 07 关 · 高光时刻" },
      "ach.title": { en: "Achievements", zh: "成就墙" },
      "ach.sub": { en: "They unlock when you scroll here 🏆", zh: "滚动到这里就会解锁 🏆" },

      "photos.eyebrow": { en: "LEVEL 08 · PHOTO MODE", zh: "第 08 关 · 拍照模式" },
      "photos.title": { en: "Photo Mode", zh: "拍照模式" },
      "photos.sub": { en: "Screenshots from real life. Click a polaroid to zoom in 📸", zh: "现实世界的截图，点开任意一张可以放大 📸" },
      "lb.close": { en: "Close", zh: "关闭" },
      "lb.prev": { en: "Previous photo", zh: "上一张" },
      "lb.next": { en: "Next photo", zh: "下一张" },

      "side.eyebrow": { en: "LEVEL 09 · BEYOND CODE", zh: "第 09 关 · 代码之外" },
      "side.title": { en: "Side Quests", zh: "支线任务" },
      "side.sub": { en: "Things I do while the compiler is busy.", zh: "编译器在忙的时候，我在做这些。" },
      "side.photoTag": { en: "📷 shot by me", zh: "📷 我拍的" },
      "side.photoTitle": { en: "Golden Hour, Hong Kong", zh: "黄金时刻 · 香港" },
      "side.photoText": { en: "West Kowloon at dusk. When I'm not rendering light, I'm out chasing it.", zh: "黄昏时分的西九龙。不在渲染光的时候，我就在外面追光。" },
      "side.driveTitle": { en: "Test Drive", zh: "试驾" },
      "side.driveText": { en: "I spent two years building vehicles for a living. Take one for a spin, right here on this page.", zh: "我做了两年载具。来试驾一下吧，就在这个网页上。" },
      "side.driveBtn": { en: "🚗 Start engine", zh: "🚗 点火启动" },
      "side.driveHint": { en: "or press D anywhere", zh: "也可以随时按 D 键" },
      "side.kitchenTitle": { en: "Kitchen Quest", zh: "厨房任务" },
      "side.kitchenText": { en: "200 recipes, zero burnt kitchens (so far).", zh: "200 份菜谱，厨房至今安然无恙。" },
      "side.kitchenBtn": { en: "Open the cookbook", zh: "打开菜谱" },

      "contact.eyebrow": { en: "LEVEL 10 · CONTACT", zh: "第 10 关 · 联系" },
      "contact.title": { en: "Open a Channel", zh: "建立通讯" },
      "contact.sub": { en: "Graphics, games, imaging research, or a solid bubble-tea recommendation in Madison. My inbox is open.", zh: "图形、游戏、成像研究，或者麦迪逊哪家奶茶好喝，都欢迎来聊。" },
      "contact.email": { en: "Email me", zh: "给我发邮件" },
      "contact.copy": { en: "Copy address", zh: "复制邮箱" },
      "contact.clock": { en: "Local time in Madison:", zh: "麦迪逊当地时间：" },

      "footer.name": { en: "Zhi Guo (郭智)", zh: "郭智 Zhi Guo" },
      "footer.made": { en: "Hand-made with HTML, CSS, vanilla JS & a lot of 🧃", zh: "用 HTML、CSS、原生 JS 和大量 🧃 手工打造" },
      "footer.secret": { en: "psst… try ↑↑↓↓←→←→BA, or press D", zh: "悄悄话：试试 ↑↑↓↓←→←→BA，或者按 D" },

      "toast.ach": { en: "ACHIEVEMENTS UNLOCKED", zh: "成就解锁" },
      "toast.achText": { en: "8 / 8 badges collected 🏆", zh: "已收集 8 / 8 枚徽章 🏆" },
      "toast.level": { en: "LEVEL UP!", zh: "升级啦！" },
      "toast.levelText": { en: "You read the whole page. Legend. 🎉", zh: "你看完了整个页面，太强了 🎉" },
      "toast.copied": { en: "COPIED", zh: "已复制" },
      "toast.copiedText": { en: "Email address copied 📋", zh: "邮箱地址已复制 📋" },
      "toast.party": { en: "CHEAT CODE ACCEPTED", zh: "秘籍生效" },
      "toast.partyOn": { en: "Party mode ON 🎉 (enter the code again to stop)", zh: "派对模式开启 🎉（再输一次即可关闭）" },
      "toast.partyOff": { en: "Party mode OFF. Back to work 💼", zh: "派对模式关闭，回去干活 💼" },
      "toast.drive": { en: "DRIVE MODE", zh: "驾驶模式" },
      "toast.driveText": { en: "WASD / arrows to drive · Space to drift · Shift to boost · Esc to exit", zh: "WASD / 方向键驾驶 · 空格漂移 · Shift 加速 · Esc 退出" },
      "toast.driveTouch": { en: "Touch and hold where you want to go · tap ✕ to exit", zh: "按住屏幕指向目的地 · 点 ✕ 退出" },
      "toast.lang": { en: "LANGUAGE", zh: "语言" },
      "toast.langText": { en: "Switched to English ✨", zh: "已切换到中文 ✨" },

      "drive.speed": { en: "SPEED", zh: "速度" },
      "drive.score": { en: "DRIFT", zh: "漂移分" },
      "drive.best": { en: "BEST", zh: "最佳" },
      "drive.exit": { en: "Exit", zh: "退出" },

      "title.away": { en: "(｡•́︿•̀｡) come back~", zh: "(｡•́︿•̀｡) 快回来～" },
      "title.back": { en: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ welcome back!", zh: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ 欢迎回来！" },

      boot: {
        en: [
          "JUICE-OS v26.09 cold start",
          "mounting /dev/imagination",
          "compiling shaders: cute.glsl + cool.glsl",
          "calibrating single-photon sensors",
          "spawning vehicles 🚗",
          "pouring juice 🧃 · welcome, player!",
        ],
        zh: [
          "JUICE-OS v26.09 冷启动",
          "挂载 /dev/想象力",
          "编译着色器：可爱.glsl + 酷炫.glsl",
          "校准单光子传感器",
          "生成载具 🚗",
          "倒满果汁 🧃 · 欢迎你，玩家！",
        ],
      },

      clockMood: {
        en: ["probably asleep 😴 (or debugging)", "fueling up on juice 🧃", "in the lab 🔬", "coding under the stars 🌙"],
        zh: ["大概在睡觉 😴（或者在 debug）", "正在给自己灌果汁 🧃", "在实验室 🔬", "在星空下写代码 🌙"],
      },

      terminal: {
        en: [
          "$ ping zhi.guo",
          "PING madison.wi (juice.local): 56 data bytes",
          "64 bytes: seq=1 ttl=64 time=0.42 ms 🧃",
          "64 bytes: seq=2 ttl=64 time=0.39 ms 💖",
          "--- zhi.guo ping statistics ---",
          "2 packets sent, 2 received, reply guaranteed ✨",
        ],
        zh: [
          "$ ping zhi.guo",
          "PING madison.wi (juice.local)：56 字节数据",
          "64 字节：seq=1 ttl=64 时间=0.42 ms 🧃",
          "64 字节：seq=2 ttl=64 时间=0.39 ms 💖",
          "--- zhi.guo ping 统计 ---",
          "已发送 2 个包，收到 2 个，保证回复 ✨",
        ],
      },
    },

    /* ---------------- Mascot lines ---------------- */
    mascot: {
      hello: { en: "Hi! I'm Byte, Zhi's robo-cat 🐱 Click me!", zh: "嗨！我是 Byte，Zhi 的机器猫 🐱 戳我试试！" },
      sections: {
        about: { en: "That's Zhi! Two years of shipping games, now chasing photons 🧃", zh: "这就是 Zhi！做了两年游戏，现在在追光子 🧃" },
        quests: { en: "Fun fact: the vehicle systems Zhi worked on reach ~40M players. Every. Single. Day. 🚗", zh: "冷知识：Zhi 做的载具系统，每天约有 4000 万玩家在用 🚗" },
        lab: { en: "Science mode ON 🔬 Those little animations are running live!", zh: "科研模式启动 🔬 这些小动画都是实时跑的！" },
        gadgets: { en: "Loot time! Hover the cards, they're holographic ✨", zh: "开箱时间！鼠标放到卡片上，是闪卡哦 ✨" },
        academy: { en: "HK → Utah → Madison. Frequent-flyer miles: maxed ✈️", zh: "香港 → 犹他 → 麦迪逊，飞行里程已拉满 ✈️" },
        skills: { en: "Skill points well spent, if you ask me 🌟", zh: "要我说，这技能点加得很合理 🌟" },
        achievements: { en: "Achievement hunter detected 🏆", zh: "检测到成就收集爱好者 🏆" },
        photos: { en: "Photo mode unlocked! IRL screenshots ahead 📸", zh: "拍照模式已解锁！前方是现实世界截图 📸" },
        side: { en: "Psst… press D to drive a car around this page 🏎️", zh: "悄悄说：按 D 键可以在网页上开车 🏎️" },
        contact: { en: "Say hi! Zhi replies faster than a SPAD fires 📡", zh: "来打个招呼吧！Zhi 回复速度堪比单光子探测器 📡" },
      },
      clicks: {
        en: [
          "Meow.exe executed successfully 🐱",
          "I run on 100% juice 🧃",
          "Have you tried the Konami code? ↑↑↓↓←→←→BA",
          "Beep boop… you look like a great collaborator 💖",
          "My antenna picks up good vibes 📡",
          "No frameworks were harmed in the making of this page.",
          "Press D. Trust me. 🏎️",
          "I'm 60% cat, 40% robot, 100% cute.",
        ],
        zh: [
          "喵.exe 执行成功 🐱",
          "我由 100% 果汁驱动 🧃",
          "试过 Konami 秘籍吗？↑↑↓↓←→←→BA",
          "哔哔……你看起来很适合一起合作 💖",
          "我的天线接收到了好心情 📡",
          "本页面制作过程中没有伤害任何框架。",
          "按 D。相信我。🏎️",
          "我 60% 是猫，40% 是机器人，100% 可爱。",
        ],
      },
      sleepy: { en: "zzz… (move the mouse to wake me)", zh: "zzz……（动一动鼠标叫醒我）" },
      drive: { en: "Vroom vroom! Space to drift, Shift to boost 🏎️", zh: "轰轰！空格漂移，Shift 加速 🏎️" },
      drift: { en: "Nice drift! 🔥", zh: "漂亮的漂移！🔥" },
      party: { en: "PARTY TIME! ᕕ( ᐛ )ᕗ", zh: "派对时间！ᕕ( ᐛ )ᕗ" },
      levelUp: { en: "You made it to the end! Say hi below 👇", zh: "你看到最后啦！下面打个招呼吧 👇" },
    },
  };
})();
