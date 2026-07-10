/* ========================================
   塔罗牌手势占卜系统 - 主应用逻辑 v7-0707d
   
   状态流程：
   IDLE → (握拳) → SUMMONED (3D环+立体底盘)
     → (张开手掌连续滑动) → 旋转木马丝滑旋转
     → (食指指向 POINT) → FOCUSED (选中高亮，等待捏合确认)
     → (捏合 PINCH) → HOLDING (卡牌翻转展示，等待松手)
     → (松手 PINCH_RELEASE) → 卡牌飞入槽位
     → 若未满3张 → SUMMONED
     → 选满3张 → RESULT (占卜结果页)
   ======================================== */

/**
 * 父页面预请求摄像头协议（与 games/sakura/app-sakura-tarot.js 保持一致）：
 * play.js 在用户点全屏时发送 cygame-request-camera，
 * iframe 在非全屏状态下弹出 getUserMedia 权限窗，
 * 成功后缓存 stream 并回复 cygame-camera-granted，
 * 后续 _initCamera 检测到缓存 stream 直接复用，不再弹窗。
 */
var __preCameraStream = null;

/** Vivo/OPPO/小米等内置浏览器：推理与画布叠在一起易掉帧，摄像头与特效再降一档 */
function cygameTarotIsVivoStyleBrowser() {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('perf-tarot-vivo');
}

/** 与小樱塔罗相同的轻量约束；Vivo 系再压低分辨率与帧率减轻 MediaPipe 压力 */
function cygameTarotVideoConstraints() {
  if (cygameTarotIsVivoStyleBrowser()) {
    return {
      facingMode: 'user',
      width: { ideal: 240, max: 320 },
      height: { ideal: 180, max: 240 },
      frameRate: { ideal: 14, max: 18 },
    };
  }
  return {
    facingMode: 'user',
    width: { ideal: 320, max: 480 },
    height: { ideal: 240, max: 360 },
    frameRate: { ideal: 20, max: 24 },
  };
}

window.addEventListener('message', function (ev) {
  var d = ev && ev.data;
  if (!d || typeof d !== 'object') return;
  if (d.type === 'cygame-request-camera' && !__preCameraStream) {
    navigator.mediaDevices.getUserMedia({
      video: cygameTarotVideoConstraints(),
      audio: false,
    }).then(function (stream) {
      __preCameraStream = stream;
      try { window.parent.postMessage({ type: 'cygame-camera-granted' }, '*'); } catch (_) {}
    }).catch(function () {
      try { window.parent.postMessage({ type: 'cygame-camera-denied' }, '*'); } catch (_) {}
    });
  }
});

/** 将 MediaPipe 归一化坐标映射到 object-fit:cover 下的屏幕像素（与小樱点选一致） */
function tarotVideoPointToClient(videoEl, nx, ny, mirrored) {
  if (!videoEl) return { x: 0, y: 0 };
  const rect = videoEl.getBoundingClientRect();
  const vw = videoEl.videoWidth || 1;
  const vh = videoEl.videoHeight || 1;
  const xN = mirrored ? 1 - nx : nx;
  const px = xN * vw;
  const py = ny * vh;
  const vAr = vw / vh;
  const rAr = rect.width / Math.max(1, rect.height);
  if (rAr > vAr) {
    const scale = rect.width / vw;
    const dispH = vh * scale;
    const y0 = rect.top + (rect.height - dispH) / 2;
    return { x: rect.left + px * scale, y: y0 + py * scale };
  }
  const scale = rect.height / vh;
  const dispW = vw * scale;
  const x0 = rect.left + (rect.width - dispW) / 2;
  return { x: x0 + px * scale, y: rect.top + py * scale };
}

const STATE = {
  IDLE: 'idle',
  SUMMONED: 'summoned',
  FOCUSED: 'focused',    // 食指选中了一张牌，等待捏合确认
  HOLDING: 'holding',    // 捏住卡牌中，等待松开拇指食指
  RELEASED: 'released',  // 松开了，卡牌飞入方框，等待张开手掌继续
  SELECTING: 'selecting', // 释放动画过渡中
  RESULT: 'result',
};

class App {
  constructor() {
    this.state = STATE.IDLE;
    this.collectedCards = [];
    this.gestureEngine = new GestureEngine();
    this.particles = null;
    this.spellEffect = null;
    this.carousel = null;
    this.userQuestion = ''; // 用户提的问题
    this.userTheme = '今日运势'; // 用户选择的占卜主题

    // DOM
    this.els = {};
    this._questionReady = false; // 是否已完成提问
    /** 分享文件名用：文档能量组合 key（如 ABE） */
    this._lastTypesKey = '---';
    this._tarotShareSaveBound = false;
  }

  async boot() {
    this._cacheDom();
    this._initEffects();
    this._initStarfield();
    this._bindUI();
    this._initPlatform();

    if (window.tarotMode === 'mouse') {
      // 鼠标模式：跳过摄像头和手势
      // 隐藏摄像头预览小窗
      const cpw = document.getElementById('cam-preview-wrap');
      if (cpw) cpw.style.display = 'none';
      // 显示问题面板，等用户选完主题再创建 carousel
      this._hideLoading();
      // 等 500ms 后再绑定按鈕（_hideLoading 是异步的）
      const self = this;
      setTimeout(() => {
        const btn = document.getElementById('btn-silent-start');
        if (!btn) return;
        btn.addEventListener('click', function() {
          // 隐藏问题面板
          const qp = document.getElementById('question-panel');
          if (qp) { qp.style.opacity='0'; setTimeout(()=>{ qp.style.display='none'; },400); }
          // 创建 carousel
          self.carousel = new CardCarousel();
          self.carousel.create();
          self.carousel.onSnap = () => {
            if (self.state === STATE.SUMMONED && self.collectedCards.length > 0) self._skipCollected();
          };
          // 召唤牌阵 + 直接展开（鼠标版无需等待手势）
          self._summonCards();
          setTimeout(() => { self._spreadCards(); }, 300);
          // 绑定鼠标事件
          self._bindMouseEvents();
        }, { once: true });
      }, 600);
      return;
    }

    // 与小樱一致：先 await 摄像头 + 手势，再进入主界面（避免 boot 末尾 fire-and-forget 丢掉用户手势）
    await this._initCameraAndGesture();

    this._hideLoading();

    this.carousel = new CardCarousel();
    this.carousel.create();

    this.carousel.onSnap = () => {
      if (this.state === STATE.SUMMONED && this.collectedCards.length > 0) {
        this._skipCollected();
      }
    };
  }

  /**
   * 后台异步初始化摄像头 + 手势引擎
   */
  async _initCameraAndGesture() {
    try {
      await this._initCamera();
    } catch (e) {
      console.error('摄像头初始化失败:', e);
      this._showGlobalError('摄像头无法开启，请允许权限或检查设备。');
    }
    try {
      await this._initGesture();
    } catch (e) {
      console.error('手势引擎初始化失败:', e);
      this._showGlobalError('手势模型初始化失败：' + (e.message || String(e)));
    }
  }

  _showGlobalError(msg) {
    var old = document.getElementById('cygame-tarot-global-error');
    if (old) old.remove();
    const errDiv = document.createElement('div');
    errDiv.id = 'cygame-tarot-global-error';
    errDiv.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(255,50,50,0.8);color:white;padding:12px 24px;border-radius:8px;z-index:9999;font-size:14px;pointer-events:none;';
    errDiv.innerHTML = '⚠️ <strong>占卜仪式异常</strong><br>' + msg;
    document.body.appendChild(errDiv);
  }

  _showCameraError(detail) {
    // 在手势提示区域显示醒目的摄像头错误
    const hint = this.els.gestureHint;
    if (hint) {
      hint.classList.remove('hidden');
      hint.innerHTML = '';
      const icon = document.createElement('div');
      icon.className = 'hint-icon';
      icon.textContent = '📷';
      const text = document.createElement('div');
      text.className = 'hint-text';
      text.style.cssText = 'color: #ff6b6b; font-size: 14px;';
      text.textContent = detail;
      hint.appendChild(icon);
      hint.appendChild(text);
    }
    // 同时在页面顶部加一个带重试按钮的提示条
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;right:0;padding:14px 20px;background:rgba(180,40,40,0.92);color:white;z-index:10000;text-align:center;font-size:14px;display:flex;align-items:center;justify-content:center;gap:16px;';
    bar.id = 'cygame-tarot-camera-error-bar';
    const span = document.createElement('span');
    span.textContent = '📷 摄像头未开启：' + detail;
    bar.appendChild(span);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '🔄 刷新页面';
    btn.style.cssText = 'padding:8px 18px;border:1px solid rgba(255,255,255,0.5);background:rgba(255,255,255,0.15);color:white;border-radius:6px;cursor:pointer;font-size:13px;';
    btn.onclick = () => location.reload();
    bar.appendChild(btn);
    const grantBtn = document.createElement('button');
    grantBtn.type = 'button';
    grantBtn.textContent = '点此申请摄像头';
    grantBtn.style.cssText =
      'padding:8px 18px;border:1px solid rgba(255,215,0,0.65);background:rgba(255,215,0,0.2);color:#ffd700;border-radius:6px;cursor:pointer;font-size:13px;font-weight:700;';
    var self = this;
    grantBtn.onclick = function () {
      void self._retryOpenCameraAfterUserTap();
    };
    bar.appendChild(grantBtn);
    document.body.appendChild(bar);
  }

  /**
   * 在用户点击回调内重新 getUserMedia（Chrome/Android 丢激活后唯一可靠路径）
   */
  async _retryOpenCameraAfterUserTap() {
    try {
      var stream = await navigator.mediaDevices.getUserMedia({
        video: cygameTarotVideoConstraints(),
        audio: false,
      });
      this.els.camera.srcObject = stream;
      await new Promise((resolve) => {
        this.els.camera.onloadedmetadata = resolve;
      });
      await this.els.camera.play();
      var bar = document.getElementById('cygame-tarot-camera-error-bar');
      if (bar) bar.remove();
      var gerr = document.getElementById('cygame-tarot-global-error');
      if (gerr) gerr.remove();
      var hint = this.els.gestureHint;
      if (hint) {
        hint.innerHTML = '';
        hint.classList.add('hidden');
      }
      try {
        window.parent.postMessage({ type: 'cygame-camera-granted' }, '*');
      } catch (_) {}
      if (this.gestureEngine && !this.gestureEngine.running) {
        this.gestureEngine.start();
      }
    } catch (e) {
      console.error(e);
      var msg = (e && e.message) || String(e);
      window.alert('仍无法打开摄像头：' + msg + '\n请检查系统设置中的相机权限，或关闭其他占用摄像头的应用。');
    }
  }

  _cacheDom() {
    this.els = {
      app: document.getElementById('app'),
      loading: document.getElementById('loading-screen'),
      loadingStatus: document.getElementById('loading-status'),
      camera: document.getElementById('camera'),
      cameraOverlay: document.getElementById('camera-overlay'),
      questionPanel: document.getElementById('question-panel'),
      gestureHint: document.getElementById('gesture-hint'),
      hintIcon: document.querySelector('#gesture-hint .hint-icon'),
      hintText: document.querySelector('#gesture-hint .hint-text'),
      stateBadge: document.getElementById('state-badge'),
      platform3d: document.getElementById('platform-3d'),
      carouselStage: document.getElementById('carousel-stage'),
      carousel: document.getElementById('carousel'),
      selectedView: document.getElementById('card-selected-view'),
      selectedFlipper: document.getElementById('selected-card-flipper'),
      selectedFront: document.getElementById('selected-card-front'),
      selectedCardName: document.getElementById('selected-card-name'),
      selectedGlow: document.getElementById('selected-glow'),
      releaseHint: document.getElementById('release-hint'),
      tarotCollection: document.getElementById('tarot-collection'),
      resultView: document.getElementById('tarot-result-view'),
      resultCards: document.getElementById('result-cards'),
      resultShowcase: document.getElementById('result-showcase'),
      fxCanvas: document.getElementById('fx-canvas'),
      particleCanvas: document.getElementById('particle-canvas'),
      starfieldCanvas: document.getElementById('starfield-canvas'),
      debugPanel: document.getElementById('debug-panel'),
      debugCanvas: document.getElementById('debug-canvas'),
      dbgGesture: document.getElementById('dbg-gesture'),
      dbgState: document.getElementById('dbg-state'),
      dbgHands: document.getElementById('dbg-hands'),
      dbgFps: document.getElementById('dbg-fps'),
      dbgConfidence: document.getElementById('dbg-confidence'),
    };
  }

  _initEffects() {
    this.particles = new ParticleSystem(this.els.particleCanvas);
    this.spellEffect = new SpellEffect(this.els.fxCanvas);
  }

  _initStarfield() {
    if (cygameTarotIsVivoStyleBrowser()) return;
    if (this.els.starfieldCanvas) {
      this.starfield = new Starfield(this.els.starfieldCanvas);
    }
  }

  _initPlatform() {
    // 初始化底盘符文点
    if (typeof initPlatformRunes === 'function') {
      initPlatformRunes();
    }
  }

  _bindUI() {
    document.getElementById('btn-debug').addEventListener('click', () => {
      this.els.debugPanel.classList.toggle('hidden');
    });
    document.getElementById('debug-close').addEventListener('click', () => {
      this.els.debugPanel.classList.add('hidden');
    });
    document.getElementById('btn-mirror').addEventListener('click', () => {
      this.gestureEngine.mirrored = !this.gestureEngine.mirrored;
    });
    document.getElementById('btn-restart-reading').addEventListener('click', () => {
      this._resetAll();
    });
    this._bindTarotSaveShare();

    // 提问面板 — 默念开始按钮（click + touchend 双保险）
    const silentBtn = document.getElementById('btn-silent-start');
    if (silentBtn) {
      const handler = (e) => {
        e.preventDefault();
        this._startAfterQuestion();
      };
      silentBtn.addEventListener('click', handler);
      silentBtn.addEventListener('touchend', handler);
    }

    // 主题选择按鈕
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.userTheme = btn.dataset.theme || '今日运势';
      });
    });
  }

  /**
   * 提问完毕，隐藏面板，显示手势提示 + badge + 收集区
   */
  _startAfterQuestion() {
    this.userQuestion = '';
    this._questionReady = true;

    // 淡出提问面板
    const qp = document.getElementById('question-panel');
    if (qp) {
      qp.style.transition = 'opacity 0.4s ease';
      qp.style.opacity = '0';
      qp.style.pointerEvents = 'none';
      setTimeout(() => { qp.style.display = 'none'; }, 400);
    }

    // 显示手势提示
    this.els.gestureHint.classList.remove('hidden');
    this.els.gestureHint.style.display = '';
    this.els.gestureHint.style.opacity = '1';
    this.els.gestureHint.style.pointerEvents = '';

    // 显示状态标签和收集区
    this.els.stateBadge.classList.remove('hidden');
    this.els.stateBadge.style.display = '';
    this.els.stateBadge.style.opacity = '1';
    this.els.tarotCollection.classList.remove('hidden');
    this.els.tarotCollection.style.display = '';
    this.els.tarotCollection.style.opacity = '1';
    this.els.tarotCollection.style.pointerEvents = '';
  }

  async _initCamera() {
    this._setLoading('正在开启灵视之眼…');
    try {
      var stream;
      var cameraFromPrecache = false;
      if (typeof __preCameraStream !== 'undefined' && __preCameraStream) {
        stream = __preCameraStream;
        __preCameraStream = null;
        cameraFromPrecache = true;
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          video: cygameTarotVideoConstraints(),
          audio: false,
        });
      }
      this.els.camera.srcObject = stream;
      await new Promise(resolve => { this.els.camera.onloadedmetadata = resolve; });
      await this.els.camera.play();
      this._setLoading('塔罗牌灵已就绪');
      if (!cameraFromPrecache) {
        try { window.parent.postMessage({ type: 'cygame-camera-granted' }, '*'); } catch (_) {}
      }
    } catch (err) {
      console.error('摄像头初始化失败:', err);
      let detail = err.message || String(err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        detail = '已拒绝摄像头权限，请在地址栏旁点击 🔒 图标允许摄像头，然后刷新页面';
        // 通知父页面摄像头被拒绝
        try { window.parent.postMessage({ type: 'cygame-camera-denied' }, '*'); } catch (_) {}
      } else if (!window.isSecureContext) {
        detail = '当前不是安全来源，请用本地服务器打开（如 http://127.0.0.1:8765），勿用 file://';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        detail = '未检测到摄像头设备';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        detail = '摄像头可能被占用或暂时无法启动，请关闭其他使用摄像头的应用后，点下方「点此申请摄像头」重试';
      }
      this._showCameraError(detail);
      throw err; // 向上抛出，阻止手势引擎在无摄像头时初始化
    }
  }

  async _initGesture() {
    this._setLoading('正在加载手势模型…（首次约 8MB，请稍候）');
    var ua = navigator.userAgent || '';
    var android = /Android/i.test(ua);
    var vivoStyle = cygameTarotIsVivoStyleBrowser();
    await this.gestureEngine.init(this.els.camera, {
      onStatus: (msg) => this._setLoading(msg),
      numHands: 1,
      // Vivo/内置浏览器：推理更疏 + 轮询更慢，优先保证环转动跟手
      inferStride: vivoStyle ? 5 : (android ? 4 : 2),
      pollIntervalMs: vivoStyle ? 36 : 16,
    });
    this.gestureEngine.onGesture = (gesture, landmarks) => {
      this._handleGesture(gesture, landmarks);
    };
    this.gestureEngine.onHandUpdate = (results) => {
      this._drawDebug(results);
      this._drawCamPreview(results);
    };
    this.gestureEngine.start();
    // 摄像头就绪后显示预览小窗
    var wrap = document.getElementById('cam-preview-wrap');
    if (wrap) wrap.style.display = 'flex';
    this._setLoading('牌灵已就绪，准备开始占卜');
  }

  _setLoading(text) {
    this.els.loadingStatus.textContent = text;
  }

  _hideLoading() {
    const self = this;
    this.els.loading.style.transition = 'opacity 0.5s';
    this.els.loading.style.opacity = '0';
    setTimeout(() => {
      self.els.loading.style.display = 'none';
      // 显示 app 背景（星空等）
      self.els.app.classList.remove('hidden');
      self.els.app.style.display = '';
      // 显示提问面板（它在 #app 外面，独立控制）
      const qp = document.getElementById('question-panel');
      if (qp) {
        qp.classList.remove('hidden');
        qp.style.display = '';
        qp.style.opacity = '1';
        qp.style.pointerEvents = 'auto';
      }
    }, 500);
  }

  /** 食指指尖落在屏幕上的位置 → 命中环上第几张牌（-1 表示未命中） */
  _pickRingFromLandmarks(hand) {
    if (!hand || !hand[8] || !this.els.camera) return -1;
    const p = hand[8];
    const pt = tarotVideoPointToClient(this.els.camera, p.x, p.y, this.gestureEngine.mirrored);
    return this.carousel.hitTestScreen(pt.x, pt.y);
  }

  // ===== 核心状态机 =====

  _handleGesture(gesture, landmarks) {
    switch (this.state) {

      case STATE.IDLE:
        if (gesture === GESTURE.FIST && this._questionReady) {
          this._summonCards();
        }
        break;

      case STATE.SUMMONED:
        if (gesture === GESTURE.SWIPE_CONTINUOUS) {
          // 连续滑动 — 丝滑（降低灵敏度，避免太快）
          const delta = this.gestureEngine.getSwipeDelta();
          // delta 映射到角速度 (正数向右) — 系数从150降到50
          this.carousel.addVelocity(delta * 50);
        } else if (gesture === GESTURE.OPEN_PALM && !this._cardsSpread) {
          // 张开手掌展开牌阵
          this._spreadCards();
        } else if (gesture === GESTURE.POINT && this._cardsSpread) {
          const ring = this._pickRingFromLandmarks(landmarks);
          if (ring >= 0) {
            this.carousel.stopPhysics();
            this.carousel.snapToRingSlot(ring);
            this._focusCard();
          }
        }
        break;

      case STATE.FOCUSED:
        // 已选中一张牌，等待捏合确认
        if (gesture === GESTURE.PINCH) {
          // 捏合 — 确认选中，翻转展示
          this._holdCard();
        } else if (gesture === GESTURE.OPEN_PALM || gesture === GESTURE.SWIPE_CONTINUOUS) {
          // 张开手掌或滑动 — 取消选中，回到浏览
          this._unfocusCard();
          if (gesture === GESTURE.SWIPE_CONTINUOUS) {
            const delta2 = this.gestureEngine.getSwipeDelta();
            this.carousel.addVelocity(delta2 * 50);
          }
        }
        // 锁定期间不再响应 POINT：每帧指尖抖动会让 hitTest 在相邻环位间跳变，导致 snap + 当前牌不断切换
        break;

      case STATE.HOLDING:
        // 只有拇指食指彻底松开才释放卡牌
        if (gesture === GESTURE.PINCH_RELEASE) {
          this._releaseCard();
        }
        break;

      case STATE.RELEASED:
        // 卡牌已飞入方框，必须张开手掌才能继续抽下一张
        if (gesture === GESTURE.OPEN_PALM) {
          this._continueAfterRelease();
        }
        break;

      case STATE.SELECTING:
        // 动画过渡中，不响应
        break;

      case STATE.RESULT:
        // 结果页不响应手势，仅通过鼠标按钮控制
        break;
    }
  }

  // ===== 交互动作 =====

  /**
   * 召唤卡牌：显示底盘 + 旋转木马（叠牌状态）
   * 注意：不再显示中间魔法阵
   */
  _summonCards() {
    this.state = STATE.SUMMONED;
    this._cardsSpread = false;

    // 显示3D底盘
    this.els.platform3d.classList.remove('hidden');

    // 显示旋转木马（叠放状态）
    this.els.carouselStage.classList.remove('hidden');
    this.carousel.create(); // 重新创建为叠放状态
    
    this.particles.emitSummon('#d4af37', 15);

    this._updateHint('🖐️', '张开手掌展开牌阵');
    this._updateBadge('牌堆已就绪');
  }

  /**
   * 张开手掌 — 展开牌阵
   */
  _spreadCards() {
    this._cardsSpread = true;
    this.carousel.spreadOut();
    this.particles.emitSummon('#d4af37', 12);

    // 牌阵展开时批量预加载所有牌正面图，结果页显示更快
    if (window.TAROT_CARDS && !this._preloaded) {
      this._preloaded = true;
      const taken = new Set(this.collectedCards.map(c => c.id));
      window.TAROT_CARDS.forEach(card => {
        if (!taken.has(card.id)) {
          const img = new Image();
          img.src = card.image;
        }
      });
    }

    const round = this.collectedCards.length + 1;
    this._updateHint('🖐️', `左右滑动浏览 · ☝️ 食指选定 (第${round}/3张)`);
    this._updateBadge('感知牌阵');
  }

  /**
   * 食指选中 — 进入 FOCUSED 状态，高亮当前牌
   * 注意：已收集的牌不会出现在正面位置（由 _skipCollected 保证）
   */
  _focusCard() {
    const taken = new Set(this.collectedCards.map(c => c.id));
    let card = this.carousel.getCurrentCard();
    if (taken.has(card.id)) {
      this.carousel.rotateUntilIdNotIn(taken);
      card = this.carousel.getCurrentCard();
    }

    this.state = STATE.FOCUSED;
    this._focusedCard = card;

    // 立刻停止旋转木马惯性，防止捏合前木马漂移导致抓错牌
    this.carousel.stopPhysics();

    // 旋转木马高亮选中牌
    this.carousel.setFocused(true);

    // 小粒子反馈
    this.particles.emitSummon(card.color || '#d4af37', 12);

    const round = this.collectedCards.length + 1;
    this._updateHint('', `已锁定 · 🤏捏合确认翻牌 (第${round}/3张)`);
    this._updateBadge('已选中');
  }

  /**
   * 取消选中 — 回到 SUMMONED 继续浏览
   */
  _unfocusCard() {
    this.state = STATE.SUMMONED;
    this._focusedCard = null;

    // 取消旋转木马高亮
    this.carousel.setFocused(false);

    const round = this.collectedCards.length + 1;
    this._updateHint('🖐️', `左右滑动浏览 · ☝️ 食指选定 (第${round}/3张)`);
    this._updateBadge('感知牌阵');
  }

  /**
   * 捏合确认 — 进入 HOLDING 状态，展示翻转
   */
  _holdCard() {
    this.carousel.stopPhysics();
    const taken = new Set(this.collectedCards.map(c => c.id));
    // 使用 FOCUSED 锁定的牌；以环上 data-logical-index 为准的 getCurrentCard 与画面一致
    let card = this._focusedCard || this.carousel.getCurrentCard();
    if (taken.has(card.id)) {
      this.carousel.rotateUntilIdNotIn(taken);
      card = this.carousel.getCurrentCard();
    }
    if (taken.has(card.id)) {
      this.state = STATE.SUMMONED;
      this._holdingCard = null;
      this._focusedCard = null;
      this.carousel.setFocused(false);
      this.els.carouselStage.classList.remove('hidden');
      const round = this.collectedCards.length + 1;
      this._updateHint('🖐️', `该牌已抽过，请换一张 · 左右滑动 · ☝️ 食指选定 (第${round}/3张)`);
      this._updateBadge('请换牌');
      return;
    }

    this.state = STATE.HOLDING;
    this._holdingCard = card;
    this._focusedCard = null;

    // 取消旋转木马高亮
    this.carousel.setFocused(false);

    // 隐藏旋转木马
    this.els.carouselStage.classList.add('hidden');

    // 隐藏底部提示和收集区域，避免遮挡卡牌名字
    this.els.gestureHint.style.opacity = '0';
    this.els.gestureHint.style.pointerEvents = 'none';
    this.els.tarotCollection.style.opacity = '0';
    this.els.tarotCollection.style.pointerEvents = 'none';

    // 显示选中视图（先展示背面）
    this.els.selectedView.classList.remove('hidden');
    this.els.selectedFlipper.classList.remove('flipped');
    this.els.selectedCardName.classList.remove('show');
    this.els.releaseHint.style.display = 'none';

    // 翻牌展示的背面也使用随机图片
    const backImg = document.querySelector('#selected-card-back .selected-back-img');
    if (backImg) {
      const randomBack = CARD_BACK_IMAGES[Math.floor(Math.random() * CARD_BACK_IMAGES.length)];
      backImg.src = randomBack;
    }

    // 重置翻转特效
    const flipBurst = document.getElementById('flip-burst');
    const flipRing = document.getElementById('flip-ring');
    if (flipBurst) { flipBurst.classList.remove('active'); flipBurst.style.background = ''; }
    if (flipRing) flipRing.classList.remove('active');

    // 设置正面内容 — 使用图片
    this.els.selectedFront.style.borderColor = card.color;
    this.els.selectedFront.style.boxShadow = `0 0 40px ${card.color}40, 0 20px 60px rgba(0,0,0,0.8)`;
    this.els.selectedFront.innerHTML = `
      <img src="${card.image}" alt="${card.name}" style="width:100%; height:100%; object-fit:cover; display:block; border-radius:7px;">
    `;

    this.els.selectedGlow.style.background = `radial-gradient(ellipse, ${card.color}20 0%, transparent 60%)`;
    this.els.selectedCardName.textContent = `${card.name} · ${card.nameEn}`;
    // 不再用卡牌颜色设置名字，使用 CSS 默认淡白色

    var flipLite = typeof document !== 'undefined' && document.documentElement.classList.contains('perf-flip-lite');
    var vivoStyle = cygameTarotIsVivoStyleBrowser();
    this.particles.emitSummon(card.color, vivoStyle ? 8 : 12);

    // 延迟翻转 — 手机端缩短等待、减粒子与法术层；Vivo 系内置浏览器再收紧
    var preFlipMs = vivoStyle ? 180 : (flipLite ? 220 : 500);
    var nameDelayMs = vivoStyle ? 380 : (flipLite ? 420 : 800);
    setTimeout(() => {
      this.els.selectedFlipper.classList.add('flipped');

      if (flipBurst) {
        flipBurst.style.background = `radial-gradient(circle, ${card.color}60 0%, ${card.color}20 40%, transparent 70%)`;
        flipBurst.classList.add('active');
      }
      if (flipRing) {
        flipRing.style.borderColor = card.color;
        flipRing.style.boxShadow = `0 0 30px ${card.color}80`;
        flipRing.classList.add('active');
      }

      this.particles.emitSpellBurst(card.color, vivoStyle ? 10 : 20);
      this.spellEffect.play(card, vivoStyle ? 2000 : 3000);

      setTimeout(() => {
        this.els.selectedCardName.classList.add('show');
        this.els.releaseHint.style.display = 'none';
      }, nameDelayMs);
    }, preFlipMs);

    this._updateHint('', '');
    this._updateBadge('揭示真相');
  }

  /**
   * 松手释放 — 卡牌飞入槽位
   */
  _releaseCard() {
    if (!this._holdingCard) return;
    const card = this._holdingCard;
    const currentSlot = this.collectedCards.length + 1; // 即将收入的是第几张
    this.state = STATE.SELECTING;

    // 恢复提示和收集区显示
    this.els.gestureHint.style.opacity = '1';
    this.els.gestureHint.style.pointerEvents = '';
    this.els.tarotCollection.style.opacity = '1';
    this.els.tarotCollection.style.pointerEvents = '';

    this._updateHint('✨', `${card.name} 已记录`);
    this._updateBadge(`第${currentSlot}张已就位`);

    // 延迟一点播放收集动画
    setTimeout(() => {
      this._collectCard(card);
    }, 600);
  }

  /**
   * 收入槽位
   */
  _collectCard(card) {
    if (this.collectedCards.some(c => c.id === card.id)) {
      console.warn('tarot: blocked duplicate collect', card.id);
      return;
    }
    const slotIndex = this.collectedCards.length;
    this.collectedCards.push(card);

    // 预加载当前牌正面图（结果页用）
    const preImg = new Image();
    preImg.src = card.image;

    // 更新 UI 槽位
    const slotEl = document.getElementById(`slot-${slotIndex}`);
    slotEl.classList.add('filled');
    slotEl.querySelector('.slot-content').innerHTML = `<img src="${card.image}" alt="${card.name}" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">`;
    slotEl.style.borderColor = 'rgba(255, 255, 255, 0.25)';
    slotEl.style.boxShadow = `0 0 10px ${card.color}20`;

    // 隐藏选定视图
    this.els.selectedView.classList.add('hidden');
    this._holdingCard = null;

    // 检查是否抽满 3 张
    if (this.collectedCards.length >= 3) {
      // 延迟1秒让用户看到三张牌都收集完，再出解读
      setTimeout(() => this._showResult(), 1000);
    } else {
      // 进入 RELEASED 状态，等待用户张开手掌
      const remaining = 3 - this.collectedCards.length;
      this.state = STATE.RELEASED;
      this._updateHint('🖐️', `张开手掌抽取第${this.collectedCards.length + 1}张`);
      this._updateBadge(`还剩${remaining}张`);
      // 鼠标版：无需手势，自动继续
      if (window.tarotMode === 'mouse') {
        setTimeout(() => { this._continueAfterRelease(); }, 800);
      }
    }
  }

  /**
   * 张开手掌后继续回到旋转木马
   */
  _continueAfterRelease() {
    this._backToCarousel();
  }

  /** 结果页为静态 UI：停星空、清粒子、停法术层，减轻安卓卡顿 */
  _pauseAmbientForResult() {
    if (this.spellEffect) this.spellEffect.stop();
    if (this.particles) this.particles.clear();
    if (this.starfield) this.starfield.pause();
  }

  _resumeAmbientFromResult() {
    if (this.starfield) this.starfield.resume();
  }

  /**
   * 显示占卜结果（金句+解读：文档能量表；保存分享 DOM 同步更新）
   */
  _showResult() {
    this._pauseAmbientForResult();

    // 鼠标版：移除 wheel 监听，恢复页面滚动
    if (window.tarotMode === 'mouse' && this._wheelHandler) {
      document.querySelector('#tarot-app')?.removeEventListener('wheel', this._wheelHandler);
      document.body.style.overflow = '';
    }

    this.state = STATE.RESULT;
    this.els.platform3d.classList.add('hidden');
    this.els.carouselStage.classList.add('hidden');

    // 隐藏手势提示和顶部收集区（结果页有自己的展示）
    this.els.gestureHint.style.opacity = '0';
    this.els.gestureHint.style.pointerEvents = 'none';
    this.els.tarotCollection.style.opacity = '0';
    this.els.tarotCollection.style.pointerEvents = 'none';
    this.els.stateBadge.style.opacity = '0';

    var doc =
      typeof window.generateTarotReading === 'function'
        ? window.generateTarotReading(this.collectedCards, this.userTheme || '今日运势')
        : (typeof getTarotDocQuoteAndReading === 'function'
          ? getTarotDocQuoteAndReading(this.collectedCards)
          : null);
    this._lastTypesKey = doc && doc.typesKey ? doc.typesKey : '---';
    var quoteText =
      doc && doc.quote ? doc.quote : '「解读数据未加载，请刷新页面重试。」';
    var readingText = doc && doc.reading ? doc.reading : '';

    var qIn = document.getElementById('result-doc-quote');
    var insightShort = document.getElementById('result-doc-insight-short');
    var insightFull  = document.getElementById('result-doc-insight-full');
    if (qIn) {
      qIn.textContent = quoteText;
      qIn.setAttribute('title', quoteText);
    }

    // 简短版：留空，由 renderTravelRecommend 填充融合文案
    if (insightShort) insightShort.innerHTML = '';
    // 完整版：保留详细塔罗解读
    if (insightFull) insightFull.innerHTML = readingText;

    // 展开按鈕交互
    var expandBtn = document.getElementById('btn-insight-expand');
    if (expandBtn) {
      expandBtn.onclick = function() {
        var full = document.getElementById('result-doc-insight-full');
        var short = document.getElementById('result-doc-insight-short');
        if (full.classList.contains('hidden')) {
          full.classList.remove('hidden');
          short.classList.add('hidden');
          expandBtn.textContent = '收起详细解读 ↑';
        } else {
          full.classList.add('hidden');
          short.classList.remove('hidden');
          expandBtn.textContent = '查看完整解读 ↓';
        }
      };
    }

    // 三张牌居中大图
    this.els.resultShowcase.innerHTML = '';
    if (this.userQuestion) {
      this.els.resultShowcase.innerHTML += `<div class="showcase-question">「${this.userQuestion}」</div>`;
    }
    const showcaseRow = document.createElement('div');
    showcaseRow.className = 'showcase-row';
    const posLabels = ['过去', '现在', '未来'];
    this.collectedCards.forEach((card, i) => {
      const reversedTag = card.reversed ? '<span class="showcase-reversed">逆位</span>' : '';
      showcaseRow.innerHTML += `
        <div class="showcase-card" style="animation-delay: ${i * 0.2}s">
          <div class="showcase-label">${posLabels[i]}</div>
          <img src="${card.image}" alt="${card.name}" style="${card.reversed ? 'transform:rotate(180deg)' : ''}">
          <div class="showcase-name">${card.name}${reversedTag}</div>
        </div>
      `;
    });
    this.els.resultShowcase.appendChild(showcaseRow);

    this._fillTarotShareDom(this.collectedCards, quoteText, readingText);

    this.els.resultView.classList.remove('hidden');
    // 结果页显示时隐藏预览小窗
    var _pw = document.getElementById('cam-preview-wrap');
    if (_pw) _pw.style.display = 'none';

    this.particles.emitSpellBurst('#d4af37', 20);

    // 命运旅途推荐
    if (typeof window.renderTravelRecommend === 'function') {
      setTimeout(() => {
        window.renderTravelRecommend(this.collectedCards, this.userTheme || '今日运势');
      }, 300);
    }
  }

  /**
   * 离屏 #share-card：与小樱 result.html 结构一致，供 sakuraExportShareToDataUrl 截图
   */
  _fillTarotShareDom(cards, quoteText, readingText) {
    var row = document.getElementById('tarot-share-cards-row');
    if (!row) return;
    var labs = ['过 去', '现 在', '未 来'];
    row.innerHTML = '';
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      var d = document.createElement('div');
      d.className = 'sc-mini';
      d.innerHTML =
        '<div class="lbl">' +
        labs[i] +
        '</div><div class="imgw"><img src="' +
        c.image +
        '" alt="" loading="eager" decoding="async" /></div><div class="nm">' +
        c.name +
        '</div>';
      row.appendChild(d);
    }
    var qEl = document.getElementById('tarot-share-sc-quote');
    var bEl = document.getElementById('tarot-share-sc-body');
    if (qEl) {
      qEl.textContent = quoteText;
      qEl.setAttribute('title', quoteText);
    }
    if (bEl) bEl.textContent = readingText;
  }

  _bindTarotSaveShare() {
    if (this._tarotShareSaveBound) return;
    var btn = document.getElementById('btn-tarot-save-share');
    if (!btn) return;
    this._tarotShareSaveBound = true;
    var self = this;
    btn.addEventListener('click', function () {
      void self._onTarotSaveShareClick();
    });
  }

  _tarotIsMobileShareDevice() {
    var ua = navigator.userAgent || '';
    if (/iPhone|iPod|Android/i.test(ua)) return true;
    if (/iPad/i.test(ua)) return true;
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
    return false;
  }

  /**
   * 保存分享：流程对齐 games/sakura/result.html（已线上验证）
   */
  async _onTarotSaveShareClick() {
    var btn = document.getElementById('btn-tarot-save-share');
    if (!btn) return;
    if (!window.sakuraExportShareToDataUrl) {
      alert('分享组件未加载，请刷新重试');
      return;
    }
    if (!window.html2canvas && !(window.htmlToImage && window.htmlToImage.toPng)) {
      alert('未加载 html2canvas / html-to-image');
      return;
    }
    var shareEl = document.getElementById('share-card');
    if (!shareEl) return;

    var old = '保存分享';
    btn.disabled = true;
    btn.textContent = '生成中…';
    try {
      var url = await window.sakuraExportShareToDataUrl(shareEl);
      var ids = this.collectedCards.map(function (c) {
        return c.id;
      }).join('-');
      var fileName = 'tarot-' + ids + '-' + (this._lastTypesKey || 'XXX') + '-share.png';

      if (this._tarotIsMobileShareDevice() && typeof window.sakuraPresentShareImageForAlbum === 'function') {
        var mob = await window.sakuraPresentShareImageForAlbum(url, fileName);
        if (!mob.ok) {
          btn.textContent = mob.method === 'aborted' ? '已取消' : '保存失败';
          setTimeout(function () {
            btn.textContent = old;
          }, mob.method === 'aborted' ? 1200 : 1800);
          return;
        }
        btn.textContent = mob.method === 'share' ? '请在分享里选「存储图像」' : '长按图片存相册';
        setTimeout(function () {
          btn.textContent = old;
        }, 2200);
        return;
      }

      var save = { ok: true, method: 'download' };
      if (typeof window.sakuraSaveShareDataUrl === 'function') {
        save = await window.sakuraSaveShareDataUrl(url, fileName);
      } else {
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      if (!save.ok) {
        btn.textContent = save.method === 'aborted' ? '已取消' : '保存失败';
        setTimeout(function () {
          btn.textContent = old;
        }, save.method === 'aborted' ? 1200 : 1800);
        return;
      }
      btn.textContent = save.method === 'picker' ? '已保存' : '已保存到下载';
      setTimeout(function () {
        btn.textContent = old;
      }, 1400);
    } catch (e) {
      console.error(e);
      btn.textContent = '失败，建议截图';
      setTimeout(function () {
        btn.textContent = old;
      }, 1600);
    } finally {
      btn.disabled = false;
    }
  }

  /**
   * 回到旋转木马继续抽牌
   */
  _backToCarousel() {
    this.state = STATE.SUMMONED;
    this._cardsSpread = true; // 回来时已展开
    this.els.carouselStage.classList.remove('hidden');
    this.carousel.stopPhysics();

    // 自动跳过已收集的牌，确保正面位置不是已抽过的牌
    this._skipCollected();

    const round = this.collectedCards.length + 1;
    this._updateHint('🖐️', `左右滑动浏览 · ☝️ 食指选定 (第${round}/3张)`);
    this._updateBadge('感知牌阵');

    this.carousel.playEnterAnimation();
  }

  /**
   * 自动跳过已收集的牌 — 如果当前正面是已抽过的牌，旋转到下一张未抽过的牌
   */
  _skipCollected() {
    const collectedIds = new Set(this.collectedCards.map(c => c.id));
    if (collectedIds.size === 0) return;
    this.carousel.rotateUntilIdNotIn(collectedIds);
  }

  /**
   * 收回全部，回到 IDLE
   */
  _resetAll() {
    this.state = STATE.IDLE;
    this.collectedCards = [];
    this._holdingCard = null;
    this._focusedCard = null;
    this._cardsSpread = false;
    this._questionReady = false;
    this.userQuestion = '';

    // 清空槽位UI
    for (let i = 0; i < 3; i++) {
      const slotEl = document.getElementById(`slot-${i}`);
      slotEl.classList.remove('filled');
      slotEl.querySelector('.slot-content').innerHTML = '';
      slotEl.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      slotEl.style.boxShadow = 'none';
    }

    // 不再操作中间魔法阵
    this.els.platform3d.classList.add('hidden');
    this.els.carouselStage.classList.add('hidden');
    this.els.resultView.classList.add('hidden');
    // 回到主界面时恢复预览小窗
    var _pw2 = document.getElementById('cam-preview-wrap');
    if (_pw2) _pw2.style.display = 'flex';
    this.els.selectedView.classList.add('hidden');

    var rq = document.getElementById('result-doc-quote');
    var ri = document.getElementById('result-doc-insight');
    if (rq) {
      rq.textContent = '';
      rq.removeAttribute('title');
    }
    if (ri) ri.textContent = '';
    var row = document.getElementById('tarot-share-cards-row');
    if (row) row.innerHTML = '';
    var sq = document.getElementById('tarot-share-sc-quote');
    var sb = document.getElementById('tarot-share-sc-body');
    if (sq) {
      sq.textContent = '';
      sq.removeAttribute('title');
    }
    if (sb) sb.textContent = '';
    this._lastTypesKey = '---';

    // 恢复所有 UI 元素显示
    this.els.gestureHint.style.opacity = '1';
    this.els.gestureHint.style.pointerEvents = '';
    this.els.gestureHint.classList.add('hidden');
    this.els.tarotCollection.style.opacity = '1';
    this.els.tarotCollection.style.pointerEvents = '';
    this.els.tarotCollection.classList.add('hidden');
    this.els.stateBadge.style.opacity = '1';
    this.els.stateBadge.classList.add('hidden');

    // 重新显示提问面板
    const qp = document.getElementById('question-panel');
    if (qp) {
      qp.style.display = '';
      qp.style.opacity = '1';
      qp.style.pointerEvents = 'auto';
      qp.classList.remove('hidden');
    }

    this._updateHint('✊', '握拳开始仪式');
    this._updateBadge('塔罗占卜');

    this._resumeAmbientFromResult();
  }

  // ===== UI =====

  _updateHint(icon, text) {
    // 鼠标模式下替换提示文字
    if (window.tarotMode === 'mouse') {
      if (text.includes('握拳')) { icon='🖱️'; text='点击鼠标版按钮开始'; }
      else if (text.includes('左右滑动') || text.includes('食指选定')) {
        const m = text.match(/第(\d+)\/3张/);
        const round = m ? m[1] : '?';
        icon='🖱️'; text=`滑动旋转牌阵 · 点击选牌 (第${round}/3张)`;
      }
      else if (text.includes('捏合确认')) {
        const m = text.match(/第(\d+)\/3张/);
        const round = m ? m[1] : '?';
        icon='👆'; text=`已锁定 · 再次点击确认翻牌 (第${round}/3张)`;
      }
      else if (text.includes('张开手掌')) { icon='🖱️'; text='拖拽旋转牌阵，点击选牌'; }
      else if (text.includes('已抽过')) {
        const m = text.match(/第(\d+)\/3张/);
        const round = m ? m[1] : '?';
        icon='⚠️'; text=`该牌已抽过，请拖拽换一张 (第${round}/3张)`;
      }
    }
    this.els.hintIcon.textContent = icon || '';
    this.els.hintIcon.style.display = icon ? '' : 'none';
    this.els.hintText.textContent = text;
  }

  _updateBadge(text) {
    this.els.stateBadge.textContent = text;
  }

  // ===== 调试面板 =====

  _drawCamPreview(results) {
    var wrap = document.getElementById('cam-preview-wrap');
    var canvas = document.getElementById('cam-preview');
    if (!canvas || !this.els.camera || this.els.camera.readyState < 2) return;
    var hasHand = results && results.landmarks && results.landmarks.length > 0;
    if (wrap) wrap.classList.toggle('hand-detected', hasHand);

    // 调整 canvas 大小匹配容器
    var W = canvas.offsetWidth || 120, H = canvas.offsetHeight || 90;
    if (canvas.width !== W) canvas.width = W;
    if (canvas.height !== H) canvas.height = H;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);

    // 画视频帧（canvas 已通过 CSS scaleX(-1) 镜像，这里正常画）
    ctx.drawImage(this.els.camera, 0, 0, W, H);

    // 画手部骨架
    if (results && results.landmarks) {
      var conns = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],
                   [0,9],[9,10],[10,11],[11,12],[0,13],[13,14],[14,15],[15,16],
                   [0,17],[17,18],[18,19],[19,20],[5,9],[9,13],[13,17]];
      for (var hand of results.landmarks) {
        // 骨架线（注意：canvas 已 CSS 镜像， x 直接用归一化坐标）
        ctx.strokeStyle = 'rgba(212,175,55,0.8)';
        ctx.lineWidth = 1.5;
        for (var c of conns) {
          var a = hand[c[0]], b = hand[c[1]];
          if (!a || !b) continue;
          ctx.beginPath();
          ctx.moveTo(a.x * W, a.y * H);
          ctx.lineTo(b.x * W, b.y * H);
          ctx.stroke();
        }
        // 关节点
        for (var lm of hand) {
          ctx.beginPath();
          ctx.arc(lm.x * W, lm.y * H, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,220,80,1)';
          ctx.shadowColor = 'rgba(255,200,0,0.8)';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    // 手势状态文字
    var gesture = this.gestureEngine && this.gestureEngine.debugData && this.gestureEngine.debugData.gesture;
    var gestureMap = {
      'FIST': '\u270a 握拳 开始占卜',
      'POINT': '\u261d️ 食指 选牌',
      'PALM': '\u270b 掌心 滑动',
      'PINCH': '\u2728 捏合 抓取',
      'NONE': '待机中…',
      '': '待机中…'
    };
    var gestureColors = {
      'FIST': '#FFD700',
      'POINT': '#60CFFF',
      'PALM': '#80FF80',
      'PINCH': '#FF80CF',
    };
    var label = gestureMap[gesture] || ('手势: ' + gesture);
    var color = gestureColors[gesture] || 'rgba(255,255,255,0.6)';
    var hint = document.getElementById('cam-preview-hint');
    if (hint) {
      hint.textContent = label;
      hint.style.color = color;
    }
  }

  _drawDebug(results) {
    if (this.els.debugPanel && this.els.debugPanel.classList.contains('hidden')) {
      return;
    }
    const ge = this.gestureEngine;
    this.els.dbgGesture.textContent = ge.debugData.gesture;
    this.els.dbgState.textContent = this.state;
    this.els.dbgHands.textContent = ge.debugData.handsCount;
    this.els.dbgFps.textContent = ge.fps;
    this.els.dbgConfidence.textContent = ge.debugData.confidence + '%';

    const canvas = this.els.debugCanvas;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.els.camera.readyState >= 2) {
      ctx.save();
      if (this.gestureEngine.mirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(this.els.camera, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    if (results.landmarks) {
      for (const hand of results.landmarks) {
        const connections = [
          [0,1],[1,2],[2,3],[3,4],
          [0,5],[5,6],[6,7],[7,8],
          [0,9],[9,10],[10,11],[11,12],
          [0,13],[13,14],[14,15],[15,16],
          [0,17],[17,18],[18,19],[19,20],
          [5,9],[9,13],[13,17],
        ];

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.lineWidth = 1;
        for (const [a, b] of connections) {
          const pa = hand[a], pb = hand[b];
          const ax = this.gestureEngine.mirrored ? (1 - pa.x) * canvas.width : pa.x * canvas.width;
          const ay = pa.y * canvas.height;
          const bx = this.gestureEngine.mirrored ? (1 - pb.x) * canvas.width : pb.x * canvas.width;
          const by = pb.y * canvas.height;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }

        for (let i = 0; i < hand.length; i++) {
          const p = hand[i];
          const x = this.gestureEngine.mirrored ? (1 - p.x) * canvas.width : p.x * canvas.width;
          const y = p.y * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = [4, 8].includes(i) ? '#ff6baf' : '#00e5ff';
          ctx.fill();
        }
      }
    }
  }

  // ===== 鼠标模式 =====

  _waitMouseStart() {
    const self = this;
    const btn = document.getElementById('btn-silent-start');
    if (!btn) { console.warn('找不到 btn-silent-start'); return; }
    btn.addEventListener('click', function() {
      const qp = document.getElementById('question-panel');
      if (qp) { qp.style.opacity = '0'; setTimeout(()=>{ qp.style.display='none'; }, 400); }
      self._summonCards();
      self._bindMouseEvents();
      const hint = document.querySelector('.welcome-hint');
      if (hint) hint.textContent = '← 拖拽旋转牌阵 · 点击选牌 →';
    }, { once: true });
  }

  _bindMouseEvents() {
    const self = this;
    const app = this.els.app;

    // 滚轮旋转牌阵（保存引用以便结果页移除）
    this._wheelHandler = function(e) {
      if (self.state === STATE.RESULT) return; // 结果页不拦截
      e.preventDefault();
      if (self.carousel && (self.state === STATE.SUMMONED || self.state === STATE.FOCUSED)) {
        // 滚轮：deltaY 纵向滚动旋转，deltaX 支持 trackpad 横向滑动
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        self.carousel.addVelocity(delta * 0.008);
      }
    };
    app.addEventListener('wheel', this._wheelHandler, { passive: false });

    // Touch 左右滑动旋转牌阵（触屏 / 触控板手势）
    let _touchStartX = 0;
    let _touchLastX = 0;
    let _touchActive = false;
    app.addEventListener('touchstart', function(e) {
      if (self.state === STATE.RESULT) return;
      _touchStartX = e.touches[0].clientX;
      _touchLastX = _touchStartX;
      _touchActive = true;
    }, { passive: true });
    app.addEventListener('touchmove', function(e) {
      if (!_touchActive) return;
      if (self.state === STATE.RESULT) return;
      const x = e.touches[0].clientX;
      const dx = _touchLastX - x; // 向左滑 dx>0 → 正向旋转
      _touchLastX = x;
      if (self.carousel && (self.state === STATE.SUMMONED || self.state === STATE.FOCUSED)) {
        self.carousel.addVelocity(dx * 0.012);
      }
    }, { passive: true });
    app.addEventListener('touchend', function() {
      _touchActive = false;
    }, { passive: true });

    // 点击选牌（结果页不拦截）
    app.addEventListener('click', function(e) {
      if (self.state === STATE.RESULT) return;
      self._handleMouseClick(e);
    });
  }

  _handleMouseClick(e) {
    if (this.state === STATE.SUMMONED) {
      // 锁定当前正面牌，然后翻牌
      this._focusCard();
      const self = this;
      setTimeout(function() {
        if (self.state === STATE.FOCUSED) self._holdCard();
      }, 200);
    } else if (this.state === STATE.HOLDING) {
      // 收牌入槽
      this._releaseCard();
    } else if (this.state === STATE.FOCUSED) {
      this._holdCard();
    }
  }
}
