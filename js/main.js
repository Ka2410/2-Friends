// 2MADE — Main JS (Lenis, Nav, Mobile Menu, Preloader, Zoom & White Erase, Arc Menu, Language, Image Protection, Text Protection, About Popover, WebView Detection)

function initLenis() {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    // مزامنة Lenis مع ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }

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

function animateHeroTitleIn() {
  const line1 = document.querySelector('.hero-title-large .line-1');
  const line2 = document.querySelector('.hero-title-large .line-2');
  if (!line1 || !line2) return;

  // إيقاف أي أنيميشن شغال على السطور
  gsap.killTweensOf([line1, line2]);

  // إعادة تعيين الحالة قبل الأنيميشن
  gsap.set(line1, { opacity: 0, y: -60 });
  gsap.set(line2, { opacity: 0, y: 60 });

  // أنيميشن السطر الأول (من فوق)
  gsap.to(line1, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.2
  });

  // أنيميشن السطر الثاني (من تحت)
  gsap.to(line2, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.4
  });
}

function initHeroTitleObserver() {
  const heroSection = document.getElementById('hero');
  const line1 = document.querySelector('.hero-title-large .line-1');
  const line2 = document.querySelector('.hero-title-large .line-2');
  
  if (!heroSection || !line1 || !line2) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // ظهر الهيرو على الشاشة => شغّل الأنيميشن
        animateHeroTitleIn();
      } else {
        // اختفى الهيرو من الشاشة => أخفي السطور فوراً
        gsap.killTweensOf([line1, line2]);
        gsap.set([line1, line2], { opacity: 0 });
      }
    });
  }, { threshold: 0.3 }); // يشتغل لما يظهر 30% من الهيرو

  observer.observe(heroSection);
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

  let isBusy = false;

  const closeAllMenus = () => {
    arcMenus.forEach(menu => menu.classList.remove('active'));
    heroSection.classList.remove('menu-open');
  };

  const resetHero = () => {
    gsap.killTweensOf([heroBase, heroBg, heroMohamed, heroKaram, heroContainer]);

    heroBase.style.opacity = '1';
    heroBg.style.opacity = '0';
    heroMohamed.style.opacity = '0';
    heroKaram.style.opacity = '0';
    gsap.to(heroContainer, { scale: 1, duration: 0.5, ease: 'power2.out' });
    closeAllMenus();

    setTimeout(() => {
      animateHeroTitleIn();
    }, 200);
  };

  const zoomOnPerson = (side) => {
    if (isBusy) return;

    isBusy = true;

    gsap.killTweensOf([heroBase, heroBg, heroMohamed, heroKaram, heroContainer]);

    closeAllMenus();

    const lines = document.querySelectorAll('.hero-title-large .line-1, .hero-title-large .line-2');
    gsap.killTweensOf(lines);
    gsap.set(lines, { opacity: 0 });

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

    setTimeout(() => {
      isBusy = false;
    }, 2000);
  };

  if (ctaLeft) {
    ctaLeft.addEventListener('click', (e) => {
      e.preventDefault();
      zoomOnPerson('left');
    });
  }

  if (ctaRight) {
    ctaRight.addEventListener('click', (e) => {
      e.preventDefault();
      zoomOnPerson('right');
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hero-arc-menu') && !e.target.closest('.hero .cta-glass')) {
      if (!isBusy) {
        closeAllMenus();
        setTimeout(resetHero, 100);
      }
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

function detectWebView() {
  const ua = navigator.userAgent.toLowerCase();
  const isWebView = /(instagram|facebook|whatsapp|snapchat|line|fbav|wv|inappbrowser)/.test(ua);
  
  if (isWebView) {
    console.warn('You are viewing inside an in-app browser. Some features may be limited.');
  }
}

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
  initHeroTitleObserver(); // تم استبدال initHeroTitleScrollTrigger بـ initHeroTitleObserver
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