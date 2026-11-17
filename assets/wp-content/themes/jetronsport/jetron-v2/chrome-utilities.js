(() => {
  const init = () => {
    const button = document.getElementById('jtn-scroll-top');
    if (!button) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const overlays = '.modal,.js-modal,[role="dialog"][aria-modal="true"],.fancybox__container,.mfp-wrap,.pswp';
    const visible = el => {
      const s = getComputedStyle(el);
      return !el.hidden && s.display !== 'none' && s.visibility !== 'hidden' && el.getClientRects().length > 0;
    };
    const sync = () => {
      const blocked = document.body.matches('.jmx-menu-open,.noscroll,.jtn2-noscroll') ||
        [...document.querySelectorAll(overlays)].some(visible);
      button.hidden = window.scrollY < 320 || blocked;
    };
    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; sync(); });
    };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    new MutationObserver(records => {
      if (records.some(r => r.target !== button)) schedule();
    }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class','style','hidden','open'], childList: true });
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduced.matches ? 'instant' : 'smooth' });
      const target = document.querySelector('.jtn2-logo');
      if (target) target.focus({ preventScroll: true });
    });
    sync();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
