/* Bramley Lodge — progressive enhancement only.
   Everything on the site works without this file. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Header: condense on scroll ---------- */
  var header = document.querySelector('.site-header:not(.site-header--solid)');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav drawer ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    nav.querySelectorAll('li').forEach(function (li, i) {
      li.style.setProperty('--i', i);
    });
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && !reduceMotion.matches) {
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      group.querySelectorAll('.reveal').forEach(function (el, i) {
        el.style.setProperty('--reveal-delay', (i * 80) + 'ms');
      });
    });
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Menu page: sticky subnav with sliding indicator ---------- */
  var subnav = document.querySelector('.menu-subnav');
  if (subnav) {
    var links = Array.prototype.slice.call(subnav.querySelectorAll('a[href^="#"]'));
    var indicator = subnav.querySelector('.subnav-indicator');
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

    var setActive = function (link) {
      links.forEach(function (a) { a.classList.toggle('is-active', a === link); });
      if (indicator && link) {
        indicator.style.width = link.offsetWidth + 'px';
        indicator.style.transform = 'translateX(' + link.offsetLeft + 'px)';
        link.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    };
    var sections = Array.prototype.slice.call(
      document.querySelectorAll('.menu-section[id]')
    ).filter(function (s) { return byId[s.id]; });

    var current = null;
    var pick = function () {
      var y = window.scrollY + window.innerHeight * 0.28;
      var active = sections[0];
      sections.forEach(function (s) {
        if (s.offsetTop <= y) active = s;
      });
      if (active && active !== current) {
        current = active;
        setActive(byId[active.id]);
      }
    };
    window.addEventListener('scroll', pick, { passive: true });
    window.addEventListener('resize', function () {
      current = null;
      pick();
    });
    pick();
  }

  /* ---------- Gallery lightbox ---------- */
  var gallery = document.querySelector('.gallery');
  var lightbox = document.querySelector('.lightbox');
  if (gallery && lightbox && typeof lightbox.showModal === 'function') {
    var items = Array.prototype.slice.call(gallery.querySelectorAll('a'));
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('figcaption');
    var index = 0;

    var show = function (i) {
      index = (i + items.length) % items.length;
      var a = items[index];
      var thumb = a.querySelector('img');
      lbImg.src = a.getAttribute('href');
      lbImg.srcset = a.dataset.srcset || '';
      lbImg.sizes = a.dataset.srcset ? '92vw' : '';
      lbImg.alt = thumb ? thumb.alt : '';
      lbCaption.textContent = thumb ? thumb.alt : '';
    };
    items.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        show(i);
        lightbox.showModal();
      });
    });
    lightbox.addEventListener('click', function (e) {
      var action = e.target.closest('[data-lb]');
      if (action) {
        var kind = action.dataset.lb;
        if (kind === 'close') lightbox.close();
        if (kind === 'prev') show(index - 1);
        if (kind === 'next') show(index + 1);
      } else if (!e.target.closest('figure')) {
        lightbox.close(); // backdrop click
      }
    });
    lightbox.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    lightbox.addEventListener('close', function () {
      lbImg.src = '';
      lbImg.srcset = '';
    });
  }

  /* ---------- Videos: play only in viewport, never under reduced motion.
     Reel cards ship as lazy poster images; a <video> is injected on first
     intersection so posters never compete with the LCP. ---------- */
  var videoHosts = document.querySelectorAll('[data-video]');
  var eagerVideos = document.querySelectorAll('video[data-autoplay]');
  if ((videoHosts.length || eagerVideos.length) && 'IntersectionObserver' in window) {
    var pauseAll = function () {
      document.querySelectorAll('[data-video] video, video[data-autoplay]').forEach(function (v) { v.pause(); });
    };
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var host = entry.target;
        var v = host.tagName === 'VIDEO' ? host : host.querySelector('video');
        if (reduceMotion.matches) { if (v) v.pause(); return; }
        if (entry.isIntersecting) {
          if (!v && host.dataset.video) {
            v = document.createElement('video');
            v.muted = true;
            v.loop = true;
            v.playsInline = true;
            v.setAttribute('playsinline', '');
            v.preload = 'auto';
            var img = host.querySelector('img');
            if (img) {
              v.poster = img.currentSrc || img.src;
              img.after(v);
            } else {
              host.prepend(v);
            }
            var src = document.createElement('source');
            src.src = host.dataset.video;
            src.type = 'video/mp4';
            v.appendChild(src);
          }
          if (v) v.play().catch(function () {});
        } else if (v) {
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    videoHosts.forEach(function (h) { vo.observe(h); });
    eagerVideos.forEach(function (v) { vo.observe(v); });
    reduceMotion.addEventListener('change', function () {
      if (reduceMotion.matches) pauseAll();
    });
  }

  /* ---------- Sticky call pill (mobile) ---------- */
  var pill = document.querySelector('.call-pill');
  var hero = document.querySelector('.hero');
  var footer = document.querySelector('.site-footer');
  if (pill && 'IntersectionObserver' in window) {
    var heroGone = !hero;
    var footerVisible = false;
    var updatePill = function () {
      pill.classList.toggle('is-shown', heroGone && !footerVisible);
    };
    if (hero) {
      new IntersectionObserver(function (entries) {
        heroGone = !entries[0].isIntersecting;
        updatePill();
      }, { threshold: 0.08 }).observe(hero);
    }
    if (footer) {
      new IntersectionObserver(function (entries) {
        footerVisible = entries[0].isIntersecting;
        updatePill();
      }, { threshold: 0.05 }).observe(footer);
    }
    updatePill();
  }
})();
