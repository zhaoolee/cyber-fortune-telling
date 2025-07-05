# 玄乎儿分光镜

2025年7月，基于Deepseek的风水算命项目《玄乎儿分光镜》完成了开源，只需提供[deepseek官方的key](https://platform.deepseek.com/api_keys) 即可通过 docker 启动，完美本地运行。

经过一个月的开发和验证，我发现电脑运行这个程序，就会带来好心情，机魂大悦人也开心，有些人想玩这个程序，但担心泄露个人八字隐私，于是这个程序开源了，有 docker 基础就能完全本地部署。希望各路大师能提供更强的提示词，让这个项目更好玩。

如果你不想本地部署，可以用在线体验地址 [https://ft.fangyuanxiaozhan.com/register](https://ft.fangyuanxiaozhan.com/register)

有问题可以通过https://github.com/zhaoolee/cyber-fortune-telling  提 issues 


项目的起源：我有个朋友，喜欢**在桌面搞点风水摆件，提升运势**，我感觉这东西虽然玄学，但确实能提供心理安慰的作用，让人心情愉悦。

![](https://cdn.fangyuanxiaozhan.com/assets/1746849484470a0c7NxG3.png)

于是，我打算搞一个**电子风水摆件**，录入自己的八字信息，每天自动调用满血版DeepSeek，计算今天最适合的风水摆件，并通过**屏幕展示在桌面上**。为了避免过于单调，还可以让Deepseek大模型把**今天中午适合吃什么**，今天**适合联系哪些朋友**，今天**幸运数字是什么**，今天的**幸运色是什么**，变成**一个个小建议轮播**到屏幕上！



在线体验地址 [https://ft.fangyuanxiaozhan.com/register](https://ft.fangyuanxiaozhan.com/register)



进入网页后，需要录入出生日期和时间，方便大模型八字获取八字信息（点击圆形头像，有惊喜🕶）

![](https://cdn.fangyuanxiaozhan.com/assets/1746852819331AXfdk2fZ.png)

点击注册后，程序会自动跳转到一个url，这个网页的url可以放到树莓派浏览器打开，每天的零点后，浏览器会自动刷新，重新计算当天运势；（底部有个输入框，里面有塔罗占卜，今天适合听什么歌的预制对话，也可以随意提问，和大模型Chat的玩法基本一样）

![](https://cdn.fangyuanxiaozhan.com/assets/17468525802596fhca86F.png)



点击右上角的「进入玄修」，就会进入风水摆件页面，风水摆件会有一个闪着光晕的细腻动画。



![image-20250510124133540](https://cdn.fangyuanxiaozhan.com/assets/1746856629981Edtrn7R3.png)

实机运行效果如下（画面被压缩了，实际效果好很多，一度引起办公室众多玄学爱好者的围观）

![](https://cdn.fangyuanxiaozhan.com/assets/1746852527676RtQnXNMx.jpeg)



如果你是一个**二手电子垃圾爱好者，或者运维老哥**，也可以将**风水摆件**放到机房，**机魂大悦，让你一觉到天明**。

我为我的二手硬件小机房，添加了一个风水摆件，内网穿透的成功率变高了很多😁 （信则有，不信则无）。



![pi5](https://cdn.fangyuanxiaozhan.com/assets/1746849238609ZsZFGCYQ.jpeg)

## 后续计划，搞个更酷的电子潮玩版本

我打算用分光棱镜做个更酷的简化版本，Demo如下图所示，可以显示有限的文字，依然是每天占卜，给出建议，成本基本在100块以内，而且会非常省电。作为电子潮玩售卖，图一乐！

![trans](https://cdn.fangyuanxiaozhan.com/assets/1746853648246t6cZN4W3.jpeg)


在线体验地址 [https://ft.fangyuanxiaozhan.com/register](https://ft.fangyuanxiaozhan.com/register)

## 🚀 快速开始

本项目难点不在于代码，而在于产品思路，工程基于Strapi + Next.js构建，目前代码还在整理完善阶段

```bash
# 克隆项目
git clone --depth=1 https://github.com/zhaoolee/cyber-fortune-telling.git
cd cyber-fortune-telling

# 复制环境变量
cp example.env .env
```

## 🔧 环境配置

编辑 `.env` 文件，配置以下必要参数：

```bash
# DeepSeek API 配置 (推荐使用，性价比高)
OPENAI_API_KEY=sk-your-deepseek-api-key
OPENAI_BASE_URL=https://api.deepseek.com/v1
```

## 🚀 启动项目

### 使用 Docker Compose（推荐）

```bash
# 启动所有服务
docker compose up

# 后台运行
docker compose up -d

# 查看日志
docker compose logs -f

# 停止服务
docker compose down
```

## 如果不需要Docker数据库服务(请前往.env自定义数据库信息)
```
docker compose -f docker-compose-no-database.yml
```

## 🛠️ 技术栈

### 前端
- **Next.js 15.1.7** - React 框架
- **React 19.0.0** - JavaScript 库
- **Material-UI 7.1.0** - UI 组件库 (@mui/material)
- **Framer Motion 12.9.4** - 动画库
- **Axios 1.7.9** - HTTP 客户端
- **Showdown** - Markdown 解析器
- **Next PWA** - 渐进式 Web 应用支持
- **Lunar JavaScript** - 农历日期处理
- **Moment.js** - 日期时间处理

### 后端
- **Strapi 5.10.3** - 无头 CMS
- **Node.js 22.14.0+** - 运行时环境
- **PostgreSQL 17.5** - 主数据库
- **SQLite3** - 开发数据库
- **OpenAI API 4.96.2** - AI 服务接口
- **IntelliNode** - AI 服务库
- **MQTT** - 消息队列协议

### 部署
- **Docker** - 容器化部署
- **Docker Compose** - 多容器编排

### 访问地址
- 前端：http://localhost:4000
- 管理后台：http://localhost:11337/admin

## 🌟 功能特色

- 🎯 **AI 算命** - 基于大语言模型的智能算命
- 📱 **响应式设计** - 完美适配手机和电脑
- 🚀 **PWA 支持** - 可安装为手机应用
- 🔐 **用户系统** - 完整的注册登录功能
- 📊 **管理后台** - Strapi 提供的强大后台
- ✨ **风水摆件** - 电子风水摆件展示
- 🌈 **多主题切换** - 支持多种颜色主题
- 📅 **农历支持** - 完整的农历日期系统
- 🔄 **实时聊天** - 与AI实时对话功能
- 📱 **移动优先** - 移动端优化体验
- 🎨 **动画效果** - 流畅的动画交互

## 🔮 项目背景

基于大模型的风水算命摆件，为桌面提供**电子风水摆件**体验。录入八字信息后，每天自动调用 DeepSeek 计算适合的风水摆件，通过屏幕展示在桌面上。

### 特色功能
- 📅 每日运势自动更新
- 🎨 动态风水摆件展示
- 🤖 AI 智能对话
- 📱 多设备适配
- 🔄 自动刷新机制

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🐳 Docker 部署说明

项目使用 Docker Compose 进行容器化部署，包含以下服务：

- **PostgreSQL 17.5** - 数据库服务，端口 5432
- **Strapi Backend** - 后端服务，端口 1337
- **Next.js Frontend** - 前端服务，端口 4000

### 环境要求

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 22.14.0+（本地开发）

### 数据持久化

- `postgres_data` - PostgreSQL 数据
- `backend_uploads` - 后端上传文件
- `backend_data` - 后端临时数据



## 🙏 致谢

- [Next.js](https://nextjs.org/) - 前端框架
- [Strapi](https://strapi.io/) - 后端 CMS
- [DeepSeek](https://deepseek.com/) - AI 服务
- [Material-UI](https://mui.com/) - UI 组件库
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [PostgreSQL](https://www.postgresql.org/) - 数据库
- [Docker](https://www.docker.com/) - 容器化平台