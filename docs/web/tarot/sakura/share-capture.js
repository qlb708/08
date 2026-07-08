/**
 * html2canvas / html-to-image 截图辅助
 * - fetch 必须带超时，否则线上 CDN 挂起会一直停在「生成中…」
 * - 多图并行 + AbortController，避免串行阻塞
 * - 离屏容器用 translate 移出视口，避免负 z-index 不合成
 */
(function (global) {
  'use strict';

  var FETCH_MS = 6000;

  /** iOS / Chrome(iOS) / 桌面 Safari：blob→img 在截图管线里易触发 WebKitBlobResource / 卡死 */
  function skipBlobForCapture() {
    var ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return true;
    if (/CriOS/i.test(ua)) return true;
    if (/Chrome|Chromium|Edg|Firefox/i.test(ua)) return false;
    return /^((?!chrome|android).)*safari/i.test(ua);
  }

  /**
   * WebKit：离屏 + 外链 PNG 时 html-to-image 首帧常采不到像素；blob: 又易触发 WebKitBlobResource。
   * 同源 fetch → data URL 内联到 img，克隆/绘制与像素同源，避免「第一次无卡图」。
   */
  async function inlineShareImagesDataUrl(containerEl) {
    var imgs = Array.from(containerEl.querySelectorAll('img'));
    if (!imgs.length) {
      return function () {};
    }

    var cleanups = [];

    await Promise.all(
      imgs.map(function (img) {
        return (async function () {
          var attr = img.getAttribute('src');
          if (!attr || attr.indexOf('data:') === 0) return;

          var previous = img.currentSrc || img.src;
          try {
            var abs = new URL(attr, window.location.href).href;
            var controller = new AbortController();
            var timer = setTimeout(function () {
              controller.abort();
            }, FETCH_MS);
            var res = await fetch(abs, {
              credentials: 'same-origin',
              mode: 'same-origin',
              cache: 'force-cache',
              signal: controller.signal,
            });
            clearTimeout(timer);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            var blob = await res.blob();
            var dataUrl = await new Promise(function (resolve, reject) {
              var fr = new FileReader();
              fr.onload = function () {
                resolve(fr.result);
              };
              fr.onerror = reject;
              fr.readAsDataURL(blob);
            });
            img.src = dataUrl;
            await new Promise(function (resolve) {
              var n = 0;
              function tryDone() {
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                  var p = img.decode && img.decode();
                  if (p && typeof p.then === 'function') {
                    return p.then(resolve).catch(resolve);
                  }
                  return resolve();
                }
                n++;
                if (n > 400) return resolve();
                requestAnimationFrame(tryDone);
              }
              img.onload = tryDone;
              img.onerror = resolve;
              tryDone();
            });
            cleanups.push(function () {
              img.src = previous;
            });
          } catch (_) {
            cleanups.push(function () {});
          }
        })();
      })
    );

    await new Promise(function (r) {
      requestAnimationFrame(function () {
        requestAnimationFrame(r);
      });
    });

    return function () {
      cleanups.forEach(function (fn) {
        try {
          fn();
        } catch (_) {}
      });
    };
  }

  async function prepareImagesForHtml2Canvas(containerEl) {
    if (skipBlobForCapture()) {
      return inlineShareImagesDataUrl(containerEl);
    }

    var imgs = Array.from(containerEl.querySelectorAll('img'));
    var cleanups = [];

    await Promise.all(
      imgs.map(function (img) {
        return (async function () {
          var attr = img.getAttribute('src');
          if (!attr || attr.indexOf('data:') === 0 || attr.indexOf('blob:') === 0) return;

          var previous = img.currentSrc || img.src;
          try {
            var abs = new URL(attr, window.location.href).href;
            var controller = new AbortController();
            var timer = setTimeout(function () {
              controller.abort();
            }, FETCH_MS);
            var res = await fetch(abs, {
              credentials: 'same-origin',
              mode: 'same-origin',
              cache: 'force-cache',
              signal: controller.signal,
            });
            clearTimeout(timer);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            var blob = await res.blob();
            var burl = URL.createObjectURL(blob);
            await new Promise(function (resolve) {
              var done = function () {
                img.onload = img.onerror = null;
                resolve();
              };
              img.onload = done;
              img.onerror = done;
              img.src = burl;
              setTimeout(done, 5000);
            });
            cleanups.push(function () {
              try {
                URL.revokeObjectURL(burl);
              } catch (_) {}
              img.src = previous;
            });
          } catch (_) {
            cleanups.push(function () {});
          }
        })();
      })
    );

    return function () {
      cleanups.forEach(function (fn) {
        try {
          fn();
        } catch (_) {}
      });
    };
  }

  function styleShareWrapperForCapture(wrapperEl) {
    if (!wrapperEl) return function () {};
    var prev = wrapperEl.style.cssText;
    // 竖直移出视口：部分引擎对 translate(-120vw) 下子图栅格化不完整，首截易空白卡
    wrapperEl.style.cssText =
      'position:fixed;left:0;top:0;width:360px;height:640px;transform:translate3d(0,calc(100vh + 32px),0);' +
      'z-index:2147483646;pointer-events:none;opacity:1;visibility:visible;overflow:visible;';
    return function () {
      wrapperEl.style.cssText = prev;
    };
  }

  global.sakuraShareCapture = {
    prepareImagesForHtml2Canvas: prepareImagesForHtml2Canvas,
    styleShareWrapperForCapture: styleShareWrapperForCapture,
  };
})(typeof window !== 'undefined' ? window : globalThis);
