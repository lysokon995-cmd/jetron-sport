(() => {
  if (window.__jtnMobileV2Installed) return;
  window.__jtnMobileV2Installed = true;

  const mobile = matchMedia('(max-width:1024px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let cleanup = () => {};

  function init() {
    cleanup();
    cleanup = () => {};

    if (!mobile.matches) return;

    const root = document.querySelector('[data-jtn2]');
    if (!root) return;

    const abort = new AbortController();
    const undo = [];
    const listen = (element, name, fn, options = {}) => {
      if (element) {
        element.addEventListener(name, fn, {
          ...options,
          signal: abort.signal
        });
      }
    };

    /* Нанесение: лёгкий scale стрелки и футболок при появлении в кадре.
       На design-preview стрелкой управляет preview-p79 (j78-center-focus). */
    const printCard = root.querySelector('.jtn2-print.jtp');
    if (
      printCard &&
      'IntersectionObserver' in window &&
      !document.body.classList.contains('jetron-design-preview')
    ) {
      const syncPrint = (on) => {
        printCard.classList.toggle('jmx-print-inview', on);
      };
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          syncPrint(entry.isIntersecting && entry.intersectionRatio >= 0.28);
        });
      }, { threshold: [0, 0.28, 0.45, 0.7] });
      io.observe(printCard);
      undo.push(() => {
        io.disconnect();
        printCard.classList.remove('jmx-print-inview');
      });
    }
    /* Фичи: оборачиваем текст, чтобы выровнять правый край с иконками. */
    root.querySelectorAll('.jtn2-player-feats li').forEach(li => {
      if (li.querySelector('.jmx-feat-text')) return;

      const label = document.createElement('span');
      label.className = 'jmx-feat-text';

      [...li.childNodes].forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          label.appendChild(node);
        }
      });

      if (!label.textContent.trim()) return;

      li.prepend(label);

      undo.push(() => {
        while (label.firstChild) li.insertBefore(label.firstChild, label);
        label.remove();
      });
    });
    /* Дополнительные 5px перед карточкой нанесения. */
    const printing = root.querySelector('.jtn2-print.jtp');

    if (printing) {
      const oldValue = printing.style.getPropertyValue('margin-top');
      const oldPriority = printing.style.getPropertyPriority('margin-top');
      const margin = parseFloat(getComputedStyle(printing).marginTop) || 0;

      printing.style.setProperty('margin-top', `${margin + 5}px`, 'important');

      undo.push(() => {
        if (oldValue) {
          printing.style.setProperty('margin-top', oldValue, oldPriority);
        } else {
          printing.style.removeProperty('margin-top');
        }
      });

      const point = printing.querySelector('.jtp-points li');

      if (point) {
        const oldText = point.textContent;
        point.textContent = 'Номер на шортах\nвключён в стоимость';
        undo.push(() => point.textContent = oldText);
      }
    }

    /* =========================================
       МЕНЮ: отдельный слой непосредственно в body
       ========================================= */

    const source = document.querySelector('[data-jtn2-mnav]');
    const trigger = document.querySelector('[data-jtn2-menu]');

    if (source && trigger) {
      const shell = document.createElement('div');
      shell.className = 'jmx-menu';
      shell.hidden = true;

      shell.innerHTML = `
        <button class="jmx-backdrop"
                type="button"
                tabindex="-1"
                aria-label="Закрыть меню"></button>
        <section class="jmx-panel"
                 role="dialog"
                 aria-modal="true"
                 aria-label="Навигация по сайту"
                 tabindex="-1">
          <div class="jmx-top">
            <button class="jmx-close"
                    type="button"
                    aria-label="Закрыть меню">×</button>
          </div>
          <div class="jmx-scroll">
            <nav class="jmx-links" aria-label="Меню сайта"></nav>
            <div class="jmx-footer"></div>
          </div>
        </section>
      `;

      /* Build the menu off-screen but already rendered. This prevents the first
       * opening from flashing an unlaid-out gap while the browser paints it. */
      shell.classList.add('jmx-ready');
      document.body.append(shell);

      const panel = shell.querySelector('.jmx-panel');
      const backdrop = shell.querySelector('.jmx-backdrop');
      const scroller = shell.querySelector('.jmx-scroll');
      const links = shell.querySelector('.jmx-links');
      const footer = shell.querySelector('.jmx-footer');
      const closeButton = shell.querySelector('.jmx-close');

      /* Mobile IA: fixed ordered list requested for the compact sheet. */
      const allSourceLinks = [...source.querySelectorAll('a[href]')];
      const hrefByText = label => {
        const found = allSourceLinks.find(a => a.textContent.replace(/\s+/g, ' ').trim() === label);
        return found ? found.getAttribute('href') : '#';
      };
      const addLink = (label, href, className = '') => {
        const a = document.createElement('a');
        a.href = href || '#';
        a.textContent = label;
        if (className) a.className = className;
        links.append(a);
      };
      const divider = () => {
        const span = document.createElement('span');
        span.className = 'jmx-group-divider';
        span.setAttribute('aria-hidden', 'true');
        links.append(span);
      };

      const phone = document.createElement('a');
      phone.className = 'jmx-phone';
      phone.href = 'tel:+79629000133';
      phone.textContent = '8 962 900-01-33';
      scroller.prepend(phone);

      addLink('Взрослая', hrefByText('Взрослая'));
      addLink('Детская', hrefByText('Детская'));
      addLink('Футбольные футболки', hrefByText('Футбольные футболки'));
      addLink('Вратарская', hrefByText('Вратарская форма'));
      addLink('Судейская', hrefByText('Судейская форма'));
      addLink('Распродажа', hrefByText('Распродажа'));
      divider();
      addLink('Конструктор футбольной формы', hrefByText('Конструктор формы'));
      addLink('Конструктор футболок', hrefByText('Конструктор футболок'));

      const callback = document.createElement('button');
      callback.type = 'button';
      callback.className = 'jtn2-mnav-call';
      callback.setAttribute('data-jtn2-callback', '');
      callback.textContent = 'Заказать обратный звонок';
      links.append(callback);

      divider();
      addLink('О нас', hrefByText('О нас'));
      addLink('Наши работы', hrefByText('Наши работы'));
      addLink('Доставка и оплата', hrefByText('Доставка и оплата'));
      addLink('Контакты', hrefByText('Контакты'));

      /* Keep the real messenger SVG links and move only those into the menu. */
      const moved = [];
      const social = document.querySelector('.jtn2-social');
      if (social) {
        const marker = document.createComment('jmx-original-position');
        social.before(marker);
        moved.push([social, marker]);
        footer.append(social);
      }

      const collapse = document.createElement('button');
      collapse.type = 'button';
      collapse.className = 'jmx-collapse';
      collapse.innerHTML = '<span>Свернуть меню</span><svg class="jmx-collapse-mark" viewBox="0 0 20 12" aria-hidden="true"><path d="M2 10 10 2l8 8"/></svg>';
      footer.append(collapse);

      let restoreScroll = null;

      function lockPage() {
        if (restoreScroll) return;

        const y = window.scrollY;
        const properties = ['position', 'top', 'left', 'right', 'width'];
        const saved = properties.map(name => [
          name,
          document.body.style.getPropertyValue(name),
          document.body.style.getPropertyPriority(name)
        ]);

        document.body.style.setProperty('position', 'fixed', 'important');
        document.body.style.setProperty('top', `-${y}px`, 'important');
        document.body.style.setProperty('left', '0', 'important');
        document.body.style.setProperty('right', '0', 'important');
        document.body.style.setProperty('width', '100%', 'important');

        restoreScroll = () => {
          const yRestore = y;
          saved.forEach(([name, value, priority]) => {
            if (value) {
              document.body.style.setProperty(name, value, priority);
            } else {
              document.body.style.removeProperty(name);
            }
          });

          const apply = () => window.scrollTo(0, yRestore);
          apply();
          requestAnimationFrame(() => {
            apply();
            requestAnimationFrame(apply);
          });
          restoreScroll = null;
        };
      }

      function resetPanelMotion() {
        panel.style.transform = '';
        panel.style.transition = '';
        backdrop.style.opacity = '';
        backdrop.style.transition = '';
      }

      let menuHideTimer = 0;

      function setMenu(open, focus = true) {
        clearTimeout(menuHideTimer);
        trigger.setAttribute('aria-expanded', String(open));

        /* Старый drawer остаётся закрытым. */
        source.hidden = true;
        source.classList.remove('is-open');
        root.classList.remove('is-menu-open');

        if (open) {
          resetPanelMotion();
          /* Menu must begin exactly under the header's current visual bottom.
           * Sticky header is compact, normal mobile header is taller; a fixed 70px
           * offset created the visible gap/overlap shown on some pages. */
          const liveHeader = document.querySelector('.jtn2-sticky-portal .jtn2-header.is-jtn2-sticky') || root.querySelector('.jtn2-header');
          const liveRect = liveHeader ? liveHeader.getBoundingClientRect() : null;
          const menuTop = liveRect ? Math.max(0, Math.ceil(liveRect.bottom) - 1) : 69;
          shell.style.setProperty('--jmx-menu-top', `${menuTop}px`);
          /* Make the opaque drawer paint first, then mark the page/header open.
           * This prevents a single compositing frame where sticky chrome changes
           * but the drawer has not painted yet. */
          shell.classList.remove('is-closing');
          shell.classList.add('is-open');
          shell.hidden = false;
          // Force style/layout commit before exposing the header state.
          void shell.offsetHeight;
          document.body.classList.add('jmx-menu-open');
          if (liveHeader) liveHeader.classList.add('jmx-header-menu-open');
          /* Show the already-built drawer atomically. Do not wait two animation
           * frames: on deferred/mobile JS that exposed underlying page content for
           * a frame and looked like a gap/foreign slide under the sticky header. */
          lockPage();
          if (focus) phone.focus({ preventScroll: true });
        } else {
          document.body.classList.remove('jmx-menu-open');
          document.querySelectorAll('.jtn2-header.jmx-header-menu-open').forEach(el => el.classList.remove('jmx-header-menu-open'));
          shell.classList.remove('is-open');
          shell.classList.add('is-closing');
          if (restoreScroll) restoreScroll();
          menuHideTimer = window.setTimeout(() => {
            shell.hidden = true;
            shell.classList.remove('is-closing');
            resetPanelMotion();
          }, reduced.matches ? 0 : 300);
          if (focus) trigger.focus({ preventScroll: true });
        }
      }

      listen(document, 'click', event => {
        if (event.target.closest('[data-jtn2-menu]') !== trigger) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        setMenu(!shell.classList.contains('is-open'));
      }, { capture: true });

      listen(closeButton, 'click', () => setMenu(false));
      listen(backdrop, 'click', () => setMenu(false));
      listen(collapse, 'click', () => setMenu(false));

      listen(links, 'click', event => {
        /*
         * «Каталог» — button, поэтому сюда не попадает.
         * Заявка продолжает всплывать к штатному обработчику hero.js.
         *
         * Важно для iOS/mobile: setMenu(false) восстанавливает прежнюю
         * scroll-позицию после body{position:fixed}. Если оставить переход
         * по #якорю браузеру, restoreScroll тут же прокручивает страницу
         * обратно, и ссылка выглядит нерабочей. Для якорей текущей страницы
         * сначала снимаем scroll-lock, затем выполняем прокрутку сами.
         */
        const callback = event.target.closest('[data-jtn2-callback]');
        const anchor = event.target.closest('a[href]');

        if (callback) {
          setMenu(false, false);
          return;
        }

        if (!anchor) return;

        let url = null;
        try {
          url = new URL(anchor.getAttribute('href'), location.href);
        } catch (_) {}

        const normalizePath = value => (value || '/').replace(/\/+$/, '') || '/';
        const samePage = url &&
          url.origin === location.origin &&
          normalizePath(url.pathname) === normalizePath(location.pathname) &&
          url.search === location.search;

        if (!samePage || !url.hash) {
          setMenu(false, false);
          return;
        }

        let id = '';
        try {
          id = decodeURIComponent(url.hash.slice(1));
        } catch (_) {
          id = url.hash.slice(1);
        }

        const target = id ? document.getElementById(id) : null;
        if (!target) {
          setMenu(false, false);
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        setMenu(false, false);

        const go = () => {
          try {
            history.pushState(null, '', location.pathname + location.search + url.hash);
          } catch (_) {}

          const top = target.getBoundingClientRect().top + window.pageYOffset - 12;
          window.scrollTo({
            top,
            behavior: reduced.matches ? 'auto' : 'smooth'
          });
        };

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(go, 40);
          });
        });
      });

            /* Header actions remain usable while the drawer is open. If Cart is tapped,
       * close/unlock the drawer first, then let the site's native cart handler open
       * its modal above the page. */
      listen(document, 'click', event => {
        if (!shell.classList.contains('is-open')) return;
        const cart = event.target.closest('.jtn2-cart, .shopcart, [data-jtn2-cart]');
        if (!cart) return;
        setMenu(false, false);
        /* Do not prevent/stop propagation: the existing cart click handler must run. */
      }, { capture: true });

listen(document, 'keydown', event => {
        if (shell.hidden) return;

        if (event.key === 'Escape') {
          event.preventDefault();
          setMenu(false);
          return;
        }

        if (event.key !== 'Tab') return;

        const elements = [...panel.querySelectorAll('a,button,input')]
          .filter(el => el.getClientRects().length && !el.disabled && el.tabIndex >= 0);

        if (!elements.length) return;

        const first = elements[0];
        const last = elements[elements.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus({ preventScroll: true });
        }
      });

      /* Меню следует за пальцем вправо и закрывается по порогу. */
      let drag = null;

      listen(panel, 'touchstart', event => {
        drag = null;

        if (
          event.touches.length !== 1 ||
          event.target.closest('input, textarea, .jmx-close')
        ) return;

        const touch = event.touches[0];
        drag = {
          x: touch.clientX,
          y: touch.clientY,
          dx: 0,
          active: false
        };
      }, { passive: true });

      listen(panel, 'touchmove', event => {
        if (!drag) return;

        const touch = event.touches[0];
        const dx = touch.clientX - drag.x;
        const dy = touch.clientY - drag.y;

        if (!drag.active) {
          if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;

          /* Вертикальный скролл списка — не перехватываем. */
          if (Math.abs(dy) >= Math.abs(dx) || dx <= 0) {
            drag = null;
            return;
          }

          drag.active = true;
          panel.style.transition = 'none';
          backdrop.style.transition = 'none';
        }

        if (!drag.active) return;

        if (event.cancelable) event.preventDefault();

        drag.dx = Math.min(panel.offsetWidth, Math.max(0, dx));
        const progress = drag.dx / Math.max(1, panel.offsetWidth);

        panel.style.transform = `translate3d(${drag.dx}px,0,0)`;
        backdrop.style.opacity = String(Math.max(0, 1 - progress));
      }, { passive: false });

      function endDrag(commit) {
        if (!drag) return;

        const { active, dx } = drag;
        drag = null;

        if (!active) return;

        const threshold = panel.offsetWidth * 0.28;

        panel.style.transition = 'transform .28s ease';
        backdrop.style.transition = 'opacity .28s ease';

        if (commit && dx > threshold) {
          panel.style.transform = `translate3d(100%,0,0)`;
          backdrop.style.opacity = '0';

          const finish = () => {
            panel.removeEventListener('transitionend', finish);
            setMenu(false, true);
          };

          panel.addEventListener('transitionend', finish);
          setTimeout(finish, 320);
        } else {
          panel.style.transform = 'translate3d(0,0,0)';
          backdrop.style.opacity = '1';

          const clear = () => {
            panel.removeEventListener('transitionend', clear);
            resetPanelMotion();
          };

          panel.addEventListener('transitionend', clear);
          setTimeout(clear, 320);
        }
      }

      listen(panel, 'touchend', () => endDrag(true), { passive: true });
      listen(panel, 'touchcancel', () => endDrag(false), { passive: true });

      undo.push(() => {
        setMenu(false, false);

        moved.forEach(([element, marker]) => marker.replaceWith(element));

        shell.remove();
      });
    }

    /* =========================================
       КАТЕГОРИИ: плавный transform вместо scrollLeft
       ========================================= */

    const tabs = root.querySelector('.jtn2-cat-tabs');
    let raf = 0;

    if (tabs && tabs.children.length) {
      const originals = [...tabs.children];
      const track = document.createElement('div');

      track.className = 'jmx-category-track';
      tabs.classList.add('jmx-categories');

      originals.forEach(element => track.append(element));

      function cloneSet() {
        return originals.map(element => {
          const copy = element.cloneNode(true);

          copy.removeAttribute('id');
          copy.setAttribute('aria-hidden', 'true');
          copy.tabIndex = -1;
          track.append(copy);

          return copy;
        });
      }

      const copies = cloneSet();
      cloneSet();
      tabs.append(track);

      let cycle = 0;
      let position = 0;
      let previous = 0;
      let pauseUntil = performance.now() + 1000;
      let pointer = null;
      let dragged = false;

      // Touch focus must not permanently pause the ticker; keyboard focus must.
      let keyboardInput = false;
      const canCheckFocus = window.CSS?.supports('selector(:focus-visible)');
      listen(document, 'keydown', () => { keyboardInput = true; }, { capture: true });
      listen(document, 'pointerdown', () => { keyboardInput = false; }, { capture: true, passive: true });
      const keyboardFocus = () => {
        const active = document.activeElement;
        return tabs.contains(active) && (keyboardInput ||
          (canCheckFocus && active.matches(':focus-visible')));
      };
      const allLinks = [...track.children];
      let tabWidth = 0, linkMetrics = new Map();
      const modulo = (value, length) => ((value % length) + length) % length;

      function measure() {
        tabWidth = tabs.clientWidth;
        linkMetrics = new Map(allLinks.map(link => [link, { left: link.offsetLeft, width: link.offsetWidth }]));
        paintedPosition = NaN;
        cycle = copies[0].offsetLeft - originals[0].offsetLeft;
        if (cycle > 0) position = modulo(position, cycle);
      }

      let currentLink = originals[0] || allLinks[0] || null;
      let paintedLink = null;
      let paintedPosition = NaN;
      allLinks.forEach(link => link.classList.remove('jmx-current'));

      function linkBox(link) {
        const metric = linkMetrics.get(link);
        const left = metric.left - position;
        const width = metric.width;
        return { left, width, right: left + width };
      }

      function visibleRatio(link) {
        if (!link) return 0;
        const { left, right, width } = linkBox(link);
        if (!width) return 0;
        const visible = Math.max(0, Math.min(right, tabWidth) - Math.max(left, 0));
        return visible / width;
      }

      function advanceFrom(link) {
        const idx = allLinks.indexOf(link);
        if (idx < 0) return allLinks.find(item => visibleRatio(item) > 0.3) || allLinks[0];

        const { right } = linkBox(link);
        const exitingLeft = right < tabWidth * 0.55;

        return exitingLeft
          ? (allLinks[idx + 1] || allLinks[0])
          : (allLinks[idx - 1] || allLinks[allLinks.length - 1]);
      }

      function paint() {
        if (position === paintedPosition && paintedLink) return;
        if (position !== paintedPosition) {
          track.style.transform = `translate3d(${-position}px,0,0)`;
          paintedPosition = position;
        }

        if (!currentLink || !allLinks.includes(currentLink)) {
          currentLink = allLinks.find(item => visibleRatio(item) > 0.3) || allLinks[0];
        }

        let guard = 0;
        while (currentLink && visibleRatio(currentLink) <= 0.3 && guard < allLinks.length) {
          currentLink = advanceFrom(currentLink);
          guard += 1;
        }

        if (currentLink !== paintedLink) {
          paintedLink?.classList.remove('jmx-current');
          currentLink?.classList.add('jmx-current');
          paintedLink = currentLink;
        }
      }

      function frame(time) {
        const elapsed = previous ? Math.min(time - previous, 50) : 0;
        previous = time;

        const bounds = tabs.getBoundingClientRect();
        const inView = bounds.bottom > 0 && bounds.top < innerHeight;

        if (
          cycle > 0 &&
          !pointer &&
          !reduced.matches &&
          !document.hidden &&
          inView &&
          time > pauseUntil &&
          !keyboardFocus()
        ) {
          position = modulo(position + elapsed * 0.014, cycle);
        }

        paint();
        raf = requestAnimationFrame(frame);
      }

      const observer = new ResizeObserver(measure);
      observer.observe(tabs);
      observer.observe(track);

      measure();
      document.fonts?.ready.then(() => {
        if (!abort.signal.aborted) measure();
      });

      listen(tabs, 'pointerdown', event => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;

        pointer = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          position
        };

        dragged = false;
        pauseUntil = performance.now() + 3000;
      });

      /*
       * Невешанный на document non-passive pointermove блокировал
       * вертикальный скролл страницы (touch/trackpad), даже когда
       * жест начинался вне вкладок. Слушаем tabs + setPointerCapture.
       */
      listen(tabs, 'pointermove', event => {
        if (!pointer || event.pointerId !== pointer.id || cycle <= 0) return;

        const dx = event.clientX - pointer.x;
        const dy = event.clientY - pointer.y;

        if (!dragged && Math.abs(dy) > 6 && Math.abs(dy) >= Math.abs(dx)) {
          pointer = null;
          return;
        }

        if (!dragged && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
          dragged = true;
          try { tabs.setPointerCapture(event.pointerId); } catch (_) {}
        }

        if (dragged) {
          if (event.cancelable) event.preventDefault();
          position = modulo(pointer.position - dx, cycle);
          paint();
        }
      }, { passive: false });

      function release(event) {
        if (!pointer || event.pointerId !== pointer.id) return;
        pointer = null;
        pauseUntil = performance.now() + 3000;
      }

      listen(document, 'pointerup', release);
      listen(document, 'pointercancel', release);
      listen(tabs, 'lostpointercapture', event => {
        // A link's implicit capture moves to tabs during a drag; that is not its end.
        if (event.target === tabs) release(event);
      });
      const resetInteraction = () => {
        pointer = null;
        dragged = false;
        previous = 0;
        pauseUntil = performance.now() + 1000;
        measure();
      };
      listen(window, 'pageshow', resetInteraction);
      listen(window, 'blur', resetInteraction);
      listen(document, 'visibilitychange', () => { if (!document.hidden) resetInteraction(); });

      listen(tabs, 'click', event => {
        if (!dragged) return;
        event.preventDefault();
        event.stopPropagation();
        dragged = false;
      }, { capture: true });

      listen(tabs, 'focusin', event => {
        if (!keyboardFocus()) return;
        pauseUntil = performance.now() + 3000;
        const link = event.target.closest('a');

        if (link && cycle > 0) {
          position = modulo(link.offsetLeft - 16, cycle);
          paint();
        }
      });

      listen(tabs, 'wheel', event => {
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || cycle <= 0) return;

        event.preventDefault();
        position = modulo(position + event.deltaX, cycle);
        pauseUntil = performance.now() + 3000;
        paint();
      }, { passive: false });

      raf = requestAnimationFrame(frame);

      undo.push(() => {
        observer.disconnect();
        originals.forEach(element => {
          element.classList.remove('jmx-current');
          tabs.append(element);
        });

        track.remove();
        tabs.classList.remove('jmx-categories');
      });
    }

    cleanup = () => {
      cancelAnimationFrame(raf);
      abort.abort();
      undo.reverse().forEach(fn => fn());
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  mobile.addEventListener('change', init);
})();


/* jtn2 sticky header portal pass29 */
(() => {
  const initStickyHeaders = () => {
    const headers = [...document.querySelectorAll('.jtn2 .jtn2-header')];
    if (!headers.length) return;

    headers.forEach(header => {
      if (header.dataset.jtnStickyReady === '1') return;
      header.dataset.jtnStickyReady = '1';

      const sourceRoot = header.closest('.jtn2');
      const spacer = document.createElement('div');
      spacer.className = 'jtn2-sticky-spacer';
      spacer.setAttribute('aria-hidden', 'true');
      header.before(spacer);

      const portal = document.createElement('div');
      portal.className = 'jtn2 jtn2-sticky-portal';
      portal.hidden = true;
      portal.setAttribute('aria-hidden', 'true');
      document.body.append(portal);

      let originY = 0;
      let headerHeight = 0;
      let naturalLeft = 0;
      let naturalWidth = 0;
      let ticking = false;

      const copyVars = () => {
        const styles = getComputedStyle(sourceRoot);
        ['--bg', '--ink', '--muted', '--brand', '--hover'].forEach(name => {
          const value = styles.getPropertyValue(name);
          if (value) portal.style.setProperty(name, value);
        });
      };

      const restore = () => {
        if (header.parentNode === portal) {
          header.classList.remove('is-jtn2-sticky');
          spacer.after(header);
        }
        portal.hidden = true;
        spacer.style.height = '0px';
      };

      const measureNatural = () => {
        // A fixed body temporarily reports scrollY=0. Preserve the live header
        // and its geometry until the menu releases the page scroll lock.
        if (document.body.classList.contains('jmx-menu-open')) return;
        const wasSticky = header.parentNode === portal;
        if (wasSticky) restore();

        const rect = header.getBoundingClientRect();
        originY = rect.top + window.scrollY;
        headerHeight = Math.ceil(rect.height);
        naturalLeft = Math.round(rect.left);
        naturalWidth = Math.round(rect.width);
        const headerStyles = getComputedStyle(header);

        header.style.setProperty('--jtn-sticky-left', `${naturalLeft}px`);
        header.style.setProperty('--jtn-sticky-width', `${naturalWidth}px`);
        header.style.setProperty('--jtn-sticky-height', `${headerHeight}px`);
        header.style.setProperty('--jtn-sticky-pad-left', headerStyles.paddingLeft || '0px');
        header.style.setProperty('--jtn-sticky-pad-right', headerStyles.paddingRight || '0px');
        copyVars();

        if (wasSticky || window.scrollY > originY) stick();
      };

      const stick = () => {
        if (header.parentNode === portal) return;
        spacer.style.height = `${headerHeight}px`;
        portal.hidden = false;
        portal.removeAttribute('aria-hidden');
        portal.append(header);
        header.classList.add('is-jtn2-sticky');
      };

      const unstick = () => {
        if (header.parentNode !== portal) return;
        header.classList.remove('is-jtn2-sticky');
        spacer.after(header);
        portal.hidden = true;
        portal.setAttribute('aria-hidden', 'true');
        spacer.style.height = '0px';
      };

      const update = () => {
        ticking = false;
        if (document.body.classList.contains('jmx-menu-open')) return;
        if (window.scrollY > originY) stick();
        else unstick();
      };

      const requestUpdate = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      };

      measureNatural();
      update();

      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', () => {
        clearTimeout(header._jtnStickyResizeTimer);
        header._jtnStickyResizeTimer = setTimeout(() => {
          measureNatural();
          requestUpdate();
        }, 140);
      }, { passive: true });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStickyHeaders, { once: true });
  } else {
    initStickyHeaders();
  }
})();
