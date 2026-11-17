/* Static review behavior. The storefront scripts own galleries, sliders and menus. */
(() => {
  'use strict';
  document.body.classList.add('jetron-demo');
  const key = 'jetron_sport_demo_cookie_choice';
  const lifetime = 180 * 86400000;
  const banner = document.getElementById('jtn-cookie-banner');
  const settings = document.getElementById('jtn-cookie-settings');
  const analytics = settings?.querySelector('[name="analytics"]');
  let opener = null;
  const read = () => {
    try {
      const choice = JSON.parse(localStorage.getItem(key));
      return choice && typeof choice.analytics === 'boolean' && Number.isFinite(choice.time) && Date.now() >= choice.time && Date.now() - choice.time < lifetime ? choice : null;
    } catch { return null; }
  };
  const sync = () => { if (banner) banner.hidden = !!read(); };
  const save = enabled => {
    try { localStorage.setItem(key, JSON.stringify({ analytics: enabled, time: Date.now() })); }
    catch { /* The visible choice still applies for this open page. */ }
    if (banner) banner.hidden = true;
    settings?.close();
    opener?.focus({ preventScroll: true });
  };
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-jtn-cookie]');
    if (button) {
      event.preventDefault();
      switch (button.dataset.jtnCookie) {
        case 'settings': opener = button; analytics.checked = read()?.analytics === true; settings.showModal(); break;
        case 'close': settings.close(); opener?.focus({ preventScroll: true }); break;
        case 'accept': save(true); break;
        case 'reject': save(false); break;
        case 'save': save(analytics.checked); break;
      }
    }
    const city = event.target.closest('[data-r1ship-city-open],.jtn2-city');
    if (city) { event.preventDefault(); window.jQuery?.modal?.open('#js-modal-delivery'); }
  });
  addEventListener('storage', event => { if (event.key === key) sync(); });
  sync();
  // A GitHub Pages preview has no order/payment/contact backend.
  document.querySelectorAll('.wpcf7-form').forEach(form => {
    form.removeAttribute('novalidate');
    form.querySelectorAll('[aria-required="true"],[data-jtn-required]').forEach(field => { field.required = true; });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const output = form.querySelector('.wpcf7-response-output');
      if (!output) return;
      output.replaceChildren(document.createTextNode('Для отправки заявки откройте форму на основном сайте. '));
      const link = document.createElement('a');
      link.href = 'https://jetronsport.ru/#callback';
      link.textContent = 'Перейти к отправке';
      output.append(link);
      output.setAttribute('role', 'status');
      output.style.display = 'block';
    });
  });
  document.addEventListener('click', event => {
    const city = event.target.closest('.delivery__link');
    if (!city) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const name = city.textContent.trim();
    document.querySelectorAll('.r1ship-customer-city-name,.select-city span').forEach(el => { el.textContent = name; });
    window.jQuery?.modal?.close('#js-modal-delivery');
  }, true);
})();
