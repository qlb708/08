import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "competitor-radar", "data.json");
const publicOutputPath = path.join(rootDir, "public", "competitor-radar", "data.json");

function buildSearchUrl(platform, query) {
  const encoded = encodeURIComponent(query);

  if (platform === "x") return `https://x.com/search?q=${encoded}&src=typed_query`;
  if (platform === "instagram") return `https://www.instagram.com/explore/search/keyword/?q=${encoded}`;
  if (platform === "weibo") return `https://s.weibo.com/weibo?q=${encoded}`;
  if (platform === "xiaohongshu") return `https://www.xiaohongshu.com/search_result?keyword=${encoded}`;
  if (platform === "douyin") return `https://www.douyin.com/search/${encoded}`;
  return "https://x.com/";
}

function buildTopicUrl(platform, trackKey) {
  const topicMap = {
    travel: {
      x: "travel",
      instagram: "travel",
      weibo: "旅行",
      xiaohongshu: "旅行",
      douyin: "旅行"
    },
    "ai-tools": {
      x: "aitools",
      instagram: "aitools",
      weibo: "AI工具",
      xiaohongshu: "AI工具",
      douyin: "AI工具"
    },
    creator: {
      x: "contentcreator",
      instagram: "contentcreator",
      weibo: "创作者",
      xiaohongshu: "创作者",
      douyin: "vlog"
    },
    lifestyle: {
      x: "lifestyle",
      instagram: "lifestyle",
      weibo: "生活方式",
      xiaohongshu: "生活方式",
      douyin: "citywalk"
    },
    consumer: {
      x: "productreview",
      instagram: "productreview",
      weibo: "种草",
      xiaohongshu: "种草",
      douyin: "好物"
    },
    funding: {
      x: "venturecapital",
      instagram: "startupfunding",
      weibo: "融资",
      xiaohongshu: "融资",
      douyin: "创业"
    }
  };

  const token = topicMap[trackKey]?.[platform] ?? "trend";

  if (platform === "x") return `https://x.com/search?q=%23${encodeURIComponent(token)}&src=typed_query`;
  if (platform === "instagram") return `https://www.instagram.com/explore/tags/${encodeURIComponent(token)}/`;
  if (platform === "weibo") return `https://s.weibo.com/weibo?q=%23${encodeURIComponent(token)}%23`;
  if (platform === "xiaohongshu") return `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(token)}`;
  if (platform === "douyin") return `https://www.douyin.com/search/${encodeURIComponent(token)}`;
  return "https://x.com/";
}

function buildSourceExamples(item) {
  const query = `${item.region} ${item.track} ${item.title}`;

  return [
    {
      label: `${item.platformLabel} 搜索入口`,
      note: "从平台内搜索该热点标题与关键词，适合继续追帖子原文。",
      url: buildSearchUrl(item.platform, query)
    },
    {
      label: `${item.platformLabel} 主题入口`,
      note: "查看同主题下的扩散内容、相似帖子和二次创作。",
      url: buildTopicUrl(item.platform, item.trackKey)
    },
    {
      label: `${item.platformLabel} 平台主页`,
      note: "回到平台首页或探索页，继续顺着账号与话题找原始内容。",
      url: item.url
    }
  ];
}

const seedItems = [
  ["cn-travel-1", "微博热议暑期高铁城市周末逃离路线", "用户集中讨论两天一夜短途出行、预算控制和避开热门景点拥堵的真实体验。", "cn", "国内", "travel", "旅行出行", 94, "微博热议", "weibo", "微博", "https://weibo.com/", "国内旅行热点已经从‘去哪’转到‘怎么高效玩’，短平快路线很容易形成传播。", 2],
  ["cn-ai-1", "小红书笔记爆出 AI 做简历和面试模拟的新工作流", "大量职场用户在评论区交换 prompt 和效率截图，收藏率明显上升。", "cn", "国内", "ai-tools", "AI 工具应用", 91, "小红书热门笔记", "xiaohongshu", "小红书", "https://www.xiaohongshu.com/", "用户不再满足于工具介绍，更愿意保存可复用的完整工作流。", 5],
  ["cn-creator-1", "抖音跟拍潮掀起“办公室一天剪成 vlog”模板热", "创作者内容从日常记录升级成模板复制，评论区集中问转场和字幕工具。", "cn", "国内", "creator", "创作者内容", 88, "抖音跟拍热点", "douyin", "抖音", "https://www.douyin.com/", "内容一旦模板化，就会从单条爆款转成连锁跟拍。", 10],
  ["cn-life-1", "微博城市热榜讨论“夜骑 + 河边散步”生活方式", "年轻用户把骑行、咖啡和city walk打包成一种低成本社交生活方式。", "cn", "国内", "lifestyle", "城市生活方式", 84, "微博城市话题", "weibo", "微博", "https://weibo.com/", "生活方式热点通常由场景词驱动，而不是由单一品牌驱动。", 21],
  ["cn-consumer-1", "小红书测评把便携榨汁杯重新推成办公室种草单品", "评论从颜值讨论很快转向清洗成本、续航和真实使用频率。", "cn", "国内", "consumer", "消费种草", 82, "小红书种草测评", "xiaohongshu", "小红书", "https://www.xiaohongshu.com/", "消费种草真正扩散时，用户会迅速从‘想买’进入‘值不值’阶段。", 28],
  ["cn-funding-1", "X 上投资人讨论中国消费 AI 团队开始转向精细变现", "行业讨论从流量增长切到留存和付费结构，关注 CAC 与复购效率。", "cn", "国内", "funding", "融资动态", 77, "X 行业讨论", "x", "X", "https://x.com/", "融资视角正从故事转向模型之后的经营质量。", 190],

  ["na-travel-1", "Instagram Reels 带火“24 小时城市逃离”周末路线", "北美创作者把路线、预算和用车方式剪成高复用模板，互动率明显提高。", "na", "北美", "travel", "旅行出行", 92, "Instagram Reels", "instagram", "Instagram", "https://www.instagram.com/", "北美旅行内容正朝模板化和一键复用方向走。", 3],
  ["na-ai-1", "X 上热议 AI meeting notes 工具谁最适合远程团队", "讨论点从转写准确率转向行动项提取、跨时区协作和集成能力。", "na", "北美", "ai-tools", "AI 工具应用", 90, "X Trending", "x", "X", "https://x.com/", "AI 工具热点一旦进入效率场景，竞争点会迅速转向实际工作流。", 8],
  ["na-creator-1", "Instagram 创作者开始批量发布“拍摄桌面 setup”内容", "热门内容把镜头、灯光、收音和 AI 剪辑工具捆绑成完整创作方案。", "na", "北美", "creator", "创作者内容", 86, "Instagram Creator Post", "instagram", "Instagram", "https://www.instagram.com/", "创作者热点更像装备与流程的组合展示，而不是单一功能秀。", 17],
  ["na-life-1", "X 讨论组热聊 remote work 人群最爱的第三空间", "用户把咖啡馆、共享空间和通勤便利性打包成城市生活方式评价体系。", "na", "北美", "lifestyle", "城市生活方式", 83, "X 社区对话", "x", "X", "https://x.com/", "第三空间类热点很容易串联消费、工作和社交三条线。", 40],
  ["na-consumer-1", "Instagram 热门测评把迷你投影仪重新带回客厅场景", "评论区从画质争论扩展到租房、小户型和朋友聚会真实使用场景。", "na", "北美", "consumer", "消费种草", 81, "Instagram Product Reel", "instagram", "Instagram", "https://www.instagram.com/", "消费热度重新升起时，通常是因为使用场景被重新定义。", 70],
  ["na-funding-1", "X 上 VC 复盘创作者经济工具融资进入冷静期", "讨论点集中在增长质量、续费能力和付费用户规模，而不是单纯 DAU。", "na", "北美", "funding", "融资动态", 79, "X 投资讨论", "x", "X", "https://x.com/", "资本正在用更成熟的 SaaS 指标重新审视创作者工具。", 210],

  ["eu-travel-1", "Instagram 带动欧洲周末火车小镇路线持续升温", "创作者把 rail pass、咖啡馆和本地市集组合成低碳旅行模板。", "eu", "欧洲", "travel", "旅行出行", 89, "Instagram 热门标签", "instagram", "Instagram", "https://www.instagram.com/explore/tags/travel/", "欧洲旅行热点常由低碳叙事和生活方式共同推动。", 6],
  ["eu-ai-1", "X 上热议 AI 翻译工具能否真正支持跨语种工作", "多语协作场景让用户开始比较实时字幕、邮件润色和会议纪要质量。", "eu", "欧洲", "ai-tools", "AI 工具应用", 86, "X 产品对比", "x", "X", "https://x.com/", "跨语种场景会逼出 AI 工具的真实可用性，而不只是炫技。", 15],
  ["eu-creator-1", "Instagram 挑战赛把 city walk film look 再次推热", "大量创作者在模仿胶片调色、慢镜头和简短字幕结构。", "eu", "欧洲", "creator", "创作者内容", 84, "Instagram Challenge", "instagram", "Instagram", "https://www.instagram.com/", "当审美模板形成时，内容热点会从创意竞争转向执行效率竞争。", 26],
  ["eu-life-1", "X 上城市生活讨论把“低刺激周末”变成热词", "用户分享书店、公园、慢跑和面包店路线，形成一种反高压生活叙事。", "eu", "欧洲", "lifestyle", "城市生活方式", 80, "X Lifestyle Thread", "x", "X", "https://x.com/", "低刺激生活方式的走红说明情绪需求正在驱动城市内容。", 75],
  ["eu-consumer-1", "Instagram 测评让胶囊咖啡机在小户型租房场景翻红", "话题重点从品牌溢价转向早晨效率、台面占用和清洁感。", "eu", "欧洲", "consumer", "消费种草", 78, "Instagram Product Post", "instagram", "Instagram", "https://www.instagram.com/", "消费产品一旦贴合生活节律，就很容易形成高讨论度。", 115],
  ["eu-funding-1", "X 创投圈追踪欧洲垂直消费应用 pre-seed 节奏", "小团队如何先做社区再做交易成为讨论重点。", "eu", "欧洲", "funding", "融资动态", 74, "X 创投讨论", "x", "X", "https://x.com/", "欧洲融资偏好仍然倾向 niche 社群和清晰的第一批用户。", 320],

  ["jpkr-travel-1", "Instagram 上日韩用户热推清晨拍照路线和错峰攻略", "内容围绕拍照动线、咖啡店开门时间和地铁换乘效率展开。", "jpkr", "日韩", "travel", "旅行出行", 88, "Instagram 创作者内容", "instagram", "Instagram", "https://www.instagram.com/explore/tags/travel/", "日韩旅行热点常把审美动线和效率动线叠在一起。", 4],
  ["jpkr-ai-1", "X 热议 AI 手账与日程整理工具是否真的替代纸笔", "用户讨论生成速度、日历同步和界面治愈感哪个更影响留存。", "jpkr", "日韩", "ai-tools", "AI 工具应用", 84, "X 用户讨论", "x", "X", "https://x.com/", "工具在日韩市场更容易被当成生活方式产品来判断。", 20],
  ["jpkr-creator-1", "小红书跨境内容把东京一天拍成三种风格模板", "评论区大量询问镜头参数、滤镜和剪映模板链接。", "jpkr", "日韩", "creator", "创作者内容", 82, "小红书跨境内容", "xiaohongshu", "小红书", "https://www.xiaohongshu.com/", "创作热点在日韩内容里非常容易演变成风格模板交易。", 33],
  ["jpkr-life-1", "微博转发带热“便利店深夜觅食路线”城市内容", "用户分享便利店新品、深夜步行路线和一个人出门的安全感。", "jpkr", "日韩", "lifestyle", "城市生活方式", 79, "微博转发热议", "weibo", "微博", "https://weibo.com/", "一个人也能舒服生活的叙事，在日韩内容里极具传播力。", 90],
  ["jpkr-consumer-1", "Instagram 短视频让口袋打印机重回手账圈", "用户从拍照存档延伸到票据收藏、追星应援和旅行纪念。", "jpkr", "日韩", "consumer", "消费种草", 77, "Instagram Reels", "instagram", "Instagram", "https://www.instagram.com/", "消费热点往往靠细分兴趣圈层复活，而不是大众市场直接起量。", 125],
  ["jpkr-funding-1", "微博科技话题转发日韩小而美应用融资讨论", "外界关注文化理解、本地细节和审美一致性能否形成壁垒。", "jpkr", "日韩", "funding", "融资动态", 73, "微博行业转发", "weibo", "微博", "https://weibo.com/", "日韩方向的融资判断常围绕本地化深度和审美统一性展开。", 360],

  ["sea-travel-1", "抖音热门话题带火海岛雨季错峰玩法", "家庭出游和朋友团体玩法在评论区持续补充，预算拆分成为高频词。", "sea", "东南亚", "travel", "旅行出行", 87, "抖音热门话题", "douyin", "抖音", "https://www.douyin.com/", "东南亚旅行热点通常和多人出行决策紧密绑定。", 7],
  ["sea-ai-1", "Instagram 创作者测试 AI 字幕翻译工具在东南亚多语视频里的表现", "用户比较字幕准确率、语气自然度和平台分发是否受影响。", "sea", "东南亚", "ai-tools", "AI 工具应用", 83, "Instagram Creator Reel", "instagram", "Instagram", "https://www.instagram.com/", "多语内容环境让 AI 工具的实用性被放大检验。", 16],
  ["sea-creator-1", "X 上 digital nomad vlog 模板话题继续扩散", "创作者把住宿、咖啡馆、海边工作和社交场景剪成统一结构。", "sea", "东南亚", "creator", "创作者内容", 81, "X 社群趋势", "x", "X", "https://x.com/", "数字游民内容一旦模板化，就很适合形成系列传播。", 42],
  ["sea-life-1", "小红书笔记热议清迈慢生活和远程办公城市感", "内容围绕租房、夜市、共创空间和低压生活节奏展开。", "sea", "东南亚", "lifestyle", "城市生活方式", 79, "小红书海外生活", "xiaohongshu", "小红书", "https://www.xiaohongshu.com/", "东南亚城市生活方式热点，本质上是在卖更轻松的生活节奏。", 82],
  ["sea-consumer-1", "Instagram 热门短视频把便携风扇和防晒袖套打成海岛出行标配", "用户从颜值讨论快速转向是否真适合高温高湿环境。", "sea", "东南亚", "consumer", "消费种草", 76, "Instagram Product Reel", "instagram", "Instagram", "https://www.instagram.com/", "环境适配性会直接决定东南亚消费热点能否持续。", 130],
  ["sea-funding-1", "Instagram 创投账号盘点东南亚本地生活工具融资风向", "讨论从用户增长转向本地服务合作和更稳的现金流模式。", "sea", "东南亚", "funding", "融资动态", 72, "Instagram 创投观察", "instagram", "Instagram", "https://www.instagram.com/", "东南亚融资更关注落地服务网络，而不是纯流量故事。", 420]
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
  ]) => {
    const item = {
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
      sourceQuery: `${region} ${track} ${title}`,
      time: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
    };

    return {
      ...item,
      sourceExamples: buildSourceExamples(item)
    };
  }
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
