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

const trackOptions = [
  { id: "all", label: "🔭 全部" },
  { id: "trip-planning", label: "✈️ AI 旅行规划" },
  { id: "ota-assistant", label: "🏨 OTA AI 助手" },
  { id: "social-travel", label: "👥 社交+旅行" },
  { id: "funding", label: "💰 融资动态" }
];

const timeframeOptions = [
  { id: "today", label: "📅 今日热点" },
  { id: "week", label: "📆 本周热点" },
  { id: "month", label: "🗓️ 本月热点" }
];

const viewOptions = [
  { id: "list", label: "排行列表" },
  { id: "grid", label: "卡片网格" }
];

const sortOptions = [
  { id: "heat", label: "按热度" },
  { id: "newest", label: "按时间" }
];

const platformMeta = {
  x: { label: "X", mood: "讨论热度", action: "适合追踪官方账号发声、评论链和投资人观点的放大效应。" },
  instagram: { label: "Instagram", mood: "内容扩散", action: "适合看创作者视觉表达、Reels 带动的功能理解和种草效率。" },
  weibo: { label: "微博", mood: "热点聚合", action: "适合捕捉话题词、热搜延展和泛用户对旅行 AI 的即时反馈。" },
  xiaohongshu: { label: "小红书", mood: "口碑发酵", action: "适合看真实体验、收藏导向内容和产品被怎样包装成生活方式。" },
  douyin: { label: "抖音", mood: "视频转化", action: "适合观察爆款切口、结果展示能力和评论区的强购买意图。" }
};

const trackPlaybooks = {
  "trip-planning": "优先做‘一键出路线 + 可执行理由’的表达，少讲抽象 AI，多讲时间、预算和动线。",
  "ota-assistant": "强调提醒、重排和服务链串联能力，让用户感觉是一个真能替你处理琐事的助手。",
  "social-travel": "聚焦陪伴、安全感和兴趣匹配，把社交从功能点改成情绪价值和场景价值。",
  funding: "把融资讨论拆成增长、留存、变现三个维度，避免只看‘拿没拿钱’。"
};

const region = ref("all");
const track = ref("all");
const timeframe = ref("today");
const viewMode = ref("list");
const sortBy = ref("heat");
const platform = ref("all");
const keyword = ref("");
const activeItem = ref(null);
const outboundItem = ref(null);

const { copy, copied } = useClipboard();
const { data, isFetching, error } = useFetch(DATA_URL).json();

const payload = computed(() => data.value ?? { updatedAt: "", items: [] });

const platformOptions = computed(() => {
  const items = Array.isArray(payload.value.items) ? payload.value.items : [];
  const ids = [...new Set(items.map((item) => item.platform))];

  return [
    { id: "all", label: "全部平台" },
    ...ids.map((id) => ({
      id,
      label: platformMeta[id]?.label ?? id
    }))
  ];
});

const normalizedItems = computed(() => {
  const items = Array.isArray(payload.value.items) ? payload.value.items : [];

  return items.map((item) => {
    const detailTone = platformMeta[item.platform] ?? { label: item.platformLabel, mood: "平台信号", action: "" };
    const heatBand =
      item.heat >= 90 ? "爆发" : item.heat >= 82 ? "高压" : item.heat >= 75 ? "观察" : "跟踪";
    const urgency =
      item.heat >= 90 ? "立即跟进" : item.heat >= 82 ? "本周评估" : item.heat >= 75 ? "纳入监测" : "背景观察";
    const summaryLine = `${item.region} · ${item.track} · ${detailTone.mood}`;

    return {
      ...item,
      domain: safeDomain(item.url),
      detailTone,
      heatBand,
      urgency,
      summaryLine,
      playbook: trackPlaybooks[item.trackKey] ?? "建议继续跟踪这类信号的扩散链路与用户反馈。"
    };
  });
});

const filteredItems = computed(() => {
  const q = keyword.value.trim().toLowerCase();

  const items = normalizedItems.value
    .filter((item) => (region.value === "all" ? true : item.regionKey === region.value))
    .filter((item) => (track.value === "all" ? true : item.trackKey === track.value))
    .filter((item) => (platform.value === "all" ? true : item.platform === platform.value))
    .filter((item) => matchesTimeframe(item.time))
    .filter((item) => {
      if (!q) return true;
      return [item.title, item.summary, item.insight, item.region, item.track, item.platformLabel]
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

const highlightStats = computed(() => {
  const items = filteredItems.value;

  if (!items.length) {
    return [
      { label: "热点总数", value: 0, note: "当前筛选为空" },
      { label: "平均热度", value: 0, note: "暂无趋势" },
      { label: "覆盖平台", value: 0, note: "暂无覆盖" }
    ];
  }

  const averageHeat = Math.round(
    items.reduce((sum, item) => sum + Number(item.heat || 0), 0) / items.length
  );
  const platforms = new Set(items.map((item) => item.platform));
  const hottestRegion = topGroup(items, "region");

  return [
    { label: "热点总数", value: items.length, note: `最高密度：${hottestRegion}` },
    { label: "平均热度", value: averageHeat, note: averageHeat >= 88 ? "热度正在抬升" : "处于观察区间" },
    { label: "覆盖平台", value: platforms.size, note: `${[...platforms].map((id) => platformMeta[id]?.label ?? id).join(" / ")}` }
  ];
});

const topInsight = computed(() => filteredItems.value[0] ?? null);

const laneSummary = computed(() => {
  const items = filteredItems.value;

  return [
    {
      title: "最强平台",
      value: topGroup(items, "platformLabel"),
      note: items.length ? (platformMeta[items[0].platform]?.action ?? "继续追踪扩散链路。") : "暂无数据"
    },
    {
      title: "最强赛道",
      value: topGroup(items, "track"),
      note: items.length ? (trackPlaybooks[items[0].trackKey] ?? "继续做分层监测。") : "暂无数据"
    },
    {
      title: "执行建议",
      value: topInsight.value?.urgency ?? "等待数据",
      note: topInsight.value?.insight ?? "当前筛选下暂无头部信号。"
    }
  ];
});

const relatedItems = computed(() => {
  if (!activeItem.value) return [];

  return filteredItems.value
    .filter((item) => item.id !== activeItem.value.id)
    .filter(
      (item) =>
        item.regionKey === activeItem.value.regionKey ||
        item.trackKey === activeItem.value.trackKey ||
        item.platform === activeItem.value.platform
    )
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

function safeDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
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
        <p class="eyebrow">Competitor Radar</p>
        <h1>竞品雷达 · AI 旅行赛道</h1>
        <p class="subtitle">
          不只是看热度，而是把社交平台信号拆成地区、赛道、平台语境和可执行动作。
        </p>
      </div>
      <div class="hero-side">
        <span class="pill">社交平台源</span>
        <span class="meta">最近更新 {{ payload.updatedAt ? formatDate(payload.updatedAt) : "--" }}</span>
      </div>
    </header>

    <section class="stats">
      <article v-for="stat in highlightStats" :key="stat.label" class="stat card">
        <span>{{ stat.label }}</span>
        <strong>{{ stat.value }}</strong>
        <small>{{ stat.note }}</small>
      </article>
    </section>

    <section class="lane-grid">
      <article v-for="lane in laneSummary" :key="lane.title" class="lane card">
        <span>{{ lane.title }}</span>
        <strong>{{ lane.value }}</strong>
        <p>{{ lane.note }}</p>
      </article>
    </section>

    <section class="panel card">
      <div class="toolbar">
        <div class="filter-group">
          <label>关键词搜索</label>
          <input
            v-model="keyword"
            class="search-input"
            type="text"
            placeholder="搜标题、平台、洞察、地区..."
          />
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

        <div class="filter-group">
          <label>赛道</label>
          <div class="chip-row">
            <button
              v-for="option in trackOptions"
              :key="option.id"
              :class="['chip', { active: option.id === track }]"
              @click="track = option.id"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="toolbar-bottom">
          <div class="filter-group compact">
            <label>时间范围</label>
            <div class="chip-row">
              <button
                v-for="option in timeframeOptions"
                :key="option.id"
                :class="['chip', { active: option.id === timeframe }]"
                @click="timeframe = option.id"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div class="toolbar-controls">
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
      </div>

      <div v-if="topInsight" class="headline card inset">
        <div>
          <span class="headline-tag">Top Signal</span>
          <h2>#{{ topInsight.rank }} {{ topInsight.title }}</h2>
          <p>{{ topInsight.insight }}</p>
          <div class="headline-tags">
            <span>{{ topInsight.region }}</span>
            <span>{{ topInsight.track }}</span>
            <span>{{ topInsight.platformLabel }}</span>
            <span>{{ topInsight.urgency }}</span>
          </div>
        </div>
        <div class="headline-metrics">
          <strong>{{ topInsight.heat }}</strong>
          <span>热度值</span>
        </div>
      </div>

      <div v-if="isFetching" class="empty">正在加载热点数据...</div>
      <div v-else-if="error" class="empty">数据加载失败，请检查 `competitor-radar/data.json`。</div>
      <div v-else-if="!filteredItems.length" class="empty">当前筛选下没有热点数据。</div>

      <div v-else :class="viewMode === 'grid' ? 'grid-view' : 'list-view'">
        <article
          v-for="item in filteredItems"
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
            <span>{{ item.source }}</span>
            <span>{{ formatDate(item.time) }}</span>
          </div>
        </article>
      </div>
    </section>

    <teleport to="body">
      <div v-if="activeItem" class="modal-mask" @click.self="closeDetail">
        <div class="modal card">
          <button class="close" @click="closeDetail">×</button>
          <div class="modal-head">
            <span class="rank large">#{{ activeItem.rank }}</span>
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
                <span>赛道：{{ activeItem.track }}</span>
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
              <p>{{ activeItem.detailTone.action }}</p>
            </section>

            <section class="detail-block">
              <h3>建议动作</h3>
              <p>{{ activeItem.playbook }}</p>
            </section>
          </div>

          <section v-if="relatedItems.length" class="related-block">
            <h3>关联信号</h3>
            <div class="related-list">
              <button
                v-for="item in relatedItems"
                :key="item.id"
                class="related-card"
                @click="openDetail(item)"
              >
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
