const moment = require("moment");
const { getEnumLabel } = require("../../../../config/enum-mappings");

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

  // 获取用户详细信息变量
  // 基本身体信息
  const userHeight = user.height || null; // 身高（米）
  const userWeight = user.weight || null; // 体重（公斤）
  const userProfession = user.profession || null; // 职业

  // 健康状况信息
  const userConstitutionType = user.constitution_type || null; // 体质类型（原始值）
  const userConstitutionTypeLabel = userConstitutionType ? getEnumLabel('constitution_type', userConstitutionType) : null; // 体质类型（显示文本）
  
  const userSleepQuality = user.sleep_quality || null; // 睡眠质量（原始值）
  const userSleepQualityLabel = userSleepQuality ? getEnumLabel('sleep_quality', userSleepQuality) : null; // 睡眠质量（显示文本）
  
  const userExerciseFrequency = user.exercise_frequency || null; // 运动频率（原始值）
  const userExerciseFrequencyLabel = userExerciseFrequency ? getEnumLabel('exercise_frequency', userExerciseFrequency) : null; // 运动频率（显示文本）

  // 症状和偏好信息（数组类型）
  const userCommonSymptoms = user.common_symptoms || []; // 常见症状列表
  const userDietaryPreferences = user.dietary_preferences || []; // 饮食偏好列表
  const userBodyDiscomfort = user.body_discomfort || []; // 身体不适部位列表

  // 补充说明
  const userHealthInfo = user.health_info || null; // 健康信息补充说明

  // 格式化信息用于显示（如果需要的话）
  const formattedUserInfo = {
    // 身体基本信息
    height: userHeight ? `${userHeight}米` : '未填写',
    weight: userWeight ? `${userWeight}公斤` : '未填写', 
    profession: userProfession || '未填写',
    
    // 健康状况
    constitutionType: userConstitutionTypeLabel || '未填写',
    sleepQuality: userSleepQualityLabel || '未填写',
    exerciseFrequency: userExerciseFrequencyLabel || '未填写',
    
    // 症状和不适
    commonSymptoms: userCommonSymptoms.length > 0 ? userCommonSymptoms.join('、') : '无',
    dietaryPreferences: userDietaryPreferences.length > 0 ? userDietaryPreferences.join('、') : '无特殊偏好',
    bodyDiscomfort: userBodyDiscomfort.length > 0 ? userBodyDiscomfort.join('、') : '无',
    
    // 补充信息
    healthInfo: userHealthInfo || '无补充说明'
  };
  return `
    我是${user.username}，出生信息如下：
    - 出生日期：${user.birth_date} (阳历)
    - 出生时间：${user.birth_time}
    - 性别：${user.gender === "male" ? "男性" : "女性"}

    我的身高是：${userHeight}米，体重是：${userWeight}公斤，职业是：${userProfession}

    我的健康状况是：${userConstitutionTypeLabel}，睡眠质量是：${userSleepQualityLabel}，运动频率是：${userExerciseFrequencyLabel}

    我的常见症状是：${userCommonSymptoms.length > 0 ? userCommonSymptoms.join('、') : '无'}，饮食偏好是：${userDietaryPreferences.length > 0 ? userDietaryPreferences.join('、') : '无'}，身体不适部位是：${userBodyDiscomfort.length > 0 ? userBodyDiscomfort.join('、') : '无'}

    我的健康信息补充说明是：${userHealthInfo}
  
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

    请用资深中医的语气，结合中医理论（如阴阳五行、脏腑经络、辨证论治等），用温和、专业、富有文化底蕴的语言，引用一些道德经名言，总结健康建议，并输出到 health-summary 部分

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


    ## 🌿今日中医养生健康建议:

    <div class="health-advice">
      <div class="health-advice-item">{健康建议}</div>
      <div class="health-advice-item">{健康建议}</div>
      <div class="health-advice-item">{健康建议}</div>
      <div class="health-advice-item">{健康建议}</div>
      <div class="health-advice-item">{健康建议}</div>
      <div class="health-advice-item">{健康建议}</div>
      <div class="health-advice-item">{健康建议}</div>
      <div class="health-advice-item">{健康建议}</div>
    </div>

    <div class="health-summary">
      {健康建议总结}
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

    ### 📅 ${currentDate} 黄历精要

    | 项目 | 内容 |
    |:----:|:-----|
    | 🌟 **五行** | {当日五行属性} |
    | 🙏 **值神** | {当日值神} |
    | ⚡ **冲煞** | {冲煞信息} |
    | 💰 **财神** | {财神方位} |
    | 😊 **喜神** | {喜神方位} |
    | 🍀 **福神** | {福神方位} |

    ### ⏰ 重要时辰

    | 时辰 | 时间 | 运势 |
    |:----:|:----:|:-----|
    | 🌅 **卯时** | 05-07时 | {卯时运势简述} |
    | ☀️ **巳时** | 09-11时 | {巳时运势简述} |
    | 🌞 **午时** | 11-13时 | {午时运势简述} |
    | 🌆 **酉时** | 17-19时 | {酉时运势简述} |

    ---

    ### 📝 今日宜忌

    <div class="fortune-yi">宜：{今日宜做的事情}</div>
    <div class="fortune-ji">忌：{今日忌做的事情}</div>

  

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