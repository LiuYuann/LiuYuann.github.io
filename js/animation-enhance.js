// ===========================
// 炫酷交互效果增强
// ===========================

(function() {
  'use strict';

  // --- 1. 鼠标点击涟漪效果 ---
  document.addEventListener('click', function(e) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,180,216,0.4) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9998;
      animation: clickRipple 0.6s ease-out forwards;
    `;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  // 涟漪动画注入
  const style = document.createElement('style');
  style.textContent = `
    @keyframes clickRipple {
      0% { width: 0; height: 0; opacity: 1; }
      100% { width: 80px; height: 80px; opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // --- 2. 自动切换日夜间模式（6:00-18:00 日间，其余夜间） ---
  (function autoThemeSwitch() {
    const now = new Date();
    const hour = now.getHours();
    // 6:00 到 18:00 是白天模式，其余时间夜间模式
    const isDaytime = hour >= 6 && hour < 18;
    const theme = isDaytime ? 'light' : 'dark';

    // 给 body 添加标记
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(theme);

    // 更新 meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDaytime ? '#ffffff' : '#0d0d0d');
    }

    // 尝试调用 Butterfly 内置方法
    if (typeof theme_set !== 'undefined') {
      theme_set(theme);
    }

    // 写入 localStorage 供 Butterfly 读取
    localStorage.setItem('darkmode', JSON.stringify({
      enable: true,
      autoChangeMode: true,
      status: isDaytime ? 'light' : 'dark'
    }));

    console.log('[Theme] Auto switched to ' + theme + ' mode (hour: ' + hour + ')');
  })();

  // --- 3. 滚动渐入动画 (IntersectionObserver) ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  // 观察所有文章卡片
  document.querySelectorAll('.post, .index_card, .post_info').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // --- 4. 阅读进度百分比显示 ---
  function updateReadingProgress() {
    const winH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const progress = Math.min(Math.round((scrollTop / (docH - winH)) * 100), 100);

    // 尝试读取 Butterfly 进度条容器
    const progressBar = document.querySelector('.read_progress');
    if (progressBar) {
      progressBar.innerHTML = `<span>${progress}%</span>`;
    }
  }

  window.addEventListener('scroll', updateReadingProgress, { passive: true });

  // --- 5. 打字机效果 — 首页标语更酷炫 ---
  const subtitleEl = document.querySelector('.subtitle');
  if (subtitleEl) {
    const texts = ['AI Agent 开发者', 'LLM 应用工程师', '高通 AI 工程师', 'Python 全栈开发'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeWriter() {
      const current = texts[textIndex];

      if (isDeleting) {
        charIndex--;
        typeSpeed = 50;
      } else {
        charIndex++;
        typeSpeed = 100;
      }

      subtitleEl.textContent = current.substring(0, charIndex);

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        typeSpeed = 2000; // 暂停2秒
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
      }

      setTimeout(typeWriter, typeSpeed);
    }

    // 延迟启动
    setTimeout(typeWriter, 1000);
  }

  // --- 6. 图片懒加载淡入效果 ---
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
        imgObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-original]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    imgObserver.observe(img);
  });

  const imgStyle = document.createElement('style');
  imgStyle.textContent = `
    img.loaded {
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(imgStyle);

})();
