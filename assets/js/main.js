(function () {
  'use strict';

  // Header: add a border once the page is scrolled.
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile navigation.
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav && header) {
    var setOpen = function (open) {
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // Footer year.
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // Contact form.
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = form.querySelector('.form-status');
  var submit = form.querySelector('button[type="submit"]');
  var endpoint = (form.dataset.endpoint || '').trim();
  var email = form.dataset.email;

  var showStatus = function (msg, kind) {
    status.textContent = msg;
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
  };

  var field = function (name) {
    var el = form.elements[name];
    return el ? el.value.trim() : '';
  };

  var openMailClient = function () {
    var company = field('company');
    var lines = [
      'Name: ' + field('name'),
      'Email: ' + field('email'),
      'Company: ' + company,
      field('role') ? 'Role: ' + field('role') : null,
      field('stage') ? 'Where we are today: ' + field('stage') : null,
      '',
      field('message')
    ].filter(function (l) { return l !== null; });
    var href = 'mailto:' + email +
      '?subject=' + encodeURIComponent('Consultation request — ' + company) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = href;
    showStatus('Your email app should open with your message ready to send. If it doesn’t, email us at ' + email + '.', 'success');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    showStatus('');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Honeypot: bots fill hidden fields; silently accept and drop.
    if (field('_gotcha')) {
      form.reset();
      showStatus('Thank you. We’ll be in touch within one business day.', 'success');
      return;
    }

    if (!endpoint) {
      openMailClient();
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending…';

    fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        form.reset();
        showStatus('Thank you. We’ll be in touch within one business day.', 'success');
      })
      .catch(function () {
        showStatus('Something went wrong sending your message. Please email us directly at ' + email + '.', 'error');
      })
      .then(function () {
        submit.disabled = false;
        submit.textContent = 'Request a consultation';
      });
  });
})();
