# 基于大模型的风水算命摆件



在线体验地址 http://fangyuanxiaozhan.com:4000/register



有问题可以通过https://github.com/zhaoolee/cyber-fortune-telling  提 issues 



项目的起源：我有个朋友，喜欢**在桌面搞点风水摆件，提升运势**，我感觉这东西虽然玄学，但确实能提供心理安慰的作用，让人心情愉悦。



![](https://cdn.fangyuanxiaozhan.com/assets/1746849484470a0c7NxG3.png)

于是，我打算搞一个**电子风水摆件**，录入自己的八字信息，每天自动调用满血版DeepSeek，计算今天最适合的风水摆件，并通过**屏幕展示在桌面上**。为了避免过于单调，还可以让Deepseek大模型把**今天中午适合吃什么**，今天**适合联系哪些朋友**，今天**幸运数字是什么**，今天的**幸运色是什么**，变成**一个个小建议轮播**到屏幕上！



在线体验地址 http://fangyuanxiaozhan.com:4000/register



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



在线体验地址 http://fangyuanxiaozhan.com:4000/register



## 关于开源

本项目难点不在于代码，而在于产品思路，工程基于Strapi + Next.js构建，目前代码还在整理完善阶段，等到功能稳定下来，会对代码进行开源。

项目设计成了多用户模式，即使不进行私有化部署，也可以，随开随用，能白嫖zhaoolee的token进行运势推理，可以也是一件乐事。

如果你真的迫切的想要这个项目的源码，不妨点个star, 项目的star到100，我会在三天之内把代码整理好，推送到本仓库。

项目最核心的提示词 prompt已经放到 prompts 文件夹
