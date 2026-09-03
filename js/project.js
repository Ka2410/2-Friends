// 2MADE — Project page animations

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  // Image reveal animations
  const seqItems = document.querySelectorAll('.seq-item');
  seqItems.forEach((el) => {
    el.classList.add('clip-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(el);
  });

  // Subtle parallax on hero image
  const heroImg = document.querySelector('.project-hero-img');
  if (heroImg) {
    gsap.to(heroImg, {
      y: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.project-hero-image',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Description reveal
  const description = document.querySelector('.project-description p');
  if (description) {
    description.classList.add('fade-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(description);
  }
});