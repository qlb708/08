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

const region = ref("all");
const track = ref("all");
const timeframe = ref("today");
const viewMode = ref("list");
const activeItem = ref(null);

const { copy, copied } = useClipboard();
const { data, isFetching, error } = useFetch(DATA_URL).json();

const payload = computed(() => data.value ?? { updatedAt: "", items: [] });

const filteredItems = computed(() => {
  const rawItems = Array.isArray(payload.value.items) ? payload.value.items : [];

  return rawItems
    .filter((item) => (region.value === "all" ? true : item.regionKey === region.value))
    .filter((item) => (track.value === "all" ? true : item.trackKey === track.value))
    .filter((item) => matchesTimeframe(item.time))
    .sort((a, b) => b.heat - a.heat)
    .map((item, index) => ({ ...item, rank: index + 1 }));
});

const highlightStats = computed(() => {
  const items = filteredItems.value;

  if (!items.length) {
    return [
      { label: "热点总数", value: 0 },
      { label: "平均热度", value: 0 },
      { label: "覆盖平台", value: 0 }
    ];
  }

  const averageHeat = Math.round(
    items.reduce((sum, item) => sum + Number(item.heat || 0), 0) / items.length
  );
  const platforms = new Set(items.map((item) => item.platform));

  return [
    { label: "热点总数", value: items.length },
    { label: "平均热度", value: averageHeat },
    { label: "覆盖平台", value: platforms.size }
  ];
});

const topInsight = computed(() => filteredItems.value[0] ?? null);

function matchesTimeframe(time) {
  const now = new Date();
  const target = new Date(time);
  const diffMs = now.getTime() - target.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) {
    return false;
  }

  if (timeframe.value === "today") {
    return diffDays < 1;
  }

  if (timeframe.value === "week") {
    return diffDays <= 7;
  }

  return diffDays <= 31;
}

function openDetail(item) {
  activeItem.value = item;
}

function closeDetail() {
  activeItem.value = null;
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

    <header class="hero card">
      <div>
        <p class="eyebrow">Competitor Radar</p>
        <h1>竞品雷达 · AI 旅行赛道</h1>
        <p class="subtitle">
          聚合 X、Instagram、微博、小红书、抖音的热点信号，跟踪 AI 旅行规划相关竞品动态。
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
      </article>
    </section>

    <section class="panel card">
      <div class="toolbar">
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

          <div class="filter-group compact">
            <label>视图</label>
            <div class="chip-row">
              <button
                v-for="option in viewOptions"
                :key="option.id"
                :class="['chip', { active: option.id === viewMode }]"
                @click="viewMode = option.id"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="topInsight" class="headline card inset">
        <div>
          <span class="headline-tag">Top Signal</span>
          <h2>#{{ topInsight.rank }} {{ topInsight.title }}</h2>
          <p>{{ topInsight.insight }}</p>
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
          </div>
          <h2>{{ activeItem.title }}</h2>
          <p class="modal-summary">{{ activeItem.summary }}</p>
          <div class="meta-grid">
            <span>地区：{{ activeItem.region }}</span>
            <span>赛道：{{ activeItem.track }}</span>
            <span>来源：{{ activeItem.source }}</span>
            <span>平台：{{ activeItem.platformLabel }}</span>
            <span>时间：{{ formatDate(activeItem.time) }}</span>
          </div>
          <div class="insight-box">
            <strong>洞察</strong>
            <p>{{ activeItem.insight }}</p>
          </div>
          <div class="modal-actions">
            <a class="button primary" :href="activeItem.url" target="_blank" rel="noreferrer">
              阅读原文
            </a>
            <button class="button ghost" @click="copy(activeItem.title)">
              {{ copied ? "已复制标题" : "复制标题" }}
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
