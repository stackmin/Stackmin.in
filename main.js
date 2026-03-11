// ── STACKMIN — main.js ──

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
    // Trigger once for page reload mid-scroll
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  // ── Mobile menu toggle ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ── Active nav link ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // ── Animate progress bars ──
  const progressBars = document.querySelectorAll('.progress-fill');
  if (progressBars.length) {
    const pbObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.dataset.width;
          entry.target.style.width = width + '%';
          pbObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    progressBars.forEach(bar => {
      bar.style.width = '0%';
      pbObserver.observe(bar);
    });
  }

  // ── Counter animation ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(ease(progress) * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const cObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObserver.observe(c));
  }

  // ── Contact form validation ──
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const fields = {
      name:    { el: document.getElementById('f-name'),    err: 'Please enter your full name.' },
      email:   { el: document.getElementById('f-email'),   err: 'Please enter a valid email address.' },
      phone:   { el: document.getElementById('f-phone'),   err: '' },
      service: { el: document.getElementById('f-service'), err: '' },
      message: { el: document.getElementById('f-message'), err: 'Please enter your message (min. 20 characters).' },
    };

    function showError(group, msg) {
      const wrap = group.closest('.form-group');
      wrap.classList.add('has-error');
      const errEl = wrap.querySelector('.form-error');
      if (errEl) errEl.textContent = msg;
    }
    function clearError(group) {
      const wrap = group.closest('.form-group');
      wrap.classList.remove('has-error');
    }

    Object.values(fields).forEach(f => {
      if (f.el) f.el.addEventListener('input', () => clearError(f.el));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Name
      if (!fields.name.el.value.trim()) {
        showError(fields.name.el, fields.name.err); valid = false;
      }
      // Email
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(fields.email.el.value.trim())) {
        showError(fields.email.el, fields.email.err); valid = false;
      }
      // Message
      if (fields.message.el.value.trim().length < 20) {
        showError(fields.message.el, fields.message.err); valid = false;
      }

      if (valid) {
        const btn = contactForm.querySelector('.btn-submit');
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
          contactForm.reset();
          btn.textContent = 'Send Message';
          btn.disabled = false;
          document.getElementById('formSuccess').classList.add('show');
          setTimeout(() => document.getElementById('formSuccess').classList.remove('show'), 5000);
        }, 1500);
      }
    });
  }

  // ── Portfolio filter ──
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card[data-cat]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        portfolioCards.forEach(card => {
          if (cat === 'all' || card.dataset.cat === cat) {
            card.style.display = '';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // ── Tab system (Services) ──
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });
  }

  // ── Smooth anchor scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
