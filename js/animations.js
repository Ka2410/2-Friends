// 2MADE — GSAP ScrollTrigger Animations

function initAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP not loaded. Animations skipped.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.set('.reveal-text, .fade-up, .clip-reveal', { opacity: 1, transform: 'none', clipPath: 'none' });
    return;
  }

  // 1. Double Entrance (Intro)
  const introSection = document.querySelector('.intro-section');
  if (introSection) {
    ScrollTrigger.create({
      trigger: introSection,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => introSection.classList.add('reveal'),
      onLeaveBack: () => introSection.classList.remove('reveal')
    });
  }

  // 2. About Reveal Word by Word (آمن - بدون innerHTML)
  const aboutHeadline = document.querySelector('.about-headline');
  if (aboutHeadline && aboutHeadline.dataset.splitText) {
    const words = aboutHeadline.textContent.trim().split(' ');
    aboutHeadline.innerHTML = '';
    const fragment = document.createDocumentFragment();
    words.forEach(word => {
      const span = document.createElement('span');
      span.classList.add('word');
      span.textContent = word;
      fragment.appendChild(span);
    });
    aboutHeadline.appendChild(fragment);
  }

  const aboutSection = document.querySelector('.about-section');
  if (aboutSection) {
    ScrollTrigger.create({
      trigger: aboutSection,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => aboutSection.classList.add('reveal'),
      onLeaveBack: () => aboutSection.classList.remove('reveal')
    });
  }

  // 3. Glitch (Contact)
  const contactSection = document.querySelector('.contact-section');
  if (contactSection) {
    ScrollTrigger.create({
      trigger: contactSection,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => contactSection.classList.add('reveal'),
      onLeaveBack: () => contactSection.classList.remove('reveal')
    });
  }

  // 4. Footer تفاعلي
  const footer = document.querySelector('.site-footer');
  if (footer) {
    ScrollTrigger.create({
      trigger: footer,
      start: 'top 85%',
      end: 'bottom 10%',
      onEnter: () => footer.classList.add('reveal'),
      onLeaveBack: () => footer.classList.remove('reveal')
    });
  }

  // 5. Scroll reveals
  gsap.utils.toArray('.fade-up').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  gsap.utils.toArray('.clip-reveal').forEach((el) => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0 0 0)',
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // 6. Magnetic Buttons
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      xTo(x * 0.45);
      yTo(y * 0.45);
    });

    btn.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  });

  // 7. Horizontal Work Scroll (Pinned) - دعم RTL لايف بدون تحديث الصفحة
  const workTrack = document.querySelector('.work-track');
  const workWrapper = document.querySelector('.work-wrapper');

  if (workTrack && workWrapper) {
    const getDistance = () => workTrack.scrollWidth - window.innerWidth;

    gsap.to(workTrack, {
      // هنا بنقرأ الاتجاه لحظياً (لايف) عند كل إعادة حساب
      x: () => {
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
        return isRTL ? getDistance() : -getDistance();
      },
      ease: 'none',
      scrollTrigger: {
        trigger: '.work-section',
        start: 'top top',
        end: () => '+=' + getDistance(),
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true // ده مهم جداً عشان يعيد حساب الـ x
      }
    });
  }

  // 8. Parallax on About background "2"
  const aboutBg = document.querySelector('.about-bg');
  if (aboutBg) {
    gsap.to(aboutBg, {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // 9. Hero scroll hint fade
  const scrollHint = document.querySelector('.hero-scroll-hint');
  if (scrollHint) {
    gsap.to(scrollHint, {
      opacity: 0,
      y: -20,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom 70%',
        scrub: true
      }
    });
  }

  // 10. CTA hover highlight
  document.querySelectorAll('.cta-glass').forEach((cta) => {
    cta.addEventListener('mousemove', (e) => {
      const rect = cta.getBoundingClientRect();
      cta.style.setProperty('--pointer-x', `${e.clientX - rect.left}px`);
      cta.style.setProperty('--pointer-y', `${e.clientY - rect.top}px`);
    });
  });

  // 11. Creator cards hover
  document.querySelectorAll('.creator-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--pointer-x', `${x}px`);
      card.style.setProperty('--pointer-y', `${y}px`);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initAnimations, 100);
});