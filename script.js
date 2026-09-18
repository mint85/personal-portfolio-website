/* allenjones.dev v3
   Vanilla JS. Theme toggle, mobile nav, hero terminal, scroll reveal,
   Netlify form submit, copyright year, 404 path, and one small tribute easter egg. */
(function () {
  'use strict';

  var docEl = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Theme toggle. The initial data-theme is set by the inline script in
     <head>; this only handles the button and persistence.
     --------------------------------------------------------------------- */
  var toggle = document.querySelector('.theme-switch');
  if (toggle) {
    var syncToggle = function () {
      var light = docEl.getAttribute('data-theme') === 'light';
      toggle.setAttribute('aria-checked', light ? 'true' : 'false');
    };
    toggle.addEventListener('click', function () {
      var next = docEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      docEl.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
      syncToggle();
    });
    syncToggle();
  }

  /* ---------------------------------------------------------------------
     Mobile nav: open/close, close on link click or Escape.
     --------------------------------------------------------------------- */
  var navToggle = document.querySelector('.nav__toggle');
  var navList = document.getElementById('site-nav');
  if (navToggle && navList) {
    var setOpen = function (open) {
      navList.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    navToggle.addEventListener('click', function () {
      setOpen(!navList.classList.contains('is-open'));
    });
    navList.addEventListener('click', function (e) {
      if (e.target.closest('a')) { setOpen(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navList.classList.contains('is-open')) {
        setOpen(false);
        navToggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------------------
     Copyright year.
     --------------------------------------------------------------------- */
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = year;
  });

  /* ---------------------------------------------------------------------
     Typing rotator.
     Adapted from a CodePen by CheeseTurtle: https://codepen.io/CheeseTurtle/pen/AYJYqE
     Changed to use textContent, a shared cursor element, and to respect
     prefers-reduced-motion.
     --------------------------------------------------------------------- */
  function TxtRotate(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.isDeleting = false;
    this.tick();
  }

  TxtRotate.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    this.txt = this.isDeleting
      ? fullTxt.substring(0, this.txt.length - 1)
      : fullTxt.substring(0, this.txt.length + 1);

    this.el.textContent = this.txt;

    var that = this;
    var delta = 105 - Math.random() * 100;
    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(function () { that.tick(); }, delta);
  };

  /* ---------------------------------------------------------------------
     Hero terminal. The markup ships fully rendered (works without JS and
     under reduced motion). With motion allowed, hide the lines and replay
     the session: commands are typed, output appears, then the rotator runs
     on the last line.
     --------------------------------------------------------------------- */
  var terminal = document.getElementById('hero-terminal');
  if (terminal) {
    var lines = Array.prototype.slice.call(terminal.querySelectorAll('.term-line'));
    var rotator = terminal.querySelector('.txt-rotate');
    var phrases = [];
    try { phrases = JSON.parse(rotator.getAttribute('data-rotate')) || []; } catch (e) { phrases = []; }
    var period = rotator ? rotator.getAttribute('data-period') : 2000;
    var cursor = terminal.querySelector('.cursor');

    var startRotator = function () {
      if (rotator && phrases.length) {
        rotator.textContent = '';
        new TxtRotate(rotator, phrases, period);
      }
    };

    if (reduceMotion || !lines.length) {
      /* Leave the static session in place. */
    } else {
      var cmds = lines.map(function (line) {
        var cmd = line.querySelector('.term-cmd');
        return cmd ? cmd.textContent : null;
      });
      lines.forEach(function (line, idx) {
        line.hidden = true;
        if (cmds[idx] !== null) { line.querySelector('.term-cmd').textContent = ''; }
      });
      if (rotator) { rotator.textContent = ''; }

      var typeCommand = function (line, text, done) {
        var target = line.querySelector('.term-cmd');
        line.hidden = false;
        target.insertAdjacentElement('afterend', cursor);
        var i = 0;
        var step = function () {
          target.textContent = text.substring(0, i + 1);
          i++;
          if (i < text.length) {
            setTimeout(step, 40 + Math.random() * 60);
          } else {
            setTimeout(done, 350);
          }
        };
        setTimeout(step, 250);
      };

      var showOutput = function (line, done) {
        line.hidden = false;
        line.appendChild(cursor);
        setTimeout(done, 450);
      };

      var run = function (idx) {
        if (idx >= lines.length) {
          var last = lines[lines.length - 1];
          if (rotator && last.contains(rotator)) {
            rotator.insertAdjacentElement('afterend', cursor);
          }
          startRotator();
          return;
        }
        var line = lines[idx];
        if (cmds[idx] !== null) {
          typeCommand(line, cmds[idx], function () { run(idx + 1); });
        } else {
          showOutput(line, function () { run(idx + 1); });
        }
      };

      setTimeout(function () { run(0); }, 600);
    }
  }

  /* ---------------------------------------------------------------------
     Scroll reveal. CSS hides .reveal only when html.js is present, so the
     content is always visible without JS or under reduced motion. A plain
     viewport check on load, scroll, and resize is used instead of an
     IntersectionObserver so nothing can stay hidden if callbacks stall.
     --------------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (revealEls.length) {
    if (reduceMotion) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var pending = revealEls.slice();
      var ticking = false;
      var checkReveal = function () {
        ticking = false;
        var limit = window.innerHeight * 0.92;
        pending = pending.filter(function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.top < limit && rect.bottom > 0) {
            el.classList.add('is-visible');
            return false;
          }
          return true;
        });
        if (!pending.length) {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onScroll);
        }
      };
      var onScroll = function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(checkReveal);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      checkReveal();
      /* Fonts and images can shift layout after first paint; look again. */
      window.addEventListener('load', checkReveal);
    }
  }

  /* ---------------------------------------------------------------------
     Contact form: submit to Netlify Forms with fetch and show an inline
     success state. Without JS the form posts normally and Netlify redirects
     to the action URL (/thanks.html).
     --------------------------------------------------------------------- */
  var form = document.querySelector('form[data-netlify="true"]');
  if (form && window.fetch) {
    var status = form.querySelector('.form__status');
    var success = document.getElementById('form-success');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('[type="submit"]');
      var endpoint = (status && status.getAttribute('data-endpoint')) || 'POST /contact';
      if (status) { status.textContent = endpoint + ' ...'; status.classList.remove('form__status--error'); }
      if (submitBtn) { submitBtn.disabled = true; }
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
      }).then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        if (status) { status.innerHTML = ''; status.textContent = endpoint + ' '; var ok = document.createElement('span'); ok.className = 'ok'; ok.textContent = '200 OK'; status.appendChild(ok); }
        form.hidden = true;
        if (success) {
          success.hidden = false;
          success.setAttribute('tabindex', '-1');
          success.focus();
        }
      }).catch(function () {
        if (submitBtn) { submitBtn.disabled = false; }
        if (status) {
          status.textContent = endpoint + ' 502 Bad Gateway. Could not send; try again or reach me on LinkedIn.';
          status.classList.add('form__status--error');
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Contact cards: play a tiny "request" when a link is clicked. The link
     opens in a new tab, so this page stays put to show the 200.
     --------------------------------------------------------------------- */
  document.querySelectorAll('.contact-link').forEach(function (link) {
    var badge = link.querySelector('.contact-link__status');
    if (!badge) { return; }
    link.addEventListener('click', function () {
      link.classList.remove('is-ok');
      link.classList.add('is-loading');
      badge.textContent = '...';
      setTimeout(function () {
        link.classList.remove('is-loading');
        link.classList.add('is-ok');
        badge.textContent = '200 OK';
      }, reduceMotion ? 0 : 420);
    });
  });

  /* ---------------------------------------------------------------------
     404 page: show the path that was requested.
     --------------------------------------------------------------------- */
  var nfPath = document.getElementById('nf-path');
  if (nfPath) {
    var requested = window.location.pathname || '/';
    nfPath.textContent = requested;
    var nfEcho = document.getElementById('nf-path-echo');
    if (nfEcho) { nfEcho.textContent = requested + ': '; }
  }

  /* ---------------------------------------------------------------------
     A quiet note for anyone reading the console.
     --------------------------------------------------------------------- */
  try {
    console.log(
      '%c rebeccapurple %c #663399 ',
      'background:#663399;color:#fff;padding:3px 8px;border-radius:4px 0 0 4px;font-family:monospace',
      'background:#1a1e24;color:#b794f6;padding:3px 8px;border-radius:0 4px 4px 0;font-family:monospace'
    );
    console.log(
      'The accent color on this site is one of my favorite colors called rebeccapurple, a CSS named color added in 2014 ' +
      'in memory of Rebecca Alison Meyer, who loved purple.\n' +
      'https://meyerweb.com/eric/thoughts/2014/06/19/rebeccapurple/'
    );
  } catch (e) { /* no console */ }
})();
