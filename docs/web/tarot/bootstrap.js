/* bootstrap - 支持手势版 + 鼠标版双入口 */
const statusEl = document.getElementById('loading-status');
function setStatus(t) { if(statusEl) statusEl.textContent=t; }

const CDN_SOURCES=[
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/vision_bundle.mjs',
  'https://unpkg.com/@mediapipe/tasks-vision@0.10.18/vision_bundle.mjs'
];
const WASM_SOURCES=[
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm',
  'https://unpkg.com/@mediapipe/tasks-vision@0.10.18/wasm'
];

function importWithTimeout(url,ms=25000){return Promise.race([import(url),new Promise((_,r)=>setTimeout(()=>r(new Error('超时')),ms))]);}

async function loadMediaPipe(){
  for(let i=0;i<CDN_SOURCES.length;i++){
    try{
      setStatus('正在加载手势模型…('+(i+1)+'/'+CDN_SOURCES.length+')');
      const m=await importWithTimeout(CDN_SOURCES[i]);
      window._wasmBasePath=WASM_SOURCES[i];
      return m;
    }catch(e){console.warn('CDN失败:',e.message);}
  }
  return null; // 失败时降级，不抛错
}

async function waitApp(ms=15000){
  let w=0;
  while(typeof App==='undefined'&&w<ms){await new Promise(r=>setTimeout(r,100));w+=100;}
  return typeof App!=='undefined';
}

function showLoading(ws){
  ws.classList.add('fading-out');
  const ls=document.getElementById('loading-screen');
  if(ls){ls.classList.remove('hidden');ls.style.display='';}
  setTimeout(()=>{ws.style.display='none';},800);
}

(async()=>{
  try{
    const ws=document.getElementById('welcome-screen');
    const gestureBtn=document.getElementById('btn-start-ritual');
    const mouseBtn=document.getElementById('btn-start-mouse');

    if(!gestureBtn) throw new Error('找不到开始按钮');

    // 等用户点击任意一个按钮
    const chosenMode = await new Promise(r=>{
      gestureBtn.addEventListener('click',()=>r('gesture'),{once:true});
      if(mouseBtn) mouseBtn.addEventListener('click',()=>r('mouse'),{once:true});
    });

    window.tarotMode = chosenMode;
    showLoading(ws);

    // 等 App class 就绪
    const appReady = await waitApp();
    if(!appReady){ setStatus('❌ 脚本加载失败，请刷新'); return; }

    if(chosenMode === 'mouse'){
      // 鼠标版：直接跳过手势模型
      setStatus('正在启动鼠标占卜模式…');
      await new App().boot();
    } else {
      // 手势版：加载 MediaPipe
      setStatus('正在加载手势模型（首次约数MB）…');
      const mp = await loadMediaPipe();
      if(mp){
        window.FilesetResolver=mp.FilesetResolver;
        window.HandLandmarker=mp.HandLandmarker;
      } else {
        window._gestureDisabled=true;
        setStatus('手势模型不可用，以基础模式启动…');
      }
      await new App().boot();
    }

  }catch(err){
    console.error('启动失败:',err);
    setStatus('⚠️ '+err.message);
  }
})();
