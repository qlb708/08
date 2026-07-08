/* ========================================
   Bootstrap Mouse: 鼠标模式专用启动器
   完全跳过 MediaPipe，无需摄像头权限
   ======================================== */

(async () => {
  try {
    const welcomeScreen = document.getElementById('welcome-screen');
    const startBtn      = document.getElementById('btn-start-ritual');
    const loadingScreen = document.getElementById('loading-screen');

    if (!startBtn) throw new Error('找不到开始按钮 #btn-start-ritual');

    // 更新欢迎页文案
    const wh = document.querySelector('.welcome-hint');
    if (wh) wh.textContent = '🖱️ 鼠标模式 · 无需摄像头 · 点击开始';

    // 点亮按钮（无需等待 MediaPipe）
    startBtn.disabled = false;
    startBtn.style.opacity = '1';

    // 等待用户点击
    await new Promise((resolve) => {
      startBtn.addEventListener('click', resolve, { once: true });
    });

    // 淡出欢迎页，显示加载画面
    welcomeScreen.classList.add('fading-out');
    loadingScreen.classList.remove('hidden');
    loadingScreen.style.display = '';
    setTimeout(() => { welcomeScreen.style.display = 'none'; }, 800);

    // 启动 App（tarot-main.js 里 boot() 检测 window.__MS_MODE === 'mouse'
    // 会自动：跳过 _initCameraAndGesture → _hideLoading → summon+spread）
    const app = new App();
    await app.boot();

    // boot 完成后注入鼠标控制
    _injectMouseControl(app);

  } catch (err) {
    console.error('鼠标模式启动失败:', err);
    const rsb = document.getElementById('btn-start-ritual');
    if (rsb) { rsb.disabled = false; rsb.style.opacity = '1'; }
  }
})();
