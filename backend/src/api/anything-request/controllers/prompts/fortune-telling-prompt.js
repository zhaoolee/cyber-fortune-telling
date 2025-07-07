const moment = require("moment");

/**
 * Builds the fortune telling prompt based on user information
 * @param {Object} user - User information including birth details
 * @returns {string} Formatted prompt for the LLM
 */
const buildFortuneTellingPrompt = (user) => {
  // 基于 "水晶洞","金蟾","貔貅","文昌塔", "关公像","龙龟","葫芦","福禄寿三星","五帝钱", "大象" 随机抽取3个摆件
  const availableDecor = ["水晶洞","金蟾","貔貅","文昌塔", "关公像","龙龟","葫芦","福禄寿三星","五帝钱", "大象"];
  const randomDecor = availableDecor.sort(() => Math.random() - 0.5).slice(0, 3);
  const decorString = randomDecor.join(",");

  const currentDate = moment().format("YYYY-MM-DD");
  return `
    我是${user.username}，出生信息如下：
    - 出生日期：${user.birth_date} (阳历)
    - 出生时间：${user.birth_time}
    - 性别：${user.gender === "male" ? "男性" : "女性"}

    今天的日期是：${currentDate}

    目前可用的摆件列表: ${decorString}

    请给我一个100字左右的谶语小诗, 小诗对仗工整，需要包含以下内容:
    架空的世界，玄妙的情节，不可说破的寓意；如果需要解谶语小故事，语气像街头算命的道长，不要完全说破，给用户留有想象空间

    请根据我的八字流年和塔罗牌，推算出今天的运势，分析内容包括以下几个方面：
    1. 事业与工作
    2. 财运
    3. 感情与人际
    4. 健康
    5. 幸运色
    6. 摆件


    最后根据已输出内容内容, 总结12到20条tips, tips用于长时间轮播提示给用户，请尽可能涵盖已输出内容的重点信息

    输出文本时可以使用一些Emoji来增加趣味性，但不要过多，可以参考100个字一个Emoji

    请按照以下格式输出：

    ## 📜今天给${user.username}的谶语

    <div class="fortune-story">
      <div class="fortune-story-item">{谶语小诗语句}</div>
      <div class="fortune-story-item">{谶语小诗语句}</div>
      <div class="fortune-story-item">{谶语小诗语句}</div>
      <div class="fortune-story-item">{谶语小诗语句}</div>
      <div class="fortune-story-item">{谶语小诗语句}</div>
      <div class="fortune-story-item">{谶语小诗语句}</div>
      <div class="fortune-story-item">{谶语小诗语句}</div>
      <div class="fortune-story-item">{谶语小诗语句}</div>
    </div>




    ## 🍀八字与流年分析 ${user.username}今日${currentDate}具体运势分析：
    - 事业与工作：
    - 财运：
    - 感情与人际：
    - 健康：


    ## 🍭幸运色分析

    <div class="lucky-color" style="color: {颜色值}">{颜色描述信息}</div>

    ## 🔢今日幸运数字

    <div class="lucky-number">{数字描述信息}</div>

    ## 💬基于以上分析,今日适合交流的人物:

    1.
    2.
    3.

    ## 💏今天脱单适合去哪里

    <div class="dating-place">{地点描述信息}</div>
    <div class="dating-place">{地点描述信息}</div>
    <div class="dating-place">{地点描述信息}</div>

    ## 🤠今天适合去哪里玩

    <div class="play-place">{地点描述信息}</div>
    <div class="dating-place">{地点描述信息}</div>
    <div class="dating-place">{地点描述信息}</div>

    ## 🍽️为了长寿,今天适合吃什么

    <div class="food">{食物描述信息}</div>
    <div class="food">{食物描述信息}</div>
    <div class="food">{食物描述信息}</div>

    ## 🗓️传统黄历

    <div class="fortune-yi">宜：{宜}</div>
    <div class="fortune-ji">忌：{忌}</div>
    <div class="fortune-cai">财神方位：{财神方位}</div>
    <div class="fortune-xi">喜神方位：{喜神方位}</div>
    <div class="fortune-fu">福神方位：{福神方位}</div>

    


    ## 🪆基于以上分析, 今天适合在桌面摆放的一个摆件为{摆件名}:
     <img class="desk-decor" src="/api/random-desk-decor?keyword={摆件名}" />
    
    ## 💡解谶语小故事

    <div class="fortune-story-explanation">{谶语小故事解释}</div>

    ## 🎯总结

    ## 基于以上内容, 总结今日tips信息:

    <div class="fortune-tip">{tip信息}</div>


    
  `;
};

module.exports = {
  buildFortuneTellingPrompt
}; 