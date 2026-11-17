(() => {
  const init = () => {
    if (matchMedia('(max-width:1024px)').matches) return;
    document.querySelectorAll('.jtn2-header').forEach(header => {
      const nav = header.querySelector('.jtn2-nav');
      if (!nav || nav.querySelector('.jtn2-catalog-dd')) return;
      const catalog = [...nav.querySelectorAll('a')].find(a => a.textContent.trim() === 'Каталог');
      if (!catalog) return;
      const wrap = document.createElement('div');
      wrap.className = 'jtn2-catalog-dd';
      catalog.before(wrap);
      wrap.append(catalog);
      catalog.classList.add('jtn2-catalog-dd-btn');
      catalog.setAttribute('aria-haspopup','true');
      catalog.setAttribute('aria-expanded','false');
      const menu = document.createElement('div');
      menu.className = 'jtn2-catalog-dd-menu';
      menu.innerHTML = `
        <a href="/shop/vzroslaya-forma/">Взрослая</a>
        <a href="/shop/detskaya-forma/">Детская</a>
        <a href="/shop/futbolnye-futbolki/">Футбольные футболки</a>
        <a href="/shop/vratarskaya-forma/">Вратарская форма</a>
        <a href="/shop/sudejskaya-forma/">Судейская форма</a>
        <a href="/shop/rasprodazha/">Распродажа</a>
        <a href="/onlajn-konstruktor-formy/">Конструктор футбольной формы</a>
        <a href="/onlajn-konstruktor-futbolok/">Конструктор футболок</a>`;
      wrap.append(menu);
      const open = () => { wrap.classList.add('is-open'); catalog.setAttribute('aria-expanded','true'); };
      const close = () => { wrap.classList.remove('is-open'); catalog.setAttribute('aria-expanded','false'); };
      wrap.addEventListener('mouseenter', open);
      wrap.addEventListener('mouseleave', close);
      catalog.addEventListener('focus', open);
      wrap.addEventListener('focusout', e => { if (!wrap.contains(e.relatedTarget)) close(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true}); else init();
})();
