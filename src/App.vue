<script setup>
import { computed, ref } from "vue";
import { useClipboard, useFetch } from "@vueuse/core";

const DATA_URL = `${import.meta.env.BASE_URL}competitor-radar/data.json`;

const regionOptions = [
  { id: "all", label: "全部" },
  { id: "cn", label: "🇨🇳 国内" },
  { id: "na", label: "🇺🇸 北美" },
  { id: "eu", label: "🇪🇺 欧洲" },
  { id: "jpkr", label: "🇯🇵🇰🇷 日韩" },
  { id: "sea", label: "🌏 东南亚" }
];

const topicOptions = [
  { id: "all", label: "全部主题" },
  { id: "travel", label: "✈️ 旅行出行" },
  { id: "ai-tools", label: "🤖 AI 工具应用" },
  { id: "creator", label: "🎬 创作者内容" },
  { id: "lifestyle", label: "🏙️ 城市生活方式" },
  { id: "consumer", label: "🛍️ 消费种草" },
  { id: "funding", label: "💰 融资动态" }
];

const timeframeOptions = [
  { id: "today", label: "今日" },
  { id: "week", label: "本周" },
  { id: "month", label: "本月" }
];

const viewOptions = [
  { id: "list", label: "列表" },
  { id: "grid", label: "卡片" }
];

const sortOptions = [
  { id: "heat", label: "热度优先" },
  { id: "newest", label: "最新优先" }
];

const platformMeta = {
  x: {
    label: "X",
    mood: "观点放大",
    action: "适合看官方发声、从业者观点和话题扩散链。",
    color: "violet"
  },
  instagram: {
    label: "Instagram",
    mood: "视觉种草",
    action: "适合看创作者如何把趋势包装成可复制内容。",
    color: "orange"
  },
  weibo: {
    label: "微博",
    mood: "热点聚合",
    action: "适合看泛用户即时反馈和话题词成形速度。",
    color: "red"
  },
  xiaohongshu: {
    label: "小红书",
    mood: "口碑发酵",
    action: "适合看真实体验、收藏导向内容和消费判断。",
    color: "pink"
  },
  douyin: {
    label: "抖音",
    mood: "爆款转化",
    action: "适合看模板化传播和评论区行动意图。",
    color: "cyan"
  }
};

const topicMeta = {
  travel: {
    label: "旅行出行",
    short: "看路线、目的地和出行方式怎么被重新包装成热门内容。",
    playbook: "把热点拆成目的地热度、出行方式、预算场景和真实体验四层。"
  },
  "ai-tools": {
    label: "AI 工具应用",
    short: "看工具是否真的进入工作流，而不只是新奇演示。",
    playbook: "优先观察用户有没有自发分享具体工作流和前后效果。"
  },
  creator: {
    label: "创作者内容",
    short: "看内容模板如何被复制、跟拍和规模化扩散。",
    playbook: "重点看评论区是否在问模板、参数和制作方法。"
  },
  lifestyle: {
    label: "城市生活方式",
    short: "看城市内容如何和情绪、节奏、场景绑定。",
    playbook: "生活方式热点通常由场景词和情绪词驱动。"
  },
  consumer: {
    label: "消费种草",
    short: "看种草是否走到了‘值不值’而不是只停留在‘想买’。",
    playbook: "一旦用户开始比较频率、耐用和使用场景，才算进入决策阶段。"
  },
  funding: {
    label: "融资动态",
    short: "看创投讨论如何从故事走向增长、留存和变现。",
    playbook: "把讨论拆成增长、留存、变现三个维度更有分析价值。"
  }
};

const region = ref("all");
const topic = ref("all");
const timeframe = ref("today");
const platform = ref("all");
const viewMode = ref("list");
const sortBy = ref("heat");
const keyword = ref("");
const activeItem = ref(null);
const outboundItem = ref(null);
const workspaceVisible = ref(false);

const { copy, copied } = useClipboard();
const { data, isFetching, error } = useFetch(DATA_URL).json();

const payload = computed(() => data.value ?? { updatedAt: "", items: [] });

const normalizedItems = computed(() => {
  const items = Array.isArray(payload.value.items) ? payload.value.items : [];

  return items.map((item) => {
    const platformInfo = platformMeta[item.platform] ?? {
      label: item.platformLabel,
      mood: "平台信号",
      action: "适合继续做扩散链路分析。",
      color: "violet"
    };
    const topicInfo = topicMeta[item.trackKey] ?? {
      label: item.track,
      short: "继续跟踪这个主题的扩散脉络。",
      playbook: "继续拆解该主题的触发点、传播点和行动点。"
    };

    return {
      ...item,
      domain: safeDomain(item.url),
      platformInfo,
      topicInfo,
      heatBand: item.heat >= 90 ? "爆发" : item.heat >= 82 ? "高压" : item.heat >= 75 ? "观察" : "跟踪",
      urgency:
        item.heat >= 90 ? "立即跟进" : item.heat >= 82 ? "本周评估" : item.heat >= 75 ? "纳入监测" : "背景观察",
      summaryLine: `${item.region} · ${item.track} · ${platformInfo.mood}`
    };
  });
});

const platformOptions = computed(() => {
  const ids = [...new Set(normalizedItems.value.map((item) => item.platform))];

  return [
    { id: "all", label: "全部平台" },
    ...ids.map((id) => ({
      id,
      label: platformMeta[id]?.label ?? id
    }))
  ];
});

const filteredItems = computed(() => {
  const q = keyword.value.trim().toLowerCase();

  const items = normalizedItems.value
    .filter((item) => (region.value === "all" ? true : item.regionKey === region.value))
    .filter((item) => (topic.value === "all" ? true : item.trackKey === topic.value))
    .filter((item) => (platform.value === "all" ? true : item.platform === platform.value))
    .filter((item) => matchesTimeframe(item.time))
    .filter((item) => {
      if (!q) return true;
      return [item.title, item.summary, item.insight, item.track, item.region, item.platformLabel]
        .join(" ")
        .toLowerCase()
        .includes(q);
    })
    .sort((a, b) =>
      sortBy.value === "newest"
        ? new Date(b.time).getTime() - new Date(a.time).getTime()
        : b.heat - a.heat
    );

  return items.map((item, index) => ({ ...item, rank: index + 1 }));
});

const featuredItem = computed(() => filteredItems.value[0] ?? normalizedItems.value[0] ?? null);

const heroCards = computed(() => {
  const items = normalizedItems.value;
  const current = filteredItems.value.length ? filteredItems.value : items;
  const topRegion = topGroup(current, "region");
  const topTopic = topGroup(current, "track");
  const topPlatform = topGroup(current, "platformLabel");

  return [
    { label: "热点总量", value: current.length, note: `最高密度：${topRegion}` },
    { label: "最强主题", value: topTopic, note: "适合先从主题入口开始看" },
    { label: "主导平台", value: topPlatform, note: "代表当前扩散语境" }
  ];
});

const spotlightTopics = computed(() => {
  return topicOptions
    .filter((option) => option.id !== "all")
    .map((option) => {
      const items = normalizedItems.value
        .filter((item) => item.trackKey === option.id)
        .sort((a, b) => b.heat - a.heat);
      const top = items[0];

      return {
        id: option.id,
        label: topicMeta[option.id]?.label ?? option.label,
        short: topicMeta[option.id]?.short ?? "",
        volume: items.length,
        topTitle: top?.title ?? "暂无热点",
        topHeat: top?.heat ?? 0
      };
    })
    .sort((a, b) => b.topHeat - a.topHeat);
});

const quickStories = computed(() => normalizedItems.value.slice().sort((a, b) => b.heat - a.heat).slice(0, 4));

const workspaceItems = computed(() => filteredItems.value);

const relatedItems = computed(() => {
  if (!activeItem.value) return [];

  return normalizedItems.value
    .filter((item) => item.id !== activeItem.value.id)
    .filter(
      (item) =>
        item.trackKey === activeItem.value.trackKey ||
        item.regionKey === activeItem.value.regionKey ||
        item.platform === activeItem.value.platform
    )
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 3);
});

function topGroup(items, key) {
  if (!items.length) return "--";

  const bucket = new Map();
  for (const item of items) {
    bucket.set(item[key], (bucket.get(item[key]) ?? 0) + 1);
  }
  return [...bucket.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

function matchesTimeframe(time) {
  const now = new Date();
  const target = new Date(time);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return false;
  if (timeframe.value === "today") return diffDays < 1;
  if (timeframe.value === "week") return diffDays <= 7;
  return diffDays <= 31;
}

function safeDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function jumpToWorkspace(nextTopic = "all") {
  topic.value = nextTopic;
  workspaceVisible.value = true;
  document.getElementById("analysis-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function focusRegion(nextRegion) {
  region.value = nextRegion;
  workspaceVisible.value = true;
  document.getElementById("analysis-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openDetail(item) {
  activeItem.value = item;
  outboundItem.value = null;
}

function closeDetail() {
  activeItem.value = null;
}

function askOutbound(item) {
  outboundItem.value = item;
}

function cancelOutbound() {
  outboundItem.value = null;
}

function confirmOutbound() {
  if (!outboundItem.value) return;
  window.open(outboundItem.value.url, "_blank", "noopener,noreferrer");
  outboundItem.value = null;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
</script>

<template>
  <div class="shell">
    <div class="aurora aurora-a"></div>
    <div class="aurora aurora-b"></div>
    <div class="grid-glow"></div>

    <header class="hero card">
      <div class="hero-copy">
        <p class="eyebrow">Social Hotspot Radar</p>
        <h1>社交热点雷达</h1>
        <p class="subtitle">追踪不同地区、主题与平台上的高传播内容与话题信号。</p>
        <div class="hero-actions">
          <button class="button primary" @click="jumpToWorkspace()">查看热点库</button>
          <button class="button ghost" @click="jumpToWorkspace('ai-tools')">AI 工具</button>
        </div>
      </div>
      <div class="hero-side">
        <span class="pill">X / Instagram / 微博 / 小红书 / 抖音</span>
        <span class="meta">最近更新 {{ payload.updatedAt ? formatDate(payload.updatedAt) : "--" }}</span>
      </div>
    </header>

    <section class="hero-metrics">
      <article v-for="card in heroCards" :key="card.label" class="metric card">
        <span>{{ card.label }}</span>
        <strong>{{ card.value }}</strong>
        <small>{{ card.note }}</small>
      </article>
    </section>

    <section v-if="featuredItem" class="feature card">
      <div class="feature-copy">
        <p class="eyebrow">Today’s Signal</p>
        <h2>{{ featuredItem.title }}</h2>
        <p>{{ featuredItem.summary }}</p>
        <div class="feature-tags">
          <span>{{ featuredItem.region }}</span>
          <span>{{ featuredItem.track }}</span>
          <span>{{ featuredItem.platformLabel }}</span>
          <span>{{ featuredItem.urgency }}</span>
        </div>
      </div>
      <div class="feature-side">
        <strong>{{ featuredItem.heat }}</strong>
        <span>热度值</span>
        <button class="button ghost" @click="openDetail(featuredItem)">展开解读</button>
      </div>
    </section>

    <section class="spotlight-grid">
      <article
        v-for="topicCard in spotlightTopics"
        :key="topicCard.id"
        class="spotlight card clickable"
        @click="jumpToWorkspace(topicCard.id)"
      >
        <span class="spotlight-volume">{{ topicCard.volume }} 条</span>
        <h3>{{ topicCard.label }}</h3>
        <p>{{ topicCard.short }}</p>
        <strong>{{ topicCard.topTitle }}</strong>
        <small>最高热度 {{ topicCard.topHeat }}</small>
      </article>
    </section>

    <section class="story-row">
      <article
        v-for="story in quickStories"
        :key="story.id"
        class="story card clickable"
        @click="openDetail(story)"
      >
        <div class="story-top">
          <span class="source">{{ story.platformLabel }}</span>
          <span class="heat">{{ story.heat }}</span>
        </div>
        <h3>{{ story.title }}</h3>
        <p>{{ story.summaryLine }}</p>
      </article>
    </section>

    <section id="analysis-workspace" class="workspace card">
      <div class="workspace-head">
        <div>
          <p class="eyebrow">Library</p>
          <h2>热点库</h2>
          <p>按主题、地区、平台与时间检索热点信号。</p>
        </div>
        <button class="button ghost" @click="workspaceVisible = !workspaceVisible">
          {{ workspaceVisible ? "收起" : "展开" }}
        </button>
      </div>

      <div v-if="workspaceVisible" class="workspace-body">
        <div class="filter-grid">
          <div class="filter-group">
            <label>关键词</label>
            <input v-model="keyword" class="search-input" type="text" placeholder="搜标题、洞察、平台..." />
          </div>

          <div class="filter-group">
            <label>主题</label>
            <div class="chip-row">
              <button
                v-for="option in topicOptions"
                :key="option.id"
                :class="['chip', { active: option.id === topic }]"
                @click="topic = option.id"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div class="filter-group">
            <label>地区</label>
            <div class="chip-row">
              <button
                v-for="option in regionOptions"
                :key="option.id"
                :class="['chip', { active: option.id === region }]"
                @click="region = option.id"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div class="filter-inline">
            <div class="filter-group compact">
              <label>平台</label>
              <div class="chip-row compact-row">
                <button
                  v-for="option in platformOptions"
                  :key="option.id"
                  :class="['chip mini', { active: option.id === platform }]"
                  @click="platform = option.id"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div class="filter-group compact">
              <label>时间</label>
              <div class="chip-row compact-row">
                <button
                  v-for="option in timeframeOptions"
                  :key="option.id"
                  :class="['chip mini', { active: option.id === timeframe }]"
                  @click="timeframe = option.id"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div class="filter-group compact">
              <label>排序</label>
              <div class="chip-row compact-row">
                <button
                  v-for="option in sortOptions"
                  :key="option.id"
                  :class="['chip mini', { active: option.id === sortBy }]"
                  @click="sortBy = option.id"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div class="filter-group compact">
              <label>视图</label>
              <div class="chip-row compact-row">
                <button
                  v-for="option in viewOptions"
                  :key="option.id"
                  :class="['chip mini', { active: option.id === viewMode }]"
                  @click="viewMode = option.id"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="quick-region-row">
          <button class="region-jump" @click="focusRegion('cn')">快速看国内</button>
          <button class="region-jump" @click="focusRegion('na')">快速看北美</button>
          <button class="region-jump" @click="focusRegion('eu')">快速看欧洲</button>
          <button class="region-jump" @click="focusRegion('jpkr')">快速看日韩</button>
          <button class="region-jump" @click="focusRegion('sea')">快速看东南亚</button>
        </div>

        <div v-if="isFetching" class="empty">正在加载热点数据...</div>
        <div v-else-if="error" class="empty">数据加载失败，请检查 `competitor-radar/data.json`。</div>
        <div v-else-if="!workspaceItems.length" class="empty">当前筛选下没有热点数据。</div>

        <div v-else :class="viewMode === 'grid' ? 'grid-view' : 'list-view'">
          <article
            v-for="item in workspaceItems"
            :key="item.id"
            class="entry card clickable"
            @click="openDetail(item)"
          >
            <div class="entry-top">
              <span class="rank">#{{ item.rank }}</span>
              <span class="source">{{ item.platformLabel }}</span>
              <span class="heat">{{ item.heat }}</span>
            </div>
            <div class="entry-rail">
              <span class="signal-band">{{ item.heatBand }}</span>
              <span class="entry-summary">{{ item.summaryLine }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
            <div class="entry-tags">
              <span>{{ item.region }}</span>
              <span>{{ item.track }}</span>
              <span>{{ formatDate(item.time) }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <teleport to="body">
      <div v-if="activeItem" class="modal-mask" @click.self="closeDetail">
        <div class="modal card">
          <button class="close" @click="closeDetail">×</button>
          <div class="modal-head">
            <span class="rank large">#{{ activeItem.rank ?? '-' }}</span>
            <span class="heat large">{{ activeItem.heat }}</span>
            <span class="signal-band">{{ activeItem.heatBand }}</span>
          </div>
          <h2>{{ activeItem.title }}</h2>
          <p class="modal-summary">{{ activeItem.summary }}</p>

          <div class="detail-grid">
            <section class="detail-block">
              <h3>信号拆解</h3>
              <div class="meta-grid">
                <span>地区：{{ activeItem.region }}</span>
                <span>主题：{{ activeItem.track }}</span>
                <span>平台：{{ activeItem.platformLabel }}</span>
                <span>来源：{{ activeItem.source }}</span>
                <span>时间：{{ formatDate(activeItem.time) }}</span>
                <span>外链域名：{{ activeItem.domain }}</span>
              </div>
            </section>

            <section class="detail-block">
              <h3>洞察</h3>
              <p>{{ activeItem.insight }}</p>
            </section>

            <section class="detail-block">
              <h3>平台语境</h3>
              <p>{{ activeItem.platformInfo.action }}</p>
            </section>

            <section class="detail-block">
              <h3>建议动作</h3>
              <p>{{ activeItem.topicInfo.playbook }}</p>
            </section>
          </div>

          <section v-if="relatedItems.length" class="related-block">
            <h3>关联信号</h3>
            <div class="related-list">
              <button v-for="item in relatedItems" :key="item.id" class="related-card" @click="openDetail(item)">
                <strong>{{ item.title }}</strong>
                <span>{{ item.region }} · {{ item.track }} · {{ item.platformLabel }}</span>
              </button>
            </div>
          </section>

          <div class="modal-actions">
            <button class="button primary" @click="askOutbound(activeItem)">阅读原文</button>
            <button class="button ghost" @click="copy(activeItem.title)">
              {{ copied ? "已复制标题" : "复制标题" }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="outboundItem" class="modal-mask" @click.self="cancelOutbound">
        <div class="confirm card">
          <h3>跳转外部原链接？</h3>
          <p>
            你将打开 <strong>{{ outboundItem.platformLabel }}</strong> 原始内容，目标域名是
            <strong>{{ outboundItem.domain }}</strong>。
          </p>
          <div class="confirm-meta">
            <span>{{ outboundItem.title }}</span>
          </div>
          <div class="modal-actions">
            <button class="button primary" @click="confirmOutbound">确认跳转</button>
            <button class="button ghost" @click="cancelOutbound">先留在面板</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
