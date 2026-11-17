(() => {
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');
 document.querySelectorAll('[data-jtn2]').forEach(root=>{
  const original=root.querySelector('.jtn2-player');if(!original||root.dataset.sceneReady)return;
  root.dataset.sceneReady='true';
  root.id='jtn-scene';
  // Wave: swap white/blue before cloning and binding colour navigation.
  // Moving the original buttons preserves their colour, label and image.
  const waveSwatches=original.querySelector('.jtn2-swatches');
  if(waveSwatches){
   const white=waveSwatches.querySelector('[data-color-choice="white"]');
   const blue=waveSwatches.querySelector('[data-color-choice="blue"]');
   if(white&&blue){
    const slot=document.createComment('wave-colour-order');
    blue.replaceWith(slot);white.replaceWith(blue);slot.replaceWith(white);
   }
  }
  const sceneAssets='./assets/wp-content/uploads/jetron-scenes-p141/';
  original.querySelectorAll('[data-boy]').forEach(img=>{
   img.dataset.perfSource=window.JTN_DESIGN_CONTENT?.['wave_boy_'+img.dataset.boy]||sceneAssets+'wave-'+img.dataset.boy+'.webp';
  });
  const shell=original.closest('.j77-carousel')||document.createElement('div');shell.className='j77-carousel';
  const track=shell.querySelector('.j77-track')||document.createElement('div');track.className='j77-track';
  shell.setAttribute('role','region');shell.setAttribute('aria-label','Коллекции игровой формы');
  if(!shell.contains(original)){original.before(shell);shell.append(track);track.append(original);}
  const slides=[original];
  for(let i=1;i<3;i++){
   const clone=original.cloneNode(true);clone.classList.remove('j77-active');clone.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
   clone.querySelectorAll('img').forEach(e=>e.removeAttribute('fetchpriority'));track.append(clone);slides.push(clone);
  }
  root.querySelector('.jtn2-m-dots')?.remove();root.querySelector('.jtn2-carousel-controls')?.remove();

  const legendAssets='./assets/wp-content/uploads/jetron-scenes-p143/';
  original.querySelectorAll('[data-color-choice]').forEach(button=>{
   const img=button.querySelector('img');
   if(img){img.dataset.perfSource=window.JTN_DESIGN_CONTENT?.['wave_kit_'+button.dataset.colorChoice]||legendAssets+'wave-kit-'+button.dataset.colorChoice+'.webp';}
  });
  function configureCollection(slide, legend=false) {
    const modelName=legend?'Легенда':'Фаворит';
    const variants = legend ? [
      ['white','Белая','#e25355','belaya'],
      ['mint','Мятная','#6ad6cf','biryuzovaya'],
      ['red','Красная','#e93839','krasnaya'],
      ['blue','Синяя','#258deb','sinyaya'],
      ['yellow','Жёлтая','#ddec29','zhyoltaya'],
      ['teal','Тёмно-бирюзовая','#167c88','zelyonaya']
    ] : [
      ['lime',   'Салатовая', '#91f532'],
      ['blue',   'Синяя',    '#2359ed'],
      ['purple', 'Сиреневая','#ab8ae9'],
      ['red',    'Красная',  '#f33532'],
      ['white',  'Белая',    '#e5e6f0']
    ];

    const bg = slide.querySelector('.jtn2-player-bg');
    const people = slide.querySelector('.jtn2-person-window');
    const copy = slide.querySelector('.jtn2-player-copy');
    const heading = copy?.querySelector('h2');
    const art = heading?.querySelector('svg');

    if (!bg || !people || !copy || !heading || !art ||
        art.querySelectorAll('text').length < 2) {
      throw new Error(
        'Фаворит: структура баннера изменилась — сверить текущий шаблон'
      );
    }

    slide.dataset.model = legend?'legend':'favorit';
    slide.dataset.color = variants[0][0];

    // Сохраняем существующую маску/форму фоновой панели.
    bg.className = 'jtn2-player-bg jf-background';
    bg.replaceChildren();

    // Базовые Wave-классы + jf-* как модификаторы Favorit.
    people.className = 'jtn2-person-window jf-people'+(legend?' jl-people':'');
    people.replaceChildren();
    copy.className = 'jtn2-player-copy jf-copy';

    heading.className = 'jtn2-wave-heading jf-heading';
    heading.setAttribute('aria-label', 'Игровая форма '+modelName);
    art.setAttribute('viewBox', '0 0 260 108');
    art.setAttribute('aria-hidden', 'true');
    heading.replaceChildren(art);

    const lines = art.querySelectorAll('text');
    lines[0].setAttribute('class', 'jtn2-wave-heading__category');
    lines[1].setAttribute(
      'class',
      'jtn2-wave-heading__model jf-title-main'
    );
    lines[0].textContent = 'игровая форма';
    lines[1].textContent = modelName.toUpperCase();
    lines[0].removeAttribute('style');
    lines[1].removeAttribute('style');

    lines.forEach(line => {
      line.setAttribute('x', '252');
      line.removeAttribute('textLength');
      line.removeAttribute('lengthAdjust');
      line.setAttribute('text-anchor', 'end');
    });


    const features = document.createElement("ul");
    features.className = "jtn2-player-feats jf-features";
    features.innerHTML = "<li></li><li></li>";

    const swatches = document.createElement('div');
    swatches.className = 'jtn2-swatches jf-swatches';
    swatches.setAttribute('role', 'group');
    swatches.setAttribute('aria-label', 'Цвет формы '+modelName);

    const geometry = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m12 2 9 5v10l-9 5-9-5V7Z
             m0 0v10m-9-5 9 5 9-5
             m-9 5v10m-9-5 9-5 9 5"
          stroke="currentColor" stroke-width="1.1"/>
      </svg>`;

    variants.forEach(([key, label, hex, slug], index) => {
      const light = document.createElement('span');
      light.className = 'jf-light';
      light.dataset.favoritLight = key;
      light.style.opacity=index===0?'1':'0';
      light.style.backgroundImage =
        `radial-gradient(ellipse at 18% 65%,${hex}66,transparent 68%)`;
      bg.append(light);

      const boy = new Image();
      boy.className = 'jf-boy' + (index === 0 ? ' is-active' : '');
      boy.dataset.boy = key;
      boy.dataset.perfSource = legend
        ? './assets/wp-content/uploads/jetron-legend-client-20260910/legend-client-'+(key==='yellow'?'lime':key)+'.webp'
        : './assets/wp-content/uploads/jetron-favorit-20260911/favorit-'+key+'.webp';
      boy.alt = modelName+' — ' + label.toLowerCase() + ' форма';
      if (legend) {
        boy.width = key==='teal' ? 880 : 1792;
        boy.height = key==='teal' ? 1168 : 2400;
      } else {
        boy.width = key==='white'||key==='red' ? 1792 : 1529;
        boy.height = key==='white'||key==='red' ? 2400 : 2048;
      }
      boy.decoding = 'async';
      boy.draggable = false;
      boy.setAttribute('aria-hidden', String(index !== 0));
      people.append(boy);

      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.colorChoice = key;
      button.setAttribute('aria-label', modelName+': ' + label.toLowerCase());
      button.setAttribute('aria-pressed', String(index === 0));
      button.style.setProperty('--jf-color', hex);

      const kit = new Image();
      kit.className = 'jf-kit';
      kit.dataset.perfSource = legendAssets+(legend?'kit-':'favorit-kit-')+key+'.webp';
      kit.alt = '';
      kit.width = 360;
      kit.height = 520;
      kit.decoding = 'async';
      kit.draggable = false;

      const dot = document.createElement('span');
      // j81-color-dot предотвращает добавление второго маркера
      // существующим preview-p81.js.
      dot.className = 'j81-color-dot jf-dot';
      dot.setAttribute('aria-hidden', 'true');
      dot.innerHTML = geometry;

      button.append(kit, dot);
      swatches.append(button);
    });

    copy.replaceChildren(heading, features, swatches);


    slide.querySelector('.jtn2-kids').href = legend
      ? 'https://jetronsport.ru/shop/filter/model--legenda/'
      : 'https://jetronsport.ru/shop/filter/model--favorit/';
  }

  configureCollection(slides[1]);
  configureCollection(slides[2],true);

  const content=window.JTN_DESIGN_CONTENT||{};
  slides.forEach((slide,index)=>{
   const model=['wave','favorit','legend'][index];
   const text=(selector,key)=>{const el=slide.querySelector(selector);if(el&&content[key]!==undefined)el.textContent=content[key];};
   text('.jtn2-wave-heading__category',model+'_category');
   text('.jtn2-wave-heading__model',model+'_name');
   const heading=slide.querySelector('h2');if(heading)heading.setAttribute('aria-label',(content[model+'_category']||'')+' '+(content[model+'_name']||''));
   const title=slide.querySelector('.jtn2-wave-heading__model');if(title)title.textContent=title.textContent.toUpperCase();
   slide.querySelectorAll('.jtn2-kids-desk,.jtn2-kids-mob').forEach(e=>{if(content[model+'_cta']!==undefined)e.textContent=content[model+'_cta'];});
   if(content[model+'_url'])slide.querySelector('.jtn2-kids').href=content[model+'_url'];
   slide.querySelectorAll('[data-boy]').forEach(img=>{const url=content[model+'_boy_'+img.dataset.boy];if(url)img.dataset.perfSource=url;});
   slide.querySelectorAll('[data-color-choice] img').forEach(img=>{const url=content[model+'_kit_'+img.closest('button').dataset.colorChoice];if(url)img.dataset.perfSource=url;});
  });
  const imageMap=window.JTN_PERF_IMAGES||{};
  function setupImage(img,eager=false){
   const source=img.dataset.perfSource||img.dataset.perfSrc||img.getAttribute('src');
   if(!source)return;
   img.dataset.perfSource=source;
   const entry=imageMap[source];
   if(entry){
    img.width=entry.width;img.height=entry.height;
    img.dataset.perfSrcset=entry.sources.map(s=>s.url+' '+s.width+'w').join(', ');
    img.dataset.perfSizes=entry.sizes;
   }else{
    // A changed ACF image must not inherit another asset's responsive sources.
    ['srcset','sizes','data-perf-srcset','data-perf-sizes'].forEach(name=>img.removeAttribute(name));
   }
   img.dataset.perfSrc=source;
   img.decoding='async';img.fetchPriority=img===original.querySelector('[data-boy].is-active')?'high':'low';
   if(eager)hydrate(img);
   else {img.removeAttribute('srcset');img.src='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';img.loading='lazy';}
  }
  function hydrate(img){
   if(img.dataset.perfSrcset){img.sizes=img.dataset.perfSizes;img.srcset=img.dataset.perfSrcset;}
   if(img.dataset.perfSrc){img.loading='eager';img.src=img.dataset.perfSrc;delete img.dataset.perfSrc;}
  }
  slides.forEach((slide,index)=>slide.querySelectorAll('img').forEach(img=>setupImage(img,index<=1&&(img.matches('[data-boy].is-active')||!!img.closest('.jtn2-swatches')))));
  // Keep the neighbouring preview present even while a boundary copy is shown.
  // One copy per side left the trailing Wave without its next Favorit.
  const loopOffset=2;
  const loopClones=[];
  function createLoopClone(source){
   const clone=slides[source].cloneNode(true);
   clone.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
   clone.querySelectorAll('img').forEach(el=>el.removeAttribute('fetchpriority'));
   clone.classList.remove('j77-active','j77-next');
   clone.classList.add('j77-slide','j77-loop-clone');
   clone.dataset.loopSource=String(source);
   clone.setAttribute('aria-hidden','true');
   clone.inert=true;
   loopClones.push(clone);
   return clone;
  }
  track.prepend(createLoopClone(1),createLoopClone(2));
  track.append(createLoopClone(0),createLoopClone(1));
  const logicalIndex=index=>((index-loopOffset)%slides.length+slides.length)%slides.length;
  const canonicalIndex=index=>logicalIndex(index)+loopOffset;

  // Fetch only requested colours / first frames, including their loop copies.
  const decoded=new Map();
  function prepareImage(img){
   const key=img.dataset.perfSource||img.src;
   [...track.querySelectorAll('img')].filter(copy=>copy.dataset.perfSource===key).forEach(hydrate);
   hydrate(img);
   if(!decoded.has(key))decoded.set(key,img.decode().catch(()=>{}));
   return decoded.get(key);
  }
  const readySlides=new Set(),slidePreparation=new Map();
  function prepareSlide(index){
   const slide=slides[index];
   if(!slidePreparation.has(slide)){
    const images=[...slide.querySelectorAll('[data-boy].is-active,.jtn2-swatches img')];
    slidePreparation.set(slide,Promise.all(images.map(prepareImage)).then(()=>readySlides.add(slide)));
   }
   return slidePreparation.get(slide);
  }
  prepareSlide(0).then(()=>{
   const warmNeighbours=()=>{prepareSlide(1);prepareSlide(2);};
   if(document.readyState==='complete')setTimeout(warmNeighbours,1500);
   else window.addEventListener('load',()=>setTimeout(warmNeighbours,1500),{once:true});
  });
  let navigationRequest=0;

  const nav=document.createElement('div');nav.className='j77-nav';
  const segs=document.createElement('div');segs.className='j77-nav-segs';
  const dots=slides.map((slide,i)=>{
   slide.classList.add('j77-slide');slide.dataset.banner=String(i);
   const modelName = {favorit:'Фаворит',legend:'Легенда'}[slide.dataset.model] || 'Волна';
   slide.setAttribute(
     'aria-label',
     `Баннер ${i + 1} из ${slides.length}. Игровая форма ${modelName}`
   );
   const b=document.createElement('button');b.type='button';b.className='j77-dot';b.setAttribute('aria-label',`Показать баннер ${i+1}`);
   b.addEventListener('click',e=>{e.stopPropagation();change(i,i>banner?1:-1);});segs.append(b);return b;
  });
  const arrows=document.createElement('div');arrows.className='j77-nav-arrows';
  const prevBtn=document.createElement('button');
  prevBtn.type='button';prevBtn.className='j77-nav-prev';
  prevBtn.setAttribute('aria-label','Предыдущий баннер');
  prevBtn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const nextBtn=document.createElement('button');
  nextBtn.type='button';nextBtn.className='j77-nav-next';
  nextBtn.setAttribute('aria-label','Следующий баннер');
  nextBtn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  prevBtn.addEventListener('click',e=>{e.stopPropagation();change((banner+slides.length-1)%slides.length,-1);});
  nextBtn.addEventListener('click',e=>{e.stopPropagation();change((banner+1)%slides.length,1);});
  arrows.append(prevBtn,nextBtn);
  nav.append(segs,arrows);
  shell.append(nav);
  const status=document.createElement('span');status.className='j77-sr';status.setAttribute('aria-live','polite');shell.append(status);
  const mobileCarousel=matchMedia('(max-width:1024px)');
  let banner=0,color=0,timer=0,visible=false,drag=null,animations=[];
  let visualIndex=loopOffset;
  const completedSlides=new Set();
  let isDragging=false;
  const stop=()=>{
   clearTimeout(timer);
   timer=0;
  };
  function getTrackX(index){
   const item=track.children[index];
   return item?-item.offsetLeft:0;
  }
  function setMobileTrack(index,animate=true){
   if(!mobileCarousel.matches){
    track.style.removeProperty('transform');
    track.style.removeProperty('transition');
    return;
   }
   track.style.transition=animate&&!reduce.matches
    ?'transform var(--jtn-scene-duration) var(--jtn-scene-ease)'
    :'none';
   shell.classList.toggle('j77-moving',animate&&!reduce.matches);
   track.style.transform=`translate3d(${getTrackX(index)}px,0,0)`;
  }
  function syncMobileSwatches(){
   slides.forEach(slide=>{
    slide.querySelectorAll('[data-color-choice]').forEach(button=>{
     button.removeAttribute('tabindex');
     button.removeAttribute('aria-disabled');
    });
   });
  }
  function settleMobileLoop(){
   if(!mobileCarousel.matches)return;
   shell.classList.remove('j77-moving');
   const canonical=canonicalIndex(visualIndex);
   if(visualIndex!==canonical){
    visualIndex=canonical;
    setMobileTrack(visualIndex,false);
   }
   resetCompletedSlides();
  }
  // A new gesture can arrive before the boundary clone finishes moving.
  // Rebase the current frame to its identical real-slide coordinate first;
  // preserve the remaining offset instead of animating back across the track.
  function rebaseMobileLoop(){
   if(!mobileCarousel.matches)return;
   const canonical=canonicalIndex(visualIndex);
   if(canonical===visualIndex)return;
   const x=new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
   const shift=getTrackX(canonical)-getTrackX(visualIndex);
   visualIndex=canonical;
   track.style.transition='none';
   track.style.transform=`translate3d(${x+shift}px,0,0)`;
   void track.offsetWidth;
  }
  track.addEventListener('transitionend',e=>{
   if(e.target===track&&e.propertyName==='transform')settleMobileLoop();
  });
  function applyColor(slide, n, immediate = false) {
    const buttons = [...slide.querySelectorAll('[data-color-choice]')];
    if (!buttons.length) return;

    // Prepare an incoming banner's first frame without a second, nested fade.
    // Ordinary colour changes retain their CSS transitions.
    const transitions = immediate ? [...slide.querySelectorAll('[data-boy], [data-favorit-light], .jtn2-swatches img')].map(el => {
      const saved = [el, el.style.getPropertyValue('transition'), el.style.getPropertyPriority('transition')];
      el.style.setProperty('transition', 'none', 'important');
      return saved;
    }) : [];

    const selected = ((n % buttons.length) + buttons.length) % buttons.length;
    const key = buttons[selected].dataset.colorChoice;
    slide.dataset.color = key;
    slide.querySelectorAll('[data-favorit-light]').forEach(light=>light.style.setProperty('opacity',light.dataset.favoritLight===key?'1':'0','important'));

    buttons.forEach((button, index) => {
      const active = index === selected;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-on', active);

      const img = button.querySelector('img');

      /*
       * p91: размер выбранной формы контролирует CSS.
       * Не оставляем inline transform, который мешает
       * одинаковому Wave/Favorit поведению.
       */
      if (img) {
        img.style.removeProperty('transform');
      }
    });

    slide.querySelectorAll('[data-boy]').forEach(boy => {
      const active = boy.dataset.boy === key;
      boy.classList.toggle('is-active', active);
      boy.setAttribute('aria-hidden', String(!active));
    });
    if (immediate) {
      void slide.offsetWidth;
      transitions.forEach(([el, value, priority]) => {
        if (value) el.style.setProperty('transition', value, priority);
        else el.style.removeProperty('transition');
      });
    }
    return selected;
  }
  function selectedColor(slide){
   return Math.max(0,[...slide.querySelectorAll('[data-color-choice]')].findIndex(b=>b.getAttribute('aria-pressed')==='true'));
  }
  function setSlideColor(index,n,immediate=false){
   const selected=applyColor(slides[index],n,immediate);
   loopClones.filter(clone=>Number(clone.dataset.loopSource)===index).forEach(clone=>applyColor(clone,selected,immediate));
   return selected;
  }
  let colorRequest=0;
  async function choose(n,immediate=false){
   const request=++colorRequest,selectedBanner=banner;
   const buttons=[...slides[banner].querySelectorAll('[data-color-choice]')];
   const key=buttons[((n%buttons.length)+buttons.length)%buttons.length]?.dataset.colorChoice;
   const image=[...slides[banner].querySelectorAll('[data-boy]')].find(img=>img.dataset.boy===key);
   if(image)await prepareImage(image);
   if(request!==colorRequest||selectedBanner!==banner)return;
   color=setSlideColor(banner,n,immediate);
  }
  function resetCompletedSlides(){
   // Only an automatically completed sequence resets, and only offscreen.
   // Manual return keeps the same colour already visible in the neighbour.
   const bounds=shell.getBoundingClientRect();
   completedSlides.forEach(index=>{
    if(index===banner)return;
    const copies=[slides[index],...loopClones.filter(c=>Number(c.dataset.loopSource)===index)];
    if(mobileCarousel.matches&&copies.some(copy=>{
     const r=copy.getBoundingClientRect();
     return r.right>bounds.left&&r.left<bounds.right;
    }))return;
    setSlideColor(index,0,true);
    completedSlides.delete(index);
   });
  }
  function schedule() {
    stop();
    if (reduce.matches || !visible || document.hidden || drag || isDragging) return;

    timer = setTimeout(() => {
      if (isDragging || drag) return;

      const count =
        slides[banner].querySelectorAll('[data-color-choice]').length;

      if (color + 1 < count) {
        choose(color + 1);
        schedule();
      } else {
        completedSlides.add(banner);
        change((banner + 1) % slides.length, 1, false);
      }
    }, 3000);
  }
  function paint(){
    [...track.children].forEach(s=>s.classList.remove('j77-next'));
    slides[banner].nextElementSibling?.classList.add('j77-next');
    slides.forEach((s,i)=>{
      const active=i===banner;
      s.classList.toggle('j77-active',active);
      s.setAttribute('aria-hidden',String(!active));
      s.inert=!active;
      if(active){
        dots[i].setAttribute('aria-current','true');
      }else{
        dots[i].removeAttribute('aria-current');
      }
    });
  }
  async function change(next,dir=1,announce=true,dragOffset=0){
   if(isDragging)return;
   const request=++navigationRequest;
   const target=slides[(next+slides.length)%slides.length];
   await prepareSlide((next+slides.length)%slides.length);
   if(request!==navigationRequest||isDragging)return;
   stop();animations.forEach(a=>a.cancel());animations=[];
   const old=slides[banner];old.classList.remove('j77-leaving');
   slides.forEach(s=>s.classList.remove('j77-leaving'));
   rebaseMobileLoop();
   const oldBanner=banner;
   const different=target!==slides[banner];
   banner=(next+slides.length)%slides.length;color=selectedColor(slides[banner]);paint();
   if(different&&mobileCarousel.matches){
    if(dir>0&&oldBanner===slides.length-1&&banner===0){
     visualIndex=slides.length+loopOffset;
    }else if(dir<0&&oldBanner===0&&banner===slides.length-1){
     visualIndex=loopOffset-1;
    }else{
     visualIndex=banner+loopOffset;
    }
    setMobileTrack(visualIndex,true);
    if(reduce.matches)settleMobileLoop();
   }else if(different&&!reduce.matches){
    old.classList.add('j77-leaving');
    const motionStyle = getComputedStyle(root);
    const durationToken =
      motionStyle.getPropertyValue('--jtn-scene-duration').trim();
    const durationValue = parseFloat(durationToken);

    const options = {
      duration: Number.isFinite(durationValue)
        ? durationValue * (durationToken.endsWith('ms') ? 1 : 1000)
        : 800,
      easing:
        motionStyle.getPropertyValue('--jtn-scene-ease').trim() ||
        'cubic-bezier(0.4,0,0.2,1)'
    };
    // A short in-place crossfade keeps the overhanging players inside their
    // established composition instead of sliding them across the page.
    options.duration=Math.min(options.duration,300);
    const out=old.animate([{transform:`translateX(${dragOffset}px)`,opacity:1},{transform:`translateX(${dragOffset}px)`,opacity:0}],options);
    const incoming=slides[banner].animate([{transform:'translateX(0)',opacity:0},{transform:'translateX(0)',opacity:1}],options);
    out.onfinish=()=>{old.classList.remove('j77-leaving');resetCompletedSlides();};
    animations=[out,incoming];
  }
   if(reduce.matches)resetCompletedSlides();
   if(announce)status.textContent=`Баннер ${banner+1} из ${slides.length}`;
   schedule();
  }
  async function goMobile(direction){
   if(!mobileCarousel.matches)return;
   const request=++navigationRequest;
   const next=(banner+direction+slides.length)%slides.length;
   if(!readySlides.has(slides[next])){
    stop();
    setMobileTrack(visualIndex,true);
    await prepareSlide(next);
    if(request!==navigationRequest||isDragging)return;
   }
   rebaseMobileLoop();
   stop();
   animations.forEach(a=>a.cancel());
   animations=[];
   /*
    * Interrupt an in-flight track transition so a second swipe
    * advances from the already-committed target, not mid-frame.
    */
   const matrix=new DOMMatrixReadOnly(getComputedStyle(track).transform);
   track.style.transition='none';
   track.style.transform=`translate3d(${matrix.m41}px,0,0)`;
   void track.offsetWidth;

   const previousBanner=banner;
   banner=(banner+direction+slides.length)%slides.length;
   visualIndex=direction>0&&previousBanner===slides.length-1?slides.length+loopOffset:
    direction<0&&previousBanner===0?loopOffset-1:banner+loopOffset;
   color=selectedColor(slides[banner]);
   paint();
   setMobileTrack(visualIndex,true);
   if(reduce.matches)settleMobileLoop();
   status.textContent=`Баннер ${banner+1} из ${slides.length}`;
   schedule();
  }
  slides.forEach(slide=>{
   slide.querySelectorAll('[data-color-choice]').forEach((b,i)=>b.addEventListener('click',e=>{
    if(performance.now()<suppressClickUntil){
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if(mobileCarousel.matches){
     e.preventDefault();
     e.stopPropagation();
     choose(i);
     schedule();
     return;
    }
    e.stopPropagation();choose(i);schedule();
   }));
   slide.querySelectorAll('img').forEach(img=>{
    img.draggable=false;
   });
   const bar=slide.querySelector('.jtn2-kids-bar');
   if(bar)new ResizeObserver(()=>{if(bar.offsetHeight)slide.style.setProperty('--kids-bar-h',bar.offsetHeight+'px');}).observe(bar);
  });
  let suppressClickUntil=0;
  let ignoreLostCapture=false;
  function resetDrag(pointerId){
   slides[banner].style.removeProperty('translate');
   shell.classList.remove('j77-moving');
   if(pointerId!==undefined){
    ignoreLostCapture=true;
    try{shell.releasePointerCapture(pointerId);}catch(_){}
    ignoreLostCapture=false;
   }
   drag=null;
   isDragging=false;
  }
  function gestureBlockedTarget(target){
   return !!(target&&target.closest&&target.closest('input,textarea,select'));
  }
  function beginGesture(id,x,y,target){
   if(gestureBlockedTarget(target))return false;
   if(drag)return false;
   ++navigationRequest;
   if(mobileCarousel.matches){
    const currentX=new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
    // A committed target may be several slides ahead of the rendered frame.
    // Anchor interrupted gestures to the nearest physical slide before rebasing.
    let nearest=0;
    for(let i=1;i<track.children.length;i++){
     if(Math.abs(getTrackX(i)-currentX)<Math.abs(getTrackX(nearest)-currentX))nearest=i;
    }
    visualIndex=nearest;
    banner=logicalIndex(nearest);
    color=selectedColor(slides[banner]);
    paint();
   }
   rebaseMobileLoop();
   const matrix=new DOMMatrixReadOnly(getComputedStyle(track).transform);
   const startTranslate=Number.isFinite(matrix.m41)?matrix.m41:getTrackX(visualIndex);
   if(mobileCarousel.matches){
    track.style.transition='none';
    track.style.transform=`translate3d(${startTranslate}px,0,0)`;
   }
   isDragging=true;
   drag={
    id,
    x,
    y,
    dx:0,
    axis:null,
    startTranslate,
    captured:false,
    swiped:false,
    source:'gesture'
   };
   stop();
   return true;
  }
  function moveGesture(id,x,y,capturePointer){
   if(!drag||drag.id!==id)return;
   const dx=x-drag.x;
   const dy=y-drag.y;

   if(!drag.axis){
    const ax=Math.abs(dx);
    const ay=Math.abs(dy);
    if(Math.max(ax,ay)<6)return;
    if(ax>ay*1.1){
     drag.axis='x';
    }else if(ay>=14&&ay>ax*1.35){
     drag.axis='y';
    }else{
     return;
    }
   }

   if(drag.axis==='y'){
    suppressClickUntil=performance.now()+500;
    resetDrag();
    if(mobileCarousel.matches)setMobileTrack(visualIndex,true);
    schedule();
    return;
   }

   if(drag.axis==='x'){
    suppressClickUntil=performance.now()+500;
    shell.classList.add('j77-moving');
    drag.dx=dx;
    drag.swiped=true;
    if(mobileCarousel.matches){
     track.style.transition='none';
     const adjacent=(banner+(dx<0?1:slides.length-1))%slides.length;
     // Keep the loaded card in place until the adjacent card can paint.
     const offset=readySlides.has(slides[adjacent])?dx:0;
     track.style.transform=`translate3d(${drag.startTranslate+offset}px,0,0)`;
    }else slides[banner].style.setProperty('translate',`${dx}px 0`,'important');
    if(capturePointer&&!drag.captured){
     drag.captured=true;
     try{shell.setPointerCapture(id);}catch(_){}
    }
   }
  }
  function endGesture(id,cancelled){
   if(!drag||drag.id!==id)return;
   if(cancelled)suppressClickUntil=performance.now()+500;
   const d=drag;
   resetDrag(typeof id==='number'?id:undefined);

   if(d.axis!=='x'){
    if(mobileCarousel.matches)setMobileTrack(visualIndex,true);
    schedule();
    return;
   }

   const threshold=Math.max(30,shell.clientWidth*0.07);
   if(!mobileCarousel.matches){
    if(!cancelled&&Math.abs(d.dx)>=threshold)change((banner+(d.dx<0?1:slides.length-1))%slides.length,d.dx<0?1:-1,true,d.dx);
    else schedule();
    return;
   }
   if(!cancelled&&Math.abs(d.dx)>=threshold){
    if(d.swiped)suppressClickUntil=performance.now()+450;
    goMobile(d.dx<0?1:-1);
   }else{
    setMobileTrack(visualIndex,true);
    schedule();
   }
  }
  function beginMobileDrag(e){
   if(e.pointerType==='touch')return;
   if(e.isPrimary===false)return;
   if(e.button!==undefined&&e.button!==0)return;
   beginGesture(e.pointerId,e.clientX,e.clientY,e.target);
  }
  function moveMobileDrag(e){
   if(e.pointerType==='touch')return;
   moveGesture(e.pointerId,e.clientX,e.clientY,true);
  }
  function endMobileDrag(e){
   if(e.pointerType==='touch')return;
   endGesture(e.pointerId,e.type==='pointercancel');
  }
  function onLostCapture(e){
   // A child's implicit touch capture is transferred to shell, not cancelled.
   // Its bubbling lostpointercapture must not reset the ongoing swipe.
   if(e.target!==shell)return;
   if(ignoreLostCapture)return;
   if(!drag||drag.id!==e.pointerId)return;
   endGesture(e.pointerId,true);
  }
  // Touch has one owner, in capture phase across the whole panel. Browser
  // pointer cancellation/retargeting must not cancel the native touch stream.
  function onTouchStart(e){
   if(e.touches.length!==1){if(drag?.source==='touch')endGesture(drag.id,true);return;}
   const t=e.touches[0];
   if(!beginGesture('touch-'+t.identifier,t.clientX,t.clientY,e.target))return;
   drag.source='touch';
  }
  function onTouchMove(e){
   if(!drag||drag.source!=='touch')return;
   if(e.touches.length!==1){
    endGesture(drag.id,true);
    return;
   }
   const t=[...e.touches].find(t=>'touch-'+t.identifier===drag.id);
   if(!t)return;
   moveGesture(drag.id,t.clientX,t.clientY,false);
   if(drag&&drag.axis==='x'&&e.cancelable)e.preventDefault();
  }
  function onTouchEnd(e){
   if(!drag||drag.source!=='touch')return;
   const id=drag.id;
   endGesture(id,e.type==='touchcancel');
  }
  shell.addEventListener('pointerdown',beginMobileDrag);
  shell.addEventListener('pointermove',moveMobileDrag);
  shell.addEventListener('pointerup',endMobileDrag);
  shell.addEventListener('pointercancel',endMobileDrag);
  shell.addEventListener('lostpointercapture',onLostCapture);
  shell.addEventListener('click',e=>{
   if(performance.now()<suppressClickUntil){e.preventDefault();e.stopImmediatePropagation();}
  },true);
  // A trackpad sends wheel events, not touch/pointer dragging. Consume only
  // deliberate horizontal gestures; vertical page scrolling stays native.
  let wheelDelta=0,wheelLocked=false,wheelTimer=0;
  shell.addEventListener('wheel',e=>{
   if(e.ctrlKey||Math.abs(e.deltaX)<=Math.abs(e.deltaY)*1.15)return;
   e.preventDefault();stop();
   clearTimeout(wheelTimer);
   wheelTimer=setTimeout(()=>{wheelDelta=0;wheelLocked=false;schedule();},200);
   if(wheelLocked)return;
   wheelDelta+=e.deltaX*(e.deltaMode===1?16:1);
   if(Math.abs(wheelDelta)<45)return;
   wheelLocked=true;
   const dir=wheelDelta>0?1:-1;
   change((banner+dir+slides.length)%slides.length,dir);
  },{passive:false});
  shell.addEventListener('touchstart',onTouchStart,{passive:true,capture:true});
  shell.addEventListener('touchmove',onTouchMove,{passive:false,capture:true});
  shell.addEventListener('touchend',onTouchEnd,{passive:true,capture:true});
  shell.addEventListener('touchcancel',onTouchEnd,{passive:true,capture:true});
  shell.addEventListener('keydown',e=>{
   if(!['ArrowLeft','ArrowRight'].includes(e.key)||e.target.closest('[data-color-choice]'))return;
   e.preventDefault();
   e.stopPropagation();
   change(
     (banner+(e.key==='ArrowRight'?1:slides.length-1))%slides.length,
     e.key==='ArrowRight'?1:-1
   );
  });
  new IntersectionObserver(es=>{const next=es[0].isIntersecting;if(next!==visible){visible=next;schedule();}}).observe(shell);
  document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',schedule);
  let layoutWidth=shell.clientWidth;
  window.addEventListener('resize',()=>{
   if(shell.clientWidth===layoutWidth)return;
   layoutWidth=shell.clientWidth;
   if(drag)resetDrag();
   setMobileTrack(visualIndex,false);
  });
  mobileCarousel.addEventListener('change',()=>{
   visualIndex=banner+loopOffset;
   setMobileTrack(visualIndex,false);
   syncMobileSwatches();
   paint();
  });
  paint();
  visualIndex=banner+loopOffset;
  setMobileTrack(visualIndex,false);
  syncMobileSwatches();
  choose(0,true);
  schedule();
 });
})();
