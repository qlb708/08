// 命运旅途推荐 v5.0 — 融合版（旧卡片样式）
window.renderTravelRecommend = function(cards, theme) {
  var section = document.getElementById('travel-recommend-section');
  if (!section) return;

  // 标签打分引擎拿 Top3
  var ranked = null;
  if (typeof window.scoreDestinations === 'function') {
    try { ranked = window.scoreDestinations(cards, theme); } catch(e) {}
  }
  if (!ranked || !ranked.length) {
    var db = window.DESTINATION_DB || [];
    ranked = db.slice().sort(() => Math.random() - 0.5);
  }
  var top3 = ranked.slice(0, 3);
  if (!top3.length) return;

  var best = top3[0];
  var others = top3.slice(1);

  // 三层文案（旅行处方）
  var prescription = null;
  if (typeof window.generateTravelCopy === 'function') {
    try { prescription = window.generateTravelCopy(cards, best.name, theme); } catch(e) {}
  }

  // ——融合段落——
  // 把 insight-short（塔罗引子1句）+ 旅行处方正文合并显示
  var insightShort = document.getElementById('result-doc-insight-short');
  if (insightShort) {
    var tarotLeadin = insightShort.textContent ? insightShort.textContent.trim() : '';
    var travelBody = prescription
      ? (prescription.title + '\n' + prescription.body)
      : '';

    var html = '';
    if (tarotLeadin) {
      html += '<span style="color:rgba(255,255,255,0.55);font-style:italic;font-size:13px;">' + tarotLeadin + '</span><br><br>';
    }
    if (travelBody) {
      html += '<span style="color:rgba(255,255,255,0.9);font-size:14px;line-height:2;">'
        + travelBody.replace(/\n/g, '<br>')
        + '</span>';
    }
    insightShort.innerHTML = html || insightShort.textContent;
  }

  // 主题标题
  var themeMap = {
    '邂逅爱情': '命运说，去这里邂逅你的爱情',
    '旺我事业': '命运说，去这里旺你的事业运',
    '今日去哪': '命运为你指引，今天就去这里'
  };
  var titleText = themeMap[theme] || '命运为你推荐的旅途';

  // 旅游卡片（旧 destiny-* 样式）
  section.innerHTML = `
    <div style="width:100%;padding:0 0 8px;">
      <div class="destiny-header">
        <div class="destiny-title">✈ ${titleText}</div>
      </div>

      <!-- 命运首选大卡 -->
      <div class="destiny-best-card" onclick="window.open('${best.url}','_blank')">
        <div class="destiny-best-img-wrap">
          <img src="${best.image}" alt="${best.name}"
               onerror="this.src='https://source.unsplash.com/400x300/?travel,china'">
          <span class="destiny-best-badge">✦ 命运首选</span>
        </div>
        <div class="destiny-best-info">
          <div class="destiny-scene">${best.name}</div>
          <div class="destiny-location">${best.province}</div>
          <div class="destiny-tagline">${best.desc}</div>
          <div class="destiny-cta">查看游记 →</div>
        </div>
      </div>

      <!-- 次推荐横排小卡 -->
      <div class="destiny-other-row">
        ${others.map(d => `
          <div class="destiny-other-card" onclick="window.open('${d.url}','_blank')">
            <img src="${d.image}" alt="${d.name}"
                 onerror="this.src='https://source.unsplash.com/400x300/?travel'">
            <div class="destiny-other-info">
              <div class="destiny-other-scene">${d.name}</div>
              <div class="destiny-other-loc">${d.province}</div>
              <div class="destiny-other-tagline">${d.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  section.style.display = 'block';
};
