// 命运旅途推荐 v8.0 — 确定性推荐 + 行程ID占位表
(function() {

// ── 内置30个目的地（无url，由DEST_TRIPS提供行程ID）──
var DEST_DB = [{"name":"张家界","province":"湖南","desc":"在三千奇峰之间，寻找属于你的那座仙境——命运的云梯，正等你踏上去。","image":"https://source.unsplash.com/400x300/?zhangjiajie,mountain","tags":{"adventure":5,"romance":1,"healing":3,"culture":2,"nature":5,"urban":0,"spiritual":3,"social":2}},{"name":"九寨沟","province":"四川","desc":"五彩池水倒映着前世的约定，在这片童话世界里，命运的色彩为你绽放。","image":"https://source.unsplash.com/400x300/?jiuzhaigou,valley","tags":{"adventure":3,"romance":3,"healing":5,"culture":1,"nature":5,"urban":0,"spiritual":2,"social":1}},{"name":"稻城亚丁","province":"四川","desc":"最后的香格里拉，蓝色星球上最纯净的角落——命运在这里，等你深呼吸。","image":"https://source.unsplash.com/400x300/?daochengyading,snowmountain","tags":{"adventure":5,"romance":3,"healing":4,"culture":1,"nature":5,"urban":0,"spiritual":4,"social":0}},{"name":"西藏","province":"西藏","desc":"在离天最近的地方，听见灵魂的回响——这一世朝圣，是命运写给你的邀请函。","image":"https://source.unsplash.com/400x300/?tibet,potala","tags":{"adventure":5,"romance":1,"healing":4,"culture":4,"nature":5,"urban":0,"spiritual":5,"social":1}},{"name":"新疆","province":"新疆","desc":"万里辽阔的土地上，每一步都是命运的指引——从沙漠到草原，遇见最辽阔的自己。","image":"https://source.unsplash.com/400x300/?xinjiang,grassland","tags":{"adventure":5,"romance":2,"healing":3,"culture":3,"nature":5,"urban":1,"spiritual":3,"social":2}},{"name":"海南","province":"海南","desc":"椰风海韵中，命运安排了一场与蔚蓝的邂逅——让浪花带走所有疲惫。","image":"https://source.unsplash.com/400x300/?hainan,beach","tags":{"adventure":3,"romance":4,"healing":5,"culture":1,"nature":4,"urban":2,"spiritual":1,"social":3}},{"name":"桂林","province":"广西","desc":"山水甲天下的画卷里，你乘一叶竹筏漂过命运的转折点——前方是全新的风景。","image":"https://source.unsplash.com/400x300/?guilin,riverrafting","tags":{"adventure":3,"romance":3,"healing":4,"culture":3,"nature":5,"urban":0,"spiritual":2,"social":2}},{"name":"黄山","province":"安徽","desc":"云海翻涌之间，你站在命运的山巅——看日出破晓，万物重新开始。","image":"https://source.unsplash.com/400x300/?huangshan,sunrise","tags":{"adventure":4,"romance":2,"healing":3,"culture":3,"nature":5,"urban":0,"spiritual":3,"social":2}},{"name":"武夷山","province":"福建","desc":"茶香弥漫的丹霞地貌间，命运泡在一壶大红袍里——慢慢品，答案自在其中。","image":"https://source.unsplash.com/400x300/?wuyishan,tea","tags":{"adventure":3,"romance":2,"healing":5,"culture":4,"nature":5,"urban":0,"spiritual":3,"social":1}},{"name":"敦煌","province":"甘肃","desc":"千年壁画低语着古老的预言——在沙漠深处，命运与文明交汇于此。","image":"https://source.unsplash.com/400x300/?dunhuang,desert","tags":{"adventure":4,"romance":2,"healing":2,"culture":5,"nature":3,"urban":0,"spiritual":5,"social":1}},{"name":"西安","province":"陕西","desc":"在这片古老的土地上，遇见命中注定的人——城墙之下，命运穿越千年与你对望。","image":"https://source.unsplash.com/400x300/?xian,terracotta","tags":{"adventure":2,"romance":3,"healing":2,"culture":5,"nature":2,"urban":3,"spiritual":3,"social":4}},{"name":"北京","province":"北京","desc":"紫禁城的红墙里藏着王朝的命运，而你——正站在历史与未来的交汇点上。","image":"https://source.unsplash.com/400x300/?beijing,forbiddencity","tags":{"adventure":3,"romance":2,"healing":1,"culture":5,"nature":2,"urban":5,"spiritual":2,"social":5}},{"name":"成都","province":"四川","desc":"在烟火人间中慢下来，命运说：不急，好运气藏在一碗盖碗茶里。","image":"https://source.unsplash.com/400x300/?chengdu,panda","tags":{"adventure":2,"romance":3,"healing":4,"culture":4,"nature":3,"urban":4,"spiritual":1,"social":5}},{"name":"丽江","province":"云南","desc":"古城的石板路上，命运为你写下一个转角——那里有人等你，有歌为你而唱。","image":"https://source.unsplash.com/400x300/?lijiang,oldtown","tags":{"adventure":3,"romance":5,"healing":4,"culture":4,"nature":4,"urban":1,"spiritual":3,"social":4}},{"name":"大理","province":"云南","desc":"风花雪月之间，命运在苍山洱海边等你——放下行囊的那一刻，自由开始了。","image":"https://source.unsplash.com/400x300/?dali,erhai","tags":{"adventure":3,"romance":5,"healing":5,"culture":3,"nature":5,"urban":1,"spiritual":3,"social":3}},{"name":"洛阳","province":"河南","desc":"牡丹花开的季节，命运在龙门石窟微笑——千年等待，只为与你相遇。","image":"https://source.unsplash.com/400x300/?luoyang,peony","tags":{"adventure":2,"romance":3,"healing":2,"culture":5,"nature":3,"urban":2,"spiritual":3,"social":3}},{"name":"开封","province":"河南","desc":"梦回大宋的繁华夜市里，命运藏在一笼灌汤包的温度中——生活的滋味，就此展开。","image":"https://source.unsplash.com/400x300/?kaifeng,nightmarket","tags":{"adventure":2,"romance":2,"healing":3,"culture":5,"nature":2,"urban":2,"spiritual":2,"social":4}},{"name":"扬州","province":"江苏","desc":"烟花三月的瘦西湖畔，命运如柳丝轻拂——慢生活里藏着最深的智慧。","image":"https://source.unsplash.com/400x300/?yangzhou,garden","tags":{"adventure":1,"romance":4,"healing":4,"culture":5,"nature":4,"urban":2,"spiritual":2,"social":3}},{"name":"上海","province":"上海","desc":"霓虹灯下，命运在外滩的夜风中低语——这座不夜城，正等你书写新的篇章。","image":"https://source.unsplash.com/400x300/?shanghai,skyline","tags":{"adventure":3,"romance":4,"healing":1,"culture":4,"nature":1,"urban":5,"spiritual":1,"social":5}},{"name":"广州","province":"广东","desc":"在岭南的烟火气里，命运熬成一锅老火靓汤——温暖从胃到心，好运自然来。","image":"https://source.unsplash.com/400x300/?guangzhou,canton","tags":{"adventure":2,"romance":2,"healing":3,"culture":4,"nature":2,"urban":5,"spiritual":1,"social":5}},{"name":"深圳","province":"广东","desc":"在这座年轻的城市里，命运说：放手去拼——每一个明天，都比今天更耀眼。","image":"https://source.unsplash.com/400x300/?shenzhen,city","tags":{"adventure":4,"romance":2,"healing":1,"culture":2,"nature":2,"urban":5,"spiritual":1,"social":5}},{"name":"杭州","province":"浙江","desc":"西湖的水面倒映着命运的轮廓——在诗意与代码之间，这座城市给你两种答案。","image":"https://source.unsplash.com/400x300/?hangzhou,westlake","tags":{"adventure":2,"romance":4,"healing":4,"culture":4,"nature":4,"urban":4,"spiritual":2,"social":4}},{"name":"重庆","province":"重庆","desc":"8D魔幻城市的每一条路都是命运的隐喻——转个弯，就是柳暗花明。","image":"https://source.unsplash.com/400x300/?chongqing,nightview","tags":{"adventure":5,"romance":3,"healing":2,"culture":3,"nature":3,"urban":5,"spiritual":1,"social":5}},{"name":"厦门","province":"福建","desc":"鼓浪屿的琴声中，命运在凤凰花下微笑——这座海上花园，是你心灵的避风港。","image":"https://source.unsplash.com/400x300/?xiamen,gulangyu","tags":{"adventure":2,"romance":4,"healing":4,"culture":3,"nature":3,"urban":3,"spiritual":2,"social":3}},{"name":"三亚","province":"海南","desc":"在天涯海角，命运牵起你的手——这片碧海蓝天，是你们爱情的见证。","image":"https://source.unsplash.com/400x300/?sanya,tropicalbeach","tags":{"adventure":3,"romance":5,"healing":5,"culture":1,"nature":5,"urban":2,"spiritual":1,"social":3}},{"name":"鼓浪屿","province":"福建","desc":"钢琴声飘过万国建筑，命运在小巷深处等你——每一步，都是浪漫的注脚。","image":"https://source.unsplash.com/400x300/?gulangyu,island","tags":{"adventure":2,"romance":5,"healing":4,"culture":4,"nature":3,"urban":1,"spiritual":2,"social":3}},{"name":"青岛","province":"山东","desc":"红瓦绿树间，海风送来命运的消息——在啤酒与海之间，遇见最美的意外。","image":"https://source.unsplash.com/400x300/?qingdao,coast","tags":{"adventure":3,"romance":4,"healing":3,"culture":3,"nature":4,"urban":3,"spiritual":1,"social":4}},{"name":"周庄","province":"江苏","desc":"小桥流水人家，命运在一叶乌篷船里轻轻摇晃——江南水乡，藏着最温柔的时光。","image":"https://source.unsplash.com/400x300/?zhouzhuang,watertown","tags":{"adventure":1,"romance":5,"healing":4,"culture":5,"nature":4,"urban":0,"spiritual":2,"social":2}},{"name":"乌镇","province":"浙江","desc":"枕水而眠的夜晚，命运在灯影中闪烁——这座梦中的水乡，是你灵魂的归处。","image":"https://source.unsplash.com/400x300/?wuzhen,nightwater","tags":{"adventure":1,"romance":5,"healing":5,"culture":5,"nature":4,"urban":0,"spiritual":3,"social":2}},{"name":"凤凰古城","province":"湖南","desc":"沱江边的吊脚楼下，命运写下你的名字——这座边城，等你来续写未完的故事。","image":"https://source.unsplash.com/400x300/?fenghuang,ancienttown","tags":{"adventure":3,"romance":5,"healing":4,"culture":4,"nature":4,"urban":0,"spiritual":3,"social":3}}];

// ── 行程ID占位表（后续替换为真实ID，每个目的地3+个行程）──
// 替换时把 "TRIP_XXX_01" 换成真实的 pitravel 行程ID即可
var DEST_TRIPS = {
  "张家界":   [null, null, null],  // 待补充
  "九寨沟":   [null, null, null],  // 待补充
  "稻城亚丁": ["7660052465678075268", "7660042595872000470", null],
  "西藏":     [null, null, null],  // 待补充
  "新疆":     [null, null, null],  // 待补充
  "海南":     [null, null, null],  // 待补充
  "桂林":     [null, null, null],  // 待补充
  "黄山":     ["7660061824401822137", "7660061377735239210", "7660060673360601040"],
  "武夷山":   [null, null, null],  // 待补充
  "敦煌":     [null, null, null],  // 待补充
  "西安":     [null, null, null],  // 待补充
  "北京":     [null, null, null],  // 待补充
  "成都":     [null, null, null],  // 待补充
  "丽江":     ["7660059384860391790", "7660059384870778388", null],
  "大理":     ["7660061420685281350", "7660061420674895352", "7660059745648032062"],
  "洛阳":     [null, null, null],  // 待补充
  "开封":     [null, null, null],  // 待补充
  "扬州":     [null, null, null],  // 待补充
  "上海":     [null, null, null],  // 待补充
  "广州":     ["7660059423525114674", "7660059423525114672", null],
  "深圳":     [null, null, null],  // 待补充
  "杭州":     [null, null, null],  // 待补充
  "重庆":     [null, null, null],  // 待补充
  "厦门":     ["7660059423525484221", "7660059419220130304", null],
  "三亚":     [null, null, null],  // 待补充
  "鼓浪屿":   [null, null, null],  // 待补充
  "青岛":     ["7660059414963712706", null, null],
  "周庄":     [null, null, null],  // 待补充
  "乌镇":     [null, null, null],  // 待补充
  "凤凰古城": [null, null, null]   // 待补充
};

var BASE_URL = 'https://slytherin-admin.devops.xiaohongshu.com/config/journey';

// 获取目的地跳转URL：带目的地名称参数，直接进该目的地规划页
function getTripUrl(destName, idx) {
  var ids = DEST_TRIPS[destName] || [];
  var id = ids[idx || 0];
  // 有真实行程ID就跳具体行程，否则带目的地搜索参数跳规划页
  if (id && id.indexOf('TRIP_') !== 0) return BASE_URL + '?journeyId=' + id;
  return BASE_URL + '?city=' + encodeURIComponent(destName);
}

// ── 8维打分 ──
function scoreOne(dest, cards, theme) {
  var posWeights = [1.0, 1.2, 1.5];
  var themeBoost = {'邂逅爱情':{romance:2.0},'旺我事业':{urban:1.5,culture:1.5}}[theme] || {};
  var CARD_TAGS = window.CARD_TAGS || {};
  var score = 0;
  for (var i = 0; i < cards.length && i < 3; i++) {
    var card = cards[i];
    var ct = CARD_TAGS[card.nameEn];
    var cardTags = ct ? (card.reversed ? ct.reversed : ct.upright) : null;
    if (!cardTags) continue;
    var pw = posWeights[i] || 1.0;
    var dims = Object.keys(dest.tags);
    for (var j = 0; j < dims.length; j++) {
      var dim = dims[j];
      score += (cardTags[dim]||0) * (dest.tags[dim]||0) * pw * (themeBoost[dim]||1.0);
    }
  }
  return score;
}

// ── 确定性Top3（相同输入永远出相同结果）──
function pickTop3(cards, theme) {
  var scored = DEST_DB.map(function(d) {
    return {dest:d, score:scoreOne(d, cards, theme)};
  });
  // 分数相同时按名字排序，保证确定性
  scored.sort(function(a,b) {
    if (b.score !== a.score) return b.score - a.score;
    return a.dest.name < b.dest.name ? -1 : 1;
  });
  var top10 = scored.slice(0,10).map(function(x){return x.dest;});
  // 确定性去重（不用随机，按顺序取第一个不同省份的）
  var pick1 = top10[0];
  var pick2 = top10.slice(1).filter(function(d){return d.province!==pick1.province;})[0] || top10[1];
  var pick3 = top10.slice(1).filter(function(d){
    return d.name!==pick1.name && d.name!==(pick2&&pick2.name) &&
           d.province!==pick1.province && d.province!==(pick2&&pick2.province);
  })[0] || top10[2];
  return [pick1, pick2, pick3].filter(Boolean);
}

// ── 处方文案 ──
function rnd(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

function makePrescription(cards, destName, theme) {
  var CC = window.CARD_COPY || {};
  var DC = window.DEST_COPY || {};
  var c0=cards[0], c1=cards[1];
  var cp0 = CC[c0&&c0.nameEn] ? CC[c0.nameEn][c0.reversed?'reversed':'upright'] : null;
  var cp1 = CC[c1&&c1.nameEn] ? CC[c1.nameEn][c1.reversed?'reversed':'upright'] : null;
  var dc  = DC[destName] || {};
  var names = cards.map(function(c){return c?'「'+c.name+'」':'';}).join('');
  return [
    '你抽到'+names+'。',
    cp0&&cp0.state ? rnd(cp0.state) : '',
    cp1&&cp1.need  ? rnd(cp1.need)  : '',
    '所以这次，命运推荐你去：'+destName+'。',
    dc.reason ? rnd(dc.reason) : '',
    dc.dosage ? '建议用法：'+rnd(dc.dosage) : ''
  ].filter(Boolean).join('\n');
}

// ── 主渲染 ──
window.renderTravelRecommend = function(cards, theme) {
  var section = document.getElementById('travel-recommend-section');
  if (!section) return;

  var top3 = [];
  try { top3 = pickTop3(cards, theme); } catch(e) { top3 = DEST_DB.slice(0,3); }
  if (!top3.length) { top3 = DEST_DB.slice(0,3); }

  var best = top3[0], others = top3.slice(1,3);

  // 写处方文案
  var prescEl = document.getElementById('result-doc-insight-short');
  if (prescEl) {
    var txt = '';
    try { txt = makePrescription(cards, best.name, theme); } catch(e) {}
    prescEl.innerHTML = '<div style="text-align:left;font-size:14px;line-height:2;color:rgba(255,255,255,0.88);white-space:pre-line;padding:8px 4px;">' + txt + '</div>';
  }

  var themeMap = {'邂逅爱情':'✈ 命运说，去这里邂逅你的爱情','旺我事业':'✈ 命运说，去这里旺你的事业运','今日去哪':'✈ 命运为你指引，今天就去这里'};
  var titleText = themeMap[theme] || '✈ 命运为你推荐的旅途';

  section.innerHTML =
    '<div class="destiny-header"><div class="destiny-title">'+titleText+'</div></div>'+
    '<div class="destiny-best-card" onclick="window.open(\''+getTripUrl(best.name,0)+'\',\'_blank\')" style="cursor:pointer;">'+
      '<div class="destiny-best-img-wrap">'+
        '<img src="'+best.image+'" alt="'+best.name+'" onerror="this.parentNode.style.background=\'rgba(80,60,120,0.5)\';this.remove();">'+
        '<span class="destiny-best-badge">✦ 命运首选</span>'+
      '</div>'+
      '<div class="destiny-best-info">'+
        '<div class="destiny-scene">'+best.name+'</div>'+
        '<div class="destiny-location">'+best.province+'</div>'+
        '<div class="destiny-tagline">'+best.desc+'</div>'+
        '<div class="destiny-cta">查看游记 →</div>'+
      '</div>'+
    '</div>'+
    '<div class="destiny-other-row">'+
    others.map(function(d,i){
      return '<div class="destiny-other-card" onclick="window.open(\''+getTripUrl(d.name,0)+'\',\'_blank\')" style="cursor:pointer;">'+
        '<img src="'+d.image+'" alt="'+d.name+'" onerror="this.parentNode.style.background=\'rgba(80,60,120,0.5)\';this.remove();">'+
        '<div class="destiny-other-info">'+
          '<div class="destiny-other-scene">'+d.name+'</div>'+
          '<div class="destiny-other-loc">'+d.province+'</div>'+
          '<div class="destiny-other-tagline">'+d.desc.substring(0,28)+'…</div>'+
        '</div>'+
      '</div>';
    }).join('')+
    '</div>';

  section.classList.remove('hidden');
  section.style.display = 'block';
};

})();
