/**
 * tarot-tag-engine.js
 * 塔罗牌 × 旅游推荐 标签打分引擎
 * 
 * 三张牌位置权重：当前状态 1.0 / 内在需求 1.2 / 旅行解法 1.5
 * 8个标签维度：adventure / romance / healing / culture / nature / urban / spiritual / social
 */

// ============================================================
// 一、78张韦特塔罗牌标签数据
// ============================================================
window.CARD_TAGS = {

  // -------------------- 22 大牌 --------------------
  "The Fool": {
    upright:  { adventure:5, romance:2, healing:3, culture:1, nature:4, urban:1, spiritual:3, social:2 },
    reversed: { adventure:2, romance:1, healing:4, culture:2, nature:3, urban:2, spiritual:2, social:1 }
  },
  "The Magician": {
    upright:  { adventure:4, romance:3, healing:2, culture:3, nature:2, urban:4, spiritual:4, social:3 },
    reversed: { adventure:2, romance:2, healing:1, culture:2, nature:1, urban:3, spiritual:3, social:2 }
  },
  "The High Priestess": {
    upright:  { adventure:1, romance:3, healing:4, culture:3, nature:3, urban:0, spiritual:5, social:0 },
    reversed: { adventure:1, romance:2, healing:3, culture:2, nature:2, urban:1, spiritual:4, social:1 }
  },
  "The Empress": {
    upright:  { adventure:2, romance:5, healing:4, culture:2, nature:5, urban:1, spiritual:2, social:3 },
    reversed: { adventure:1, romance:3, healing:2, culture:1, nature:3, urban:2, spiritual:1, social:2 }
  },
  "The Emperor": {
    upright:  { adventure:2, romance:1, healing:1, culture:5, nature:2, urban:5, spiritual:1, social:3 },
    reversed: { adventure:1, romance:1, healing:1, culture:3, nature:1, urban:4, spiritual:1, social:2 }
  },
  "The Hierophant": {
    upright:  { adventure:1, romance:1, healing:3, culture:5, nature:1, urban:2, spiritual:5, social:3 },
    reversed: { adventure:3, romance:2, healing:2, culture:3, nature:2, urban:2, spiritual:3, social:2 }
  },
  "The Lovers": {
    upright:  { adventure:3, romance:5, healing:3, culture:2, nature:4, urban:1, spiritual:3, social:2 },
    reversed: { adventure:1, romance:2, healing:2, culture:1, nature:2, urban:2, spiritual:2, social:1 }
  },
  "The Chariot": {
    upright:  { adventure:5, romance:2, healing:1, culture:2, nature:3, urban:3, spiritual:2, social:3 },
    reversed: { adventure:3, romance:1, healing:1, culture:1, nature:2, urban:2, spiritual:1, social:2 }
  },
  "Strength": {
    upright:  { adventure:4, romance:3, healing:3, culture:2, nature:5, urban:0, spiritual:4, social:1 },
    reversed: { adventure:2, romance:2, healing:2, culture:1, nature:3, urban:1, spiritual:3, social:1 }
  },
  "The Hermit": {
    upright:  { adventure:3, romance:0, healing:5, culture:4, nature:5, urban:0, spiritual:5, social:0 },
    reversed: { adventure:1, romance:1, healing:3, culture:3, nature:3, urban:1, spiritual:4, social:1 }
  },
  "Wheel of Fortune": {
    upright:  { adventure:5, romance:3, healing:2, culture:3, nature:3, urban:2, spiritual:5, social:3 },
    reversed: { adventure:2, romance:1, healing:2, culture:2, nature:2, urban:1, spiritual:3, social:1 }
  },
  "Justice": {
    upright:  { adventure:2, romance:1, healing:2, culture:5, nature:1, urban:4, spiritual:3, social:2 },
    reversed: { adventure:1, romance:1, healing:1, culture:3, nature:1, urban:3, spiritual:2, social:1 }
  },
  "The Hanged Man": {
    upright:  { adventure:1, romance:1, healing:5, culture:2, nature:3, urban:0, spiritual:5, social:0 },
    reversed: { adventure:1, romance:1, healing:3, culture:1, nature:2, urban:1, spiritual:4, social:1 }
  },
  "Death": {
    upright:  { adventure:4, romance:1, healing:2, culture:3, nature:3, urban:1, spiritual:5, social:0 },
    reversed: { adventure:2, romance:1, healing:3, culture:2, nature:2, urban:1, spiritual:4, social:1 }
  },
  "Temperance": {
    upright:  { adventure:2, romance:2, healing:5, culture:3, nature:4, urban:1, spiritual:4, social:1 },
    reversed: { adventure:1, romance:1, healing:3, culture:2, nature:3, urban:1, spiritual:3, social:1 }
  },
  "The Devil": {
    upright:  { adventure:4, romance:4, healing:0, culture:2, nature:1, urban:4, spiritual:3, social:4 },
    reversed: { adventure:2, romance:2, healing:2, culture:1, nature:1, urban:3, spiritual:2, social:2 }
  },
  "The Tower": {
    upright:  { adventure:5, romance:1, healing:0, culture:3, nature:2, urban:2, spiritual:4, social:1 },
    reversed: { adventure:3, romance:1, healing:1, culture:2, nature:2, urban:1, spiritual:3, social:1 }
  },
  "The Star": {
    upright:  { adventure:3, romance:3, healing:5, culture:1, nature:5, urban:0, spiritual:5, social:0 },
    reversed: { adventure:1, romance:2, healing:3, culture:1, nature:3, urban:0, spiritual:4, social:1 }
  },
  "The Moon": {
    upright:  { adventure:3, romance:3, healing:2, culture:2, nature:4, urban:0, spiritual:5, social:0 },
    reversed: { adventure:2, romance:2, healing:2, culture:1, nature:3, urban:1, spiritual:4, social:1 }
  },
  "The Sun": {
    upright:  { adventure:4, romance:4, healing:4, culture:2, nature:5, urban:2, spiritual:2, social:5 },
    reversed: { adventure:3, romance:3, healing:3, culture:1, nature:3, urban:2, spiritual:1, social:3 }
  },
  "Judgement": {
    upright:  { adventure:3, romance:2, healing:3, culture:4, nature:2, urban:1, spiritual:5, social:1 },
    reversed: { adventure:1, romance:1, healing:2, culture:3, nature:1, urban:1, spiritual:4, social:1 }
  },
  "The World": {
    upright:  { adventure:5, romance:3, healing:3, culture:5, nature:4, urban:3, spiritual:4, social:4 },
    reversed: { adventure:3, romance:2, healing:2, culture:3, nature:3, urban:2, spiritual:3, social:2 }
  },

  // -------------------- 宝剑 (Swords) 14张 --------------------
  "Ace of Swords": {
    upright:  { adventure:3, romance:1, healing:1, culture:3, nature:1, urban:3, spiritual:3, social:1 },
    reversed: { adventure:2, romance:0, healing:1, culture:2, nature:1, urban:2, spiritual:2, social:1 }
  },
  "Two of Swords": {
    upright:  { adventure:1, romance:2, healing:2, culture:2, nature:1, urban:2, spiritual:3, social:0 },
    reversed: { adventure:2, romance:1, healing:2, culture:1, nature:1, urban:1, spiritual:2, social:1 }
  },
  "Three of Swords": {
    upright:  { adventure:1, romance:1, healing:1, culture:2, nature:2, urban:1, spiritual:2, social:0 },
    reversed: { adventure:1, romance:2, healing:3, culture:1, nature:2, urban:1, spiritual:2, social:1 }
  },
  "Four of Swords": {
    upright:  { adventure:0, romance:0, healing:5, culture:3, nature:2, urban:0, spiritual:4, social:0 },
    reversed: { adventure:1, romance:0, healing:3, culture:2, nature:1, urban:1, spiritual:3, social:1 }
  },
  "Five of Swords": {
    upright:  { adventure:3, romance:0, healing:0, culture:1, nature:1, urban:3, spiritual:1, social:2 },
    reversed: { adventure:2, romance:1, healing:1, culture:1, nature:1, urban:2, spiritual:1, social:1 }
  },
  "Six of Swords": {
    upright:  { adventure:4, romance:1, healing:3, culture:2, nature:3, urban:1, spiritual:2, social:0 },
    reversed: { adventure:2, romance:1, healing:2, culture:1, nature:2, urban:1, spiritual:2, social:1 }
  },
  "Seven of Swords": {
    upright:  { adventure:4, romance:1, healing:0, culture:2, nature:2, urban:2, spiritual:2, social:1 },
    reversed: { adventure:3, romance:1, healing:1, culture:1, nature:1, urban:2, spiritual:2, social:1 }
  },
  "Eight of Swords": {
    upright:  { adventure:1, romance:0, healing:1, culture:2, nature:1, urban:2, spiritual:3, social:0 },
    reversed: { adventure:2, romance:1, healing:3, culture:1, nature:2, urban:1, spiritual:3, social:1 }
  },
  "Nine of Swords": {
    upright:  { adventure:1, romance:0, healing:0, culture:1, nature:1, urban:1, spiritual:3, social:0 },
    reversed: { adventure:1, romance:1, healing:2, culture:1, nature:1, urban:1, spiritual:2, social:0 }
  },
  "Ten of Swords": {
    upright:  { adventure:1, romance:0, healing:0, culture:2, nature:1, urban:1, spiritual:2, social:0 },
    reversed: { adventure:2, romance:1, healing:3, culture:1, nature:2, urban:1, spiritual:2, social:1 }
  },
  "Page of Swords": {
    upright:  { adventure:4, romance:1, healing:1, culture:3, nature:2, urban:3, spiritual:2, social:2 },
    reversed: { adventure:2, romance:1, healing:1, culture:2, nature:1, urban:2, spiritual:1, social:1 }
  },
  "Knight of Swords": {
    upright:  { adventure:5, romance:1, healing:0, culture:2, nature:2, urban:3, spiritual:1, social:2 },
    reversed: { adventure:3, romance:0, healing:0, culture:2, nature:1, urban:3, spiritual:1, social:1 }
  },
  "Queen of Swords": {
    upright:  { adventure:2, romance:1, healing:2, culture:4, nature:2, urban:3, spiritual:3, social:1 },
    reversed: { adventure:1, romance:1, healing:2, culture:3, nature:1, urban:2, spiritual:2, social:1 }
  },
  "King of Swords": {
    upright:  { adventure:2, romance:1, healing:1, culture:5, nature:1, urban:4, spiritual:2, social:3 },
    reversed: { adventure:1, romance:0, healing:1, culture:3, nature:1, urban:3, spiritual:2, social:2 }
  },

  // -------------------- 权杖 (Wands) 14张 --------------------
  "Ace of Wands": {
    upright:  { adventure:5, romance:3, healing:1, culture:2, nature:3, urban:2, spiritual:2, social:3 },
    reversed: { adventure:3, romance:2, healing:1, culture:1, nature:2, urban:1, spiritual:1, social:2 }
  },
  "Two of Wands": {
    upright:  { adventure:4, romance:2, healing:1, culture:2, nature:3, urban:2, spiritual:2, social:1 },
    reversed: { adventure:2, romance:1, healing:1, culture:2, nature:2, urban:1, spiritual:2, social:1 }
  },
  "Three of Wands": {
    upright:  { adventure:5, romance:2, healing:2, culture:2, nature:3, urban:2, spiritual:1, social:3 },
    reversed: { adventure:3, romance:1, healing:2, culture:1, nature:2, urban:1, spiritual:1, social:2 }
  },
  "Four of Wands": {
    upright:  { adventure:2, romance:4, healing:3, culture:3, nature:3, urban:2, spiritual:1, social:5 },
    reversed: { adventure:1, romance:3, healing:2, culture:2, nature:2, urban:2, spiritual:1, social:3 }
  },
  "Five of Wands": {
    upright:  { adventure:4, romance:1, healing:0, culture:1, nature:2, urban:3, spiritual:1, social:5 },
    reversed: { adventure:2, romance:1, healing:1, culture:1, nature:1, urban:2, spiritual:1, social:3 }
  },
  "Six of Wands": {
    upright:  { adventure:3, romance:2, healing:1, culture:2, nature:2, urban:3, spiritual:1, social:5 },
    reversed: { adventure:2, romance:1, healing:1, culture:1, nature:1, urban:2, spiritual:1, social:3 }
  },
  "Seven of Wands": {
    upright:  { adventure:4, romance:1, healing:1, culture:2, nature:3, urban:2, spiritual:2, social:2 },
    reversed: { adventure:2, romance:1, healing:1, culture:1, nature:2, urban:1, spiritual:2, social:1 }
  },
  "Eight of Wands": {
    upright:  { adventure:5, romance:3, healing:1, culture:1, nature:2, urban:3, spiritual:1, social:4 },
    reversed: { adventure:3, romance:2, healing:1, culture:1, nature:1, urban:2, spiritual:1, social:2 }
  },
  "Nine of Wands": {
    upright:  { adventure:3, romance:0, healing:1, culture:2, nature:2, urban:2, spiritual:2, social:1 },
    reversed: { adventure:2, romance:0, healing:2, culture:1, nature:2, urban:1, spiritual:2, social:1 }
  },
  "Ten of Wands": {
    upright:  { adventure:2, romance:0, healing:0, culture:3, nature:2, urban:3, spiritual:1, social:1 },
    reversed: { adventure:1, romance:1, healing:2, culture:2, nature:1, urban:2, spiritual:1, social:1 }
  },
  "Page of Wands": {
    upright:  { adventure:5, romance:2, healing:2, culture:2, nature:3, urban:1, spiritual:2, social:3 },
    reversed: { adventure:3, romance:1, healing:2, culture:1, nature:2, urban:1, spiritual:1, social:2 }
  },
  "Knight of Wands": {
    upright:  { adventure:5, romance:4, healing:1, culture:1, nature:3, urban:2, spiritual:1, social:4 },
    reversed: { adventure:3, romance:2, healing:1, culture:1, nature:2, urban:1, spiritual:1, social:3 }
  },
  "Queen of Wands": {
    upright:  { adventure:4, romance:4, healing:2, culture:2, nature:3, urban:3, spiritual:2, social:4 },
    reversed: { adventure:2, romance:3, healing:2, culture:1, nature:2, urban:2, spiritual:1, social:3 }
  },
  "King of Wands": {
    upright:  { adventure:4, romance:3, healing:1, culture:3, nature:2, urban:4, spiritual:2, social:5 },
    reversed: { adventure:3, romance:2, healing:1, culture:2, nature:1, urban:3, spiritual:1, social:3 }
  },

  // -------------------- 圣杯 (Cups) 14张 --------------------
  "Ace of Cups": {
    upright:  { adventure:2, romance:5, healing:4, culture:2, nature:3, urban:0, spiritual:3, social:2 },
    reversed: { adventure:1, romance:3, healing:3, culture:1, nature:2, urban:0, spiritual:2, social:1 }
  },
  "Two of Cups": {
    upright:  { adventure:2, romance:5, healing:3, culture:2, nature:3, urban:1, spiritual:2, social:2 },
    reversed: { adventure:1, romance:3, healing:2, culture:1, nature:2, urban:1, spiritual:2, social:1 }
  },
  "Three of Cups": {
    upright:  { adventure:2, romance:3, healing:3, culture:2, nature:2, urban:2, spiritual:1, social:5 },
    reversed: { adventure:1, romance:2, healing:2, culture:1, nature:1, urban:2, spiritual:1, social:3 }
  },
  "Four of Cups": {
    upright:  { adventure:1, romance:2, healing:3, culture:2, nature:3, urban:1, spiritual:3, social:0 },
    reversed: { adventure:2, romance:2, healing:3, culture:2, nature:3, urban:1, spiritual:3, social:1 }
  },
  "Five of Cups": {
    upright:  { adventure:1, romance:2, healing:1, culture:2, nature:2, urban:1, spiritual:2, social:0 },
    reversed: { adventure:1, romance:2, healing:3, culture:1, nature:2, urban:1, spiritual:2, social:1 }
  },
  "Six of Cups": {
    upright:  { adventure:1, romance:4, healing:4, culture:4, nature:2, urban:1, spiritual:2, social:2 },
    reversed: { adventure:1, romance:2, healing:3, culture:3, nature:1, urban:1, spiritual:2, social:1 }
  },
  "Seven of Cups": {
    upright:  { adventure:3, romance:4, healing:2, culture:2, nature:3, urban:1, spiritual:4, social:1 },
    reversed: { adventure:2, romance:2, healing:2, culture:1, nature:2, urban:1, spiritual:3, social:1 }
  },
  "Eight of Cups": {
    upright:  { adventure:4, romance:1, healing:3, culture:2, nature:4, urban:0, spiritual:4, social:0 },
    reversed: { adventure:2, romance:1, healing:2, culture:1, nature:3, urban:1, spiritual:3, social:0 }
  },
  "Nine of Cups": {
    upright:  { adventure:2, romance:4, healing:4, culture:2, nature:2, urban:2, spiritual:1, social:4 },
    reversed: { adventure:1, romance:3, healing:3, culture:1, nature:1, urban:2, spiritual:1, social:3 }
  },
  "Ten of Cups": {
    upright:  { adventure:2, romance:5, healing:5, culture:2, nature:4, urban:1, spiritual:2, social:3 },
    reversed: { adventure:1, romance:3, healing:3, culture:1, nature:3, urban:1, spiritual:2, social:2 }
  },
  "Page of Cups": {
    upright:  { adventure:3, romance:4, healing:3, culture:2, nature:3, urban:1, spiritual:3, social:2 },
    reversed: { adventure:2, romance:3, healing:2, culture:1, nature:2, urban:1, spiritual:2, social:1 }
  },
  "Knight of Cups": {
    upright:  { adventure:3, romance:5, healing:3, culture:3, nature:3, urban:1, spiritual:3, social:2 },
    reversed: { adventure:2, romance:3, healing:2, culture:2, nature:2, urban:1, spiritual:2, social:1 }
  },
  "Queen of Cups": {
    upright:  { adventure:1, romance:4, healing:5, culture:2, nature:3, urban:0, spiritual:4, social:1 },
    reversed: { adventure:1, romance:3, healing:3, culture:1, nature:2, urban:0, spiritual:3, social:1 }
  },
  "King of Cups": {
    upright:  { adventure:2, romance:3, healing:4, culture:4, nature:3, urban:2, spiritual:3, social:3 },
    reversed: { adventure:1, romance:2, healing:3, culture:3, nature:2, urban:2, spiritual:2, social:2 }
  },

  // -------------------- 星币 (Pentacles) 14张 --------------------
  "Ace of Pentacles": {
    upright:  { adventure:3, romance:2, healing:2, culture:3, nature:4, urban:2, spiritual:1, social:2 },
    reversed: { adventure:2, romance:1, healing:1, culture:2, nature:3, urban:2, spiritual:1, social:1 }
  },
  "Two of Pentacles": {
    upright:  { adventure:3, romance:2, healing:1, culture:2, nature:2, urban:4, spiritual:1, social:3 },
    reversed: { adventure:2, romance:1, healing:1, culture:1, nature:1, urban:3, spiritual:1, social:2 }
  },
  "Three of Pentacles": {
    upright:  { adventure:2, romance:1, healing:1, culture:5, nature:1, urban:3, spiritual:1, social:3 },
    reversed: { adventure:1, romance:1, healing:1, culture:3, nature:1, urban:2, spiritual:1, social:2 }
  },
  "Four of Pentacles": {
    upright:  { adventure:0, romance:0, healing:2, culture:3, nature:1, urban:5, spiritual:1, social:1 },
    reversed: { adventure:1, romance:1, healing:2, culture:2, nature:1, urban:3, spiritual:1, social:2 }
  },
  "Five of Pentacles": {
    upright:  { adventure:1, romance:1, healing:1, culture:2, nature:2, urban:2, spiritual:3, social:0 },
    reversed: { adventure:2, romance:1, healing:3, culture:1, nature:2, urban:1, spiritual:3, social:1 }
  },
  "Six of Pentacles": {
    upright:  { adventure:1, romance:2, healing:3, culture:2, nature:1, urban:3, spiritual:1, social:4 },
    reversed: { adventure:1, romance:1, healing:2, culture:1, nature:1, urban:2, spiritual:1, social:2 }
  },
  "Seven of Pentacles": {
    upright:  { adventure:2, romance:1, healing:3, culture:2, nature:5, urban:0, spiritual:2, social:1 },
    reversed: { adventure:1, romance:1, healing:2, culture:1, nature:3, urban:1, spiritual:2, social:1 }
  },
  "Eight of Pentacles": {
    upright:  { adventure:2, romance:1, healing:2, culture:4, nature:1, urban:3, spiritual:2, social:1 },
    reversed: { adventure:1, romance:1, healing:1, culture:3, nature:1, urban:2, spiritual:1, social:1 }
  },
  "Nine of Pentacles": {
    upright:  { adventure:2, romance:3, healing:4, culture:3, nature:4, urban:2, spiritual:1, social:2 },
    reversed: { adventure:1, romance:2, healing:3, culture:2, nature:3, urban:2, spiritual:1, social:1 }
  },
  "Ten of Pentacles": {
    upright:  { adventure:1, romance:3, healing:3, culture:5, nature:2, urban:3, spiritual:1, social:4 },
    reversed: { adventure:1, romance:2, healing:2, culture:3, nature:1, urban:2, spiritual:1, social:2 }
  },
  "Page of Pentacles": {
    upright:  { adventure:3, romance:1, healing:2, culture:3, nature:4, urban:2, spiritual:1, social:2 },
    reversed: { adventure:2, romance:1, healing:1, culture:2, nature:3, urban:1, spiritual:1, social:1 }
  },
  "Knight of Pentacles": {
    upright:  { adventure:2, romance:2, healing:2, culture:3, nature:4, urban:2, spiritual:1, social:1 },
    reversed: { adventure:1, romance:1, healing:2, culture:2, nature:3, urban:2, spiritual:1, social:1 }
  },
  "Queen of Pentacles": {
    upright:  { adventure:1, romance:3, healing:4, culture:3, nature:5, urban:2, spiritual:2, social:3 },
    reversed: { adventure:1, romance:2, healing:3, culture:2, nature:3, urban:2, spiritual:1, social:2 }
  },
  "King of Pentacles": {
    upright:  { adventure:2, romance:2, healing:2, culture:4, nature:3, urban:5, spiritual:1, social:4 },
    reversed: { adventure:1, romance:1, healing:2, culture:3, nature:2, urban:3, spiritual:1, social:3 }
  }
};

// ============================================================
// 二、30个目的地数据库
// ============================================================
window.DESTINATION_DB = [

  // ---------- 自然类 (10) ----------
  {
    name: "张家界",
    desc: "在三千奇峰之间，寻找属于你的那座仙境——命运的云梯，正等你踏上去。",
    tags: { adventure:5, romance:1, healing:3, culture:2, nature:5, urban:0, spiritual:3, social:2 },
    image: "https://source.unsplash.com/400x300/?zhangjiajie,mountain",
    url: "https://www.pitravel.cn/plan",
    province: "湖南"
  },
  {
    name: "九寨沟",
    desc: "五彩池水倒映着前世的约定，在这片童话世界里，命运的色彩为你绽放。",
    tags: { adventure:3, romance:3, healing:5, culture:1, nature:5, urban:0, spiritual:2, social:1 },
    image: "https://source.unsplash.com/400x300/?jiuzhaigou,valley",
    url: "https://www.pitravel.cn/plan",
    province: "四川"
  },
  {
    name: "稻城亚丁",
    desc: "最后的香格里拉，蓝色星球上最纯净的角落——命运在这里，等你深呼吸。",
    tags: { adventure:5, romance:3, healing:4, culture:1, nature:5, urban:0, spiritual:4, social:0 },
    image: "https://source.unsplash.com/400x300/?daochengyading,snowmountain",
    url: "https://www.pitravel.cn/plan",
    province: "四川"
  },
  {
    name: "西藏",
    desc: "在离天最近的地方，听见灵魂的回响——这一世朝圣，是命运写给你的邀请函。",
    tags: { adventure:5, romance:1, healing:4, culture:4, nature:5, urban:0, spiritual:5, social:1 },
    image: "https://source.unsplash.com/400x300/?tibet,potala",
    url: "https://www.pitravel.cn/plan",
    province: "西藏"
  },
  {
    name: "新疆",
    desc: "万里辽阔的土地上，每一步都是命运的指引——从沙漠到草原，遇见最辽阔的自己。",
    tags: { adventure:5, romance:2, healing:3, culture:3, nature:5, urban:1, spiritual:3, social:2 },
    image: "https://source.unsplash.com/400x300/?xinjiang,grassland",
    url: "https://www.pitravel.cn/plan",
    province: "新疆"
  },
  {
    name: "海南",
    desc: "椰风海韵中，命运安排了一场与蔚蓝的邂逅——让浪花带走所有疲惫。",
    tags: { adventure:3, romance:4, healing:5, culture:1, nature:4, urban:2, spiritual:1, social:3 },
    image: "https://source.unsplash.com/400x300/?hainan,beach",
    url: "https://www.pitravel.cn/plan",
    province: "海南"
  },
  {
    name: "桂林",
    desc: "山水甲天下的画卷里，你乘一叶竹筏漂过命运的转折点——前方是全新的风景。",
    tags: { adventure:3, romance:3, healing:4, culture:3, nature:5, urban:0, spiritual:2, social:2 },
    image: "https://source.unsplash.com/400x300/?guilin,riverrafting",
    url: "https://www.pitravel.cn/plan",
    province: "广西"
  },
  {
    name: "黄山",
    desc: "云海翻涌之间，你站在命运的山巅——看日出破晓，万物重新开始。",
    tags: { adventure:4, romance:2, healing:3, culture:3, nature:5, urban:0, spiritual:3, social:2 },
    image: "https://source.unsplash.com/400x300/?huangshan,sunrise",
    url: "https://www.pitravel.cn/plan",
    province: "安徽"
  },
  {
    name: "武夷山",
    desc: "茶香弥漫的丹霞地貌间，命运泡在一壶大红袍里——慢慢品，答案自在其中。",
    tags: { adventure:3, romance:2, healing:5, culture:4, nature:5, urban:0, spiritual:3, social:1 },
    image: "https://source.unsplash.com/400x300/?wuyishan,tea",
    url: "https://www.pitravel.cn/plan",
    province: "福建"
  },
  {
    name: "敦煌",
    desc: "千年壁画低语着古老的预言——在沙漠深处，命运与文明交汇于此。",
    tags: { adventure:4, romance:2, healing:2, culture:5, nature:3, urban:0, spiritual:5, social:1 },
    image: "https://source.unsplash.com/400x300/?dunhuang,desert",
    url: "https://www.pitravel.cn/plan",
    province: "甘肃"
  },

  // ---------- 文化类 (8) ----------
  {
    name: "西安",
    desc: "在这片古老的土地上，遇见命中注定的人——城墙之下，命运穿越千年与你对望。",
    tags: { adventure:2, romance:3, healing:2, culture:5, nature:2, urban:3, spiritual:3, social:4 },
    image: "https://source.unsplash.com/400x300/?xian,terracotta",
    url: "https://www.pitravel.cn/plan",
    province: "陕西"
  },
  {
    name: "北京",
    desc: "紫禁城的红墙里藏着王朝的命运，而你——正站在历史与未来的交汇点上。",
    tags: { adventure:3, romance:2, healing:1, culture:5, nature:2, urban:5, spiritual:2, social:5 },
    image: "https://source.unsplash.com/400x300/?beijing,forbiddencity",
    url: "https://www.pitravel.cn/plan",
    province: "北京"
  },
  {
    name: "成都",
    desc: "在烟火人间中慢下来，命运说：不急，好运气藏在一碗盖碗茶里。",
    tags: { adventure:2, romance:3, healing:4, culture:4, nature:3, urban:4, spiritual:1, social:5 },
    image: "https://source.unsplash.com/400x300/?chengdu,panda",
    url: "https://www.pitravel.cn/plan",
    province: "四川"
  },
  {
    name: "丽江",
    desc: "古城的石板路上，命运为你写下一个转角——那里有人等你，有歌为你而唱。",
    tags: { adventure:3, romance:5, healing:4, culture:4, nature:4, urban:1, spiritual:3, social:4 },
    image: "https://source.unsplash.com/400x300/?lijiang,oldtown",
    url: "https://www.pitravel.cn/plan",
    province: "云南"
  },
  {
    name: "大理",
    desc: "风花雪月之间，命运在苍山洱海边等你——放下行囊的那一刻，自由开始了。",
    tags: { adventure:3, romance:5, healing:5, culture:3, nature:5, urban:1, spiritual:3, social:3 },
    image: "https://source.unsplash.com/400x300/?dali,erhai",
    url: "https://www.pitravel.cn/plan",
    province: "云南"
  },
  {
    name: "洛阳",
    desc: "牡丹花开的季节，命运在龙门石窟微笑——千年等待，只为与你相遇。",
    tags: { adventure:2, romance:3, healing:2, culture:5, nature:3, urban:2, spiritual:3, social:3 },
    image: "https://source.unsplash.com/400x300/?luoyang,peony",
    url: "https://www.pitravel.cn/plan",
    province: "河南"
  },
  {
    name: "开封",
    desc: "梦回大宋的繁华夜市里，命运藏在一笼灌汤包的温度中——生活的滋味，就此展开。",
    tags: { adventure:2, romance:2, healing:3, culture:5, nature:2, urban:2, spiritual:2, social:4 },
    image: "https://source.unsplash.com/400x300/?kaifeng,nightmarket",
    url: "https://www.pitravel.cn/plan",
    province: "河南"
  },
  {
    name: "扬州",
    desc: "烟花三月的瘦西湖畔，命运如柳丝轻拂——慢生活里藏着最深的智慧。",
    tags: { adventure:1, romance:4, healing:4, culture:5, nature:4, urban:2, spiritual:2, social:3 },
    image: "https://source.unsplash.com/400x300/?yangzhou,garden",
    url: "https://www.pitravel.cn/plan",
    province: "江苏"
  },

  // ---------- 都市类 (6) ----------
  {
    name: "上海",
    desc: "霓虹灯下，命运在外滩的夜风中低语——这座不夜城，正等你书写新的篇章。",
    tags: { adventure:3, romance:4, healing:1, culture:4, nature:1, urban:5, spiritual:1, social:5 },
    image: "https://source.unsplash.com/400x300/?shanghai,skyline",
    url: "https://www.pitravel.cn/plan",
    province: "上海"
  },
  {
    name: "广州",
    desc: "在岭南的烟火气里，命运熬成一锅老火靓汤——温暖从胃到心，好运自然来。",
    tags: { adventure:2, romance:2, healing:3, culture:4, nature:2, urban:5, spiritual:1, social:5 },
    image: "https://source.unsplash.com/400x300/?guangzhou,canton",
    url: "https://www.pitravel.cn/plan",
    province: "广东"
  },
  {
    name: "深圳",
    desc: "在这座年轻的城市里，命运说：放手去拼——每一个明天，都比今天更耀眼。",
    tags: { adventure:4, romance:2, healing:1, culture:2, nature:2, urban:5, spiritual:1, social:5 },
    image: "https://source.unsplash.com/400x300/?shenzhen,city",
    url: "https://www.pitravel.cn/plan",
    province: "广东"
  },
  {
    name: "杭州",
    desc: "西湖的水面倒映着命运的轮廓——在诗意与代码之间，这座城市给你两种答案。",
    tags: { adventure:2, romance:4, healing:4, culture:4, nature:4, urban:4, spiritual:2, social:4 },
    image: "https://source.unsplash.com/400x300/?hangzhou,westlake",
    url: "https://www.pitravel.cn/plan",
    province: "浙江"
  },
  {
    name: "重庆",
    desc: "8D魔幻城市的每一条路都是命运的隐喻——转个弯，就是柳暗花明。",
    tags: { adventure:5, romance:3, healing:2, culture:3, nature:3, urban:5, spiritual:1, social:5 },
    image: "https://source.unsplash.com/400x300/?chongqing,nightview",
    url: "https://www.pitravel.cn/plan",
    province: "重庆"
  },
  {
    name: "厦门",
    desc: "鼓浪屿的琴声中，命运在凤凰花下微笑——这座海上花园，是你心灵的避风港。",
    tags: { adventure:2, romance:4, healing:4, culture:3, nature:3, urban:3, spiritual:2, social:3 },
    image: "https://source.unsplash.com/400x300/?xiamen,gulangyu",
    url: "https://www.pitravel.cn/plan",
    province: "福建"
  },

  // ---------- 浪漫类 (6) ----------
  {
    name: "三亚",
    desc: "在天涯海角，命运牵起你的手——这片碧海蓝天，是你们爱情的见证。",
    tags: { adventure:3, romance:5, healing:5, culture:1, nature:5, urban:2, spiritual:1, social:3 },
    image: "https://source.unsplash.com/400x300/?sanya,tropicalbeach",
    url: "https://www.pitravel.cn/plan",
    province: "海南"
  },
  {
    name: "鼓浪屿",
    desc: "钢琴声飘过万国建筑，命运在小巷深处等你——每一步，都是浪漫的注脚。",
    tags: { adventure:2, romance:5, healing:4, culture:4, nature:3, urban:1, spiritual:2, social:3 },
    image: "https://source.unsplash.com/400x300/?gulangyu,island",
    url: "https://www.pitravel.cn/plan",
    province: "福建"
  },
  {
    name: "青岛",
    desc: "红瓦绿树间，海风送来命运的消息——在啤酒与海之间，遇见最美的意外。",
    tags: { adventure:3, romance:4, healing:3, culture:3, nature:4, urban:3, spiritual:1, social:4 },
    image: "https://source.unsplash.com/400x300/?qingdao,coast",
    url: "https://www.pitravel.cn/plan",
    province: "山东"
  },
  {
    name: "周庄",
    desc: "小桥流水人家，命运在一叶乌篷船里轻轻摇晃——江南水乡，藏着最温柔的时光。",
    tags: { adventure:1, romance:5, healing:4, culture:5, nature:4, urban:0, spiritual:2, social:2 },
    image: "https://source.unsplash.com/400x300/?zhouzhuang,watertown",
    url: "https://www.pitravel.cn/plan",
    province: "江苏"
  },
  {
    name: "乌镇",
    desc: "枕水而眠的夜晚，命运在灯影中闪烁——这座梦中的水乡，是你灵魂的归处。",
    tags: { adventure:1, romance:5, healing:5, culture:5, nature:4, urban:0, spiritual:3, social:2 },
    image: "https://source.unsplash.com/400x300/?wuzhen,nightwater",
    url: "https://www.pitravel.cn/plan",
    province: "浙江"
  },
  {
    name: "凤凰古城",
    desc: "沱江边的吊脚楼下，命运写下你的名字——这座边城，等你来续写未完的故事。",
    tags: { adventure:3, romance:5, healing:4, culture:4, nature:4, urban:0, spiritual:3, social:3 },
    image: "https://source.unsplash.com/400x300/?fenghuang,ancienttown",
    url: "https://www.pitravel.cn/plan",
    province: "湖南"
  }
];

// ============================================================
// 三、打分引擎
// ============================================================

/**
 * 为目的地打分并排序
 * @param {Array} cards - [{nameEn: "The Fool", reversed: false}, ...] 3张牌
 * @param {string} theme - 主题：'邂逅爱情' | '旺我事业' | '今日去哪'
 * @returns {Array} DESTINATION_DB 按总分降序排列，每项增加 _score 字段
 */
window.scoreDestinations = function(cards, theme) {
  var positionWeights = [1.0, 1.2, 1.5];

  // 主题加权配置
  var themeMultipliers = {};
  if (theme === '邂逅爱情') {
    themeMultipliers = { romance: 2.0 };
  } else if (theme === '旺我事业') {
    themeMultipliers = { urban: 1.5, culture: 1.5 };
  } else {
    // 今日去哪 / 默认 → 均等（所有维度乘数 1.0）
    themeMultipliers = {};
  }

  var results = window.DESTINATION_DB.map(function(dest) {
    var totalScore = 0;

    cards.forEach(function(card, posIdx) {
      var cardData = window.CARD_TAGS[card.nameEn];
      if (!cardData) return;

      var orientation = card.reversed ? 'reversed' : 'upright';
      var cardScores = cardData[orientation];
      if (!cardScores) return;

      var weight = positionWeights[posIdx] || 1.0;

      // 对每个维度计算：牌分 × 位置权重 × 主题乘数
      var dims = ['adventure', 'romance', 'healing', 'culture', 'nature', 'urban', 'spiritual', 'social'];
      dims.forEach(function(dim) {
        var cardVal = cardScores[dim] || 0;
        var destVal = dest.tags[dim] || 0;
        var multiplier = themeMultipliers[dim] || 1.0;
        totalScore += cardVal * destVal * weight * multiplier;
      });
    });

    return {
      name: dest.name,
      desc: dest.desc,
      tags: dest.tags,
      image: dest.image,
      url: dest.url,
      province: dest.province,
      _score: Math.round(totalScore * 100) / 100
    };
  });

  // 按总分降序排列
  results.sort(function(a, b) {
    return b._score - a._score;
  });

  return results;
};

// end of tarot-tag-engine.js

// ============================================================
// 四、目的地补充数据（中文标签 + 适合人群 + 推荐理由）
// ============================================================
window.DESTINATION_EXTRA = {
  "稻城亚丁":   { labels:["净土","灵性","极致自然"], crowd:"需要心灵重启的你",    reason:"三张牌都在指向内心的召唤，最高的山，最纯的水，正是答案所在" },
  "九寨沟":     { labels:["童话","治愈","色彩"], crowd:"渴望被治愈的你",         reason:"你的牌里藏着对美的渴望，九寨的水色会替你说出那些说不出口的情绪" },
  "张家界":     { labels:["奇险","探索","仙境"], crowd:"想要突破边界的你",        reason:"牌里的能量在呼唤一场垂直的冒险，站在云端，世界会重新排列" },
  "西藏":       { labels:["朝圣","灵性","辽阔"], crowd:"寻找人生意义的你",        reason:"三张牌指向了一次灵魂的旅行，去离天空最近的地方，问一问自己真正要什么" },
  "新疆":       { labels:["广袤","自由","史诗"], crowd:"渴望自由和空旷的你",      reason:"你抽到的牌在呼唤宽阔——草原、戈壁、星空，给你一场属于自己的史诗" },
  "海南":       { labels:["海岛","度假","慵懒"], crowd:"需要彻底放松的你",        reason:"牌里的疲惫需要被海风吹散，什么都不做，也是一种勇气" },
  "桂林":       { labels:["山水","诗意","经典"], crowd:"喜欢慢下来欣赏美的你",    reason:"你的牌在说，别急，像这里的山水一样，慢慢流淌才是最好的节奏" },
  "黄山":       { labels:["云海","奇松","壮阔"], crowd:"需要一次震撼体验的你",    reason:"牌里的力量需要一个足够大的舞台来释放，黄山的云海正好" },
  "武夷山":     { labels:["茶香","幽静","人文"], crowd:"需要沉淀思绪的你",        reason:"三张牌都在说，慢下来，武夷的茶烟和竹林，是最好的思考背景音" },
  "敦煌":       { labels:["大漠","历史","神秘"], crowd:"对历史和神秘感兴趣的你",  reason:"牌里有穿越时间的气息，去看那些千年前的色彩，你的问题会有新答案" },
  "西安":       { labels:["古都","历史","厚重"], crowd:"想感受文明重量的你",      reason:"你的牌在追溯根源，去那个十三朝古都，在历史的厚度里找到当下的坐标" },
  "北京":       { labels:["首都","文化","宏大"], crowd:"有大格局追求的你",        reason:"牌里有开阔的视野和雄心，这座城市的气场会给你最好的能量补给" },
  "成都":       { labels:["烟火","安逸","美食"], crowd:"想慢下来享受生活的你",    reason:"你的牌在说，享乐不是罪，去成都喝一杯盖碗茶，让生活重新变得可口" },
  "丽江":       { labels:["古镇","浪漫","文艺"], crowd:"渴望邂逅故事的你",        reason:"窄巷灯火，是你牌里那份期待的具体形状，在这里，缘分走得很慢" },
  "大理":       { labels:["洱海","自由","文艺"], crowd:"想做自己的你",            reason:"牌里有一种停下来的渴望，大理的风和洱海的光，允许你什么都不成为" },
  "洛阳":       { labels:["牡丹","古都","历史"], crowd:"喜欢被历史滋养的你",      reason:"你的牌里有根的气息，去那片开过无数次花的土地，重新感受生长的力量" },
  "开封":       { labels:["宋韵","市井","热闹"], crowd:"想体验烟火气的你",        reason:"牌里有对人间热闹的向往，开封的夜市和古城会让你重新爱上平凡的美好" },
  "扬州":       { labels:["精致","园林","慢生活"], crowd:"追求精致慢生活的你",    reason:"你的牌在说，把生活过得细一点、美一点，扬州是这种美学最好的教材" },
  "上海":       { labels:["国际","时尚","机遇"], crowd:"有野心和行动力的你",      reason:"牌里的能量需要一个够大的舞台，这座城市从不辜负认真的人" },
  "广州":       { labels:["烟火","商业","包容"], crowd:"务实又热爱生活的你",      reason:"你的牌很接地气，去广州喝一顿早茶，把计划从茶桌上谈成现实" },
  "深圳":       { labels:["创新","年轻","活力"], crowd:"想突破现状的你",          reason:"牌里有变化的冲动，这座用40年走完别人400年的城市，和你的节奏一样快" },
  "杭州":       { labels:["诗意","互联网","山水"], crowd:"兼顾理想与现实的你",    reason:"你的牌横跨两个世界，杭州恰好也是——西湖边和创业园，都是这里的真实" },
  "重庆":       { labels:["立体","火锅","江湖"], crowd:"喜欢刺激和惊喜的你",      reason:"牌里有转折和意外，重庆的每条路都不知道通向哪里，但都值得走走" },
  "厦门":       { labels:["海风","文艺","小资"], crowd:"想要治愈系浪漫的你",      reason:"你的牌里有轻盈和温柔，厦门的海风会把你心里的结一一吹开" },
  "三亚":       { labels:["热带","奢享","蓝海"], crowd:"需要彻底放空的你",        reason:"牌里积累的疲惫需要一片够蓝的海，去三亚，什么都不想，只看浪" },
  "鼓浪屿":     { labels:["琴声","浪漫","花园"], crowd:"向往慢节奏爱情的你",      reason:"牌里的爱情需要一个够美的容器，万国建筑和海风，刚好把它装下" },
  "青岛":       { labels:["啤酒","海边","爽朗"], crowd:"喜欢爽朗自在的你",        reason:"你的牌里有豪迈和随性，去青岛，对着大海喝一杯，把烦恼都交给海浪" },
  "周庄":       { labels:["水乡","古镇","诗意"], crowd:"喜欢在时光里发呆的你",    reason:"牌里有对安静的渴望，周庄的乌篷船会带你慢慢划出所有答案" },
  "乌镇":       { labels:["戏剧","水乡","文化"], crowd:"有文艺气质的你",          reason:"你的牌里有故事感，乌镇的灯影和水声，正好给你搭一个独属于你的舞台" },
  "凤凰古城":   { labels:["边城","浪漫","原始"], crowd:"渴望原生浪漫的你",        reason:"沈从文写的那种爱情，在牌里有它的影子，去沱江边，故事会自己发生" }
};

// ============================================================
// 五、「为什么推荐这里」话术生成
// ============================================================
window.generateDestinationCopy = function(destName, cards, theme) {
  var extra = (window.DESTINATION_EXTRA || {})[destName];
  if (!extra) return '';

  // 提取三张牌的核心关键词
  var CARD_KEYWORDS = {
    "The Fool":"新开始", "The Magician":"创造力", "The High Priestess":"内在智慧",
    "The Empress":"丰盛", "The Emperor":"掌控", "The Hierophant":"传承",
    "The Lovers":"选择与爱", "The Chariot":"意志力", "Strength":"内在力量",
    "The Hermit":"独处", "Wheel of Fortune":"转机", "Justice":"平衡",
    "The Hanged Man":"暂停与洞见", "Death":"蜕变", "Temperance":"调和",
    "The Devil":"欲望", "The Tower":"突破", "The Star":"希望",
    "The Moon":"直觉", "The Sun":"活力", "Judgement":"觉醒", "The World":"圆满",
    "Ace of Swords":"清晰", "Ace of Wands":"热情", "Ace of Cups":"情感",
    "Ace of Pentacles":"落地", "Six of Cups":"温柔回忆", "Ten of Cups":"圆满情感",
    "Two of Cups":"心心相印", "Three of Cups":"欢聚", "Four of Wands":"庆祝",
    "King of Pentacles":"稳健", "Queen of Cups":"感性", "Knight of Wands":"冒进"
  };

  var kw1 = CARD_KEYWORDS[cards[0] && cards[0].nameEn] || '当下的你';
  var kw3 = CARD_KEYWORDS[cards[2] && cards[2].nameEn] || '旅途';

  // 用模板 + 牌关键词 + 目的地理由拼成话术
  var copy = extra.reason + '。' +
    '你此刻带着「' + kw1 + '」的能量出发，' +
    '「' + kw3 + '」在终点等着你——' +
    destName + '，是这次命运给你的答案。';

  return copy;
};

// ============================================================
// 六、升级打分引擎（加去重/分散机制）
// ============================================================
window.scoreDestinations = (function() {
  var _lastTop3 = []; // 记录上一次推荐结果，用于去重

  return function(cards, theme) {
    var positionWeights = [1.0, 1.2, 1.5];
    var themeMultipliers = {};
    if (theme === '邂逅爱情') {
      themeMultipliers = { romance: 2.0 };
    } else if (theme === '旺我事业') {
      themeMultipliers = { urban: 1.5, culture: 1.5 };
    }

    var dims = ['adventure','romance','healing','culture','nature','urban','spiritual','social'];

    var results = (window.DESTINATION_DB || []).map(function(dest) {
      var totalScore = 0;
      cards.forEach(function(card, posIdx) {
        var cardData = window.CARD_TAGS && window.CARD_TAGS[card.nameEn];
        if (!cardData) return;
        var scores = cardData[card.reversed ? 'reversed' : 'upright'];
        if (!scores) return;
        var w = positionWeights[posIdx] || 1.0;
        dims.forEach(function(dim) {
          var m = themeMultipliers[dim] || 1.0;
          totalScore += (scores[dim]||0) * (dest.tags[dim]||0) * w * m;
        });
      });

      // 生成「为什么推荐这里」话术
      var whyCopy = window.generateDestinationCopy
        ? window.generateDestinationCopy(dest.name, cards, theme)
        : dest.desc;

      return Object.assign({}, dest, {
        _score: Math.round(totalScore * 100) / 100,
        _whyCopy: whyCopy
      });
    });

    // 按分数排序
    results.sort(function(a, b) { return b._score - a._score; });

    // 去重/分散机制：Top10里随机抽取，避免相同牌组永远推同一结果
    var top10 = results.slice(0, 10);
    var selected = [];

    // 第1名：Top3里随机选（不在上次结果里优先）
    var pool1 = top10.slice(0, 3).filter(function(d) {
      return _lastTop3.indexOf(d.name) === -1;
    });
    if (!pool1.length) pool1 = top10.slice(0, 3);
    var pick1 = pool1[Math.floor(Math.random() * pool1.length)];
    selected.push(pick1);

    // 第2名：Top4-7里随机选一个和第1名不同省份的
    var pool2 = top10.slice(3, 7).filter(function(d) {
      return d.name !== pick1.name && d.province !== pick1.province;
    });
    if (!pool2.length) pool2 = top10.slice(3, 7);
    var pick2 = pool2[Math.floor(Math.random() * pool2.length)] || top10[4];
    selected.push(pick2);

    // 第3名：剩余Top8-10里随机选
    var pool3 = top10.slice(6, 10).filter(function(d) {
      return d.name !== pick1.name && d.name !== (pick2&&pick2.name);
    });
    if (!pool3.length) pool3 = top10.slice(7, 10);
    var pick3 = pool3[Math.floor(Math.random() * pool3.length)] || top10[8];
    selected.push(pick3);

    // 记录本次结果用于下次去重
    _lastTop3 = selected.map(function(d) { return d && d.name; });

    return selected.filter(Boolean);
  };
})();
