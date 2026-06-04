/* ============================================================
   SPLASH PARQUE ACUÁTICO — Main JavaScript v2
   GSAP for hero stagger + count-up
   window.scrollY only for scroll animations
   RAF ticking for throttling
   IntersectionObserver for reveals
   Gallery filters
   Lenis for smooth scroll
   ============================================================ */
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
  function hidePreloader() {
    if (preloader) {
      preloader.classList.add('done');
      setTimeout(function () { preloader.style.display = 'none'; }, 900);
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
     2. HERO — GSAP Stagger animation
     --------------------------------------------------------- */
  var heroTitle = document.getElementById('heroTitle');
  if (heroTitle && typeof gsap !== 'undefined') {
    var hText = 'SPLASH';
    for (var i = 0; i < hText.length; i++) {
      var span = document.createElement('span');
      span.className = 'h-letter';
      span.textContent = hText[i];
      heroTitle.appendChild(span);
    }
    gsap.fromTo('#heroTitle .h-letter',
      { y: 120, opacity: 0, rotateX: -40 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.08, ease: 'back.out(1.4)', delay: 0.3 }
    );
  } else if (heroTitle) {
    var hText2 = 'SPLASH';
    for (var i2 = 0; i2 < hText2.length; i2++) {
      var span2 = document.createElement('span');
      span2.className = 'h-letter';
      span2.textContent = hText2[i2];
      span2.style.animationDelay = (0.3 + i2 * 0.08) + 's';
      heroTitle.appendChild(span2);
    }
  }

  /* ---------------------------------------------------------
     3. NAVBAR — Scroll state + mobile toggle
     --------------------------------------------------------- */
  var navbar = document.getElementById('navbar');
  var navHamburger = document.getElementById('navHamburger');
  var navLinks = document.getElementById('navLinks');
  if (navHamburger) {
    navHamburger.addEventListener('click', function () {
      navHamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navHamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

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
        var bar = el.querySelector('.adrenaline-fill');
        if (bar) bar.style.width = bar.getAttribute('data-width') + '%';
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
     7c. AQUABAR — Sticky photo parallax
     --------------------------------------------------------- */
  var aquabarPhoto = document.querySelector('.aquabar-photo-img');

  function updateAqParallax() {
    if (!aquabarPhoto || aqH <= 0) return;
    if (window.innerWidth <= 768) return;
    var scrollY = window.scrollY;
    var progress = Math.max(0, Math.min(1, (scrollY - aqTop) / aqH));
    aquabarPhoto.style.transform = 'translateY(' + ((progress - 0.5) * -60) + 'px) scale(1.05)';
  }

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

      /* Animate adrenaline bar on new slide */
      var bar = slides[newIdx].querySelector('.adrenaline-fill');
      if (bar) bar.style.width = '0%';
      setTimeout(function () {
        if (bar) bar.style.width = bar.getAttribute('data-width') + '%';
      }, 200);
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
    var firstBar = slides[0].querySelector('.adrenaline-fill');
    if (firstBar) setTimeout(function () { firstBar.style.width = firstBar.getAttribute('data-width') + '%'; }, 500);
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
     10. INITIAL CALL
     --------------------------------------------------------- */
  onScroll();

})();
