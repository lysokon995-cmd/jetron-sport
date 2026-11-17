/* Player carousel is owned by preview-p77.js. Other controllers remain intact. */

(()=>{
  const el=()=>document.getElementById('js-modal-cart');
  let cartReturnFocus=null;
  // Browsers may restore a complete DOM snapshot when navigating back. Refresh its cart once.
  window.addEventListener('pageshow',event=>{if(event.persisted)location.reload()});
  const fitCart=()=>{
    const modal=el();if(!modal)return;
    let bottom=0;
    document.querySelectorAll('.jtn2-header,#wpadminbar').forEach(node=>{
      const rect=node.getBoundingClientRect();
      if(rect.height&&rect.bottom>0&&rect.top<innerHeight)bottom=Math.max(bottom,rect.bottom);
    });
    modal.style.setProperty('--jtn-cart-top',Math.ceil(bottom)+'px');
  };
  window.addEventListener('resize',()=>{if(el()?.classList.contains('is-open'))fitCart()},{passive:true});
  const openCart=url=>{
    const modal=el();
    if(!modal){if(url)location.href=url;return;}
    cartReturnFocus=document.activeElement;
    fitCart();
    modal.classList.add('is-open');
    modal.style.display='block';
    modal.scrollTop=0;
    const cartBody=modal.querySelector('.modal-basket__body');if(cartBody)cartBody.scrollTop=0;
    requestAnimationFrame(()=>modal.querySelector('.modal-basket__close')?.focus({preventScroll:true}));
    modal.style.removeProperty('opacity');
    document.body.classList.add('noscroll');
    if(window.jQuery&&jQuery.modal){
      try{jQuery(modal).stop(true,true).css({display:'block',opacity:1});}catch(e){}
    }
  };
  const closeCart=()=>{
    const modal=el();
    if(!modal)return;
    modal.classList.remove('is-open');
    cartReturnFocus?.focus({preventScroll:true});
    if(window.jQuery&&jQuery.modal){
      Promise.resolve(jQuery.modal.close(modal)).finally(()=>{
        modal.classList.remove('is-open');
        modal.style.display='none';
        modal.style.removeProperty('opacity');
        document.body.classList.remove('noscroll','jtn2-noscroll');
      });
    }else{
      modal.style.display='none';
      document.body.classList.remove('noscroll','jtn2-noscroll');
    }
  };
  // Sync theme modal lifecycle: always drop is-open so !important CSS cannot revive the overlay
  if(window.jQuery){
    jQuery(document).on('modal:close modal:closed', '#js-modal-cart', function(){
      this.classList.remove('is-open');
      this.style.display='none';
      document.body.classList.remove('noscroll','jtn2-noscroll');
    });
    jQuery(document).on('modal:open modal:opened', '#js-modal-cart', function(){
      fitCart();
      this.classList.add('is-open');
    });
  }
  document.addEventListener('click',e=>{
    const path=typeof e.composedPath==='function'?e.composedPath():[];
    const btn=(e.target.closest&&e.target.closest('[data-jtn2-cart]'))||path.find(n=>n&&n.matches&&n.matches('[data-jtn2-cart]'));
    if(btn){
      e.preventDefault();
      e.stopPropagation();
      openCart(btn.getAttribute('data-cart-url'));
      return;
    }
    const modal=el();
    if(!modal||!modal.classList.contains('is-open'))return;
    const inPath=sel=>path.some(n=>n&&n.matches&&n.matches(sel));
    const wantClose=
      e.target===modal||
      (e.target.classList&&e.target.classList.contains('js-modal')&&e.target.id==='js-modal-cart')||
      (e.target.classList&&e.target.classList.contains('modal-content')&&modal.contains(e.target))||
      (e.target.closest&&e.target.closest('#js-modal-cart .js-modal-close'))||
      inPath('#js-modal-cart .js-modal-close');
    // Only close on backdrop / X — never on basket body clicks
    if(wantClose){
      // If click is inside .modal-basket (except close), ignore
      const isClose=e.target.closest&&e.target.closest('.js-modal-close');
      const isBackdrop=e.target===modal||(e.target.classList&&e.target.classList.contains('modal-content'));
      if(isClose||isBackdrop){
        e.preventDefault();
        e.stopPropagation();
        closeCart();
      }
    }
  }, true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart();});
})();

(()=>{document.querySelectorAll('[data-jtp]').forEach(card=>{
 if(card.dataset.ready)return;card.dataset.ready='true';
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const mobile=matchMedia('(max-width:1024px)');
 let on=false,timer=null;
 const flip=()=>{on=!on;card.classList.toggle('is-printed',on)};
 const sync=()=>{clearInterval(timer);timer=null;card.classList.remove('is-printed');on=false;if(reduced.matches||!mobile.matches)return;timer=setInterval(flip,2800)};
 sync();
 mobile.addEventListener('change',sync);
 reduced.addEventListener('change',sync);
});})();

(()=>{document.querySelectorAll('[data-jtn2-dd]').forEach(dd=>{
  const btn=dd.querySelector('.jtn2-dd-btn');
  const menu=dd.querySelector('.jtn2-dd-menu');
  if(!btn||!menu)return;
  let hideTimer=null,leaveTimer=null;
  const open=on=>{
    clearTimeout(hideTimer);
    clearTimeout(leaveTimer);
    btn.setAttribute('aria-expanded',String(on));
    if(on){
      menu.hidden=false;
      requestAnimationFrame(()=>dd.classList.add('is-open'));
    }else{
      dd.classList.remove('is-open');
      hideTimer=setTimeout(()=>{if(!dd.classList.contains('is-open'))menu.hidden=true},360);
    }
  };
  dd.addEventListener('mouseenter',()=>{clearTimeout(leaveTimer);open(true)});
  dd.addEventListener('mouseleave',()=>{leaveTimer=setTimeout(()=>open(false),160)});
  menu.addEventListener('mouseenter',()=>{clearTimeout(leaveTimer);open(true)});
  btn.addEventListener('click',e=>{e.preventDefault();open(!dd.classList.contains('is-open'))});
  document.addEventListener('click',e=>{if(!dd.contains(e.target))open(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')open(false)});
});})();

(()=>{const cfg=window.JTN2_SEARCH||{};document.querySelectorAll('[data-jtn2-search]').forEach(form=>{
  const input=form.querySelector('input[name="s"]');
  const box=form.querySelector('[data-jtn2-suggest]');
  if(!input||!box)return;
  let timer=null,seq=0,active=-1,items=[];const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const close=()=>{box.hidden=true;box.innerHTML='';active=-1;items=[];input.setAttribute('aria-expanded','false')};
  const paint=()=>{[...box.querySelectorAll('[role="option"]')].forEach((el,i)=>el.classList.toggle('is-active',i===active))};
  const show=list=>{
    items=list;
    active=-1;
    if(!list.length){box.innerHTML='<div class="jtn2-suggest-empty">Ничего не найдено</div>';box.hidden=false;input.setAttribute('aria-expanded','true');return}
    box.innerHTML=list.map((it,i)=>`<a role="option" href="${esc(it.url)}" data-i="${i}"><img src="${esc(it.image)}" alt="" width="48" height="48"><span><b>${esc(it.title)}</b>${it.sku?`<small>Арт. ${esc(it.sku)}</small>`:''}</span><em>${esc(it.price)}</em></a>`).join('');
    box.hidden=false;
    input.setAttribute('aria-expanded','true');
  };
  const ask=q=>{
    const id=++seq;
    if(q.length<2||!cfg.ajax){close();return}
    const url=cfg.ajax+'?action=jetron_product_suggest&nonce='+encodeURIComponent(cfg.nonce||'')+'&q='+encodeURIComponent(q);
    fetch(url,{credentials:'same-origin'}).then(r=>r.json()).then(data=>{
      if(id!==seq)return;
      show((data&&data.success&&data.data&&data.data.items)||[]);
    }).catch(()=>{if(id===seq)show([])});
  };
  input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>ask(input.value.trim()),160)});
  input.addEventListener('focus',()=>{if(input.value.trim().length>=2)ask(input.value.trim())});
  input.addEventListener('keydown',e=>{
    if(box.hidden||!items.length)return;
    if(e.key==='ArrowDown'){e.preventDefault();active=(active+1)%items.length;paint()}
    else if(e.key==='ArrowUp'){e.preventDefault();active=(active-1+items.length)%items.length;paint()}
    else if(e.key==='Enter'&&active>=0&&items[active]){e.preventDefault();location.href=items[active].url}
    else if(e.key==='Escape')close();
  });
  document.addEventListener('click',e=>{if(!form.contains(e.target))close()});
});})();

(()=>{
  const box=()=>document.getElementById('js-modal-callback');
  const open=()=>{const m=box();if(!m)return;m.classList.add('is-open');m.style.display='block';document.body.classList.add('noscroll','jtn2-noscroll');};
  const close=()=>{const m=box();if(!m)return;m.classList.remove('is-open');m.style.setProperty('display','none','important');document.body.classList.remove('noscroll','jtn2-noscroll');};
  document.addEventListener('click',e=>{
    const closeBtn=e.target.closest&&e.target.closest('#js-modal-callback .js-modal-close');
    if(closeBtn){
      e.preventDefault();
      e.stopImmediatePropagation();
      close();
      return;
    }
    if(e.target.closest&&e.target.closest('[data-jtn2-callback]')){e.preventDefault();open();return;}
    const m=e.target.closest&&e.target.closest('#js-modal-callback');
    if(!m)return;
    if(e.target===m||e.target.classList.contains('js-modal')){e.preventDefault();close();}
  }, true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
})();

;(function(){
  var url='./assets/wp-content/uploads/2026/09/printing-pattern-names-v2@2x.webp';
  function swap(){
    document.querySelectorAll('.jtn2-print .jtp-effect, .jtp .jtp-effect').forEach(function(img){
      if(!img) return;
      img.setAttribute('src', url);
      img.removeAttribute('srcset');
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', swap);
  else swap();
})();


// One delegated control per review section; Slick owns carousel layout and resizing.
(()=>{
  document.querySelectorAll('.reviews').forEach(section=>{
    if(section.dataset.jtnReviewsReady)return;
    section.dataset.jtnReviewsReady='1';
    section.querySelectorAll('.review').forEach(review=>{
      const text=review.querySelector('.review__text'),name=review.querySelector('.review__name');
      if(name){name.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode(' ')));name.title=name.textContent.replace(/\s+/g,' ').trim()}
      if(!text||review.querySelector('.review__more'))return;
      const button=document.createElement('button');button.type='button';button.className='review__more';button.textContent='Читать полностью';button.setAttribute('aria-expanded','false');text.after(button);review.classList.add('review--ready');
    });
    const refresh=()=>{
      const rows=[...section.querySelectorAll('.review--ready')];
      const overflow=rows.map(review=>{const text=review.querySelector('.review__text');return review.classList.contains('is-expanded')||text.scrollHeight>text.clientHeight+1});
      rows.forEach((review,i)=>{review.querySelector('.review__more').hidden=!overflow[i]});
    };
    section.addEventListener('click',event=>{
      const button=event.target.closest('.review__more');if(!button||!section.contains(button))return;
      event.preventDefault();const review=button.closest('.review');const expanded=review.classList.toggle('is-expanded');button.setAttribute('aria-expanded',String(expanded));button.textContent=expanded?'Свернуть':'Читать полностью';
      const slider=section.querySelector('.js-reviews-carousel');if(window.jQuery&&slider&&slider.classList.contains('slick-initialized'))jQuery(slider).slick('setPosition');refresh();
    });
    if(window.jQuery)jQuery(section).find('.js-reviews-carousel').on('init.jtnReview setPosition.jtnReview',refresh);
    refresh();if(document.fonts)document.fonts.ready.then(refresh);
  });
})();
