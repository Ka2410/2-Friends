// 2MADE — Main JS (Lenis, Nav, Mobile Menu, Preloader, Zoom & White Erase, Arc Menu, Language, Image Protection, Text Protection, About Popover, WebView Detection)

function initLenis() {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    window.lenis = lenis;
  }
}

function initFabMenu() {
  const fab = document.getElementById('fab');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!fab || !mobileMenu) return;

  fab.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const items = mobileMenu.querySelectorAll('.mobile-menu-item');
    items.forEach((item, idx) => {
      item.style.setProperty('--menu-index', idx);
    });
  });

  mobileMenu.querySelectorAll('.mobile-menu-item').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  });
}

function initPointerGlass() {
  const nav = document.querySelector('.nav-liquid');
  if (!nav) return;

  nav.addEventListener('mousemove', (e) => {
    const rect = nav.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    nav.style.setProperty('--pointer-x', `${x}px`);
    nav.style.setProperty('--pointer-y', `${y}px`);
  });
}

function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const bar = preloader.querySelector('.preloader-bar-fill');
  const percent = preloader.querySelector('.preloader-percent');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress > 100) progress = 100;
    bar.style.width = progress + '%';
    percent.textContent = Math.round(progress) + '%';

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.classList.add('loaded');
      }, 200);
    }
  }, 150);
}

function initZoomEraseAndMenu() {
  const heroBase = document.getElementById('heroBase');
  const heroBg = document.getElementById('heroBgLayer');
  const heroMohamed = document.getElementById('heroMohamedLayer');
  const heroKaram = document.getElementById('heroKaramLayer');
  const heroContainer = document.getElementById('heroImage');
  const heroSection = document.getElementById('hero');
  const arcMenus = document.querySelectorAll('.hero-arc-menu');

  const ctaLeft = document.querySelector('.hero-cta-left .cta-glass');
  const ctaRight = document.querySelector('.hero-cta-right .cta-glass');

  if (!heroBase || !heroBg || !heroMohamed || !heroKaram || !heroContainer || !heroSection) return;

  const closeAllMenus = () => {
    arcMenus.forEach(menu => menu.classList.remove('active'));
    heroSection.classList.remove('menu-open');
  };

  const resetHero = () => {
    heroBase.style.opacity = '1';
    heroBg.style.opacity = '0';
    heroMohamed.style.opacity = '0';
    heroKaram.style.opacity = '0';
    gsap.to(heroContainer, { scale: 1, duration: 0.5, ease: 'power2.out' });
    closeAllMenus();
  };

  const zoomOnPerson = (side) => {
    closeAllMenus();

    const activeLayer = side === 'left' ? heroMohamed : heroKaram;
    const inactiveLayer = side === 'left' ? heroKaram : heroMohamed;
    const transformOrigin = side === 'left' ? '25% 50%' : '75% 50%';

    gsap.to(heroBase, { opacity: 0, duration: 0.4, ease: 'power2.out' });
    gsap.to(heroBg, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.to(activeLayer, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.to(inactiveLayer, { opacity: 0, duration: 0.4, ease: 'power2.out' });

    gsap.to(heroContainer, {
      scale: 1.6,
      transformOrigin: transformOrigin,
      duration: 0.8,
      ease: 'power3.inOut'
    });

    heroSection.classList.add('menu-open');

    setTimeout(() => {
      const menu = side === 'left' ? document.getElementById('arcMenuLeft') : document.getElementById('arcMenuRight');
      if (menu) {
        menu.classList.add('active');
        const items = menu.querySelectorAll('.arc-menu-item');
        items.forEach((item, idx) => {
          item.style.transitionDelay = `${idx * 0.1}s`;
        });
      }
    }, 500);
  };

  if (ctaLeft) {
    ctaLeft.addEventListener('click', (e) => {
      e.preventDefault();
      if (ctaLeft.classList.contains('zooming')) return;
      ctaLeft.classList.add('zooming');
      zoomOnPerson('left');
      setTimeout(() => ctaLeft.classList.remove('zooming'), 1200);
    });
  }

  if (ctaRight) {
    ctaRight.addEventListener('click', (e) => {
      e.preventDefault();
      if (ctaRight.classList.contains('zooming')) return;
      ctaRight.classList.add('zooming');
      zoomOnPerson('right');
      setTimeout(() => ctaRight.classList.remove('zooming'), 1200);
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hero-arc-menu') && !e.target.closest('.hero .cta-glass')) {
      closeAllMenus();
      setTimeout(resetHero, 100);
    }
  });
}

function initAboutPopovers() {
    const triggers = document.querySelectorAll('.about-trigger');
    const popovers = document.querySelectorAll('.about-popover');
    
    const closeAllPopovers = () => {
        popovers.forEach(p => p.classList.remove('active'));
    };

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const side = trigger.dataset.target;
            const targetPopover = side === 'left' ? document.getElementById('popoverLeft') : document.getElementById('popoverRight');
            
            const isActive = targetPopover.classList.contains('active');
            closeAllPopovers();
            
            if (!isActive) {
                targetPopover.classList.add('active');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.about-popover') && !e.target.closest('.about-trigger')) {
            closeAllPopovers();
        }
    });
}

function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

function initImageProtection() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', (e) => e.preventDefault());
    img.addEventListener('contextmenu', (e) => e.preventDefault());
  });

  document.querySelectorAll('.hero-image, .p1-hero-image, .creator-card-img, .contact-card, .project-image').forEach(container => {
    container.addEventListener('contextmenu', (e) => e.preventDefault());
    container.addEventListener('dragstart', (e) => e.preventDefault());
  });
}

function initTextProtection() {
  const protectedTextElements = document.querySelectorAll(
    '.hero-title, .hero .cta-glass span, .arc-menu-item, .p1-name, .p1-title, .intro-title, .creator-card-info h3, .creator-role, .creator-desc, .about-headline, .about-text, .contact-section h2, .contact-email, .footer-logo, .footer-next, .nav-logo, .nav-contact-btn, .nav-lang-btn'
  );
  protectedTextElements.forEach(el => {
    el.addEventListener('copy', (e) => e.preventDefault());
    el.addEventListener('cut', (e) => e.preventDefault());
  });
}

// 🔴 فحص بيئة WebView / In-App Browser
function detectWebView() {
  const ua = navigator.userAgent.toLowerCase();
  const isWebView = /(instagram|facebook|whatsapp|snapchat|line|fbav|wv|inappbrowser)/.test(ua);
  
  if (isWebView) {
    console.warn('You are viewing inside an in-app browser. Some features may be limited.');
    // يمكن إضافة رسالة للمستخدم هنا (اختياري)
  }
}

// 🔴 تحسين أمان localStorage - استخدام sessionStorage بدلاً من التخزين الدائم إذا لزم الأمر
const LanguageManager = {
  currentLang: 'en',

  init() {
    const savedLang = localStorage.getItem('made2-lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      this.currentLang = savedLang;
    } else {
      this.currentLang = 'en';
      localStorage.setItem('made2-lang', 'en');
    }
    this.applyLanguage();

    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => this.toggle());
    }
  },

  toggle() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.applyLanguage();
    localStorage.setItem('made2-lang', this.currentLang);
  },

  applyLanguage() {
    const html = document.documentElement;

    if (this.currentLang === 'ar') {
      html.setAttribute('lang', 'ar');
      html.setAttribute('dir', 'rtl');
    } else {
      html.setAttribute('lang', 'en');
      html.setAttribute('dir', 'ltr');
    }

    document.querySelectorAll('[data-en]').forEach(el => {
      const text = this.currentLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ar');
      if (text !== null) {
        el.textContent = text;
      }
    });

    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
      langBtn.textContent = this.currentLang === 'en' ? 'AR' : 'EN';
    }

    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initFabMenu();
  initPointerGlass();
  initPreloader();
  initZoomEraseAndMenu();
  initAboutPopovers();
  initScrollProgress();
  initImageProtection();
  initTextProtection();
  detectWebView();
  LanguageManager.init();

  const body = document.body;
  body.style.opacity = '0';
  setTimeout(() => {
    body.style.transition = 'opacity 0.5s ease';
    body.style.opacity = '1';
  }, 50);
});