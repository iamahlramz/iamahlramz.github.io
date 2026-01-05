/**
 * Portfolio JavaScript
 * Allan Ramirez - Business Process Automation Expert
 * Features: Theme Toggle, Stat Counter, Modal Galleries, Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', function() {

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Check for saved theme preference or system preference
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  // Apply theme
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  // Theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ===== MOBILE NAVIGATION =====
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navItems = document.querySelector('.nav__items');

  if (mobileMenuToggle && navItems) {
    mobileMenuToggle.addEventListener('click', function() {
      navItems.classList.toggle('active');
      this.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = navItems.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navItems.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      });
    });
  }

  // ===== SMOOTH SCROLLING =====
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = document.querySelector('.nav')?.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== STAT COUNTER ANIMATION =====
  const statNumbers = document.querySelectorAll('.stat__number[data-count]');

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.round(startValue + (target - startValue) * easeOutQuart);

      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // Observe stats for animation trigger
  if (statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
  }

  // ===== BACK TO TOP BUTTON =====
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    function toggleBackToTop() {
      if (window.pageYOffset > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', throttle(toggleBackToTop, 100));

    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== AUTOMATION GALLERY MODAL =====
  const automationGallery = document.getElementById('automationGallery');
  const automationTriggers = document.querySelectorAll('.automation-gallery-trigger');

  if (automationGallery && automationTriggers.length > 0) {
    let currentSlide = 0;
    const slides = automationGallery.querySelectorAll('.gallery__slide');
    const counter = automationGallery.querySelector('.gallery__counter');
    const prevBtn = automationGallery.querySelector('.gallery__btn--prev');
    const nextBtn = automationGallery.querySelector('.gallery__btn--next');
    const closeBtn = automationGallery.querySelector('.modal__close');
    const overlay = automationGallery.querySelector('.modal__overlay');

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      slides[index].classList.add('active');
      if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
      currentSlide = index;
    }

    function openGallery(slideIndex = 0) {
      automationGallery.classList.add('active');
      document.body.style.overflow = 'hidden';
      showSlide(slideIndex);
    }

    function closeGallery() {
      automationGallery.classList.remove('active');
      document.body.style.overflow = '';
    }

    automationTriggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        const slideIndex = parseInt(this.dataset.slide) || 0;
        openGallery(slideIndex);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        const newIndex = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
        showSlide(newIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        const newIndex = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
        showSlide(newIndex);
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeGallery);
    if (overlay) overlay.addEventListener('click', closeGallery);

    document.addEventListener('keydown', function(e) {
      if (automationGallery.classList.contains('active')) {
        if (e.key === 'Escape') closeGallery();
        if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
      }
    });
  }

  // ===== POWER BI GALLERY MODAL =====
  const powerbiGallery = document.getElementById('powerbiGallery');
  const powerbiTriggers = document.querySelectorAll('.powerbi-gallery-trigger');

  if (powerbiGallery && powerbiTriggers.length > 0) {
    let currentPBSlide = 0;
    const pbSlides = powerbiGallery.querySelectorAll('.gallery__slide');
    const pbCounter = powerbiGallery.querySelector('.gallery__counter');
    const pbPrevBtn = powerbiGallery.querySelector('.gallery__btn--prev');
    const pbNextBtn = powerbiGallery.querySelector('.gallery__btn--next');
    const pbCloseBtn = powerbiGallery.querySelector('.modal__close');
    const pbOverlay = powerbiGallery.querySelector('.modal__overlay');

    function showPBSlide(index) {
      pbSlides.forEach(slide => slide.classList.remove('active'));
      pbSlides[index].classList.add('active');
      if (pbCounter) pbCounter.textContent = `${index + 1} / ${pbSlides.length}`;
      currentPBSlide = index;
    }

    function openPBGallery() {
      powerbiGallery.classList.add('active');
      document.body.style.overflow = 'hidden';
      showPBSlide(0);
    }

    function closePBGallery() {
      powerbiGallery.classList.remove('active');
      document.body.style.overflow = '';
    }

    powerbiTriggers.forEach(trigger => {
      trigger.addEventListener('click', openPBGallery);
    });

    if (pbPrevBtn) {
      pbPrevBtn.addEventListener('click', function() {
        const newIndex = currentPBSlide > 0 ? currentPBSlide - 1 : pbSlides.length - 1;
        showPBSlide(newIndex);
      });
    }

    if (pbNextBtn) {
      pbNextBtn.addEventListener('click', function() {
        const newIndex = currentPBSlide < pbSlides.length - 1 ? currentPBSlide + 1 : 0;
        showPBSlide(newIndex);
      });
    }

    if (pbCloseBtn) pbCloseBtn.addEventListener('click', closePBGallery);
    if (pbOverlay) pbOverlay.addEventListener('click', closePBGallery);

    document.addEventListener('keydown', function(e) {
      if (powerbiGallery.classList.contains('active')) {
        if (e.key === 'Escape') closePBGallery();
        if (e.key === 'ArrowLeft' && pbPrevBtn) pbPrevBtn.click();
        if (e.key === 'ArrowRight' && pbNextBtn) pbNextBtn.click();
      }
    });
  }

  // ===== CONTACT FORM VALIDATION =====
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const name = this.querySelector('#name');
      const email = this.querySelector('#email');

      if (name && !name.value.trim()) {
        e.preventDefault();
        name.focus();
        alert('Please enter your name.');
        return;
      }

      if (email && !email.value.trim()) {
        e.preventDefault();
        email.focus();
        alert('Please enter your email.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value)) {
        e.preventDefault();
        email.focus();
        alert('Please enter a valid email address.');
        return;
      }
    });
  }

  // ===== SCROLL ANIMATIONS =====
  const animatedElements = document.querySelectorAll('.cert-card, .project-card, .service-card, .highlight');

  if (animatedElements.length > 0) {
    const animationObserver = new IntersectionObserver(function(entries) {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          animationObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      animationObserver.observe(el);
    });
  }

  // ===== NAV SCROLL EFFECT =====
  const nav = document.querySelector('.nav');

  if (nav) {
    let lastScroll = 0;

    window.addEventListener('scroll', throttle(function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        nav.style.background = html.getAttribute('data-theme') === 'dark'
          ? 'rgba(10, 10, 15, 0.95)'
          : 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
      } else {
        nav.style.background = html.getAttribute('data-theme') === 'dark'
          ? 'rgba(10, 10, 15, 0.8)'
          : 'rgba(255, 255, 255, 0.9)';
        nav.style.boxShadow = 'none';
      }

      lastScroll = currentScroll;
    }, 50));
  }

  console.log('Portfolio loaded successfully.');
});

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== BROWSER COMPATIBILITY =====
if (!window.IntersectionObserver) {
  const elements = document.querySelectorAll('.cert-card, .project-card, .service-card, .highlight');
  elements.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}
