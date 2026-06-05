/* ============================================================
   SPLASH PARQUE ACUÁTICO — Main JavaScript v2
   GSAP for hero stagger + count-up
   window.scrollY only for scroll animations
   RAF ticking for throttling
   IntersectionObserver for reveals
   Gallery filters
   Lenis for smooth scroll
   ============================================================ */
/* Scroll to top on reload — runs outside IIFE for earliest execution */
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
window.addEventListener('load', function () { window.scrollTo(0, 0); });

(function () {
  'use strict';

  /* ---------------------------------------------------------
     0. PRELOADER
     --------------------------------------------------------- */
  var preloader = document.getElementById('preloader');
  var preloaderLogo = document.getElementById('preloaderLogo');
  if (preloaderLogo) {
    var pText = 'SPLASH';
    for (var p = 0; p < pText.length; p++) {
      var sp = document.createElement('span');
      sp.className = 'p-letter';
      sp.textContent = pText[p];
      sp.style.animationDelay = (0.2 + p * 0.1) + 's';
      preloaderLogo.appendChild(sp);
    }
  }
  /* Lock scroll while preloader is visible (body.preloading handles CSS lock) */
  function preventScroll(e) { e.preventDefault(); }
  document.body.addEventListener('touchmove', preventScroll, { passive: false });

  var heroRevealPlayed = false;

  function playHeroReveal() {
    if (heroRevealPlayed) return;
    heroRevealPlayed = true;
    if (typeof gsap === 'undefined') {
      /* Fallback: just show everything */
      document.querySelectorAll('.hero-content, .hero-title .h-letter, .hero-subtitle, .hero-ctas, .hero-scroll, .navbar .nav-logo-wrap, .navbar .nav-links-desktop, .navbar .nav-hamburger').forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.filter = 'none';
      });
      return;
    }
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    /* 1) Slide-up hero content */
    tl.to('.hero-content', { y: 0, opacity: 1, duration: 0.9 })
      /* 2) Mask-reveal letters with blur */
      .to('.hero-title .h-letter', {
        y: '0%',
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        stagger: 0.07,
        ease: 'power4.out'
      }, '-=0.4')
      /* 3) Subtitle */
      .to('.hero-subtitle', {
        y: 0, opacity: 1, duration: 0.6
      }, '-=0.3')
      /* 4) CTAs */
      .to('.hero-ctas', {
        y: 0, opacity: 1, duration: 0.5
      }, '-=0.25')
      /* 5) Scroll indicator */
      .to('.hero-scroll', {
        opacity: 1, duration: 0.6
      }, '-=0.2')
      /* 6) Navbar logo */
      .to('.navbar .nav-logo-wrap', {
        y: 0, opacity: 1, duration: 0.6, ease: 'power2.out'
      }, '-=0.3')
      /* 7) Navbar links + hamburger */
      .to('.navbar .nav-links-desktop', {
        y: 0, opacity: 1, duration: 0.5, ease: 'power2.out'
      }, '-=0.35')
      .to('.navbar .nav-hamburger', {
        y: 0, opacity: 1, duration: 0.5, ease: 'power2.out'
      }, '-=0.45');
  }

  function hidePreloader() {
    if (preloader) {
      preloader.classList.add('done');
      setTimeout(function () {
        preloader.style.display = 'none';
        document.body.classList.remove('preloading');
        document.body.removeEventListener('touchmove', preventScroll);
        playHeroReveal();
      }, 900);
    }
  }
  window.addEventListener('load', function () { setTimeout(hidePreloader, 2600); });
  setTimeout(hidePreloader, 4000);

  /* ---------------------------------------------------------
     1. LENIS SMOOTH SCROLL
     --------------------------------------------------------- */
  var lenis = null;
  function initLenis() {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenis);
  } else { initLenis(); }

  /* ---------------------------------------------------------
     2. HERO — Create letter spans (animation triggered by preloader callback)
     --------------------------------------------------------- */
  var heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    var hText = 'SPLASH';
    for (var i = 0; i < hText.length; i++) {
      var span = document.createElement('span');
      span.className = 'h-letter';
      span.textContent = hText[i];
      heroTitle.appendChild(span);
    }
  }

  /* ---------------------------------------------------------
     2b. HERO BACKGROUND SLIDESHOW
     --------------------------------------------------------- */
  var heroSlides = document.querySelectorAll('#heroBg .hero-slide');
  var heroPrevBtn = document.getElementById('heroPrev');
  var heroNextBtn = document.getElementById('heroNext');
  if (heroSlides.length > 1) {
    var heroCurrentSlide = 0;
    var heroInterval = null;

    function heroGoToSlide(idx) {
      var prev = heroCurrentSlide;
      heroCurrentSlide = ((idx % heroSlides.length) + heroSlides.length) % heroSlides.length;
      heroSlides[prev].classList.remove('active');
      heroSlides[heroCurrentSlide].classList.add('active');
    }

    function heroNextSlide() {
      heroGoToSlide(heroCurrentSlide + 1);
    }

    function heroPrevSlide() {
      heroGoToSlide(heroCurrentSlide - 1);
    }

    function heroStartAutoplay() {
      heroStopAutoplay();
      heroInterval = setInterval(heroNextSlide, 10000);
    }
    function heroStopAutoplay() {
      if (heroInterval) { clearInterval(heroInterval); heroInterval = null; }
    }

    if (heroPrevBtn) heroPrevBtn.addEventListener('click', function () { heroPrevSlide(); heroStartAutoplay(); });
    if (heroNextBtn) heroNextBtn.addEventListener('click', function () { heroNextSlide(); heroStartAutoplay(); });

    /* Touch/swipe support for mobile */
    var heroTouchStartX = 0;
    var heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.addEventListener('touchstart', function (e) { heroTouchStartX = e.touches[0].clientX; }, { passive: true });
      heroEl.addEventListener('touchend', function (e) {
        var diff = heroTouchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) heroNextSlide(); else heroPrevSlide();
          heroStartAutoplay();
        }
      }, { passive: true });
    }

    heroStartAutoplay();
  }

  /* ---------------------------------------------------------
     3. NAVBAR — Scroll state + mobile panel
     --------------------------------------------------------- */
  var navbar = document.getElementById('navbar');
  var navHamburger = document.getElementById('navHamburger');
  var navOverlay = document.getElementById('navOverlay');
  var navPanel = document.getElementById('navPanel');
  var navPanelLinks = document.querySelectorAll('.nav-panel-link');
  var menuOpen = false;
  var menuAnimating = false;

  function openMenu() {
    if (menuAnimating || menuOpen) return;
    menuAnimating = true;
    menuOpen = true;
    navHamburger.classList.add('open');
    navOverlay.classList.add('open');
    navPanel.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(navPanelLinks,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out', delay: 0.15,
          onComplete: function () { menuAnimating = false; }
        }
      );
    } else {
      navPanelLinks.forEach(function (l, i) {
        l.style.opacity = '1';
        l.style.transform = 'translateX(0)';
      });
      menuAnimating = false;
    }
  }

  function closeMenu() {
    if (menuAnimating || !menuOpen) return;
    menuAnimating = true;
    menuOpen = false;
    navHamburger.classList.remove('open');
    document.body.style.overflow = '';
    if (typeof gsap !== 'undefined') {
      gsap.to(navPanelLinks, {
        x: 40, opacity: 0, duration: 0.25, stagger: 0.03, ease: 'power2.in',
        onComplete: function () {
          navPanel.classList.remove('open');
          navOverlay.classList.remove('open');
          gsap.set(navPanelLinks, { clearProps: 'all' });
          menuAnimating = false;
        }
      });
    } else {
      navPanel.classList.remove('open');
      navOverlay.classList.remove('open');
      menuAnimating = false;
    }
  }

  if (navHamburger) navHamburger.addEventListener('click', function () {
    if (menuOpen) closeMenu(); else openMenu();
  });
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);

  document.querySelectorAll('.nav-panel-link').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  /* ---------------------------------------------------------
     4. CACHE SCROLL POSITIONS (measured once)
     --------------------------------------------------------- */
  var heroSection = document.getElementById('hero');
  var heroBg = document.getElementById('heroBg');
  var attractionsSection = document.getElementById('atracciones');
  var footerEl = document.getElementById('footer');
  var footerLogo = document.getElementById('footerLogo');

  var heroH = heroSection ? heroSection.offsetHeight : 0;
  var attrTop = 0, attrH = 0;
  var aqTop = 0, aqH = 0;
  var aquabarSection = document.getElementById('aquabar');

  function cachePositions() {
    if (attractionsSection) { attrTop = attractionsSection.offsetTop; attrH = attractionsSection.offsetHeight; }
    if (aquabarSection) { aqTop = aquabarSection.offsetTop; aqH = aquabarSection.offsetHeight; }
  }
  cachePositions();
  window.addEventListener('resize', function () { setTimeout(cachePositions, 200); });

  /* ---------------------------------------------------------
     4c. CUSTOM SCROLL PILL — floats over content, draggable
     --------------------------------------------------------- */
  var scrollPill = document.createElement('div');
  scrollPill.className = 'custom-scroll-pill';
  document.body.appendChild(scrollPill);
  var isDragging = false;
  var dragStartY = 0;
  var dragStartScroll = 0;

  function getPillMetrics() {
    var scrollH = document.documentElement.scrollHeight;
    var clientH = document.documentElement.clientHeight;
    var ratio = clientH / scrollH;
    var pillH = Math.max(30, ratio * clientH);
    var maxTop = clientH - pillH;
    return { scrollH: scrollH, clientH: clientH, pillH: pillH, maxTop: maxTop };
  }

  function updateScrollPill() {
    if (isDragging) return; /* skip while user is dragging */
    var m = getPillMetrics();
    if (m.scrollH <= m.clientH) { scrollPill.style.display = 'none'; return; }
    scrollPill.style.display = '';
    var scrollY = window.scrollY || window.pageYOffset;
    var progress = scrollY / (m.scrollH - m.clientH);
    scrollPill.style.height = m.pillH + 'px';
    scrollPill.style.top = (progress * m.maxTop) + 'px';
  }

  /* Drag to scroll */
  scrollPill.addEventListener('mousedown', function (e) {
    e.preventDefault();
    isDragging = true;
    dragStartY = e.clientY;
    dragStartScroll = window.scrollY || window.pageYOffset;
    scrollPill.classList.add('dragging');
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    var m = getPillMetrics();
    var deltaY = e.clientY - dragStartY;
    var scrollPerPixel = (m.scrollH - m.clientH) / m.maxTop;
    var newScroll = dragStartScroll + deltaY * scrollPerPixel;
    newScroll = Math.max(0, Math.min(newScroll, m.scrollH - m.clientH));
    window.scrollTo(0, newScroll);
    /* Move pill in sync with the drag */
    var progress = newScroll / (m.scrollH - m.clientH);
    scrollPill.style.top = (progress * m.maxTop) + 'px';
  });

  document.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;
    scrollPill.classList.remove('dragging');
    document.body.style.userSelect = '';
  });

  window.addEventListener('scroll', updateScrollPill, { passive: true });
  window.addEventListener('resize', updateScrollPill, { passive: true });
  updateScrollPill();

  /* ---------------------------------------------------------
     5. SCROLL HANDLER — RAF ticking
     --------------------------------------------------------- */
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        var scrollY = window.scrollY;
        var vh = window.innerHeight;

        /* Navbar */
        if (navbar) navbar.classList.toggle('scrolled', scrollY > 80);

        /* Hero parallax */
        if (heroBg && scrollY < heroH * 1.5) {
          heroBg.style.transform = 'translateY(' + (scrollY * 0.4) + 'px)';
        }

        /* Attractions carousel (handled by separate module) */



        /* AquaBar parallax */
        updateAqParallax();

        /* Footer inverse parallax */
        if (footerLogo && footerEl) {
          var fProgress = 1 - (footerEl.getBoundingClientRect().top / vh);
          fProgress = Math.max(0, Math.min(1, fProgress));
          footerLogo.style.transform = 'translateY(' + ((1 - fProgress) * 50) + 'px)';
        }

        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------------------------------------------------
     6. COUNT-UP with GSAP or fallback
     --------------------------------------------------------- */
  function animateCountUp(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';

    if (typeof gsap !== 'undefined') {
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power3.out',
        onUpdate: function () {
          el.textContent = Math.floor(obj.val).toLocaleString('es-MX') + suffix;
        },
        onComplete: function () {
          el.textContent = target.toLocaleString('es-MX') + suffix;
        }
      });
    } else {
      var duration = 2000, startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('es-MX') + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString('es-MX') + suffix;
      }
      requestAnimationFrame(step);
    }
  }

  /* ---------------------------------------------------------
     7. INTERSECTION OBSERVER — Reveal on viewport entry
     --------------------------------------------------------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var delay = parseFloat(el.getAttribute('data-delay')) || 0;
      setTimeout(function () {
        el.classList.add('visible');

        var num = el.querySelector('.stat-number[data-target]');
        if (num) animateCountUp(num);
      }, delay * 1000);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.stat-card, .gallery-item').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ---------------------------------------------------------
     7c. AQUABAR — No-op (photos stacked vertically, no parallax needed)
     --------------------------------------------------------- */
  function updateAqParallax() { /* photos now stacked, no parallax */ }

  /* ---------------------------------------------------------
     7b. ATTRACTIONS CAROUSEL — Coverflow auto-play with loop
     --------------------------------------------------------- */
  var carousel = document.getElementById('attrCarousel');
  if (carousel) {
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    var currentIdx = 0;
    var autoplayInterval = null;
    var isAnimating = false;
    var total = slides.length;

    function updatePositions(newIdx, oldIdx) {
      slides.forEach(function (slide, i) {
        slide.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2');
        if (i === newIdx) {
          slide.classList.add('active');
        } else {
          var diff = i - newIdx;
          if (diff === 1 || diff === -(total - 1)) {
            slide.classList.add('next');
          } else if (diff === -1 || diff === total - 1) {
            slide.classList.add('prev');
          } else if (diff === 2 || diff === -(total - 2)) {
            slide.classList.add('next-2');
          } else if (diff === -2 || diff === total - 2) {
            slide.classList.add('prev-2');
          }
        }
      });

      dots.forEach(function (d) { d.classList.remove('active'); });
      dots[newIdx].classList.add('active');


    }

    function goToSlide(idx) {
      if (isAnimating) return;
      isAnimating = true;
      var oldIdx = currentIdx;
      currentIdx = ((idx % total) + total) % total;
      updatePositions(currentIdx, oldIdx);
      setTimeout(function () { isAnimating = false; }, 650);
    }

    function nextSlide() { goToSlide(currentIdx + 1); }
    function prevSlide() { goToSlide(currentIdx - 1); }

    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, 4000);
    }
    function stopAutoplay() {
      if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null; }
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAutoplay(); });

    /* Click on prev/next slides to go to them */
    carousel.addEventListener('click', function (e) {
      var slide = e.target.closest('.carousel-slide');
      if (!slide || slide.classList.contains('active')) return;
      var idx = parseInt(slide.getAttribute('data-index'), 10);
      goToSlide(idx);
      startAutoplay();
    });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-index'), 10);
        goToSlide(idx);
        startAutoplay();
      });
    });

    /* Touch/swipe support */
    var touchStartX = 0;
    carousel.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide(); else prevSlide();
        startAutoplay();
      }
    }, { passive: true });

    /* Pause on hover */
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    /* Initialize */
    updatePositions(0, -1);
    startAutoplay();
  }

  /* ---------------------------------------------------------
     8. GALLERY FILTERS
     --------------------------------------------------------- */
  var filterBtns = document.querySelectorAll('.gallery-filter');
  var galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      galleryItems.forEach(function (item) {
        var cat = item.getAttribute('data-filter-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease, filter 0.4s ease';
        } else {
          item.classList.add('hidden');
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease, filter 0.4s ease';
        }
      });
    });
  });

  /* ---------------------------------------------------------
     9. GALLERY LIGHTBOX
     --------------------------------------------------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxContent = document.getElementById('lightboxContent');
  var lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var inner = item.querySelector('.gallery-item-inner');
      if (!inner || !lightbox || !lightboxContent) return;
      lightboxContent.innerHTML = '';
      var clone = inner.cloneNode(true);
      clone.style.cssText = 'width:80vw;max-width:800px;height:auto;min-height:400px;aspect-ratio:16/10;border-radius:0.75rem;';
      lightboxContent.appendChild(clone);
      lightbox.classList.add('open');
    });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', function () { if (lightbox) lightbox.classList.remove('open'); });
  if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) lightbox.classList.remove('open');
  });

  /* ---------------------------------------------------------
     10. LANGUAGE SWITCH (ES / EN)
     --------------------------------------------------------- */
  var currentLang = localStorage.getItem('splash-lang') || 'es';
  var langToggleDesktop = document.getElementById('langToggleDesktop');
  var langToggleMobile = document.getElementById('langToggleMobile');

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('splash-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'es' ? 'es' : 'en');
    if (langToggleDesktop) langToggleDesktop.textContent = lang === 'es' ? 'EN' : 'ES';
    if (langToggleMobile) langToggleMobile.textContent = lang === 'es' ? 'EN' : 'ES';
    if (typeof TRANSLATIONS === 'undefined') return;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[key] && TRANSLATIONS[key][lang]) {
        var val = TRANSLATIONS[key][lang];
        if (val.indexOf('\n') !== -1) {
          el.innerHTML = val.replace(/\n/g, '<br>');
        } else {
          el.textContent = val;
        }
      }
    });
    /* Update Atracciones carousel cards */
    if (TRANSLATIONS.attractions && TRANSLATIONS.attractions[lang]) {
      var cards = document.querySelectorAll('.carousel-slide');
      TRANSLATIONS.attractions[lang].forEach(function (a, i) {
        if (!cards[i]) return;
        var nameEl = cards[i].querySelector('.attr-card-name');
        var descEl = cards[i].querySelector('.attr-card-desc');
        var badgeEl = cards[i].querySelector('.attr-card-badge');
        var vibeEl = cards[i].querySelector('.attr-card-vibe');
        if (nameEl) nameEl.textContent = a.name;
        if (descEl) descEl.textContent = a.desc;
        if (badgeEl) badgeEl.textContent = a.badgeLabel;
        if (vibeEl) vibeEl.textContent = a.vibe;
      });
    }
  }

  function toggleLang() {
    applyLang(currentLang === 'es' ? 'en' : 'es');
  }

  if (langToggleDesktop) langToggleDesktop.addEventListener('click', toggleLang);
  if (langToggleMobile) langToggleMobile.addEventListener('click', toggleLang);
  applyLang(currentLang);

  /* ---------------------------------------------------------
     11. INITIAL CALL
     --------------------------------------------------------- */
  onScroll();

})();
