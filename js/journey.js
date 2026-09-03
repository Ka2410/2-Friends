// 2MADE — Journey page animations

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  // Reveal timeline items
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  items.forEach(item => {
    observer.observe(item);
  });

  // Subtle parallax on title
  const title = document.querySelector('.journey-title');
  if (title) {
    gsap.to(title, {
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.journey-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }
});