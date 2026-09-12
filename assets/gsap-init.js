/* ============================================================
   GSAP + ScrollTrigger — Watercolor Storybook Theme
   ============================================================ */
(function () {
  'use strict';

  /* Wait for GSAP to be available */
  function waitForGSAP(cb) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      cb();
    } else {
      setTimeout(function () { waitForGSAP(cb); }, 50);
    }
  }

  waitForGSAP(function () {

    /* Register plugin */
    gsap.registerPlugin(ScrollTrigger);

    /* Pause all ScrollTriggers until page is ready */
    ScrollTrigger.config({ limitCallbacks: true });

    /* -----------------------------------------------
       Utility: counter animate
    ----------------------------------------------- */
    function animateCounter(el, target) {
      var obj = { val: 0 };
      var suffix = target.replace(/[0-9]/g, '');
      var num = parseFloat(target.replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return;
      gsap.to(obj, {
        val: num,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(obj.val) + suffix;
        }
      });
    }

    /* -----------------------------------------------
       Helper: Create scroll reveal timeline
       - fromVars: starting state
       - toVars: ending state (defaults to natural state)
       - triggerEl: element that triggers the animation
       - startPos: ScrollTrigger start position
    ----------------------------------------------- */
    function scrollReveal(fromVars, toVars, triggerEl, startPos) {
      if (!triggerEl) return;

      var defaults = {
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform,opacity'
      };

      var mergedTo = Object.assign({}, defaults, toVars || {});

      gsap.fromTo(fromVars.targets || fromVars, 
        fromVars.from || fromVars, 
        mergedTo,
        {
          scrollTrigger: {
            trigger: triggerEl,
            start: startPos || 'top 85%',
            toggleActions: 'play none none none',
            once: true
          }
        }
      );
    }

    /* ============================================================
       1. HERO SECTION — Page Load Animation
    ============================================================ */
    function initHero() {
      var hero = document.querySelector('[data-gs-section="hero"]');
      if (!hero) return;

      var tl = gsap.timeline({ delay: 0.4 });

      /* Stats counter */
      var stats = hero.querySelectorAll('[data-gs="hero-stat"]');
      if (stats.length) {
        gsap.set(stats, { y: 20, opacity: 0 });
        tl.to(stats, {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.1,
          onStart: function () {
            stats.forEach(function (s) {
              var target = s.getAttribute('data-counter');
              if (target) animateCounter(s, target);
            });
          }
        }, '-=0.2');
      }

      /* Marquee parallax */
      var marquee = hero.querySelector('.marquee-track');
      if (marquee) {
        gsap.to(marquee, {
          x: -100, ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
          }
        });
      }
    }

    /* ============================================================
       2. ABOUT SECTION — Scroll Reveal
    ============================================================ */
    function initAbout() {
      var section = document.querySelector('[data-gs-section="about"]');
      if (!section) return;

      /* Photo slide in */
      var photo = section.querySelector('[data-gs="about-photo"]');
      if (photo) {
        gsap.fromTo(photo,
          { x: -120, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 80%', once: true }
          }
        );
      }

      /* Text elements */
      var textEls = section.querySelectorAll('[data-gs="about-text"]');
      if (textEls.length) {
        gsap.fromTo(textEls,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.15,
            scrollTrigger: { trigger: section, start: 'top 75%', once: true }
          }
        );
      }

      /* Pills */
      var pills = section.querySelectorAll('[data-gs="about-pill"]');
      if (pills.length) {
        gsap.fromTo(pills,
          { y: 20, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08,
            scrollTrigger: { trigger: section, start: 'top 70%', once: true }
          }
        );
      }

      /* Stats with counter */
      var stats = section.querySelectorAll('[data-gs="about-stat"]');
      if (stats.length) {
        gsap.fromTo(stats,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.1,
            scrollTrigger: {
              trigger: section, start: 'top 65%', once: true,
              onEnter: function () {
                stats.forEach(function (s) {
                  var target = s.getAttribute('data-counter');
                  if (target) animateCounter(s, target);
                });
              }
            }
          }
        );
      }

      /* CTA */
      var cta = section.querySelector('[data-gs="about-cta"]');
      if (cta) {
        gsap.fromTo(cta,
          { y: 20, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.6,
            scrollTrigger: { trigger: section, start: 'top 60%', once: true }
          }
        );
      }
    }

    /* ============================================================
       3. SERVICES SECTION — Scroll Reveal
    ============================================================ */
    function initServices() {
      var section = document.querySelector('[data-gs-section="services"]');
      if (!section) return;

      /* Heading */
      var headingEls = section.querySelectorAll('[data-gs="services-heading"]');
      if (headingEls.length) {
        gsap.fromTo(headingEls,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.12,
            scrollTrigger: { trigger: section, start: 'top 80%', once: true }
          }
        );
      }

      /* Cards */
      var cards = section.querySelectorAll('[data-gs="services-card"]');
      var grid = section.querySelector('.grid');
      if (cards.length) {
        gsap.fromTo(cards,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.1,
            scrollTrigger: { trigger: grid || section, start: 'top 75%', once: true }
          }
        );
      }

      /* Button */
      var btn = section.querySelector('[data-gs="services-btn"]');
      if (btn) {
        gsap.fromTo(btn,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6,
            scrollTrigger: { trigger: btn, start: 'top 92%', once: true }
          }
        );
      }
    }

    /* ============================================================
       4. GALLERY SECTION — Scroll Reveal
    ============================================================ */
    function initGallery() {
      var section = document.querySelector('[data-gs-section="gallery"]');
      if (!section) return;

      /* Artwork strip */
      var strips = section.querySelectorAll('[data-gs="gallery-strip"]');
      if (strips.length) {
        gsap.fromTo(strips,
          { x: -80, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.7, stagger: 0.15,
            scrollTrigger: { trigger: section, start: 'top 80%', once: true }
          }
        );
      }

      /* Heading */
      var headings = section.querySelectorAll('[data-gs="gallery-heading"]');
      if (headings.length) {
        gsap.fromTo(headings,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.1,
            scrollTrigger: { trigger: section, start: 'top 75%', once: true }
          }
        );
      }

      /* Tabs */
      var tabs = section.querySelectorAll('[data-gs="gallery-tab"]');
      if (tabs.length) {
        gsap.fromTo(tabs,
          { y: 20, opacity: 0, scale: 0.9 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08,
            scrollTrigger: { trigger: section, start: 'top 70%', once: true }
          }
        );
      }

      /* Grid items */
      var items = section.querySelectorAll('[data-gs="gallery-item"]');
      var grid = section.querySelector('.grid');
      if (items.length) {
        gsap.fromTo(items,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1,
            scrollTrigger: { trigger: grid || section, start: 'top 70%', once: true }
          }
        );
      }
    }

    /* ============================================================
       5. TEAM SECTION — Scroll Reveal
    ============================================================ */
    function initTeam() {
      var section = document.querySelector('[data-gs-section="team"]');
      if (!section) return;

      /* Heading */
      var headingEls = section.querySelectorAll('[data-gs="team-heading"]');
      if (headingEls.length) {
        gsap.fromTo(headingEls,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.1,
            scrollTrigger: { trigger: section, start: 'top 80%', once: true }
          }
        );
      }

      /* Cards */
      var cards = section.querySelectorAll('[data-gs="team-card"]');
      if (cards.length) {
        gsap.fromTo(cards,
          { x: 80, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.8, stagger: 0.2,
            scrollTrigger: { trigger: section, start: 'top 75%', once: true }
          }
        );
      }

      /* Social icons */
      cards.forEach(function (card) {
        var icons = card.querySelectorAll('[data-gs="team-social"]');
        if (icons.length) {
          gsap.fromTo(icons,
            { y: 15, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.4, stagger: 0.1,
              scrollTrigger: { trigger: card, start: 'top 85%', once: true }
            }
          );
        }
      });
    }

    /* ============================================================
       6. TESTIMONIALS SECTION — Scroll Reveal
    ============================================================ */
    function initTestimonials() {
      var section = document.querySelector('[data-gs-section="testimonials"]');
      if (!section) return;

      /* Heading */
      var headingEls = section.querySelectorAll('[data-gs="test-heading"]');
      if (headingEls.length) {
        gsap.fromTo(headingEls,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.1,
            scrollTrigger: { trigger: section, start: 'top 80%', once: true }
          }
        );
      }

      /* Cards — alternate left/right */
      var cards = section.querySelectorAll('[data-gs="test-card"]');
      cards.forEach(function (card, i) {
        var fromX = i % 2 === 0 ? -80 : 80;
        gsap.fromTo(card,
          { x: fromX, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.9,
            scrollTrigger: { trigger: card, start: 'top 90%', once: true }
          }
        );
      });

      /* Quote icons — rotate */
      var icons = section.querySelectorAll('[data-gs="test-icon"]');
      icons.forEach(function (icon) {
        gsap.fromTo(icon,
          { rotation: -180, opacity: 0, scale: 0.5 },
          {
            rotation: 0, opacity: 1, scale: 1, duration: 1,
            scrollTrigger: { trigger: icon, start: 'top 92%', once: true }
          }
        );
      });

      /* Stars bounce */
      var starsGroups = section.querySelectorAll('[data-gs="test-stars"]');
      starsGroups.forEach(function (group) {
        var stars = group.querySelectorAll('svg');
        if (stars.length) {
          gsap.fromTo(stars,
            { scale: 0, opacity: 0 },
            {
              scale: 1, opacity: 1, duration: 0.4, stagger: 0.1,
              ease: 'back.out(3)',
              scrollTrigger: { trigger: group, start: 'top 92%', once: true }
            }
          );
        }
      });
    }

    /* ============================================================
       7. CONTACT SECTION — Scroll Reveal
    ============================================================ */
    function initContact() {
      var section = document.querySelector('[data-gs-section="contact"]');
      if (!section) return;

      /* Heading */
      var headingEls = section.querySelectorAll('[data-gs="contact-heading"]');
      if (headingEls.length) {
        gsap.fromTo(headingEls,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.1,
            scrollTrigger: { trigger: section, start: 'top 80%', once: true }
          }
        );
      }

      /* Form card */
      var formCard = section.querySelector('[data-gs="contact-form"]');
      if (formCard) {
        gsap.fromTo(formCard,
          { y: 50, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.9,
            scrollTrigger: { trigger: formCard, start: 'top 85%', once: true }
          }
        );
      }

      /* Fields stagger */
      var fields = section.querySelectorAll('[data-gs="contact-field"]');
      if (fields.length) {
        gsap.fromTo(fields,
          { x: -40, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.6, stagger: 0.12,
            scrollTrigger: { trigger: section.querySelector('form') || section, start: 'top 75%', once: true }
          }
        );
      }

      /* Submit */
      var submit = section.querySelector('[data-gs="contact-submit"]');
      if (submit) {
        gsap.fromTo(submit,
          { y: 15, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.5,
            scrollTrigger: { trigger: submit, start: 'top 95%', once: true }
          }
        );
      }

      /* Info cards */
      var infoCards = section.querySelectorAll('[data-gs="contact-info"]');
      if (infoCards.length) {
        gsap.fromTo(infoCards,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.15,
            scrollTrigger: { trigger: infoCards[0].parentElement, start: 'top 90%', once: true }
          }
        );
      }
    }

    /* ============================================================
       8. FAQ SECTION — Scroll Reveal
    ============================================================ */
    function initFAQ() {
      var section = document.querySelector('[data-gs-section="faq"]');
      if (!section) return;

      /* Sticky heading */
      var sticky = section.querySelector('[data-gs="faq-sticky"]');
      if (sticky) {
        gsap.fromTo(sticky,
          { x: -50, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.8,
            scrollTrigger: { trigger: section, start: 'top 80%', once: true }
          }
        );
      }

      /* Accordion items */
      var items = section.querySelectorAll('[data-gs="faq-item"]');
      if (items.length) {
        gsap.fromTo(items,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, stagger: 0.12,
            scrollTrigger: { trigger: items[0].parentElement, start: 'top 80%', once: true }
          }
        );
      }
    }

    /* ============================================================
       9. PRODUCT DETAIL — Scroll Reveal
    ============================================================ */
    function initProductDetail() {
      var section = document.querySelector('[data-gs-section="product-detail"]');
      if (!section) return;

      /* Gallery */
      var gallery = section.querySelector('[data-gs="product-gallery"]');
      if (gallery) {
        gsap.fromTo(gallery,
          { x: -80, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 80%', once: true }
          }
        );
      }

      /* Product info elements */
      var infoEls = section.querySelectorAll('[data-gs="product-info"]');
      if (infoEls.length) {
        gsap.fromTo(infoEls,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, stagger: 0.1,
            scrollTrigger: { trigger: section, start: 'top 75%', once: true }
          }
        );
      }

      /* Add-ons */
      var addons = section.querySelector('[data-gs="product-addons"]');
      if (addons) {
        gsap.fromTo(addons,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7,
            scrollTrigger: { trigger: addons, start: 'top 85%', once: true }
          }
        );
      }

      /* Actions */
      var actions = section.querySelector('[data-gs="product-actions"]');
      if (actions) {
        gsap.fromTo(actions,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6,
            scrollTrigger: { trigger: actions, start: 'top 90%', once: true }
          }
        );
      }
    }

    /* ============================================================
       10b. FAQ PAGE SECTION — Scroll Reveal
    ============================================================ */
    function initFaqPage() {
      var section = document.querySelector('[data-gs-section="faq-page"]');
      if (!section) return;

      /* Heading */
      var headingEls = section.querySelectorAll('[data-gs="faq-heading"]');
      if (headingEls.length) {
        gsap.fromTo(headingEls,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.1,
            scrollTrigger: { trigger: section, start: 'top 80%', once: true }
          }
        );
      }

      /* Categories — stagger reveal */
      var categories = section.querySelectorAll('[data-gs="faq-category"]');
      categories.forEach(function (cat) {
        gsap.fromTo(cat,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7,
            scrollTrigger: { trigger: cat, start: 'top 85%', once: true }
          }
        );
      });
    }

    /* ============================================================
       10. ADDONS SECTION — Scroll Reveal
    ============================================================ */
    function initAddons() {
      var section = document.querySelector('[data-gs-section="addons"]');
      if (!section) return;

      /* Heading */
      var headingEls = section.querySelectorAll('[data-gs="addons-heading"]');
      if (headingEls.length) {
        gsap.fromTo(headingEls,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.1,
            scrollTrigger: { trigger: section, start: 'top 80%', once: true }
          }
        );
      }

      /* Cards */
      var cards = section.querySelectorAll('[data-gs="addons-card"]');
      if (cards.length) {
        gsap.fromTo(cards,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1,
            scrollTrigger: { trigger: section.querySelector('.grid') || section, start: 'top 75%', once: true }
          }
        );
      }
    }

    /* ============================================================
       11. HEADER — Page Load Animation
    ============================================================ */
    function initHeader() {
      var header = document.querySelector('header');
      if (!header) return;

      var tl = gsap.timeline({ delay: 0.2 });

      var logo = header.querySelector('[data-gs="header-logo"]');
      if (logo) {
        gsap.set(logo, { y: -25, opacity: 0 });
        tl.to(logo, { y: 0, opacity: 1, duration: 0.7 });
      }

      var navLinks = header.querySelectorAll('[data-gs="header-nav"]');
      if (navLinks.length) {
        gsap.set(navLinks, { y: -20, opacity: 0 });
        tl.to(navLinks, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07 }, '-=0.4');
      }

      var icons = header.querySelectorAll('[data-gs="header-icon"]');
      if (icons.length) {
        gsap.set(icons, { y: -15, opacity: 0 });
        tl.to(icons, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.3');
      }
    }

    /* ============================================================
       12. MAGNETIC BUTTON HOVER
    ============================================================ */
    function initMagneticButtons() {
      document.querySelectorAll('.btn-primary, .btn-secondary').forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
          var rect = btn.getBoundingClientRect();
          var x = (e.clientX - rect.left - rect.width / 2) * 0.15;
          var y = (e.clientY - rect.top - rect.height / 2) * 0.15;
          gsap.to(btn, { x: x, y: y, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', function () {
          gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    /* ============================================================
       13. WATERCOLOR BLOB PARALLAX
    ============================================================ */
    function initParallaxBlobs() {
      document.querySelectorAll('[data-gs="parallax-blob"]').forEach(function (blob) {
        var speed = parseFloat(blob.getAttribute('data-speed')) || 0.3;
        gsap.to(blob, {
          y: function () { return window.innerHeight * speed * 0.5; },
          ease: 'none',
          scrollTrigger: {
            trigger: blob.closest('section') || blob,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 2
          }
        });
      });
    }

    /* ============================================================
       14. SMOOTH PAGE LOAD
    ============================================================ */
    function initPageLoad() {
      // Removed: body opacity animation was causing invisible page on GSAP CDN failure
    }

    /* ============================================================
       15. SCROLL PROGRESS BAR
    ============================================================ */
    function initScrollProgress() {
      var header = document.querySelector('header');
      if (!header) return;

      var bar = document.createElement('div');
      bar.className = 'scroll-progress-bar';
      bar.style.cssText = 'position:absolute;bottom:0;left:0;height:2px;width:0%;background:var(--gradient-primary);transition:none;z-index:999;';
      header.style.position = 'relative';
      header.appendChild(bar);

      gsap.to(bar, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3
        }
      });
    }

    /* ============================================================
       16. CARD TILT ON HOVER
    ============================================================ */
    function initCardTilt() {
      document.querySelectorAll('[data-gs="team-card"], [data-gs="test-card"]').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;
          var y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotationY: x * 8,
            rotationX: -y * 8,
            transformPerspective: 800,
            duration: 0.4,
            ease: 'power2.out'
          });
        });
        card.addEventListener('mouseleave', function () {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)'
          });
        });
      });
    }

    /* ============================================================
       17. IMAGE REVEAL WITH CLIP-PATH
    ============================================================ */
    function initImageReveal() {
      document.querySelectorAll('[data-gs="about-photo"], [data-gs="product-gallery"]').forEach(function (img) {
        gsap.fromTo(img,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: img, start: 'top 80%', once: true }
          }
        );
      });
    }

    /* ============================================================
       18. MAGNETIC SOCIAL ICONS
    ============================================================ */
    function initMagneticSocials() {
      document.querySelectorAll('[data-gs="team-social"]').forEach(function (icon) {
        icon.addEventListener('mousemove', function (e) {
          var rect = icon.getBoundingClientRect();
          var x = (e.clientX - rect.left - rect.width / 2) * 0.3;
          var y = (e.clientY - rect.top - rect.height / 2) * 0.3;
          gsap.to(icon, { x: x, y: y, scale: 1.15, duration: 0.3, ease: 'power2.out' });
        });
        icon.addEventListener('mouseleave', function () {
          gsap.to(icon, { x: 0, y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        });
      });
    }

    /* ============================================================
       INITIALIZE ALL
    ============================================================ */
    function initAll() {
      initPageLoad();
      initHero();
      initHeader();
      initScrollProgress();
      initAbout();
      initServices();
      initGallery();
      initTeam();
      initTestimonials();
      initContact();
      initFAQ();
      initProductDetail();
      initAddons();
      initFaqPage();
      initMagneticButtons();
      initMagneticSocials();
      initCardTilt();
      initImageReveal();
      initParallaxBlobs();

      /* Refresh ScrollTrigger after everything is set up */
      ScrollTrigger.refresh();
    }

    /* Run on DOM ready */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }

    /* Also refresh after full page load (images etc) */
    window.addEventListener('load', function () {
      setTimeout(function () {
        ScrollTrigger.refresh();
      }, 100);
    });

  }); /* end waitForGSAP */
})();
