// 塔罗牌逐牌解读数据库 v1.0
window.CARD_READINGS = {
  // ========== 大阿卡纳 22张 ==========
  "The Fool": {
    upright: { keyword: "新开始", desc: "一段崭新的旅程正在向你招手，带着纯真与无畏，你即将踏入未知的领域，拥抱无限的可能。" },
    reversed: { keyword: "鲁莽冲动", desc: "你心中有一团火焰，但它需要被温柔地引导。在做决定之前，不妨多给自己一些思考和准备的时间。" }
  },
  "The Magician": {
    upright: { keyword: "创造力", desc: "你拥有将梦想化为现实的魔力，四大元素在你手中交汇，所有资源已准备就绪，只待你挥动意志的魔杖。" },
    reversed: { keyword: "方向迷失", desc: "你的天赋和能力一直都在，只是暂时被迷雾遮掩。重新审视自己的目标，找回那份内在的专注力吧。" }
  },
  "The High Priestess": {
    upright: { keyword: "直觉", desc: "内心深处有一个声音在轻声呼唤你，学会倾听那份直觉，它会引领你穿越表象，抵达真相的核心。" },
    reversed: { keyword: "忽视直觉", desc: "你也许太依赖理性而忽略了内心的声音。静下来，给自己一些独处的时光，让潜意识浮出水面。" }
  },
  "The Empress": {
    upright: { keyword: "丰饶", desc: "大地之母的祝福降临于你，富足与温暖环绕四周。无论是情感还是物质，都正在走向丰收的季节。" },
    reversed: { keyword: "自我忽略", desc: "你一直在照顾别人，却忘了照顾自己。记住，只有先滋养自己，才能将真正的爱与丰盛传递给世界。" }
  },
  "The Emperor": {
    upright: { keyword: "权威", desc: "坚定的力量和清晰的结构正在支撑你。用你的智慧和决断力来掌控局面，秩序与稳定是你此刻最大的优势。" },
    reversed: { keyword: "僵化控制", desc: "对控制的渴望也许正在成为你的枷锁。试着学会放手，允许事情自然发展，柔软有时比坚硬更有力量。" }
  },
  "The Hierophant": {
    upright: { keyword: "传统指引", desc: "来自传统与智慧的力量在守护着你。跟随那些经过时间检验的原则，在规矩中找到内心的安宁与方向。" },
    reversed: { keyword: "打破常规", desc: "旧有的规则也许不再适合你现在的状态。勇敢地走出舒适区，去探索属于自己的那条独特的路。" }
  },
  "The Lovers": {
    upright: { keyword: "爱的选择", desc: "一段深刻的联结正在等待你，无论是爱情还是其他重要的关系。在心的指引下做出真诚的选择。" },
    reversed: { keyword: "内心矛盾", desc: "你正面临一个艰难的选择，也许内心有两个声音在拉扯。给自己一些时间，理清什么才是你真正渴望的。" }
  },
  "The Chariot": {
    upright: { keyword: "胜利前行", desc: "你的意志如战车般坚定，驾驭着对立的力量勇往直前。胜利正在前方等待，保持专注，不要回头。" },
    reversed: { keyword: "失去方向", desc: "你也许感到被各种力量撕扯，找不到前进的方向。停下来重新校准你的目标，找回内心的掌控感。" }
  },
  "Strength": {
    upright: { keyword: "内在力量", desc: "真正的力量不是征服，而是温柔地驯服内心的恐惧。你拥有足够的勇气和耐心去面对一切挑战。" },
    reversed: { keyword: "自我怀疑", desc: "内心的猛兽让你感到不安，但请记住，脆弱也是力量的一部分。接纳自己的不完美，它会成为你最深的勇气来源。" }
  },
  "The Hermit": {
    upright: { keyword: "内省", desc: "是时候走进内心的深山了。独处不是孤独，而是一次珍贵的自我对话。在宁静中，你会找到属于自己的答案。" },
    reversed: { keyword: "封闭自我", desc: "独处的时间也许已经太长了。试着打开那扇门，让温暖的人际关系重新照进你的生活。" }
  },
  "Wheel of Fortune": {
    upright: { keyword: "命运转折", desc: "命运的轮盘正在转动，好运正在向你靠近。顺应变化，每一个转折都是一次成长的机会。" },
    reversed: { keyword: "逆境循环", desc: "生活似乎陷入了一个不顺利的循环，但请记住，轮盘终会再次转向你。保持耐心，低谷只是暂时。" }
  },
  "Justice": {
    upright: { keyword: "公正", desc: "天平正在衡量一切，因果法则正在发挥作用。坚持你的正直和诚实，公正的结果终将到来。" },
    reversed: { keyword: "失衡", desc: "你也许感到世界有些不公平，或者自己正在逃避某个责任。重新审视自己的立场，找到恢复平衡的方法。" }
  },
  "The Hanged Man": {
    upright: { keyword: "牺牲与顿悟", desc: "放下执念，换一个角度看世界。有时候，暂停和退让反而会带来最深刻的领悟和意想不到的收获。" },
    reversed: { keyword: "抗拒改变", desc: "你紧紧抓住旧有的模式不愿放手。试着松开双手，允许自己被生命的河流带走，新的风景正在前方。" }
  },
  "Death": {
    upright: { keyword: "蜕变", desc: "旧的一切正在消散，但这不是结束，而是深刻的重生。凤凰浴火之后，你将迎来更加灿烂的自己。" },
    reversed: { keyword: "抗拒结束", desc: "你害怕告别，但有些东西只有放手才能获得新生。鼓起勇气去面对结束，它会为你打开一扇更宽广的门。" }
  },
  "Temperance": {
    upright: { keyword: "平衡", desc: "天使正在将不同的元素调和成完美的配方。找到生活中的平衡点，耐心与节制会为你带来意想不到的和谐。" },
    reversed: { keyword: "过度失衡", desc: "生活的天平已经倾斜，你也许在某个方面投入了太多。重新调整你的重心，学会在给予和保留之间找到平衡。" }
  },
  "The Devil": {
    upright: { keyword: "束缚", desc: "你被某种执念或习惯所困，但锁链其实是松的。看清那些让你停滞不前的力量，你随时可以选择自由。" },
    reversed: { keyword: "挣脱枷锁", desc: "你正在从旧有的束缚中挣脱出来，这是一个勇敢的过程。继续保持这份清醒和坚定，自由就在前方。" }
  },
  "The Tower": {
    upright: { keyword: "骤变", desc: "突如其来的变化正在打破旧有的结构。虽然令人不安，但这是为了在废墟之上建造更加坚固和真实的未来。" },
    reversed: { keyword: "抗拒剧变", desc: "你害怕改变的到来，但内心的地震已经无法被忽视。与其恐惧崩塌，不如主动重建，做自己命运的建筑师。" }
  },
  "The Star": {
    upright: { keyword: "希望", desc: "暴风雨过后，星光重新洒满天空。希望正在回归，你的心灵正在被温柔地治愈，相信美好的事情即将发生。" },
    reversed: { keyword: "信心动摇", desc: "你也许暂时看不到前方的星光，但它从未消失。给自己一些时间和温柔，信心会一点点重新燃起。" }
  },
  "The Moon": {
    upright: { keyword: "迷雾与幻象", desc: "月光下的世界充满神秘与不确定。不要被恐惧和幻象迷惑，信任你的直觉，它会是你穿越迷雾的灯塔。" },
    reversed: { keyword: "迷雾消散", desc: "困惑正在慢慢散去，真相即将浮出水面。那些曾让你不安的恐惧正在失去力量，黎明就在前方。" }
  },
  "The Sun": {
    upright: { keyword: "光明与喜悦", desc: "太阳的光芒正照耀着你，一切都在走向明朗。喜悦、成功和温暖正在包围你，尽情享受这段闪耀的时光吧。" },
    reversed: { keyword: "光芒减弱", desc: "太阳暂时被云层遮挡，但它的温暖从未离开。保持乐观，拨开迷雾后你会再次看到灿烂的晴空。" }
  },
  "Judgement": {
    upright: { keyword: "觉醒", desc: "号角已经吹响，是时候回顾过去、做出选择了。一次深刻的自我觉醒正在发生，你将找到真正属于你的人生召唤。" },
    reversed: { keyword: "逃避召唤", desc: "内心有一个声音在呼唤你，但你还在犹豫。别再逃避那个真实的自己了，勇敢地回应生命的召唤吧。" }
  },
  "The World": {
    upright: { keyword: "圆满", desc: "一个完整的循环已经达成，你站在了圆满的时刻。庆祝你的成就吧，同时准备好迎接下一个更加精彩的旅程。" },
    reversed: { keyword: "未竟之愿", desc: "离终点只差一步了，但似乎还有什么在拖延你。找到那个未完成的部分，勇敢地去画上句号。" }
  },

  // ========== 宝剑牌组 14张 ==========
  "Ace of Swords": {
    upright: { keyword: "思维突破", desc: "一把锋利的宝剑划破迷雾，新的思想和洞察力正在到来。你将获得清晰的思路，足以斩断一切困惑。" },
    reversed: { keyword: "思绪混乱", desc: "思维之剑暂时失去了锋芒，你也许感到困惑不清。给自己一些时间整理思绪，清晰会在安静中归来。" }
  },
  "Two of Swords": {
    upright: { keyword: "抉择僵局", desc: "你站在十字路口，两个选择都难以割舍。蒙上双眼并非逃避，而是在等待内心真正的答案浮现。" },
    reversed: { keyword: "面对真相", desc: "信息正在涌入，真相终于浮出水面。虽然看清现实需要勇气，但这是做出正确决定的必经之路。" }
  },
  "Three of Swords": {
    upright: { keyword: "心碎", desc: "伤痛的箭刺入心中，这是一段需要面对和疗愈的时光。允许自己悲伤，但要相信伤口终会结痂愈合。" },
    reversed: { keyword: "疗愈中", desc: "最痛的阶段正在过去，你已经开始从伤痛中走出来。给自己多一些耐心和温柔，治愈是一个渐进的过程。" }
  },
  "Four of Swords": {
    upright: { keyword: "休养生息", desc: "战士躺在宁静的教堂中，这是恢复能量的时刻。放下忙碌，让身心在安静中重新充电。" },
    reversed: { keyword: "重新出发", desc: "休息的时间结束了，你感到一股内在的冲动想要重新行动。带着恢复后的能量，勇敢地再次出发吧。" }
  },
  "Five of Swords": {
    upright: { keyword: "冲突与代价", desc: "一场争执或冲突也许让你感到疲惫。胜利并不总是值得的，学会在适当的时候放下武器，才是真正的智慧。" },
    reversed: { keyword: "和解", desc: "冲突正在平息，你开始寻找和解的方式。放下防备和怨恨，用宽容的心态去修复那些受损的关系。" }
  },
  "Six of Swords": {
    upright: { keyword: "渡过难关", desc: "小船正驶向更平静的水域。虽然离开熟悉的地方令人不舍，但前方有更加安宁的彼岸在等待你。" },
    reversed: { keyword: "滞留困境", desc: "你渴望离开但现在似乎还无法做到。不要焦急，做好准备，等待那个最适合起航的时刻。" }
  },
  "Seven of Swords": {
    upright: { keyword: "策略与隐秘", desc: "你正在运用智慧和策略来处理一个复杂的局面。保持警觉和灵活，但也要确保自己的行为是光明正大的。" },
    reversed: { keyword: "坦诚面对", desc: "隐藏和逃避不再是最好的策略。试着坦诚地面对问题，用真诚去化解那些需要智慧和勇气的挑战。" }
  },
  "Eight of Swords": {
    upright: { keyword: "自我设限", desc: "你觉得自己被困住了，但束缚也许只是心理上的牢笼。睁开眼睛看看，出口其实一直都在，你需要的只是勇气。" },
    reversed: { keyword: "挣脱限制", desc: "你正在意识到那些束缚其实并不真实，内心开始觉醒。一步一步地走出现有的框架，自由正在召唤你。" }
  },
  "Nine of Swords": {
    upright: { keyword: "焦虑", desc: "深夜中的噩梦让你难以安眠，担忧正在吞噬你的内心。请记住，大部分恐惧来自想象，现实并没有那么可怕。" },
    reversed: { keyword: "走出阴霾", desc: "最黑暗的夜正在过去，黎明即将到来。那些困扰你的焦虑正在消散，学会信任自己，一切都会好起来。" }
  },
  "Ten of Swords": {
    upright: { keyword: "最低谷", desc: "你已经到达了最低点，但这也意味着最坏的事情已经过去。地平线上第一缕曙光正在升起，准备迎接新生吧。" },
    reversed: { keyword: "复苏", desc: "你正从最深的谷底慢慢爬起，虽然还需要时间，但最艰难的部分已经结束。每一个小进步都值得庆祝。" }
  },
  "Page of Swords": {
    upright: { keyword: "好奇探索", desc: "年轻的剑士充满好奇心和求知欲，新的想法和信息正在到来。保持开放的心态，勇敢地去探索未知。" },
    reversed: { keyword: "言行轻率", desc: "你的言语和想法也许有些冲动和欠考虑。在开口之前多想一想，让行动配得上你的智慧。" }
  },
  "Knight of Swords": {
    upright: { keyword: "迅猛行动", desc: "骑士如疾风般向前冲锋，行动力和决心正在驱动你。保持这股冲劲，但也要记得方向比速度更重要。" },
    reversed: { keyword: "急躁冒进", desc: "你的速度太快了，也许正在忽略重要的细节。减速思考一下，确保你在朝着正确的方向前进。" }
  },
  "Queen of Swords": {
    upright: { keyword: "清醒睿智", desc: "王后以清澈的目光看透一切，她的智慧和公正令人敬仰。用你清晰的头脑和敏锐的洞察力来处理当前的局面。" },
    reversed: { keyword: "冷漠苛刻", desc: "理智变成了冷漠，锋利变成了尖刻。试着在心智清晰的同时，也保留一份温柔和同理心。" }
  },
  "King of Swords": {
    upright: { keyword: "公正裁决", desc: "国王端坐于王座之上，以理性和公正统领一切。用你的智慧和清晰的逻辑来做决定，正义将与你同在。" },
    reversed: { keyword: "独断专行", desc: "权力也许让你变得过于强硬和专制。真正的领导者懂得倾听和包容，试着放下一些傲慢。" }
  },

  // ========== 权杖牌组 14张 ==========
  "Ace of Wands": {
    upright: { keyword: "灵感火花", desc: "一根燃烧的权杖从天而降，灵感和创造力正在被点燃。一个新的项目或热情正在萌芽，抓住这股能量开始行动吧。" },
    reversed: { keyword: "动力不足", desc: "灵感的火花似乎被风吹灭了，你感到缺乏热情和动力。不要着急，给内心的火焰一点时间，它会重新燃起。" }
  },
  "Two of Wands": {
    upright: { keyword: "展望未来", desc: "你手握世界，站在高处眺望远方。计划正在成型，未来的版图在你的脑海中逐渐清晰，是时候迈出第一步了。" },
    reversed: { keyword: "犹豫不前", desc: "你有很多想法和计划，但始终在犹豫是否要行动。不要再等了，不完美的行动胜过完美的等待。" }
  },
  "Three of Wands": {
    upright: { keyword: "远航", desc: "你的船只已经出海，成果正在归来的路上。耐心等待你的努力开花结果，同时继续展望更远的远方。" },
    reversed: { keyword: "延迟", desc: "你期待的结果似乎来得比预期慢了一些。保持耐心和信心，继续做好当下的准备，好消息终会到达。" }
  },
  "Four of Wands": {
    upright: { keyword: "欢庆", desc: "鲜花和彩旗装点着喜悦的时刻，这是值得庆祝的阶段。无论是里程碑还是小成就，都值得你停下来好好感受这份幸福。" },
    reversed: { keyword: "不稳定", desc: "基础还不够稳固，庆祝的时机也许还未完全成熟。继续巩固你的根基，让喜悦建立在坚实的土地上。" }
  },
  "Five of Wands": {
    upright: { keyword: "竞争", desc: "多股力量在交织碰撞，竞争和冲突在所难免。把这些挑战看作成长的机会，在碰撞中磨砺出更强大的自己。" },
    reversed: { keyword: "回避冲突", desc: "你正在努力避免冲突，但有些矛盾无法被永远忽视。勇敢地面对分歧，在沟通中找到共赢的解决方案。" }
  },
  "Six of Wands": {
    upright: { keyword: "荣耀胜利", desc: "凯旋的号角为你吹响，努力和才华得到了认可和赞美。享受这份荣耀吧，这是你应得的。" },
    reversed: { keyword: "自信受挫", desc: "你渴望被认可却暂时没有得到期待中的回应。别灰心，真正的价值不需要所有人的掌声来证明。" }
  },
  "Seven of Wands": {
    upright: { keyword: "坚守阵地", desc: "你站在高处，面对来自各方的挑战毫不退缩。坚持你的立场和信念，勇气和毅力将是你最强大的武器。" },
    reversed: { keyword: "力不从心", desc: "四面八方的压力让你感到疲惫不堪。也许你需要一些帮助和支持，学会求助也是一种勇敢。" }
  },
  "Eight of Wands": {
    upright: { keyword: "急速前行", desc: "八根权杖如箭一般飞驰而过，事情正在以惊人的速度推进。顺势而为，抓住这股快速前行的能量。" },
    reversed: { keyword: "停滞延误", desc: "原本快速推进的事情突然慢了下来，延误和阻碍让你焦急。利用这段等待的时间做好准备，时机到了自会起飞。" }
  },
  "Nine of Wands": {
    upright: { keyword: "坚韧", desc: "你已经在战场上坚持了很久，伤痕累累却依然站立。最后一段路总是最艰难的，但请不要放弃，胜利就在眼前。" },
    reversed: { keyword: "过度疲惫", desc: "你太累了，继续硬撑下去可能会彻底崩溃。是时候休息一下了，承认自己的极限不是软弱而是智慧。" }
  },
  "Ten of Wands": {
    upright: { keyword: "重担", desc: "你背负着太多的责任和压力，已经快要走不动了。学会放下一些不属于你的负担，轻装上阵才能走得更远。" },
    reversed: { keyword: "释放压力", desc: "你终于开始学会放下那些沉重的负担。这是一个积极的转变，学会委托和拒绝会让你的生活轻松许多。" }
  },
  "Page of Wands": {
    upright: { keyword: "热情探索", desc: "年轻的探险家带着满腔热情出发，新的冒险和可能性在前方等待。保持这份热情和好奇心，勇敢地去尝试。" },
    reversed: { keyword: "三分钟热度", desc: "你有很多想法但缺乏持久的热情。试着找到一个真正让你心动的项目，然后全心全意地投入其中。" }
  },
  "Knight of Wands": {
    upright: { keyword: "冒险精神", desc: "骑士骑着烈马奔向远方，冒险和激情是他最大的驱动力。跟随你的热情去冒险吧，精彩的故事正在等待被书写。" },
    reversed: { keyword: "浮躁不定", desc: "你的热情像一阵旋风，来得快去得也快。试着将这份能量聚焦在一个目标上，持久的热情比短暂的爆发更有力量。" }
  },
  "Queen of Wands": {
    upright: { keyword: "魅力自信", desc: "王后如太阳般温暖而有力量，她的自信和魅力吸引着一切。用你的热情和感染力去影响周围的人，你是天生的领导者。" },
    reversed: { keyword: "情绪波动", desc: "你的自信正在受到挑战，情绪像过山车一样起伏。试着回到自己的内在力量中心，找回那个闪闪发光的自己。" }
  },
  "King of Wands": {
    upright: { keyword: "远见领袖", desc: "国王以远见和魄力引领着方向，他的领导力和创造力令人信服。用你的愿景和热情去激励他人，一起创造伟大的事业。" },
    reversed: { keyword: "独裁专断", desc: "你的领导风格也许变得过于强势和独断。真正的伟大领导者懂得倾听和尊重，试着更加包容和灵活。" }
  },

  // ========== 圣杯牌组 14张 ==========
  "Ace of Cups": {
    upright: { keyword: "爱的萌芽", desc: "一只 overflowing 的圣杯出现在你面前，新的情感体验正在到来。敞开心扉，让爱和感动充盈你的生命。" },
    reversed: { keyword: "情感封闭", desc: "你的心门暂时关上了，也许是过去的伤痛让你不敢再次敞开。给自己时间，但不要永远拒绝爱的可能。" }
  },
  "Two of Cups": {
    upright: { keyword: "灵魂伴侣", desc: "两颗心在真诚地靠近，一段深刻的情感联结正在形成。珍惜这份相遇，用心去感受和回应这份美好。" },
    reversed: { keyword: "关系裂痕", desc: "你和某个人之间的联结出现了裂痕，沟通变得困难。试着放下骄傲，用真诚和理解去修复这段关系。" }
  },
  "Three of Cups": {
    upright: { keyword: "欢聚", desc: "朋友们举起酒杯共同庆祝，快乐和友情正在围绕你。融入这个温暖的群体，分享你的喜悦和幸福。" },
    reversed: { keyword: "社交疲惫", desc: "过多的社交让你感到疲惫，也许你需要的是高质量的独处时光。学会在人群中保持自己的节奏。" }
  },
  "Four of Cups": {
    upright: { keyword: "情感倦怠", desc: "你沉浸在自己的世界中，对外界的馈赠视而不见。也许不是世界缺少美好，而是你的注意力需要被重新唤醒。" },
    reversed: { keyword: "重新觉醒", desc: "你开始从情感的麻木中醒来，重新注意到身边的美好。新的机会正在出现，这次不要再错过了。" }
  },
  "Five of Cups": {
    upright: { keyword: "失落", desc: "三个杯子倒下了，悲伤和失望笼罩着你。但请回头看，还有两个杯子依然满满地立着——不要忽略你所拥有的。" },
    reversed: { keyword: "走出悲伤", desc: "你开始从失落中走出来，学会了接受和放下。转过身来，你会发现自己仍然拥有许多值得珍惜的东西。" }
  },
  "Six of Cups": {
    upright: { keyword: "纯真回忆", desc: "童年的美好记忆如潮水般涌来，纯真和快乐在召唤你。也许一个老朋友正在回来，或者一段温暖的旧时光正在重演。" },
    reversed: { keyword: "沉溺过去", desc: "你对过去的怀念已经影响到了现在的生活。美好的回忆是宝藏，但不要让自己永远活在过去。" }
  },
  "Seven of Cups": {
    upright: { keyword: "幻想与诱惑", desc: "七个杯子中盛满了各种幻想和诱惑，每一个看起来都很美好。学会分辨什么是真正的渴望，什么是短暂的幻象。" },
    reversed: { keyword: "脚踏实地", desc: "你终于从云端回到了地面，开始看清什么是真正重要的。这份清醒和务实会帮助你做出更明智的选择。" }
  },
  "Eight of Cups": {
    upright: { keyword: "放手远行", desc: "你转身离开那些不再满足你的事物，勇敢地踏上了寻找更深层意义的旅程。这是一个艰难但必要的决定。" },
    reversed: { keyword: "害怕离开", desc: "你知道应该离开，但恐惧让你留在了原地。相信自己有勇气做出改变，更好的生活在前方等待。" }
  },
  "Nine of Cups": {
    upright: { keyword: "心愿达成", desc: "你是那个坐在九个杯子前的幸运儿，心愿正在实现。尽情享受这份满足和快乐吧，这是宇宙给你的礼物。" },
    reversed: { keyword: "欲求不满", desc: "你拥有很多却依然感到不满足。试着练习感恩，你会发现真正的富足来自内心的满足而非外在的获得。" }
  },
  "Ten of Cups": {
    upright: { keyword: "家庭幸福", desc: "彩虹下的家庭充满了爱与和谐，这是最圆满的情感状态。珍惜身边的人，共同创造属于你的幸福家园。" },
    reversed: { keyword: "家庭矛盾", desc: "家庭或亲密关系中出现了不和谐的声音。用爱和耐心去沟通，寻找恢复和谐的方法。" }
  },
  "Page of Cups": {
    upright: { keyword: "浪漫惊喜", desc: "一条小鱼从杯中探出头来，带来意想不到的惊喜和灵感。保持一颗童心，去迎接生活中那些可爱的小确幸。" },
    reversed: { keyword: "情感幼稚", desc: "你的情感表达也许有些幼稚或不成熟。试着更加深入地理解自己的感受，让情感变得更加深厚和真实。" }
  },
  "Knight of Cups": {
    upright: { keyword: "浪漫追求", desc: "骑士手持圣杯优雅而来，带着浪漫和温柔的追求。跟随你的心去感受爱，让情感成为你前行的动力。" },
    reversed: { keyword: "情感幻灭", desc: "浪漫的幻象破灭了，你感到失望和迷茫。但真正的爱不是童话，接受它的不完美反而会让你更加珍惜。" }
  },
  "Queen of Cups": {
    upright: { keyword: "温柔共情", desc: "王后以无比的温柔和共情力守护着情感的深度。用你的同理心去感受和理解他人，你的温柔是最强大的力量。" },
    reversed: { keyword: "情感过度", desc: "你的情感也许太过泛滥，让他人的情绪淹没了自己。学会在关心他人的同时也保护好自己的情感边界。" }
  },
  "King of Cups": {
    upright: { keyword: "情绪智慧", desc: "国王在波涛中保持平静，他以极高的情商驾驭着情感的海洋。用你的智慧和沉稳来处理复杂的人际关系。" },
    reversed: { keyword: "情感压抑", desc: "你过度控制自己的情感，试图在所有人面前表现得完美。允许自己展示脆弱，那才是真正的情感成熟。" }
  },

  // ========== 星币牌组 14张 ==========
  "Ace of Pentacles": {
    upright: { keyword: "物质新机遇", desc: "一枚闪闪发光的星币出现在你手中，一个崭新的财务或事业机会正在到来。抓住它，用踏实的行动去浇灌这颗种子。" },
    reversed: { keyword: "错失良机", desc: "一个好机会正在从指间溜走，也许是因为犹豫或准备不足。学会识别和把握机会，不要让它在等待中消散。" }
  },
  "Two of Pentacles": {
    upright: { keyword: "灵活平衡", desc: "你在多个事务之间灵活地周旋，如杂技演员般保持平衡。虽然忙碌，但你做得很好，继续保持这种节奏。" },
    reversed: { keyword: "失控失衡", desc: "手中的球正在掉落，你感到力不从心。是时候重新排列优先级了，不要试图同时做太多事情。" }
  },
  "Three of Pentacles": {
    upright: { keyword: "团队协作", desc: "工匠们正在共同建造一座美丽的教堂，合作和专长正在带来卓越的成果。发挥你的专业才能，与团队一起创造更大的价值。" },
    reversed: { keyword: "合作不顺", desc: "团队合作遇到了障碍，沟通不畅或分工不清。试着重新建立有效的沟通机制，让每个人的才能都得到发挥。" }
  },
  "Four of Pentacles": {
    upright: { keyword: "守护财富", desc: "你紧紧抱住自己的星币，安全感对你来说非常重要。适度的保守是明智的，但也要学会在适当的时候慷慨分享。" },
    reversed: { keyword: "放下执念", desc: "你开始学会放下对物质的过度执着，懂得放手才能拥有更多。这是一种成长的标志，继续向前走。" }
  },
  "Five of Pentacles": {
    upright: { keyword: "困顿", desc: "你在风雪中艰难前行，感到被遗弃和匮乏。但请记住，教堂的窗户里亮着灯——帮助一直都在，你只需要抬头看到它。" },
    reversed: { keyword: "走出困境", desc: "最艰难的时刻正在过去，你开始看到希望和援助。接受他人的帮助并不丢人，这是你重新站起来的开始。" }
  },
  "Six of Pentacles": {
    upright: { keyword: "慷慨施与", desc: "慷慨的手正在给予，丰盈的能量在流动。无论是给予还是接受，都怀着一颗感恩的心，让善意不断循环。" },
    reversed: { keyword: "权力失衡", desc: "给予和接受之间的关系出现了不平等。审视你在关系中的位置，确保付出和收获是平衡的。" }
  },
  "Seven of Pentacles": {
    upright: { keyword: "耐心耕耘", desc: "你种下的种子正在慢慢生长，虽然进展缓慢但方向正确。继续保持耐心和坚持，丰收的季节终将到来。" },
    reversed: { keyword: "焦虑等待", desc: "你为结果感到焦虑，觉得付出和回报不成正比。重新评估你的策略和方向，也许需要做出一些调整。" }
  },
  "Eight of Pentacles": {
    upright: { keyword: "精进技艺", desc: "工匠正在专注地雕琢每一枚星币，精益求精的态度令人敬佩。投入时间去打磨你的技能，匠心会为你带来丰厚的回报。" },
    reversed: { keyword: "缺乏专注", desc: "你的注意力分散了，无法专注于提升自我。试着找回那份匠人精神，一次只做一件事，做到最好。" }
  },
  "Nine of Pentacles": {
    upright: { keyword: "优雅独立", desc: "你在自己的花园中悠然自得，经济独立和生活品质都在最佳状态。享受这份自给自足的优雅，你值得拥有。" },
    reversed: { keyword: "过度消费", desc: "你也许在物质上投入了太多，忽略了内在的富足。真正的优雅来自内心的丰盈，而非外在的奢华。" }
  },
  "Ten of Pentacles": {
    upright: { keyword: "世代传承", desc: "财富和幸福在家族中世代相传，这是最稳固的繁荣。珍惜你拥有的一切，同时也要为未来打下坚实的基础。" },
    reversed: { keyword: "家庭财务问题", desc: "家庭财务或遗产方面出现了问题。坦诚地面对和沟通，用理性和情感共同寻找解决之道。" }
  },
  "Page of Pentacles": {
    upright: { keyword: "学习新技能", desc: "年轻的学生手捧星币，眼中充满了对知识和技能的渴望。投入学习吧，每一个新的知识点都是通向未来的阶梯。" },
    reversed: { keyword: "缺乏规划", desc: "你有学习的愿望但缺乏实际的规划和行动。制定一个切实可行的计划，让梦想一步步变为现实。" }
  },
  "Knight of Pentacles": {
    upright: { keyword: "稳步前行", desc: "骑士骑着稳重的工作马缓缓前行，踏实和可靠是他的标志。不需要急于求成，一步一个脚印地走，终点一定会到达。" },
    reversed: { keyword: "停滞不前", desc: "你的生活陷入了单调和停滞，日复一日的routine让你失去了动力。试着在稳定中寻找新的挑战和可能性。" }
  },
  "Queen of Pentacles": {
    upright: { keyword: "滋养务实", desc: "王后以务实和温暖的方式管理着一切，她将生活打理得井井有条。用你的耐心和细心去经营生活，平凡中自有丰盛。" },
    reversed: { keyword: "忽视自我", desc: "你把所有精力都给了家庭和别人，却忘记了自己的需求。记住，照顾好自己才能更好地照顾你爱的人。" }
  },
  "King of Pentacles": {
    upright: { keyword: "财富大亨", desc: "国王坐在繁荣的宝座上，他的成功来自长期的智慧和努力。用你积累的经验和资源去创造更大的价值。" },
    reversed: { keyword: "贪婪固执", desc: "对财富的追求也许让你变得过于物质化或固执。真正的富足不仅仅是银行账户上的数字，还包括内心的平和。" }
  }
};

// 动态解读生成
window.generateTarotReading = function(cards, theme) {
  // cards: [{ name: '中文', nameEn: '英文', reversed: bool }, ...] 3张
  // theme: '今日运势' | '爱情缘分' | '事业财运'

  var readings = window.CARD_READINGS;

  var past = cards[0];
  var present = cards[1];
  var future = cards[2];

  var pastData = readings[past.nameEn] ? (past.reversed ? readings[past.nameEn].reversed : readings[past.nameEn].upright) : { keyword: '未知', desc: '这张牌带来了神秘的信息。' };
  var presentData = readings[present.nameEn] ? (present.reversed ? readings[present.nameEn].reversed : readings[present.nameEn].upright) : { keyword: '未知', desc: '这张牌带来了神秘的信息。' };
  var futureData = readings[future.nameEn] ? (future.reversed ? readings[future.nameEn].reversed : readings[future.nameEn].upright) : { keyword: '未知', desc: '这张牌带来了神秘的信息。' };

  var positionLabel = past.reversed ? '（逆位）' : '';
  var presentLabel = present.reversed ? '（逆位）' : '';
  var futureLabel = future.reversed ? '（逆位）' : '';

  // 主题引导语
  var themeIntro = '';
  var themeFocus = '';
  if (theme === '今日运势') {
    themeIntro = '今天的宇宙为你展开了一幅独特的牌阵';
    themeFocus = '把握今天的能量，活出最好的自己';
  } else if (theme === '爱情缘分') {
    themeIntro = '在爱的宇宙中，你的情感旅程正在被温柔地照亮';
    themeFocus = '用心去感受爱，也勇敢地表达爱';
  } else if (theme === '事业财运') {
    themeIntro = '事业和财富的能量正在你的生命中流转';
    themeFocus = '踏实前行，机遇永远眷顾有准备的人';
  }

  // 过去牌解读
  var pastText = '回到过去，' + past.name + positionLabel + '带来了"' + pastData.keyword + '"的能量——' + pastData.desc;

  // 现在牌解读
  var presentText = '回到当下，' + present.name + presentLabel + '正传递着"' + presentData.keyword + '"的信号——' + presentData.desc;

  // 未来牌解读
  var futureText = '望向未来，' + future.name + futureLabel + '预示了"' + futureData.keyword + '"的方向——' + futureData.desc;

  // 综合建议
  var advice = '';
  if (theme === '今日运势') {
    advice = '今天，请带着这三张牌给你的启示，温柔而坚定地走好每一步。';
  } else if (theme === '爱情缘分') {
    advice = '在爱的旅途中，请相信自己的直觉，用心去感受每一个温暖的瞬间，勇敢地去爱。';
  } else if (theme === '事业财运') {
    advice = '在事业和财富的道路上，保持耐心和专注，你的每一步努力都在为未来的丰盛积蓄力量。';
  }

  // 生成 reading（HTML 格式，分段显示）
  var posTag   = past.reversed    ? '<span class="tag-rev">逆位</span>' : '<span class="tag-up">正位</span>';
  var preTag   = present.reversed ? '<span class="tag-rev">逆位</span>' : '<span class="tag-up">正位</span>';
  var futTag   = future.reversed  ? '<span class="tag-rev">逆位</span>' : '<span class="tag-up">正位</span>';

  var reading = [
    '<p class="reading-intro">' + themeIntro + '。</p>',
    '<div class="reading-card-block">',
    '  <div class="reading-card-label"><span class="reading-pos">过 去</span><span class="reading-name">' + past.name + '</span>' + posTag + '</div>',
    '  <p class="reading-card-text">' + pastText.replace(/^回到过去，[^—]+——/, '') + '</p>',
    '</div>',
    '<div class="reading-card-block">',
    '  <div class="reading-card-label"><span class="reading-pos">现 在</span><span class="reading-name">' + present.name + '</span>' + preTag + '</div>',
    '  <p class="reading-card-text">' + presentText.replace(/^回到当下，[^—]+——/, '') + '</p>',
    '</div>',
    '<div class="reading-card-block">',
    '  <div class="reading-card-label"><span class="reading-pos">未 来</span><span class="reading-name">' + future.name + '</span>' + futTag + '</div>',
    '  <p class="reading-card-text">' + futureText.replace(/^望向未来，[^—]+——/, '') + '</p>',
    '</div>',
    '<p class="reading-advice">' + advice + '</p>'
  ].join('\n');

  // 生成 quote（金句，15字以内，带书名号「」）
  var quoteKeywords = [
    '心之所向素履以往', '星光不问赶路人', '万物皆有裂痕', '所有的相遇都是久别重逢',
    '爱是最好的答案', '勇敢的人先享受世界', '相信相信的力量', '一切都会好的',
    '你值得世间一切美好', '做自己的光', '岁月温柔以待', '未来可期',
    '心有繁花一路芬芳', '追光的人终会光芒万丈', '慢慢来比较快',
    '愿你被这世界温柔以待', '所有的坚持都有意义', '你的存在本身就是礼物',
    '去爱去失去去成长', '在不确定中找确定', '每一次转身都是新的开始',
    '做自己的太阳无需借光', '好运正在路上', '你比自己想象的更强大',
    '风雨过后总有彩虹', '愿你眼里有星辰大海', '热爱可抵岁月漫长',
    '每一步都算数', '你的善良终会有回响'
  ];

  // 根据牌面状态和主题选择一个合适的金句
  var quoteIndex = 0;
  var hasReversed = past.reversed || present.reversed || future.reversed;

  // 基于牌名哈希选择金句，保证同牌阵一致性
  var hash = 0;
  for (var i = 0; i < cards.length; i++) {
    var str = cards[i].nameEn + (cards[i].reversed ? 'R' : '');
    for (var j = 0; j < str.length; j++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(j);
      hash = hash & hash;
    }
  }
  hash += theme.charCodeAt(0);
  quoteIndex = Math.abs(hash) % quoteKeywords.length;

  var quote = '「' + quoteKeywords[quoteIndex] + '」';

  return { quote: quote, reading: reading };
};

// end of tarot-card-readings.js
