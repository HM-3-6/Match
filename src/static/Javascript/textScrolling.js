    // ========== 1. 滚动渐变文字揭示 ==========
    const revealText = document.getElementById('revealText');
    const revealSection = document.querySelector('.reveal-section');

    function updateReveal() {
      const rect = revealSection.getBoundingClientRect();
      const windowH = window.innerHeight;

      // 当区块进入视口时开始计算进度
      const start = windowH * 0.85;
      const end = windowH * 0.15;
      const progress = 1 - Math.min(Math.max((rect.top - end) / (start - end), 0), 1);

      // 背景位置从 100% 移到 0%，实现从下往上揭示
      const pos = 100 - progress * 100;
      revealText.style.backgroundPosition = `0 ${pos}%`;
    }

    // ========== 2. 字母拆分动画 ==========
    const splitTitle = document.getElementById('splitTitle');
    const splitSection = document.getElementById('splitSection');

    // 把文字拆成单个字母
    function splitChars(el) {
      const text = el.textContent;
      el.innerHTML = '';
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.transitionDelay = `${i * 0.06}s`;
        el.appendChild(span);
      });
    }

    splitChars(splitTitle);

    // IntersectionObserver 触发字母动画
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          // 同时给父级加 class 控制描述文字
          if (entry.target.id === 'splitTitle') {
            splitSection.classList.add('in-view');
          }
        }
      });
    }, { threshold: 0.4 });

    observer.observe(splitTitle);

    // 监听滚动
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateReveal();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // 初始化一次
    updateReveal();