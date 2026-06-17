<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useClipboard, useFetch } from '@vueuse/core'

const DATA_URL = `${import.meta.env.BASE_URL}competitor-radar/data.json`

// ── page state ──
const page = ref('home') // 'home' | 'list'
const activeItem = ref(null)
const outboundItem = ref(null)
const keyword = ref('')

// ── filters ──
const region = ref('all')
const topic = ref('all')
const platform = ref('all')
const timeframe = ref('week')

const { copy, copied } = useClipboard()
const { data, isFetching, error } = useFetch(DATA_URL).json()

// ── metadata ──
const regionOptions = [
  { id: 'all', label: '全部地区' },
  { id: 'cn', label: '🇨🇳 国内' },
  { id: 'na', label: '🇺🇸 北美' },
  { id: 'eu', label: '🇪🇺 欧洲' },
  { id: 'jpkr', label: '🇯🇵🇰🇷 日韩' },
  { id: 'sea', label: '🌏 东南亚' }
]

const topicOptions = [
  { id: 'all', label: '全部主题' },
  { id: 'ai-travel', label: '🧭 AI 旅行规划' },
  { id: 'travel', label: '✈️ 旅行出行' },
  { id: 'ai-tools', label: '🤖 AI 工具应用' },
  { id: 'creator', label: '🎬 创作者内容' },
  { id: 'lifestyle', label: '🏙️ 城市生活方式' },
  { id: 'consumer', label: '🛍️ 消费种草' },
  { id: 'funding', label: '💰 融资动态' }
]

const timeframeOptions = [
  { id: 'today', label: '今日' },
  { id: 'week', label: '本周' },
  { id: 'month', label: '本月' }
]

const platformMeta = {
  x: { label: 'X', color: 'violet' },
  instagram: { label: 'Instagram', color: 'orange' },
  weibo: { label: '微博', color: 'red' },
  xiaohongshu: { label: '小红书', color: 'pink' },
  douyin: { label: '抖音', color: 'cyan' }
}

const platformOptions = computed(() => {
  const all = ['weibo', 'xiaohongshu', 'douyin', 'x', 'instagram']
  return [{ id: 'all', label: '全部平台' }, ...all.map(id => ({ id, label: platformMeta[id]?.label ?? id }))]
})

const payload = computed(() => data.value ?? { updatedAt: '', items: [] })

const normalizedItems = computed(() => {
  const items = Array.isArray(payload.value.items) ? payload.value.items : []
  return items.map(item => ({
    ...item,
    domain: safeDomain(item.url),
    summaryLine: `${item.region} · ${item.track} · ${platformMeta[item.platform]?.label ?? item.platformLabel}`
  }))
})

// ── filtering ──
function matchesTimeframe(time) {
  const now = new Date()
  const target = new Date(time)
  const diffMs = now.getTime() - target.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  if (diffDays < 0) return false
  if (timeframe.value === 'today') return diffDays < 1
  if (timeframe.value === 'week') return diffDays <= 7
  return diffDays <= 31
}

const filteredItems = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  let items = normalizedItems.value
    .filter(item => region.value === 'all' || item.regionKey === region.value)
    .filter(item => topic.value === 'all' || item.trackKey === topic.value)
    .filter(item => platform.value === 'all' || item.platform === platform.value)
    .filter(item => matchesTimeframe(item.time))
    .filter(item => {
      if (!q) return true
      return [item.title, item.summary, item.insight, item.track, item.region, item.platformLabel].join(' ').toLowerCase().includes(q)
    })
    .sort((a, b) => b.heat - a.heat)

  // page='list' uses topic filter; for 'home' quick stories we show top by heat
  return items.map((item, index) => ({ ...item, rank: index + 1 }))
})

const featuredItem = computed(() => {
  const top = filteredItems.value[0]
  if (top) return top
  // fallback: just pick the global hottest
  return [...normalizedItems.value].sort((a, b) => b.heat - a.heat)[0] ?? null
})

const heroCards = computed(() => {
  const items = filteredItems.value.length ? filteredItems.value : normalizedItems.value
  if (!items.length) return [
    { label: '热点总量', value: 0, note: '暂无数据' },
    { label: '最强主题', value: '--', note: '' },
    { label: '主导平台', value: '--', note: '' }
  ]
  const topRegion = topGroup(items, 'region')
  const topTrack = topGroup(items, 'track')
  const topPlatform = topGroup(items, 'platformLabel')
  return [
    { label: '热点总量', value: items.length, note: `最高密度：${topRegion}` },
    { label: '最强主题', value: topTrack, note: '适合先从主题入口开始看' },
    { label: '主导平台', value: topPlatform, note: '代表当前扩散语境' }
  ]
})

const spotlightTopics = computed(() => {
  return topicOptions
    .filter(o => o.id !== 'all')
    .map(o => {
      const items = normalizedItems.value
        .filter(i => i.trackKey === o.id)
        .sort((a, b) => b.heat - a.heat)
      const top = items[0]
      return {
        id: o.id, label: o.label, volume: items.length,
        topTitle: top?.title ?? '暂无热点',
        topHeat: top?.heat ?? 0
      }
    })
    .sort((a, b) => b.topHeat - a.topHeat)
})

const quickStories = computed(() =>
  [...normalizedItems.value].sort((a, b) => b.heat - a.heat).slice(0, 4)
)

const relatedItems = computed(() => {
  if (!activeItem.value) return []
  return normalizedItems.value
    .filter(i => i.id !== activeItem.value.id && i.trackKey === activeItem.value.trackKey)
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 3)
})

// ── helpers ──
function topGroup(items, key) {
  if (!items.length) return '--'
  const bucket = new Map()
  for (const item of items) bucket.set(item[key], (bucket.get(item[key]) ?? 0) + 1)
  return [...bucket.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

function safeDomain(url) {
  try { return new URL(url).hostname.replace('www.', '') } catch { return url }
}

function formatDate(v) {
  return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(v))
}

function heatClass(heat) {
  if (heat >= 90) return 'high'
  if (heat >= 85) return 'mid'
  return 'low'
}

function goToList(topicId) {
  if (topicId) topic.value = topicId
  page.value = 'list'
  window.scrollTo(0, 0)
}

function goHome() {
  page.value = 'home'
  window.scrollTo(0, 0)
}

function openDrawer(item) { activeItem.value = item }
function closeDrawer() { activeItem.value = null }
function askOutbound(item) { outboundItem.value = item }
function confirmOutbound() {
  window.open(outboundItem.value.url, '_blank', 'noopener,noreferrer')
  outboundItem.value = null
}

function resetFilters() {
  region.value = 'all'
  topic.value = 'all'
  platform.value = 'all'
  timeframe.value = 'week'
  keyword.value = ''
}

// ── ESC to close drawer ──
function onKeydown(e) {
  if (e.key === 'Escape') {
    if (outboundItem.value) { outboundItem.value = null; return }
    if (activeItem.value) { closeDrawer(); return }
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="shell">
    <div class="aurora aurora-a"></div>
    <div class="aurora aurora-b"></div>
    <div class="aurora aurora-c"></div>
    <div class="grid-glow"></div>

    <!-- ════════════════ HOME PAGE ════════════════ -->
    <template v-if="page === 'home'">
      <!-- Hero -->
      <header class="hero card">
        <div class="hero-copy">
          <p class="eyebrow">Social Hotspot Radar</p>
          <h1>社交热点雷达</h1>
          <p class="subtitle">追踪不同地区、主题与平台上的高传播内容与竞品信号，聚焦 AI 旅行赛道。</p>
          <div class="hero-actions">
            <button class="button primary" @click="goToList()">查看全部热点</button>
            <button class="button ghost" @click="goToList('ai-travel')">🧭 AI 旅行规划</button>
          </div>
        </div>
        <div class="hero-side">
          <span class="pill">X / Instagram / 微博 / 小红书 / 抖音</span>
          <span class="meta">最近更新 {{ payload.updatedAt ? formatDate(payload.updatedAt) : '--' }}</span>
        </div>
      </header>

      <!-- Hero Metrics -->
      <section class="hero-metrics">
        <article v-for="card in heroCards" :key="card.label" class="metric card">
          <span>{{ card.label }}</span>
          <strong>{{ card.value }}</strong>
          <small>{{ card.note }}</small>
        </article>
      </section>

      <!-- Today's Signal -->
      <section v-if="featuredItem" class="feature card" @click="openDrawer(featuredItem)">
        <div class="feature-copy">
          <p class="eyebrow">Today's Signal</p>
          <h2>{{ featuredItem.title }}</h2>
          <p>{{ featuredItem.summary }}</p>
          <div class="feature-tags">
            <span>{{ featuredItem.region }}</span>
            <span>{{ featuredItem.track }}</span>
            <span>{{ featuredItem.platformLabel }}</span>
          </div>
        </div>
        <div class="feature-side">
          <div class="heat-display">{{ featuredItem.heat }}</div>
          <span>热度值</span>
        </div>
      </section>

      <!-- Topic Quick Entry -->
      <section class="spotlight-grid">
        <article
          v-for="t in spotlightTopics"
          :key="t.id"
          class="spotlight card"
          @click="goToList(t.id)"
        >
          <span class="spotlight-volume">{{ t.volume }} 条</span>
          <h3>{{ t.label }}</h3>
          <p>{{ t.topTitle }}</p>
          <small>最高热度 {{ t.topHeat }}</small>
        </article>
      </section>

      <!-- Quick Stories -->
      <section class="story-row">
        <article
          v-for="story in quickStories"
          :key="story.id"
          class="story card"
          @click="openDrawer(story)"
        >
          <div class="story-top">
            <span
              class="platform-tag"
              :data-color="platformMeta[story.platform]?.color"
            >{{ platformMeta[story.platform]?.label ?? story.platformLabel }}</span>
            <span class="heat-badge" :class="heatClass(story.heat)">{{ story.heat }}</span>
          </div>
          <h3>{{ story.title }}</h3>
          <p>{{ story.summaryLine }}</p>
        </article>
      </section>

      <!-- View All CTA -->
      <section class="view-all-section">
        <button class="button primary view-all-btn" @click="goToList()">
          查看全部 {{ normalizedItems.length }} 条热点 →
        </button>
      </section>
    </template>

    <!-- ════════════════ LIST PAGE ════════════════ -->
    <template v-if="page === 'list'">
      <div class="list-header">
        <div class="back-btn" @click="goHome">← 返回首页</div>
        <div class="breadcrumb">
          <a @click="goHome">首页</a> / <span>热点库</span>
        </div>
        <h2 style="font-size:24px;margin-top:8px;">热点库</h2>
      </div>

      <!-- Filter Bar -->
      <section class="filter-bar card">
        <input v-model="keyword" class="search-input" type="text" placeholder="搜索标题、洞察…" />
        <div class="chip-row">
          <button
            v-for="o in topicOptions" :key="o.id"
            class="chip" :class="{ active: o.id === topic }"
            @click="topic = o.id"
          >{{ o.label }}</button>
        </div>
        <div class="chip-row">
          <button
            v-for="o in regionOptions" :key="o.id"
            class="chip" :class="{ active: o.id === region }"
            @click="region = o.id"
          >{{ o.label }}</button>
        </div>
        <div class="chip-row">
          <button
            v-for="o in platformOptions" :key="o.id"
            class="chip mini" :class="{ active: o.id === platform }"
            @click="platform = o.id"
          >{{ o.label }}</button>
        </div>
        <div class="chip-row">
          <button
            v-for="o in timeframeOptions" :key="o.id"
            class="chip mini" :class="{ active: o.id === timeframe }"
            @click="timeframe = o.id"
          >{{ o.label }}</button>
        </div>
        <button class="reset-btn" @click="resetFilters">重置</button>
      </section>

      <div class="result-count">共 {{ filteredItems.length }} 条热点</div>

      <!-- Loading -->
      <div v-if="isFetching" class="loading card">
        <div class="spinner"></div>
        <span>正在加载热点数据…</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="empty card">
        <strong>数据加载失败</strong>
        <p>请检查 competitor-radar/data.json 文件是否存在。</p>
      </div>

      <!-- Empty -->
      <div v-else-if="!filteredItems.length" class="empty card">
        <strong>没有找到匹配的热点</strong>
        <p>尝试调整筛选条件或重置筛选。</p>
        <button class="button ghost sm" @click="resetFilters" style="margin-top:16px">重置筛选</button>
      </div>

      <!-- List -->
      <div v-else class="entry-list">
        <article
          v-for="item in filteredItems" :key="item.id"
          class="entry card"
          @click="openDrawer(item)"
        >
          <div class="rank-cell">
            <span class="rank-badge" :class="item.rank <= 3 ? 'top' : 'normal'">#{{ item.rank }}</span>
          </div>
          <div class="entry-content">
            <div class="entry-meta">
              <span
                class="platform-tag"
                :data-color="platformMeta[item.platform]?.color"
              >{{ platformMeta[item.platform]?.label ?? item.platformLabel }}</span>
              <span class="heat-badge" :class="heatClass(item.heat)">{{ item.heat }}</span>
            </div>
            <h3>{{ item.title }}</h3>
            <p class="entry-summary">{{ item.summaryLine }}</p>
          </div>
          <div class="heat-cell">
            <span class="heat-number">{{ item.heat }}</span>
          </div>
        </article>
      </div>
    </template>

    <!-- ════════════════ DRAWER ════════════════ -->
    <teleport to="body">
      <template v-if="activeItem">
        <div class="drawer-mask" @click="closeDrawer"></div>
        <Transition name="drawer">
          <div class="drawer" v-if="activeItem">
            <button class="drawer-close" @click="closeDrawer">×</button>
            <div class="drawer-inner">
              <div class="drawer-header">
                <span
                  class="platform-tag"
                  :data-color="platformMeta[activeItem.platform]?.color"
                >{{ platformMeta[activeItem.platform]?.label ?? activeItem.platformLabel }}</span>
                <span class="heat-badge" :class="heatClass(activeItem.heat)">{{ activeItem.heat }}</span>
              </div>

              <h2>{{ activeItem.title }}</h2>
              <p class="summary-text">{{ activeItem.summary }}</p>

              <div class="drawer-info-grid">
                <div class="drawer-info-item">
                  <label>地区</label>
                  <span>{{ activeItem.region }}</span>
                </div>
                <div class="drawer-info-item">
                  <label>赛道</label>
                  <span>{{ activeItem.track }}</span>
                </div>
                <div class="drawer-info-item">
                  <label>来源</label>
                  <span>{{ activeItem.source }}</span>
                </div>
                <div class="drawer-info-item">
                  <label>发布时间</label>
                  <span>{{ formatDate(activeItem.time) }}</span>
                </div>
              </div>

              <div class="drawer-insight">
                <label>洞察</label>
                <p>{{ activeItem.insight }}</p>
              </div>

              <div class="drawer-sources" v-if="activeItem.sourceExamples?.length">
                <h3>来源入口</h3>
                <p>继续追踪到原帖、话题页和平台讨论链。</p>
                <button
                  v-for="ex in activeItem.sourceExamples" :key="ex.label"
                  class="source-link-btn"
                  @click="askOutbound({ url: ex.url, title: ex.label, domain: safeDomain(ex.url), platformLabel: activeItem.platformLabel })"
                >
                  <strong>{{ ex.label }}</strong>
                  <em>{{ safeDomain(ex.url) }}</em>
                </button>
              </div>

              <div class="drawer-related" v-if="relatedItems.length">
                <h3>相关信号</h3>
                <button
                  v-for="rel in relatedItems" :key="rel.id"
                  class="related-item-btn"
                  @click="openDrawer(rel)"
                >
                  <strong>{{ rel.title }}</strong>
                  <span>{{ rel.region }} · {{ rel.track }} · {{ platformMeta[rel.platform]?.label ?? rel.platformLabel }}</span>
                </button>
              </div>
            </div>

            <div class="drawer-actions">
              <button class="button primary" @click="askOutbound(activeItem)">阅读原文</button>
              <button class="button ghost" @click="copy(activeItem.title)">
                {{ copied ? '已复制' : '复制标题' }}
              </button>
            </div>
          </div>
        </Transition>
      </template>

      <!-- ════════════════ OUTBOUND CONFIRM ════════════════ -->
      <div v-if="outboundItem" class="confirm-mask" @click.self="outboundItem = null">
        <div class="confirm-box">
          <h3>跳转外部链接？</h3>
          <p>你将打开 <strong>{{ outboundItem.platformLabel }}</strong> 原始内容</p>
          <div class="confirm-meta">
            <span>{{ outboundItem.title }}</span><br>
            <small style="color:var(--text-muted)">{{ outboundItem.domain }}</small>
          </div>
          <div class="modal-actions">
            <button class="button primary" @click="confirmOutbound">确认跳转</button>
            <button class="button ghost" @click="outboundItem = null">留在面板</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
/* Drawer transition */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-active .drawer,
.drawer-leave-active .drawer {
  transform: translateX(0);
}
.drawer-enter-from .drawer {
  transform: translateX(100%);
}
.drawer-leave-to .drawer {
  transform: translateX(100%);
}
</style>
