/* ============================================================
   MIGERA | script.js
   — Navbar, mobile menu, reveal animations
   — Google Sheets lead capture via Apps Script
   — Contact form tabs
   ============================================================ */

// ── IMPORTANT: Replace this URL with your Google Apps Script Web App URL ──
// See README.md for instructions on how to create it.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLVgsvJ9Unait1LAl1JQYf_Mr8oGP8JhEfGZKqmWJF0EKNB8FxpK4GblIvUuwo2ejG/exec';
window.GOOGLE_SCRIPT_URL = GOOGLE_SCRIPT_URL;

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ── Hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // ── Active nav link on scroll ──
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (sections.length && navLinks.length) {
    const secObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px' });
    sections.forEach(s => secObs.observe(s));
  }

  // ── Reveal on scroll ──
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...(entry.target.parentElement?.querySelectorAll('.reveal') || [])];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(idx * 0.07, 0.42)}s`;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObs.observe(el));

  // ── Form Tab Switcher ──
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.lead-form').forEach(f => {
        f.classList.toggle('hidden', f.id !== `form-${target}`);
      });
    });
  });

  // ── Lead Forms → Google Sheets ──
  document.querySelectorAll('.lead-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      const successEl = form.querySelector('.form-success') ||
                        document.getElementById(`success-${form.dataset.sheet?.toLowerCase()}`);

      btn.textContent = 'Sending...';
      btn.disabled = true;

      const data = {};
      new FormData(form).forEach((v, k) => data[k] = v);
      data.sheet = form.dataset.sheet || 'General';
      data.timestamp = new Date().toISOString();
      data.source_url = window.location.href;

      try {
        if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
        }
        // Show success regardless (no-cors means we can't read response)
        if (successEl) {
          successEl.style.display = 'block';
          successEl.style.animation = 'fadeIn 0.4s ease';
        }
        btn.textContent = '✓ Sent';
        btn.style.background = '#4caf50';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
          if (successEl) setTimeout(() => { successEl.style.display = 'none'; }, 5000);
        }, 4000);
      } catch (err) {
        btn.textContent = 'Error — Try Again';
        btn.style.background = '#e53935';
        btn.disabled = false;
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 3000);
      }
    });
  });

});
