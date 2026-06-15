import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "competitor-radar", "data.json");
const publicOutputPath = path.join(rootDir, "public", "competitor-radar", "data.json");

const seedItems = [
  ["auto-cn-trip-1", "微博讨论 AI 端午错峰出行路线", "旅行博主用短帖与评论互动测试路线生成、天气提醒和景点拥堵规避能力。", "cn", "国内", "trip-planning", "AI 旅行规划", 93, "微博热议", "weibo", "微博", "https://weibo.com/", "假期节点会天然放大路线效率诉求，国内热点可优先捕捉节假日相关标签。", 2],
  ["auto-cn-ota-1", "抖音热视频展示 OTA AI 助手 30 秒完成酒店比价", "用户在评论区集中追问机酒联订、退改提醒和预算控制的真实体验。", "cn", "国内", "ota-assistant", "OTA AI 助手", 90, "抖音热视频", "douyin", "抖音", "https://www.douyin.com/", "国内短视频内容对结果可视化极其敏感，‘省了多少钱’很容易形成传播。", 5],
  ["auto-cn-social-1", "小红书热门笔记热议 AI 旅行搭子", "创作者把攻略生成、拍照点推荐和同行沟通建议打包展示，收藏率明显上升。", "cn", "国内", "social-travel", "社交+旅行", 86, "小红书热门笔记", "xiaohongshu", "小红书", "https://www.xiaohongshu.com/", "个人出游的安全感和陪伴感是强情绪卖点，适合做内容化表达。", 22],
  ["auto-cn-funding-1", "X 上投资人讨论中国 AI 行程团队种子轮推进", "业内转发 Similarweb 截图并讨论复访率，融资视角从模型转向留存。", "cn", "国内", "funding", "融资动态", 78, "X 行业讨论", "x", "X", "https://x.com/", "投资人对旅行 AI 的判断越来越依赖复访和复游场景，说明可持续使用频次很关键。", 190],
  ["auto-na-trip-1", "X 上 #TravelAI 热议多城市 itinerary copilot", "北美创作者讨论路线生成是否能联动预算、天气和餐厅候选。", "na", "北美", "trip-planning", "AI 旅行规划", 92, "X Trending", "x", "X", "https://x.com/search?q=%23TravelAI", "北美用户更吃一站式串联能力，生成路线只是起点。", 1],
  ["auto-na-ota-1", "Instagram 热门 Reels 测试酒店 AI concierge", "创作者用入住前后流程演示 AI 助手在提醒、翻译和预算管理上的差异。", "na", "北美", "ota-assistant", "OTA AI 助手", 88, "Instagram Reels", "instagram", "Instagram", "https://www.instagram.com/", "北美 OTA AI 内容里，服务打包能力比单点智能更容易引发传播。", 12],
  ["auto-na-social-1", "X 讨论组热议 AI 帮我找到同路线旅行搭子", "solo trip 安全感和兴趣匹配度是评论焦点，用户频繁与论坛产品对比。", "na", "北美", "social-travel", "社交+旅行", 83, "X 社区对话", "x", "X", "https://x.com/", "验证机制和真实性是北美社交旅行产品的第一门槛。", 75],
  ["auto-na-funding-1", "Instagram 创投博主总结 AI travel startup 新融资名单", "创作者用轮播贴总结案例，评论区讨论订阅与佣金哪种更成立。", "na", "北美", "funding", "融资动态", 80, "Instagram Creator Post", "instagram", "Instagram", "https://www.instagram.com/", "变现结构已经成为融资讨论的显性话题，品牌叙事要更商业化。", 260],
  ["auto-eu-trip-1", "Instagram 上欧洲用户热刷周末火车旅行 AI 规划", "跨城火车和低碳出行内容升温，创作者对比不同 AI 规划工具的可执行性。", "eu", "欧洲", "trip-planning", "AI 旅行规划", 89, "Instagram 热门标签", "instagram", "Instagram", "https://www.instagram.com/explore/tags/travelai/", "rail-first 和低碳路线是欧洲市场更容易共鸣的表达方向。", 7],
  ["auto-eu-ota-1", "X 上 OTA AI 助手对比帖讨论多语种客服体验", "用户实测航变、退改和跨国酒店沟通场景，对多语言理解提出更高要求。", "eu", "欧洲", "ota-assistant", "OTA AI 助手", 84, "X 产品对比", "x", "X", "https://x.com/", "多语种和跨时区处理是欧洲 OTA AI 的基本盘。", 50],
  ["auto-eu-social-1", "X 上城市漫游搭子生成器被欧洲创作者转发", "用户讨论兴趣匹配、活动推荐和本地 walk 线路是否能形成更自然的社交体验。", "eu", "欧洲", "social-travel", "社交+旅行", 81, "X 社区对话", "x", "X", "https://x.com/", "欧洲社交旅行更偏生活方式表达，监测时可加入 city walk 等标签。", 130],
  ["auto-eu-funding-1", "X 投资话题追踪欧洲 AI 行程助手完成 pre-seed", "小团队如何验证垂直旅行场景成为讨论重点，社区增长优于传统买量。", "eu", "欧洲", "funding", "融资动态", 74, "X 创投讨论", "x", "X", "https://x.com/", "欧洲投资人对 niche 场景和社区增长路径接受度更高。", 330],
  ["auto-jpkr-trip-1", "Instagram 上日韩创作者热推错峰 AI 路线", "内容聚焦拍照动线、本地餐厅和人流节奏，强调细分兴趣理解能力。", "jpkr", "日韩", "trip-planning", "AI 旅行规划", 87, "Instagram 创作者内容", "instagram", "Instagram", "https://www.instagram.com/explore/tags/travelai/", "日韩用户对路线的美感和节奏特别敏感，适合强化视觉化规划。", 3],
  ["auto-jpkr-ota-1", "X 讨论日韩 OTA AI 客服能否联动地铁与航班", "用户反馈集中在实时提醒、交通换乘和航变后自动重排。", "jpkr", "日韩", "ota-assistant", "OTA AI 助手", 82, "X 用户讨论", "x", "X", "https://x.com/", "实时性和出错后的自动重排，比推荐更多地点更有吸引力。", 44],
  ["auto-jpkr-social-1", "小红书跨境笔记热议东京咖啡巡礼搭子", "评论区交换日韩目的地社交旅行经验，内容从测评转向真实场景分享。", "jpkr", "日韩", "social-travel", "社交+旅行", 79, "小红书跨境内容", "xiaohongshu", "小红书", "https://www.xiaohongshu.com/", "兴趣标签比城市标签更能驱动跨境社交旅行内容。", 96],
  ["auto-jpkr-funding-1", "微博科技话题转发日韩 AI 旅行创业团队融资讨论", "行业从业者关注文化理解和本地生活方式推荐能否形成壁垒。", "jpkr", "日韩", "funding", "融资动态", 72, "微博行业转发", "weibo", "微博", "https://weibo.com/", "日韩市场的竞争力判断常围绕本地化深度展开。", 400],
  ["auto-sea-trip-1", "抖音热门话题带动东南亚海岛 AI 行程视频增量", "家庭出游和朋友团体场景成为评论主线，用户关注预算拆分与活动安排。", "sea", "东南亚", "trip-planning", "AI 旅行规划", 85, "抖音热门话题", "douyin", "抖音", "https://www.douyin.com/", "东南亚热点适合优先覆盖多人协同和预算分配相关内容。", 6],
  ["auto-sea-ota-1", "Instagram 热门短视频测评东南亚酒店 AI 助手中文服务", "评论区集中问到接送机、亲子房和签证材料提醒。", "sea", "东南亚", "ota-assistant", "OTA AI 助手", 82, "Instagram Reels", "instagram", "Instagram", "https://www.instagram.com/", "东南亚市场对中文服务敏感，跨境服务链整合是重要卖点。", 28],
  ["auto-sea-social-1", "X 上 digital nomad + AI travel buddy 话题升温", "围绕巴厘岛与清迈社群，用户讨论 AI 能否同时安排住宿、社交和短途探索。", "sea", "东南亚", "social-travel", "社交+旅行", 77, "X 社群趋势", "x", "X", "https://x.com/", "数字游民场景适合把 stay、social、explore 做组合体验。", 120],
  ["auto-sea-funding-1", "Instagram 创业账号盘点东南亚 AI 旅游工具融资风向", "讨论从流量扩张转向 unit economics，本地服务合作成为高频词。", "sea", "东南亚", "funding", "融资动态", 71, "Instagram 创投观察", "instagram", "Instagram", "https://www.instagram.com/", "东南亚融资讨论更关注合作变现路径和本地服务网络。", 500]
];

const items = seedItems.map(
  ([
    id,
    title,
    summary,
    regionKey,
    region,
    trackKey,
    track,
    heat,
    source,
    platform,
    platformLabel,
    url,
    insight,
    hoursAgo
  ]) => ({
    id,
    title,
    summary,
    regionKey,
    region,
    trackKey,
    track,
    heat,
    source,
    platform,
    platformLabel,
    url,
    insight,
    time: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
  })
);

const payload = {
  updatedAt: new Date().toISOString(),
  sourcePolicy: {
    allowedPlatforms: ["X", "Instagram", "微博", "小红书", "抖音"],
    excludedSources: ["新闻媒体", "科技媒体", "聚合新闻站"]
  },
  items
};

await mkdir(path.dirname(outputPath), { recursive: true });
await mkdir(path.dirname(publicOutputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
await writeFile(publicOutputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(`Generated ${items.length} items at ${outputPath} and ${publicOutputPath}`);
