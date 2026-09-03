// 2MADE — Person 1 specific animations

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  // Add class for reveal animations
  const p1Elements = document.querySelectorAll('.p1-work-item, .p1-featured-image, .p1-hero-image');
  p1Elements.forEach((el) => {
    el.classList.add('fade-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    observer.observe(el);
  });

  // Parallax on hero image (very subtle)
  if (window.lenis) {
    window.lenis.on('scroll', () => {
      const heroImg = document.querySelector('.p1-hero-image');
      if (heroImg) {
        const y = window.scrollY;
        gsap.to(heroImg, { y: y * 0.05, duration: 0.5, ease: 'power2.out' });
      }
    });
  }

  // Re-enable animations on scroll (re-trigger)
  const sections = document.querySelectorAll('.p1-bio, .p1-work, .p1-featured, .p1-about');
  const observers = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, { threshold: 0.2 });

  sections.forEach(section => {
    observers.observe(section);
  });
});