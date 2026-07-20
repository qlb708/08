/* ========================================
   卡牌数据 & 3D 环形旋转木马管理 v7
   完整 78 张韦特塔罗 (Rider-Waite Tarot)
   22 大牌 + 14 宝剑 + 14 权杖 + 14 圣杯 + 14 星币
   ======================================== */

const CARDS = [
  // ============================================================
  // === 大牌 (Major Arcana) 0–21 ===
  // ============================================================
  { id: 'M00', name: '愚者',     nameEn: 'The Fool',            symbol: '🃏', color: '#fdd835', meaning: '新开始、冒险、自由、无限可能',       element: 'wind',  spell: '风之旅人', spellSub: 'Wind of Wanderer',   image: 'cards/major/major00.jpg' },
  { id: 'M01', name: '魔术师',   nameEn: 'The Magician',        symbol: '🪄', color: '#ff7043', meaning: '创造力、意志力、技巧、资源整合',     element: 'fire',  spell: '焰之创造', spellSub: 'Fire of Creation',    image: 'cards/major/major01.jpg' },
  { id: 'M02', name: '女祭司',   nameEn: 'The High Priestess',  symbol: '🌙', color: '#7986cb', meaning: '直觉、潜意识、神秘、内在智慧',       element: 'water', spell: '水之秘境', spellSub: 'Water of Mystery',    image: 'cards/major/major02.jpg' },
  { id: 'M03', name: '女皇',     nameEn: 'The Empress',         symbol: '👑', color: '#4fc3f7', meaning: '丰饶、母性、感官享受、自然',         element: 'water', spell: '水之滋养', spellSub: 'Water of Nurture',    image: 'cards/major/major03.jpg' },
  { id: 'M04', name: '皇帝',     nameEn: 'The Emperor',         symbol: '🏛️', color: '#ff5722', meaning: '权威、结构、秩序、领导力',           element: 'fire',  spell: '焰之秩序', spellSub: 'Fire of Order',       image: 'cards/major/major04.jpg' },
  { id: 'M05', name: '教皇',     nameEn: 'The Hierophant',      symbol: '📿', color: '#8d6e63', meaning: '传统、信仰、教育、精神指导',         element: 'light', spell: '光之教化', spellSub: 'Light of Guidance',   image: 'cards/major/major05.jpg' },
  { id: 'M06', name: '恋人',     nameEn: 'The Lovers',          symbol: '💞', color: '#ff6baf', meaning: '爱情、和谐、选择、结合',             element: 'wind',  spell: '风之缘结', spellSub: 'Wind of Bond',        image: 'cards/major/major06.jpg' },
  { id: 'M07', name: '战车',     nameEn: 'The Chariot',         symbol: '🏇', color: '#42a5f5', meaning: '胜利、意志、征服、控制力',           element: 'water', spell: '水之战驱', spellSub: 'Water of Triumph',    image: 'cards/major/major07.jpg' },
  { id: 'M08', name: '力量',     nameEn: 'Strength',            symbol: '🦁', color: '#ffa726', meaning: '勇气、内在力量、耐心、柔中带刚',     element: 'fire',  spell: '焰之心力', spellSub: 'Fire of Courage',     image: 'cards/major/major08.jpg' },
  { id: 'M09', name: '隐士',     nameEn: 'The Hermit',          symbol: '🏔️', color: '#78909c', meaning: '内省、独处、智慧、寻求真理',         element: 'light', spell: '光之独行', spellSub: 'Light of Solitude',   image: 'cards/major/major09.jpg' },
  { id: 'M10', name: '命运之轮', nameEn: 'Wheel of Fortune',    symbol: '🎡', color: '#fdd835', meaning: '周期、运气、转折点、命运',           element: 'light', spell: '光之轮转', spellSub: 'Wheel of Light',      image: 'cards/major/major10.jpg' },
  { id: 'M11', name: '正义',     nameEn: 'Justice',             symbol: '⚖️', color: '#66bb6a', meaning: '公正、真相、因果、决断',             element: 'wind',  spell: '风之裁决', spellSub: 'Wind of Justice',     image: 'cards/major/major11.jpg' },
  { id: 'M12', name: '倒吊人',   nameEn: 'The Hanged Man',      symbol: '🔄', color: '#29b6f6', meaning: '牺牲、新视角、等待、放下',           element: 'water', spell: '水之悬停', spellSub: 'Water of Surrender',  image: 'cards/major/major12.jpg' },
  { id: 'M13', name: '死神',     nameEn: 'Death',               symbol: '🌑', color: '#455a64', meaning: '结束、转变、重生、放手旧事物',       element: 'shadow',spell: '影之蜕变', spellSub: 'Shadow of Rebirth',   image: 'cards/major/major13.jpg' },
  { id: 'M14', name: '节制',     nameEn: 'Temperance',          symbol: '🕊️', color: '#29b6f6', meaning: '平衡、中庸、耐心、疗愈',             element: 'water', spell: '水之调和', spellSub: 'Water of Balance',    image: 'cards/major/major14.jpg' },
  { id: 'M15', name: '恶魔',     nameEn: 'The Devil',           symbol: '⛓️', color: '#b71c1c', meaning: '束缚、诱惑、执念、物质沉迷',         element: 'shadow',spell: '影之锁链', spellSub: 'Shadow of Chains',    image: 'cards/major/major15.jpg' },
  { id: 'M16', name: '塔',       nameEn: 'The Tower',           symbol: '⚡', color: '#d32f2f', meaning: '突变、崩塌、觉醒、破旧立新',         element: 'fire',  spell: '焰之破塔', spellSub: 'Fire of Collapse',    image: 'cards/major/major16.jpg' },
  { id: 'M17', name: '星星',     nameEn: 'The Star',            symbol: '⭐', color: '#00e5ff', meaning: '希望、灵感、平静、治愈',             element: 'light', spell: '星之希望', spellSub: 'Star of Hope',        image: 'cards/major/major17.jpg' },
  { id: 'M18', name: '月亮',     nameEn: 'The Moon',            symbol: '🌕', color: '#b39ddb', meaning: '幻象、不安、潜意识、直觉考验',       element: 'water', spell: '水之幻月', spellSub: 'Water of Illusion',   image: 'cards/major/major18.jpg' },
  { id: 'M19', name: '太阳',     nameEn: 'The Sun',             symbol: '☀️', color: '#fdd835', meaning: '成功、快乐、活力、清晰',             element: 'fire',  spell: '焰之太阳', spellSub: 'Fire of Sun',         image: 'cards/major/major19.jpg' },
  { id: 'M20', name: '审判',     nameEn: 'Judgement',           symbol: '📯', color: '#ab47bc', meaning: '觉醒、审视、重生、使命召唤',         element: 'fire',  spell: '焰之审判', spellSub: 'Fire of Judgement',   image: 'cards/major/major20.jpg' },
  { id: 'M21', name: '世界',     nameEn: 'The World',           symbol: '🌍', color: '#4fc3f7', meaning: '完成、整合、圆满、成就',             element: 'light', spell: '光之世界', spellSub: 'World of Light',      image: 'cards/major/major21.jpg' },

  // ============================================================
  // === 宝剑 (Swords) — 风元素 ===
  // ============================================================
  { id: 'Sw01', name: '宝剑王牌', nameEn: 'Ace of Swords',       symbol: '⚔️', color: '#90caf9', meaning: '真相、洞察、突破、清晰思维',     element: 'wind',  spell: '剑之真理', spellSub: 'Sword of Truth',      image: 'cards/swords/sword01.jpg' },
  { id: 'Sw02', name: '宝剑二',   nameEn: 'Two of Swords',       symbol: '⚖️', color: '#78909c', meaning: '抉择、僵局、逃避、蒙蔽',         element: 'wind',  spell: '剑之两难', spellSub: 'Sword of Dilemma',    image: 'cards/swords/sword02.jpg' },
  { id: 'Sw03', name: '宝剑三',   nameEn: 'Three of Swords',     symbol: '💔', color: '#e57373', meaning: '心碎、悲伤、失落、痛苦的领悟',     element: 'wind',  spell: '剑之心伤', spellSub: 'Sword of Heartbreak', image: 'cards/swords/sword03.jpg' },
  { id: 'Sw04', name: '宝剑四',   nameEn: 'Four of Swords',      symbol: '🛏️', color: '#b0bec5', meaning: '休息、恢复、冥想、暂停充电',       element: 'wind',  spell: '剑之静养', spellSub: 'Sword of Rest',       image: 'cards/swords/sword04.jpg' },
  { id: 'Sw05', name: '宝剑五',   nameEn: 'Five of Swords',      symbol: '😤', color: '#546e7a', meaning: '冲突、输赢、自私、空虚的胜利',     element: 'wind',  spell: '剑之争锋', spellSub: 'Sword of Conflict',   image: 'cards/swords/sword05.jpg' },
  { id: 'Sw06', name: '宝剑六',   nameEn: 'Six of Swords',       symbol: '🚣', color: '#4dd0e1', meaning: '过渡、离开、前进、心灵疗愈',       element: 'wind',  spell: '剑之远航', spellSub: 'Sword of Passage',    image: 'cards/swords/sword06.jpg' },
  { id: 'Sw07', name: '宝剑七',   nameEn: 'Seven of Swords',     symbol: '🦊', color: '#a1887f', meaning: '策略、隐秘、独行、另辟蹊径',       element: 'wind',  spell: '剑之暗行', spellSub: 'Sword of Stealth',    image: 'cards/swords/sword07.jpg' },
  { id: 'Sw08', name: '宝剑八',   nameEn: 'Eight of Swords',     symbol: '🪢', color: '#607d8b', meaning: '困境、自我限制、无力感、思维牢笼', element: 'wind',  spell: '剑之囚笼', spellSub: 'Sword of Restriction',image: 'cards/swords/sword08.jpg' },
  { id: 'Sw09', name: '宝剑九',   nameEn: 'Nine of Swords',      symbol: '😰', color: '#37474f', meaning: '焦虑、噩梦、过度担忧、心理压力',   element: 'wind',  spell: '剑之忧思', spellSub: 'Sword of Anxiety',    image: 'cards/swords/sword09.jpg' },
  { id: 'Sw10', name: '宝剑十',   nameEn: 'Ten of Swords',       symbol: '🔚', color: '#263238', meaning: '终结、触底、放手、黎明前的黑暗',   element: 'wind',  spell: '剑之终局', spellSub: 'Sword of Ending',     image: 'cards/swords/sword10.jpg' },
  { id: 'SwPa', name: '宝剑侍从', nameEn: 'Page of Swords',      symbol: '🧐', color: '#80cbc4', meaning: '好奇、观察、新想法、信息收集',     element: 'wind',  spell: '剑之使者', spellSub: 'Page of Swords',      image: 'cards/swords/swordPage.jpg' },
  { id: 'SwKn', name: '宝剑骑士', nameEn: 'Knight of Swords',    symbol: '⚡', color: '#4db6ac', meaning: '快速行动、直言不讳、冲劲十足',     element: 'wind',  spell: '剑之疾风', spellSub: 'Knight of Swords',    image: 'cards/swords/swordKnight.jpg' },
  { id: 'SwQu', name: '宝剑王后', nameEn: 'Queen of Swords',     symbol: '👸', color: '#26a69a', meaning: '独立、敏锐、清醒、边界分明',       element: 'wind',  spell: '剑之女王', spellSub: 'Queen of Swords',     image: 'cards/swords/swordQueen.jpg' },
  { id: 'SwKi', name: '宝剑国王', nameEn: 'King of Swords',      symbol: '🗡️', color: '#00897b', meaning: '权威、逻辑、公正、理性决策',       element: 'wind',  spell: '剑之王者', spellSub: 'King of Swords',      image: 'cards/swords/swordKing.jpg' },

  // ============================================================
  // === 权杖 (Wands) — 火元素 ===
  // ============================================================
  { id: 'Wa01', name: '权杖王牌', nameEn: 'Ace of Wands',        symbol: '🔥', color: '#ff7043', meaning: '创造力、灵感、新机遇、激情',       element: 'fire',  spell: '焰之序曲', spellSub: 'Fire of Prelude',     image: 'cards/wands/wand01.jpg' },
  { id: 'Wa02', name: '权杖二',   nameEn: 'Two of Wands',        symbol: '🗺️', color: '#ff8a65', meaning: '规划、决策、远见、跨出舒适区',     element: 'fire',  spell: '焰之抉择', spellSub: 'Fire of Planning',    image: 'cards/wands/wand02.jpg' },
  { id: 'Wa03', name: '权杖三',   nameEn: 'Three of Wands',      symbol: '🔱', color: '#ff8a65', meaning: '远见、扩张、探索、展望未来',       element: 'fire',  spell: '焰之远望', spellSub: 'Fire of Vision',      image: 'cards/wands/wand03.jpg' },
  { id: 'Wa04', name: '权杖四',   nameEn: 'Four of Wands',       symbol: '🏠', color: '#ffab91', meaning: '庆祝、和谐、家庭、稳定',           element: 'fire',  spell: '焰之庆典', spellSub: 'Fire of Festival',    image: 'cards/wands/wand04.jpg' },
  { id: 'Wa05', name: '权杖五',   nameEn: 'Five of Wands',       symbol: '⚔️', color: '#ff7043', meaning: '竞争、冲突、多方角力、磨合',       element: 'fire',  spell: '焰之竞逐', spellSub: 'Fire of Competition', image: 'cards/wands/wand05.jpg' },
  { id: 'Wa06', name: '权杖六',   nameEn: 'Six of Wands',        symbol: '🏆', color: '#ff7043', meaning: '胜利、荣誉、认可、自信',           element: 'fire',  spell: '焰之凯旋', spellSub: 'Fire of Victory',     image: 'cards/wands/wand06.jpg' },
  { id: 'Wa07', name: '权杖七',   nameEn: 'Seven of Wands',      symbol: '🛡️', color: '#e64a19', meaning: '坚守、防御、挑战、不退让',         element: 'fire',  spell: '焰之坚守', spellSub: 'Fire of Defense',     image: 'cards/wands/wand07.jpg' },
  { id: 'Wa08', name: '权杖八',   nameEn: 'Eight of Wands',      symbol: '🚀', color: '#ff5722', meaning: '迅速、行动力、推进、好消息',       element: 'fire',  spell: '焰之飞矢', spellSub: 'Fire of Arrows',      image: 'cards/wands/wand08.jpg' },
  { id: 'Wa09', name: '权杖九',   nameEn: 'Nine of Wands',       symbol: '💪', color: '#bf360c', meaning: '坚韧、警觉、最后防线、不放弃',     element: 'fire',  spell: '焰之坚韧', spellSub: 'Fire of Resilience',  image: 'cards/wands/wand09.jpg' },
  { id: 'Wa10', name: '权杖十',   nameEn: 'Ten of Wands',        symbol: '🏋️', color: '#8d6e63', meaning: '重负、压力、责任过重、需要放权',   element: 'fire',  spell: '焰之重担', spellSub: 'Fire of Burden',      image: 'cards/wands/wand10.jpg' },
  { id: 'WaPa', name: '权杖侍从', nameEn: 'Page of Wands',       symbol: '🌟', color: '#ffab40', meaning: '热情、探索、新消息、冒险精神',     element: 'fire',  spell: '焰之使者', spellSub: 'Page of Wands',       image: 'cards/wands/wandPage.jpg' },
  { id: 'WaKn', name: '权杖骑士', nameEn: 'Knight of Wands',     symbol: '🐎', color: '#ff6d00', meaning: '冲劲、大胆、冒险、追求激情',       element: 'fire',  spell: '焰之骑士', spellSub: 'Knight of Wands',     image: 'cards/wands/wandKnight.jpg' },
  { id: 'WaQu', name: '权杖王后', nameEn: 'Queen of Wands',      symbol: '🔥', color: '#ff9100', meaning: '自信、魅力、独立、温暖领导力',     element: 'fire',  spell: '焰之女王', spellSub: 'Queen of Wands',      image: 'cards/wands/wandQueen.jpg' },
  { id: 'WaKi', name: '权杖国王', nameEn: 'King of Wands',       symbol: '👑', color: '#e65100', meaning: '领袖、远见、企业家精神、掌控力',   element: 'fire',  spell: '焰之王者', spellSub: 'King of Wands',       image: 'cards/wands/wandKing.jpg' },

  // ============================================================
  // === 圣杯 (Cups) — 水元素 ===
  // ============================================================
  { id: 'Cu01', name: '圣杯王牌', nameEn: 'Ace of Cups',         symbol: '🏆', color: '#4fc3f7', meaning: '新感情、情感丰盈、直觉、爱的开始', element: 'water', spell: '水之初心', spellSub: 'Water of Origin',     image: 'cards/cups/cup01.jpg' },
  { id: 'Cu02', name: '圣杯二',   nameEn: 'Two of Cups',         symbol: '💕', color: '#f48fb1', meaning: '伙伴、结合、互相吸引、和谐',       element: 'water', spell: '水之共鸣', spellSub: 'Water of Harmony',    image: 'cards/cups/cup02.jpg' },
  { id: 'Cu03', name: '圣杯三',   nameEn: 'Three of Cups',       symbol: '🎉', color: '#ce93d8', meaning: '友谊、庆祝、合作、欢乐',           element: 'water', spell: '水之欢歌', spellSub: 'Water of Celebration',image: 'cards/cups/cup03.jpg' },
  { id: 'Cu04', name: '圣杯四',   nameEn: 'Four of Cups',        symbol: '😑', color: '#90a4ae', meaning: '倦怠、不满足、忽视机会、内省',     element: 'water', spell: '水之冷淡', spellSub: 'Water of Apathy',     image: 'cards/cups/cup04.jpg' },
  { id: 'Cu05', name: '圣杯五',   nameEn: 'Five of Cups',        symbol: '😢', color: '#546e7a', meaning: '失落、遗憾、悲伤、未看到的希望',   element: 'water', spell: '水之遗恨', spellSub: 'Water of Regret',     image: 'cards/cups/cup05.jpg' },
  { id: 'Cu06', name: '圣杯六',   nameEn: 'Six of Cups',         symbol: '🌸', color: '#b39ddb', meaning: '回忆、天真、旧时美好、重逢',       element: 'water', spell: '水之怀念', spellSub: 'Water of Memory',     image: 'cards/cups/cup06.jpg' },
  { id: 'Cu07', name: '圣杯七',   nameEn: 'Seven of Cups',       symbol: '🌈', color: '#9575cd', meaning: '幻想、选择过多、白日梦、诱惑',     element: 'water', spell: '水之幻梦', spellSub: 'Water of Fantasy',    image: 'cards/cups/cup07.jpg' },
  { id: 'Cu08', name: '圣杯八',   nameEn: 'Eight of Cups',       symbol: '🚶', color: '#5c6bc0', meaning: '离开、放弃、追寻更深意义',         element: 'water', spell: '水之远行', spellSub: 'Water of Departure',  image: 'cards/cups/cup08.jpg' },
  { id: 'Cu09', name: '圣杯九',   nameEn: 'Nine of Cups',        symbol: '🌟', color: '#ffd54f', meaning: '满足、愿望成真、幸福、享乐',       element: 'water', spell: '水之圆满', spellSub: 'Water of Fulfillment',image: 'cards/cups/cup09.jpg' },
  { id: 'Cu10', name: '圣杯十',   nameEn: 'Ten of Cups',         symbol: '🌈', color: '#81d4fa', meaning: '幸福美满、家庭和睦、情感圆满',     element: 'water', spell: '水之至福', spellSub: 'Water of Bliss',      image: 'cards/cups/cup10.jpg' },
  { id: 'CuPa', name: '圣杯侍从', nameEn: 'Page of Cups',        symbol: '🧚', color: '#80cbc4', meaning: '创意、直觉、新感情、惊喜',         element: 'water', spell: '水之使者', spellSub: 'Page of Water',       image: 'cards/cups/cupPage.jpg' },
  { id: 'CuKn', name: '圣杯骑士', nameEn: 'Knight of Cups',      symbol: '🤴', color: '#7986cb', meaning: '浪漫、追求、理想主义、感性',       element: 'water', spell: '水之骑士', spellSub: 'Knight of Water',     image: 'cards/cups/cupKnight.jpg' },
  { id: 'CuQu', name: '圣杯王后', nameEn: 'Queen of Cups',       symbol: '👸', color: '#4db6ac', meaning: '温柔、共情、直觉、情感疗愈',       element: 'water', spell: '水之女王', spellSub: 'Queen of Water',      image: 'cards/cups/cupQueen.jpg' },
  { id: 'CuKi', name: '圣杯国王', nameEn: 'King of Cups',        symbol: '🔱', color: '#26a69a', meaning: '情感成熟、慷慨、外交手腕、从容',   element: 'water', spell: '水之王者', spellSub: 'King of Water',       image: 'cards/cups/cupKing.jpg' },

  // ============================================================
  // === 星币 (Pentacles) — 光/地元素 ===
  // ============================================================
  { id: 'Pe01', name: '星币王牌', nameEn: 'Ace of Pentacles',    symbol: '💰', color: '#ffd700', meaning: '新财富、机遇、繁荣、物质基础',     element: 'light', spell: '金之萌芽', spellSub: 'Gold of Seed',        image: 'cards/pentacles/pentacle01.jpg' },
  { id: 'Pe02', name: '星币二',   nameEn: 'Two of Pentacles',    symbol: '🤹', color: '#ffb74d', meaning: '平衡、适应、灵活、多线程管理',     element: 'light', spell: '金之平衡', spellSub: 'Gold of Balance',     image: 'cards/pentacles/pentacle02.jpg' },
  { id: 'Pe03', name: '星币三',   nameEn: 'Three of Pentacles',  symbol: '🏗️', color: '#ffb74d', meaning: '团队合作、技能、规划、精益求精',   element: 'light', spell: '金之匠心', spellSub: 'Gold of Craft',       image: 'cards/pentacles/pentacle03.jpg' },
  { id: 'Pe04', name: '星币四',   nameEn: 'Four of Pentacles',   symbol: '🏦', color: '#a1887f', meaning: '守财、控制、安全感、吝啬',         element: 'light', spell: '金之守护', spellSub: 'Gold of Guarding',    image: 'cards/pentacles/pentacle04.jpg' },
  { id: 'Pe05', name: '星币五',   nameEn: 'Five of Pentacles',   symbol: '❄️', color: '#78909c', meaning: '困难、匮乏、孤立、被排斥感',       element: 'light', spell: '金之寒冬', spellSub: 'Gold of Hardship',    image: 'cards/pentacles/pentacle05.jpg' },
  { id: 'Pe06', name: '星币六',   nameEn: 'Six of Pentacles',    symbol: '🤝', color: '#a5d6a7', meaning: '慷慨、分享、平衡、互惠',           element: 'light', spell: '金之施予', spellSub: 'Gold of Giving',      image: 'cards/pentacles/pentacle06.jpg' },
  { id: 'Pe07', name: '星币七',   nameEn: 'Seven of Pentacles',  symbol: '🌱', color: '#81c784', meaning: '耐心、长期投资、等待收成、评估',   element: 'light', spell: '金之等待', spellSub: 'Gold of Patience',    image: 'cards/pentacles/pentacle07.jpg' },
  { id: 'Pe08', name: '星币八',   nameEn: 'Eight of Pentacles',  symbol: '🔨', color: '#bcaaa4', meaning: '勤奋、精进、学习、专注',           element: 'light', spell: '金之磨砺', spellSub: 'Gold of Practice',    image: 'cards/pentacles/pentacle08.jpg' },
  { id: 'Pe09', name: '星币九',   nameEn: 'Nine of Pentacles',   symbol: '🦚', color: '#c5e1a5', meaning: '成就、独立、富足、自给自足',       element: 'light', spell: '金之丰裕', spellSub: 'Gold of Abundance',   image: 'cards/pentacles/pentacle09.jpg' },
  { id: 'Pe10', name: '星币十',   nameEn: 'Ten of Pentacles',    symbol: '🏰', color: '#ffd700', meaning: '传承、财富、家族、长久稳定',       element: 'light', spell: '金之传承', spellSub: 'Gold of Legacy',      image: 'cards/pentacles/pentacle10.jpg' },
  { id: 'PePa', name: '星币侍从', nameEn: 'Page of Pentacles',   symbol: '📚', color: '#dce775', meaning: '学习、新技能、脚踏实地、好奇',     element: 'light', spell: '金之使者', spellSub: 'Page of Gold',        image: 'cards/pentacles/pentaclePage.jpg' },
  { id: 'PeKn', name: '星币骑士', nameEn: 'Knight of Pentacles',  symbol: '🐎', color: '#8d6e63', meaning: '稳健、可靠、耐心、务实',           element: 'light', spell: '金之骑士', spellSub: 'Knight of Gold',      image: 'cards/pentacles/pentacleKnight.jpg' },
  { id: 'PeQu', name: '星币王后', nameEn: 'Queen of Pentacles',  symbol: '👸', color: '#a5d6a7', meaning: '务实、慷慨、安全感、生活品质',     element: 'light', spell: '金之女王', spellSub: 'Queen of Gold',       image: 'cards/pentacles/pentacleQueen.jpg' },
  { id: 'PeKi', name: '星币国王', nameEn: 'King of Pentacles',   symbol: '🏛️', color: '#8d6e63', meaning: '财富、稳定、商业头脑、慷慨',       element: 'light', spell: '金之王者', spellSub: 'King of Gold',        image: 'cards/pentacles/pentacleKing.jpg' },
];

/* ========================================
   3D 环形旋转木马 (Carousel) v7
   - 10张物理牌 · 展示多种背面
   - 丝滑连续旋转（手势速度映射到角速度）
   ======================================== */

// 背面图片池
const _SVG_BACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 238' width='140' height='238'><defs><radialGradient id='bg' cx='50%25' cy='50%25' r='65%25'><stop offset='0%25' stop-color='%23f2f0e4'/><stop offset='100%25' stop-color='%23e8e4d4'/></radialGradient><filter id='glow'><feGaussianBlur stdDeviation='1.2' result='blur'/><feMerge><feMergeNode in='blur'/><feMergeNode in='SourceGraphic'/></feMerge></filter></defs><rect width='140' height='238' fill='url(%23bg)'/><rect x='7' y='7' width='126' height='224' rx='6' fill='none' stroke='%23c8a860' stroke-width='1.5' opacity='0.65'/><rect x='13' y='13' width='114' height='212' rx='4' fill='none' stroke='%23c8a860' stroke-width='0.7' opacity='0.38'/><g filter='url(%23glow)'><circle cx='70' cy='119' r='32' fill='none' stroke='%23c8a860' stroke-width='1.4' opacity='0.80'/><circle cx='70' cy='119' r='24' fill='rgba(200%2C175%2C120%2C0.15)' stroke='%23c8a860' stroke-width='0.7' opacity='0.55'/><circle cx='70' cy='119' r='10' fill='rgba(200%2C175%2C120%2C0.30)'/><circle cx='70' cy='111' r='5' fill='%23c8a860' opacity='0.55'/><circle cx='62' cy='119' r='5' fill='%23c8a860' opacity='0.45'/><circle cx='78' cy='119' r='5' fill='%23c8a860' opacity='0.45'/><line x1='70' y1='83' x2='70' y2='75' stroke='%23c8a860' stroke-width='1.3'/><line x1='70' y1='155' x2='70' y2='163' stroke='%23c8a860' stroke-width='1.3'/><line x1='34' y1='119' x2='26' y2='119' stroke='%23c8a860' stroke-width='1.3'/><line x1='106' y1='119' x2='114' y2='119' stroke='%23c8a860' stroke-width='1.3'/><line x1='47' y1='96' x2='41' y2='90' stroke='%23c8a860' stroke-width='0.9'/><line x1='93' y1='96' x2='99' y2='90' stroke='%23c8a860' stroke-width='0.9'/><line x1='47' y1='142' x2='41' y2='148' stroke='%23c8a860' stroke-width='0.9'/><line x1='93' y1='142' x2='99' y2='148' stroke='%23c8a860' stroke-width='0.9'/><line x1='56' y1='89' x2='53' y2='83' stroke='%23c8a860' stroke-width='0.7' opacity='0.6'/><line x1='84' y1='89' x2='87' y2='83' stroke='%23c8a860' stroke-width='0.7' opacity='0.6'/><line x1='56' y1='149' x2='53' y2='155' stroke='%23c8a860' stroke-width='0.7' opacity='0.6'/><line x1='84' y1='149' x2='87' y2='155' stroke='%23c8a860' stroke-width='0.7' opacity='0.6'/></g><g fill='%23c8a860' opacity='0.55'><polygon points='70,46 72,52 78,52 73,56 75,62 70,58 65,62 67,56 62,52 68,52' opacity='0.50'/><polygon points='70,192 72,186 78,186 73,182 75,176 70,180 65,176 67,182 62,186 68,186' opacity='0.50'/></g><g fill='%23c8a860' opacity='0.40'><path d='M22 22 L30 22 L22 30 Z' opacity='0.5'/><path d='M118 22 L110 22 L118 30 Z' opacity='0.5'/><path d='M22 216 L30 216 L22 208 Z' opacity='0.5'/><path d='M118 216 L110 216 L118 208 Z' opacity='0.5'/></g><g fill='%23c8a860' opacity='0.30'><circle cx='38' cy='55' r='1.2'/><circle cx='102' cy='55' r='1.2'/><circle cx='38' cy='183' r='1.2'/><circle cx='102' cy='183' r='1.2'/><circle cx='28' cy='90' r='0.9'/><circle cx='112' cy='90' r='0.9'/><circle cx='28' cy='148' r='0.9'/><circle cx='112' cy='148' r='0.9'/></g></svg>";
const CARD_BACK_IMAGES = [_SVG_BACK];

class CardCarousel {
  constructor() {
    this.container = document.getElementById('carousel');
    this.currentAngle = 0;
    this.targetAngle = 0;
    this.totalCards = CARDS.length;
    this.ringSize = 10;
    this.anglePerCard = 36;
    this.radius = 320;
    this.cards = [];
    this._animFrame = null;
    this._velocity = 0;
    this._friction = 0.92;
    this._isAnimating = false;
    this._isStacked = true;
    this._resizeTid = null;
    this._bindResize();
  }

  /** 窄屏减少环上物理牌数，增大夹角，牌与牌之间留出「缝」 */
  _syncRingSize() {
    const vw = typeof window !== 'undefined' ? window.innerWidth || 600 : 600;
    if (vw < 500) this.ringSize = 7;
    else if (vw < 780) this.ringSize = 8;
    else this.ringSize = 10;
    if (typeof document !== 'undefined' && document.documentElement.classList.contains('perf-tarot-vivo')) {
      this.ringSize = Math.min(this.ringSize, 6);
    }
    this.anglePerCard = 360 / this.ringSize;
  }

  /** 按视口与牌宽计算半径：使相邻牌弧长间距接近牌宽（略重叠或留缝） */
  _syncRadiusFromViewport() {
    const vw = typeof window !== 'undefined' ? window.innerWidth || 400 : 400;
    let cardW = 140;
    if (typeof document !== 'undefined') {
      const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-w'));
      if (!Number.isNaN(v) && v > 0) cardW = v;
    }
    const sinHalf = Math.sin(Math.PI / this.ringSize);
    const gapRatio = vw < 520 ? 1.16 : vw < 900 ? 1.06 : 1.02;
    const rChord = (gapRatio * cardW) / (2 * sinHalf);
    const margin = 22;
    const half = Math.max(70, vw / 2 - margin);
    const rCap = Math.min(400, half * 1.12 + cardW * 0.25);
    let r = Math.floor(Math.min(rCap, Math.max(118, rChord)));
    if (vw >= 960) r = Math.floor(Math.max(r, 268));
    this.radius = r;
  }

  /**
   * 食指指尖（屏幕坐标）命中哪张环位上的牌（0..ringSize-1）
   */
  hitTestScreen(clientX, clientY) {
    if (!this.cards || !this.cards.length) return -1;
    let best = -1;
    let bestD = Infinity;
    for (let i = 0; i < this.cards.length; i++) {
      const el = this.cards[i];
      const rect = el.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) continue;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = clientY - cy;
      const d2 = dx * dx + dy * dy;
      const diag = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
      const thresh = diag * 1.55;
      if (d2 < thresh * thresh && d2 < bestD) {
        bestD = d2;
        best = i;
      }
    }
    return best;
  }

  /** 将指定环位转到正对用户（与小樱「指谁谁到中间」一致） */
  snapToRingSlot(ringIndex) {
    if (ringIndex < 0 || ringIndex >= this.ringSize || this._isStacked) return;
    let target = -ringIndex * this.anglePerCard;
    const cur = this.currentAngle;
    let delta = target - cur;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    this.currentAngle = cur + delta;
    // 与 _snapToNearest 一致：落在格点上，避免取整误差导致「指到 A、getCurrentIndex 却是 B」
    this.currentAngle = Math.round(this.currentAngle / this.anglePerCard) * this.anglePerCard;
    this._velocity = 0;
    this._isAnimating = false;
    if (this._animFrame) {
      cancelAnimationFrame(this._animFrame);
      this._animFrame = null;
    }
    this._updateData();
    this._applyRotation();
    this._updateFrontCard();
  }

  _bindResize() {
    if (typeof window === 'undefined') return;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(this._resizeTid);
        this._resizeTid = setTimeout(() => this._onResize(), 180);
      },
      { passive: true }
    );
  }

  _onResize() {
    const prev = this.radius;
    this._syncRadiusFromViewport();
    if (prev === this.radius) return;
    if (this._isStacked) return;
    this.cards.forEach((el, i) => {
      const angle = this.anglePerCard * i;
      el.style.transition = 'none';
      el.style.transform = `rotateY(${angle}deg) translateZ(${this.radius}px)`;
    });
    requestAnimationFrame(() => {
      this.cards.forEach(el => {
        el.style.transition = 'filter 0.4s, opacity 0.4s';
      });
    });
    this._applyRotation();
    this._updateData();
    this._updateFrontCard();
  }

  create() {
    this.container.innerHTML = '';
    this.cards = [];
    this._isStacked = true;
    this._syncRingSize();
    this._syncRadiusFromViewport();

    const shuffledBacks = [...CARD_BACK_IMAGES].sort(() => Math.random() - 0.5);

    for (let i = 0; i < this.ringSize; i++) {
      const backImg = shuffledBacks[i % shuffledBacks.length];
      const el = document.createElement('div');
      el.className = 'carousel-card';
      el.dataset.ringIndex = i;
      el.innerHTML = `
        <div class="card-flipper">
          <div class="card-back">
            <img class="card-back-img" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 238' width='140' height='238'><defs><radialGradient id='bg' cx='50%25' cy='50%25' r='70%25'><stop offset='0%25' stop-color='%23f8f0e3'/><stop offset='100%25' stop-color='%23e8d5b5'/></radialGradient><filter id='glow'><feGaussianBlur stdDeviation='1.5' result='blur'/><feMerge><feMergeNode in='blur'/><feMergeNode in='SourceGraphic'/></feMerge></filter></defs><rect width='140' height='238' fill='url(%23bg)'/><rect x='6' y='6' width='128' height='226' rx='5' fill='none' stroke='%23c8973a' stroke-width='1.5' opacity='0.7'/><rect x='12' y='12' width='116' height='214' rx='3' fill='none' stroke='%23c8973a' stroke-width='0.8' opacity='0.45'/><g filter='url(%23glow)' opacity='0.85'><circle cx='70' cy='119' r='28' fill='none' stroke='%23c8973a' stroke-width='1.2'/><circle cx='70' cy='119' r='22' fill='none' stroke='%23c8973a' stroke-width='0.6' opacity='0.5'/><circle cx='70' cy='119' r='8' fill='%23c8973a' opacity='0.25'/><circle cx='70' cy='119' r='4' fill='%23c8973a' opacity='0.5'/><line x1='70' y1='87' x2='70' y2='79' stroke='%23c8973a' stroke-width='1.2'/><line x1='70' y1='151' x2='70' y2='159' stroke='%23c8973a' stroke-width='1.2'/><line x1='38' y1='119' x2='30' y2='119' stroke='%23c8973a' stroke-width='1.2'/><line x1='102' y1='119' x2='110' y2='119' stroke='%23c8973a' stroke-width='1.2'/><line x1='47' y1='96' x2='41' y2='90' stroke='%23c8973a' stroke-width='1'/><line x1='93' y1='96' x2='99' y2='90' stroke='%23c8973a' stroke-width='1'/><line x1='47' y1='142' x2='41' y2='148' stroke='%23c8973a' stroke-width='1'/><line x1='93' y1='142' x2='99' y2='148' stroke='%23c8973a' stroke-width='1'/></g><g opacity='0.7'><path d='M20,20 L26,14 M26,14 L32,20 M14,26 L20,20' fill='none' stroke='%23c8973a' stroke-width='0.8'/><path d='M120,20 L114,14 M114,14 L108,20 M126,26 L120,20' fill='none' stroke='%23c8973a' stroke-width='0.8'/><path d='M20,218 L26,224 M26,224 L32,218 M14,212 L20,218' fill='none' stroke='%23c8973a' stroke-width='0.8'/><path d='M120,218 L114,224 M114,224 L108,218 M126,212 L120,218' fill='none' stroke='%23c8973a' stroke-width='0.8'/></g><g fill='%23c8973a' opacity='0.6'><text x='70' y='55' text-anchor='middle' font-size='11' font-family='serif'>✦</text><text x='70' y='192' text-anchor='middle' font-size='11' font-family='serif'>✦</text><text x='28' y='122' text-anchor='middle' font-size='7' font-family='serif'>✦</text><text x='112' y='122' text-anchor='middle' font-size='7' font-family='serif'>✦</text></g><g fill='%23c8973a' opacity='0.35'><circle cx='35' cy='40' r='1.2'/><circle cx='105' cy='40' r='1.2'/><circle cx='35' cy='198' r='1.2'/><circle cx='105' cy='198' r='1.2'/><circle cx='50' cy='65' r='0.8'/><circle cx='90' cy='65' r='0.8'/><circle cx='50' cy='173' r='0.8'/><circle cx='90' cy='173' r='0.8'/></g><g opacity='0.5'><path d='M52,119 Q56,108 62,119 Q56,130 52,119Z' fill='%23c8973a'/><path d='M88,119 Q84,108 78,119 Q84,130 88,119Z' fill='%23c8973a'/></g></svg>" alt="牌背" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:6px;">
          </div>
        </div>
      `;

      el.style.transform = 'rotateY(0deg) translateZ(0px)';
      el.style.transition = 'transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)';

      this.container.appendChild(el);
      this.cards.push(el);
    }

    // 初始化角度为 0，使第 0 张牌正对用户
    this.currentAngle = 0;
    this._updateData();
    this._applyRotation();
  }

  spreadOut() {
    if (!this._isStacked) return;
    this._isStacked = false;

    this.cards.forEach((el, i) => {
      el.style.transition = `transform ${0.8 + i * 0.08}s cubic-bezier(0.2, 0.8, 0.2, 1)`;
      const angle = this.anglePerCard * i;
      el.style.transform = `rotateY(${angle}deg) translateZ(${this.radius}px)`;
    });

    setTimeout(() => {
      this.cards.forEach(el => {
        el.style.transition = 'filter 0.4s, opacity 0.4s';
      });
      this._updateData();
      this._updateFrontCard();
    }, 1600);
  }

  stackUp() {
    this._isStacked = true;
    this._velocity = 0;
    this._isAnimating = false;
    this.currentAngle = 0;

    this.cards.forEach((el) => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      el.style.transform = 'rotateY(0deg) translateZ(0px)';
    });
  }

  getCurrentIndex() {
    let idx = Math.round(-this.currentAngle / this.anglePerCard);
    idx = ((idx % this.totalCards) + this.totalCards) % this.totalCards;
    return idx;
  }

  /**
   * 正面环位上 data-logical-index（_updateData 写入）为展示真值，避免仅用角度取整与 DOM 不同步。
   */
  getFrontLogicalIndex() {
    if (this._isStacked || !this.cards || !this.cards.length) {
      return this.getCurrentIndex();
    }
    const idx = this.getCurrentIndex();
    const frontRing = ((idx % this.ringSize) + this.ringSize) % this.ringSize;
    const el = this.cards[frontRing];
    const raw = el && el.dataset ? el.dataset.logicalIndex : '';
    if (raw === undefined || raw === null || raw === '') return this.getCurrentIndex();
    const li = parseInt(String(raw), 10);
    if (!Number.isFinite(li)) return this.getCurrentIndex();
    return ((li % this.totalCards) + this.totalCards) % this.totalCards;
  }

  getCurrentCard() {
    return CARDS[this.getFrontLogicalIndex()];
  }

  /**
   * 三抽去重：转到下一张未收录牌。
   * 每次逻辑索引 +ringSize，使「正面环位」不变（食指刚点的槽仍朝前），只换穿过的那张牌。
   */
  rotateUntilIdNotIn(idSet) {
    if (!idSet || !idSet.size) return;
    let n = 0;
    while (idSet.has(this.getCurrentCard().id) && n <= this.totalCards) {
      const L = this.getFrontLogicalIndex();
      const next = (L + this.ringSize) % this.totalCards;
      this.rotateTo(next, false);
      n++;
    }
  }

  /** 进入捏合/结果前停掉惯性，避免回到环上时角度已被物理帧悄悄挪走 */
  stopPhysics() {
    this._velocity = 0;
    this._isAnimating = false;
    if (this._animFrame) {
      cancelAnimationFrame(this._animFrame);
      this._animFrame = null;
    }
  }

  addVelocity(v) {
    if (this._isStacked) return;
    this._velocity += v;
    this._startPhysics();
  }

  _startPhysics() {
    if (this._isAnimating) return;
    this._isAnimating = true;
    this._physicsLoop();
  }

  _physicsLoop() {
    this._velocity *= this._friction;
    this.currentAngle += this._velocity;

    this._updateData();
    this._applyRotation();
    this._updateFrontCard();

    if (Math.abs(this._velocity) > 0.15) {
      this._animFrame = requestAnimationFrame(() => this._physicsLoop());
    } else {
      this._velocity = 0;
      this._snapToNearest();
      this._isAnimating = false;
    }
  }

  _snapToNearest() {
    // 计算最近的牌位角度（基于 anglePerCard）
    const snapAngle = Math.round(this.currentAngle / this.anglePerCard) * this.anglePerCard;
    this.currentAngle = snapAngle;
    this._updateData();
    this._applyRotation();
    this._updateFrontCard();

    if (this.onSnap) this.onSnap();
  }

  rotateTo(index, animate = true) {
    const target = -index * this.anglePerCard;
    if (animate) {
      this._velocity = (target - this.currentAngle) * 0.1;
      this._startPhysics();
    } else {
      this.currentAngle = target;
      this.currentAngle = Math.round(this.currentAngle / this.anglePerCard) * this.anglePerCard;
      this._velocity = 0;
      this._updateData();
      this._applyRotation();
      this._updateFrontCard();
    }
  }

  rotateBy(dir) {
    this.addVelocity(-dir * this.anglePerCard * 0.3);
  }

  _applyRotation() {
    this.container.style.transition = 'none';
    this.container.style.transform = `rotateY(${this.currentAngle}deg)`;
  }

  _updateFrontCard() {
    const idx = this.getCurrentIndex();
    const frontRingIndex = ((idx % this.ringSize) + this.ringSize) % this.ringSize;
    if (frontRingIndex === this._lastFrontRingIdx) return; // 短路：没变化不操作DOM
    if (this._lastFrontRingIdx != null && this.cards[this._lastFrontRingIdx]) {
      this.cards[this._lastFrontRingIdx].classList.remove('front-card');
    }
    this._lastFrontRingIdx = frontRingIndex;
    if (this.cards[frontRingIndex]) {
      this.cards[frontRingIndex].classList.add('front-card');
    }
  }

  _updateData() {
    const centerIdx = this.getCurrentIndex();

    for (let i = 0; i < this.ringSize; i++) {
      let logicalIndex = centerIdx + (i - (centerIdx % this.ringSize));

      if (logicalIndex > centerIdx + Math.floor(this.ringSize / 2)) {
        logicalIndex -= this.ringSize;
      }
      if (logicalIndex < centerIdx - Math.floor(this.ringSize / 2)) {
        logicalIndex += this.ringSize;
      }

      logicalIndex = ((logicalIndex % this.totalCards) + this.totalCards) % this.totalCards;

      const el = this.cards[i];
      el.dataset.logicalIndex = logicalIndex;
      el.classList.remove('flipped');
    }
  }

  flipFrontCard() {
    const idx = this.getCurrentIndex();
    const frontRingIndex = ((idx % this.ringSize) + this.ringSize) % this.ringSize;
    const el = this.cards[frontRingIndex];
    el.classList.add('flipped');
  }

  setFocused(focused) {
    const idx = this.getCurrentIndex();
    const frontRingIndex = ((idx % this.ringSize) + this.ringSize) % this.ringSize;

    this.cards.forEach(card => card.classList.remove('focused-card'));

    if (!this._isStacked) {
      this.cards.forEach((card, i) => {
        const angle = this.anglePerCard * i;
        const bump = focused && i === frontRingIndex ? 38 : 0;
        const sc = focused && i === frontRingIndex ? 1.09 : 1;
        card.style.transform = `rotateY(${angle}deg) translateZ(${this.radius + bump}px) scale(${sc})`;
      });
    }

    if (focused) {
      this.cards[frontRingIndex].classList.add('focused-card');
    }
  }

  playEnterAnimation() {
    this.container.classList.add('entering');
    this.cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.animationDelay = `${i * 0.08}s`;
    });

    setTimeout(() => {
      this.container.classList.remove('entering');
      this.cards.forEach(card => {
        card.style.opacity = '1';
        card.style.animationDelay = '';
      });
    }, 1200);
  }
}

/**
 * 初始化底盘符文点
 */
function initPlatformRunes() {
  const container = document.getElementById('platform-runes');
  if (!container) return;
  const count = 24;
  const r = 210;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i;
    const dot = document.createElement('div');
    dot.className = 'rune-dot';
    dot.style.left = `${50 + (Math.cos(angle) * r / 440) * 100}%`;
    dot.style.top = `${50 + (Math.sin(angle) * r / 440) * 100}%`;
    dot.style.animationDelay = `${i * 0.1}s`;
    container.appendChild(dot);
  }
}
