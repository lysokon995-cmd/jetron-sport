(() => {
  const root = document.querySelector(
    'body.jetron-design-preview [data-jtn2]'
  );
  if (!root || root.dataset.p79Ready) return;
  root.dataset.p79Ready = '1';

  const ns = 'http://www.w3.org/2000/svg';
  const mobile = matchMedia('(max-width:1024px)');
  const reduce = matchMedia('(prefers-reduced-motion:reduce)');

  /* ===== 1. Металлический градиент (замена, не наслоение) ===== */
  root.querySelectorAll('.jtn2-wave-heading__art').forEach((svg, index) => {
    svg.querySelectorAll('defs').forEach(defs => defs.remove());

    const id = `j79-metal-${index}`;
    const defs = document.createElementNS(ns, 'defs');
    const gradient = document.createElementNS(ns, 'linearGradient');

    gradient.id = id;
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '0%');
    gradient.setAttribute('y2', '100%');

    [
      ['0%', '#f4f5f6'],
      ['32%', '#d8dce0'],
      ['49%', '#a0a6ad'],
      ['53%', '#eef0f2'],
      ['76%', '#c5cad0'],
      ['100%', '#969da5']
    ].forEach(([offset, color]) => {
      const stop = document.createElementNS(ns, 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', color);
      gradient.append(stop);
    });

    defs.append(gradient);
    svg.prepend(defs);

    svg.querySelectorAll('text').forEach(text => {
      text.style.setProperty('fill', text.classList.contains('jtn2-wave-heading__category') ? '#b9bec4' : `url(#${id})`, 'important');
      text.style.setProperty('stroke', 'none', 'important');
      text.style.setProperty('paint-order', 'normal', 'important');
      text.style.setProperty('filter', 'none', 'important');
    });
  });

  /* ===== 6. Одна иконка характеристик ===== */
  const jacquard = `
    <svg class="j78-feature-icon" viewBox="0 0 32 32"
         fill="none" aria-hidden="true">
      <path d="M16 2 30 16 16 30 2 16Z"
            stroke="currentColor" stroke-width="1"/>
      <path d="M9 9 23 23M5.5 12.5 19.5 26.5
               M12.5 5.5 26.5 19.5
               M23 9 9 23M19.5 5.5 5.5 19.5
               M26.5 12.5 12.5 26.5"
            stroke="currentColor" stroke-width=".8"/>
      <path d="M16 9 23 16 16 23 9 16Z"
            stroke="#b65795" stroke-width="1"/>
    </svg>`;

  const breathable = `
    <svg class="j78-feature-icon" viewBox="0 0 32 32"
         fill="none" aria-hidden="true">
      <g stroke="currentColor" stroke-width="1.2"
         stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 13V5m-3 3 3-3 3 3"/>
        <path d="M25 13V5m-3 3 3-3 3 3"/>
        <path d="M2 20q7-5 14 0t14 0
                 M2 25q7-5 14 0t14 0
                 M2 30q7-5 14 0t14 0"/>
      </g>
      <path d="M16 13V1m-3 3 3-3 3 3"
            stroke="#b65795" stroke-width="1.3"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  const quickDry = `<svg class="j78-feature-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M13 3 6 14a8 8 0 0 0 13 9" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
    <path d="M13 3 19 12M5 27h21M19 18h10M22 13h7M22 23h7" stroke="currentColor" stroke-width=".8"/>
    <path d="m18 9 4-5 4 5M22 4v14" stroke="#b65795" stroke-width="1" stroke-linejoin="round"/>
  </svg>`;

  root.querySelectorAll('.jtn2-player-feats').forEach(list => {
    const favorit = list.closest('[data-model="favorit"]');
    const legend = list.closest('[data-model="legend"]');
    const polyester='<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M3 10c6-12 8 24 14 12S23 0 29 12M3 20c6-12 8 12 14 0S23 10 29 22" stroke="currentColor" stroke-width="1"/><path d="M10 5v22M22 5v22" stroke="#b65795" stroke-width="1"/></svg>';
    const items = list.querySelectorAll('li');
    const model=legend?'legend':favorit?'favorit':'wave';
    if (items[0]) {
      items[0].innerHTML =
        '<span class="jmx-feat-text">Ткань жаккард</span>' +
        jacquard;
    }
    if (items[1]) {
      items[1].innerHTML =
        '<span class="jmx-feat-text">Супердышащая</span>' +
        (legend?polyester:favorit ? quickDry : breathable);
    }
  });

  root.querySelectorAll('.jtn2-player-feats').forEach(list=>{
    const model=list.closest('[data-model]')?.dataset.model||'wave';
    list.querySelectorAll('.jmx-feat-text').forEach((el,i)=>{const value=window.JTN_DESIGN_CONTENT?.[model+'_feature_'+(i+1)];if(value!==undefined)el.textContent=value;});
  });
  /* ===== Мобильный блок нанесения (.jpm) ===== */
  root.querySelectorAll('.jpm').forEach(mobilePrint => {
    const title = mobilePrint.querySelector('.jpm__title');
    const price = mobilePrint.querySelector('.jpm__price');
    if (!title || title.classList.contains('j79-heading')) return;

    title.classList.add('j79-heading');
    /* Price stays in its own .jtn-mobile-price cell — do not embed in title. */
    title.replaceChildren(...(window.JTN_DESIGN_CONTENT?.print_title||'Нанесение фамилии\nи номера').split('\n').map(line=>{const span=document.createElement('span');span.className='j79-heading-line';span.textContent=line;return span;}));

    if (price) {
      price.classList.add('jtn-mobile-price');
      price.textContent = window.JTN_DESIGN_CONTENT?.print_price??'600 ₽';
    }
  });

  // Align prices to the final title line, including wrapping at narrow widths.
  // ResizeObserver does no work on scroll and also catches font/layout changes.
  const priceCards=[...root.querySelectorAll('.jpm,.jkg')];
  const priceBaselines=priceCards.map(card=>{
    const title=card.querySelector('.j79-heading-line:last-child,.jkg__title-line2');
    const price=card.querySelector('.mobile-card-price');
    if(!title||!price)return null;
    const marker=()=>{
      const el=document.createElement('span');el.setAttribute('aria-hidden','true');
      el.style.cssText='display:inline-block!important;width:0!important;height:0!important;padding:0!important;margin:0!important;border:0!important;vertical-align:baseline!important';return el;
    };
    const titleMark=marker(),priceMark=marker();title.append(titleMark);price.append(priceMark);
    return {card,price,titleMark,priceMark};
  }).filter(Boolean);
  function alignPrices(){
    if(!mobile.matches)return;
    priceBaselines.forEach(({card,price,titleMark,priceMark})=>{
      const baselineOffset=priceMark.getBoundingClientRect().top-price.getBoundingClientRect().top;
      const border=parseFloat(getComputedStyle(card).borderTopWidth)||0;
      card.style.setProperty('--price-top',`${titleMark.getBoundingClientRect().top-card.getBoundingClientRect().top-border-baselineOffset}px`);
    });
  }
  const priceObserver=new ResizeObserver(alignPrices);
  priceCards.forEach(card=>priceObserver.observe(card));
  document.fonts.ready.then(alignPrices);
  mobile.addEventListener('change',alignPrices);

  /* ===== 12. Мобильный фокус карточек (один обработчик) ===== */
  const cards = [
    ...root.querySelectorAll(
      '.jkg, .jtn2-print.jtp-static, .jtn2-print.jtp, .jtn2-side-card'
    )
  ];

  let focusFrame = 0;

  function updateFocus() {
    focusFrame = 0;
    cards.forEach(card => card.classList.remove('j78-center-focus'));
    if (!mobile.matches || reduce.matches) return;

    const viewport = window.visualViewport;
    const centerY = viewport
      ? viewport.offsetTop + viewport.height / 2
      : window.innerHeight / 2;

    let candidate = null;
    let best = Infinity;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      if (rect.bottom < centerY || rect.top > centerY) return;

      const distance = Math.abs(rect.top + rect.height / 2 - centerY);
      if (distance < best) {
        best = distance;
        candidate = card;
      }
    });

    candidate?.classList.add('j78-center-focus');
  }

  function requestFocusUpdate() {
    if (!focusFrame) focusFrame = requestAnimationFrame(updateFocus);
  }

  window.addEventListener('scroll', requestFocusUpdate, { passive: true });
  window.addEventListener('resize', requestFocusUpdate, { passive: true });
  window.visualViewport?.addEventListener('resize', requestFocusUpdate, {
    passive: true
  });
  window.visualViewport?.addEventListener('scroll', requestFocusUpdate, {
    passive: true
  });
  mobile.addEventListener('change', requestFocusUpdate);
  updateFocus();

  /* Убрать конфликт jmx-print-inview со стрелкой нанесения */
  root.querySelectorAll('.jtn2-print.jtp').forEach(card => {
    card.classList.remove('jmx-print-inview');
  });
})();
