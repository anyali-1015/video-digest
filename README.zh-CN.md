# Video Digest（YouTube + 哔哩哔哩）

[English](README.md) | [简体中文](README.zh-CN.md)

把 YouTube 和哔哩哔哩视频都变成可以深入学习的资料。Video Digest 把逐字稿、双语翻译、AI 概览、悬浮 AI 问答（遇到不懂的词随时问）和可导出的时间戳笔记放进同一个 Chrome 侧边栏，让你持续学习视频中的知识和语言，同时不丢失原视频上下文。

- 把 YouTube 字幕、哔哩哔哩官方字幕都变成清晰、可搜索的学习资料。
- 查看原文、简体中文翻译，或中英双语对照字幕来学习语言。
- 遇到任何不懂的词、人名或概念，直接在悬浮问答窗口里问，每个视频的问答历史都会保存下来。
- 通过 AI 概览、章节、重点引用和选中文本讲解建立系统理解。
- 点击字幕、概览或笔记中的时间戳，快速跳转到对应位置。
- 观看时随手保存时间戳笔记，一键导出成 Markdown 文件。
- 使用自己的 API Key，数据保存在本地 Chrome 中，不包含分析统计或行为追踪。

> 这是基于 [zarazhangrui/youtube-digest](https://github.com/zarazhangrui/youtube-digest) 的个人 remix，增加了哔哩哔哩支持、悬浮问答和一键导出笔记功能。原项目本身就鼓励这样的二次开发，参见下方[用你的编程 Agent 二次开发](#用你的编程-agent-二次开发)。

Video Digest 是一个需要自行提供 API Key 的开源项目，通过 GitHub 安装。目前没有上架 Chrome 应用商店，不赠送 API 额度，也没有开发者运营的服务器。

## 让你的编程 Agent 帮你安装

你不需要看懂代码，也不需要会使用命令行。把下面这段话发送给你的编程 Agent：

> 请把这个项目下载或克隆到我选择的长期保留文件夹，告诉我准确的完整路径，并让 Chrome"加载已解压的扩展程序"使用同一个文件夹。请用简单易懂的语言一步一步指导我完成安装和配置。https://github.com/anyali-1015/video-digest

你的 Agent 应该帮你：

1. 先询问你想把项目长期保存在哪里，再下载或克隆到那里，并告诉你准确的完整路径。
2. 打开下方 Supadata 和 DeepSeek 官方页面，指导你创建自己的账号。
3. 指导你在 Chrome 中通过"加载已解压的扩展程序"选择你刚才确定的那个准确项目文件夹。
4. 告诉你应该在扩展的"设置"页面哪个位置填写 API Key。
5. 打开一个带字幕的 YouTube 或哔哩哔哩视频，确认字幕和翻译功能可以使用。

安装后请让这个文件夹留在原位。如果移动或删除它，Chrome 中加载的本地扩展会失效，需要从新的长期存放位置重新加载。

请不要把 API Key 粘贴进任何 AI 对话、源代码文件、截图或公开消息里，一定要自己手动填进 Video Digest 的设置页面。

## 手动安装

1. 打开 [github.com/anyali-1015/video-digest](https://github.com/anyali-1015/video-digest)。
2. 点击 **Code**，选择 **Download ZIP**。
3. 选一个长期保留的文件夹，把项目解压到那里。
4. 在 Chrome 中打开 `chrome://extensions`。
5. 打开"开发者模式"。
6. 点击"加载已解压的扩展程序"。
7. 选中包含 `manifest.json` 的项目文件夹。
8. 如果想快速使用，把 Video Digest 固定在 Chrome 工具栏上。

这是本地加载的扩展，不会自动更新。更新代码或下载新版本后，去 `chrome://extensions` 点击 Video Digest 卡片上的"重新加载"，再刷新已打开的视频页面。

## 配置 API Key

Video Digest 需要两个你自己账号下的 Key。两个 Key 主要服务于 YouTube 那条路径；哔哩哔哩字幕走的是哔哩哔哩自己的公开接口，不需要额外 Key，但会用 DeepSeek 给哔哩哔哩字幕做标点修复。

1. **Supadata API Key**：用来获取 YouTube 逐字稿。
2. **DeepSeek API Key**：用于概览、讲解、翻译、悬浮问答、笔记润色，以及哔哩哔哩字幕的标点修复。

### 获取 Supadata API Key

1. 打开官方 [Supadata 注册页](https://dash.supadata.ai/auth/sign-up)。
2. 注册账号，完成简单的引导流程。
3. Supadata 会在引导过程中自动生成一个 API Key。
4. 之后可以在 [Supadata 控制台](https://dash.supadata.ai/) 查看或管理这个 Key。
5. 复制 Key，粘贴到 Video Digest 设置页的 **Supadata API key** 里。

### 获取 DeepSeek API Key

1. 打开官方 [DeepSeek API Keys 页面](https://platform.deepseek.com/api_keys)。
2. 登录或注册 DeepSeek Platform 账号。
3. 点击 **Create new API key**，起一个好记的名字（比如 `Video Digest`），创建它。
4. 立刻复制这个 Key（完整的 Key 可能只显示一次）。
5. 粘贴到 Video Digest 设置页的 **DeepSeek API key** 里。
6. 如果提示余额不足，去 DeepSeek Platform 账号充值后重试。

发布版本只支持 DeepSeek V4 Flash 作为唯一的 AI 提供方（Base URL: `https://api.deepseek.com`，Model: `deepseek-v4-flash`）。Key 只应该粘贴进设置页对应的输入框，不要粘贴进任何 AI 对话、源代码文件、截图或公开消息里。所有 Key 和设置都只保存在你设备本地的 Chrome 扩展存储里。

## 使用 Video Digest

1. 打开一个带字幕的 YouTube 视频页，或者哔哩哔哩的 `bilibili.com/video/BVxxxx` 视频页。
2. 点击 Video Digest 扩展图标，或者页面上悬浮的 **Digest** 按钮，打开侧边栏。
3. 阅读带时间戳的逐字稿，或者切换 **Original**、**中文**、**双语**。
4. 打开 **Overview** 查看 AI 生成的章节和重点引用。
5. 选中字幕文字可以获取 AI 讲解，或者点击悬浮的 💬 按钮直接提问任何问题。每次问答都会存进这个视频的历史记录里。
6. 把鼠标移到播放器上点击 📝 Note（或按 "n" 键）保存笔记，之后在 **Notes** 里查看。
7. 在 Notes 页点击 **⬇ Export** 把笔记一键导出成 Markdown 文件。

## 目前支持的功能

- Chrome 116 及以上版本，使用 Side Panel API。
- 标准的 `youtube.com/watch` 页面和 `bilibili.com/video/BVxxxx` 页面。
- **YouTube**：通过 Supadata 获取原生字幕（仅 `mode=native`，不会用 AI 生成字幕）。
- **哔哩哔哩**：直接调用哔哩哔哩自己的（非官方、需要 WBI 签名的）接口获取官方 CC 字幕，不消耗 Supadata 额度。目前不支持没有官方字幕的视频，这个版本还没有语音转文字兜底。
- 针对哔哩哔哩字幕常见的"没有标点"问题，自动跑一遍 DeepSeek 标点修复。
- 原文、简体中文、中英双语对照三种字幕视图。
- AI 概览、选中文本讲解、翻译、笔记自动润色，以及带每视频历史记录的悬浮自由问答。
- 本地笔记 + 一键 Markdown 导出，以及本地缓存的逐字稿/概览结果。

Shorts、直播、私享或受限视频，以及没有可用原生字幕的视频可能无法使用。Firefox、Safari、移动端浏览器和其他 Chromium 浏览器目前未测试、不保证支持。

哔哩哔哩的字幕接口是非官方、没有官方文档的，是社区逆向出来的，随时可能变化或失效。如果哔哩哔哩字幕突然不能用了，大概率就是这个原因。

## Supadata 免费额度与请求成本（仅 YouTube 路径）

[Supadata 定价页](https://supadata.ai/pricing) 显示免费额度为每月 **100 credits**，无需信用卡。一次原生字幕请求消耗 1 credit，与视频时长无关。定价可能变化，使用前请查看最新页面。这部分只适用于 YouTube，哔哩哔哩路径完全不调用 Supadata。

## DeepSeek 成本估算

按 [DeepSeek 定价页](https://api-docs.deepseek.com/quick_start/pricing/) 的价格，翻译或问答功能大概每小时视频几分钱人民币的量级（基于本项目所 remix 的原项目中的实测数据）。哔哩哔哩的自动标点修复是个短小的批量请求，额外成本也是类似的小额量级。如果想设置硬性上限，可以在 DeepSeek 账号里设置消费限额。

## 用你的编程 Agent 二次开发

这是一个个人 remix 项目，本身也是从 [zarazhangrui/youtube-digest](https://github.com/zarazhangrui/youtube-digest) remix 而来的。这里不接受 Issue 和 Pull Request。如果遇到问题或想要新功能，欢迎下载或 fork 一份自己的副本，让你的编程 Agent 帮你修复、改造、个性化，就像这个 fork 本身诞生的方式一样。

Video Digest 用纯 HTML、CSS、JavaScript 写成，没有构建步骤，很适合作为 Agent 协作开发的起点。可以尝试的方向：

- 给没有官方字幕的哔哩哔哩视频加上语音转文字（ASR）。
- 支持更多平台（比如小红书、X/Twitter 视频）。
- 支持更多翻译语言。
- 把问答历史做成独立的生词本，支持间隔重复复习导出。
- 增加可选的本地模型支持，换取不同的隐私/成本平衡。

请让你的 Agent 保持"自带 Key"的模式、不把密钥写进源码，改完跑一遍下面的检查，并在真实视频上测试。

如果想换成其他 AI 提供方或模型，先在编程 Agent 中打开 Chrome 通过"加载已解压的扩展程序"使用的那个准确的 Video Digest 项目文件夹。然后打开 Video Digest 的设置页，使用 **Copy customization prompt**（复制定制提示词）功能。发送前先替换掉 `[PROVIDER]` 和 `[MODEL]` 占位符，千万不要把 API Key 写进提示词或对话里。等 Agent 改完你本地的副本后，按它提示的位置自己手动填入 Key。

## 隐私与数据流向

Video Digest 直接从扩展本身发起请求：

1. 向 Supadata 发送 YouTube 视频的规范 URL，或直接调用哔哩哔哩自己的接口，来获取逐字稿/字幕。
2. 在你使用 AI 功能（概览、讲解、翻译、问答、笔记润色、哔哩哔哩标点修复）时，把逐字稿文本和相关视频元数据发给 DeepSeek。
3. 把 Key、设置、笔记和问答历史保存在本地 Chrome 中。

Video Digest 没有账号系统、没有广告、没有数据统计或行为追踪。Supadata、DeepSeek 和哔哩哔哩仍会按各自的条款和隐私政策处理数据。详见 [PRIVACY.md](PRIVACY.md)（英文）。

## 故障排查

### 视频页面上看不到 Digest 按钮

- 在 `chrome://extensions` 找到 Video Digest 点击"重新加载"，再刷新视频页面。
- 确认你在标准的观看页：`https://www.youtube.com/watch?...` 或 `https://www.bilibili.com/video/BVxxxx`。
- 在哔哩哔哩上，按钮是悬浮在播放器上的（不在哔哩哔哩自己的操作栏里），看播放器左上角/右上角。

### 找不到字幕（YouTube）

- 确认视频是公开的、有原生字幕，并检查你的 Supadata Key、剩余额度和速率限制。

### 找不到字幕（哔哩哔哩）

- 确认视频本身有官方 CC 字幕，这个版本不支持没有字幕的视频。
- 哔哩哔哩的字幕接口是非官方的，随时可能变化；如果以前能用突然不能用了，大概率是这个原因。可以让你的编程 Agent 检查 `bilibili-wbi.js` 和 `background.js` 里哔哩哔哩相关的部分。

### AI 请求失败

- `401` 或 `403` 通常说明 DeepSeek Key 或账号权限有问题。
- `429` 通常说明触发了 DeepSeek 的速率或消费限制。

请不要在对话、截图或日志里分享 API Key、私人逐字稿或个人笔记内容。

## 给编程 Agent 的检查清单

修改项目后，让你的编程 Agent 跑这些命令：

```bash
npm test
npm run check
npm run package
```

Agent 还应该在 Chrome 里重新加载这个解压的扩展，并在两个平台的真实视频上测试。自动化检查不能证明真实的接口请求和页面交互一定能用。

## License

MIT，见 [LICENSE](LICENSE)。基于 [zarazhangrui/youtube-digest](https://github.com/zarazhangrui/youtube-digest)（MIT）二次开发。
