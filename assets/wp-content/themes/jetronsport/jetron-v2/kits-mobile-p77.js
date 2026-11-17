(() => {
  "use strict";

  const mobile = matchMedia("(max-width:1024px)");
  const reduce = matchMedia("(prefers-reduced-motion:reduce)");

  const colors = ["orange", "cyan", "purple", "white", "pink"];
  const names = [
    "Оранжевая", "Бирюзовая", "Фиолетовая", "Белая", "Розовая"
  ];

  function responsiveImage(image,src){
    const entry=window.JTN_PERF_IMAGES?.[src.split('?')[0]];
    if(entry){
      image.sizes='(max-width: 1024px) 100px, 160px';
      image.srcset=entry.sources.map(s=>s.url+' '+s.width+'w').join(', ');
    }else{image.removeAttribute('srcset');}
    image.loading='lazy';image.fetchPriority='low';image.decoding='async';
    image.src=src;
  }
  const wrap = n => (n + colors.length) % colors.length;

  document.querySelectorAll(
    "body.jetron-design-preview .jkg"
  ).forEach(root => {
    const scene = root.querySelector(".jkg__scene");
    const gallery = root.querySelector(".jkg__gallery");
    const status = root.querySelector(".jkg__status");

    if (!scene || !gallery || root.dataset.tapPicker) return;

    root.dataset.tapPicker = "true";
    root.classList.remove("jkg--moving");

    gallery.classList.remove(
      "jkg__gallery--native",
      "is-dragging"
    );
    gallery.removeAttribute("style");
    gallery.removeAttribute("tabindex");
    gallery.replaceChildren();

    scene.removeAttribute("aria-hidden");
    scene.querySelectorAll(
      ".jkg__kit, .jkg__tap, .j81-kit"
    ).forEach(element => element.remove());

    root.querySelectorAll(
      ".jkg__pause-p77, .jkg__hint, .jkg__control"
    ).forEach(element => element.remove());

    let index = 0;
    let timer = 0;
    let visible = false;
    let photoGesture = null;
    let suppressPhotoClickUntil = 0;

    const kits = [];
    const photos = [];
    let photoRevision = 0;
    const photoCache = new Map();

    function stop() {
      clearTimeout(timer);
    }

    function schedule() {
      stop();

      if (photoGesture) return;

      if (
        !mobile.matches ||
        !visible ||
        document.hidden ||
        reduce.matches ||
        gallery.contains(document.activeElement)
      ) return;

      timer = setTimeout(() => select(index + 1, false), 5000);
    }

    function placeKits() {
      if (!mobile.matches || !scene.clientWidth) return;

      /*
       * Centers are fractions of the scene (5-form area).
       * left/top + translate(-50%,-50%) keeps the visual center
       * stable when scale changes (transform-origin center).
       */
      const centers = [
        [0.22, 0.28],
        [0.78, 0.28],
        [0.22, 0.72],
        [0.78, 0.72]
      ];

      let side = 0;

      kits.forEach((button, i) => {
        const active = i === index;
        const scale = active ? 1.318 : 0.88;
        const [cx, cy] = active ? [0.5, 0.5] : centers[side++];

        button.style.left = '0';
        button.style.top = '0';
        button.style.right = "auto";
        button.style.bottom = "auto";
        button.style.transform =
          `translate(${cx * scene.clientWidth}px, ${cy * scene.clientHeight}px) translate(-50%, -50%) scale(${scale})`;
        button.style.zIndex = active ? "3" : "1";
        button.setAttribute("aria-pressed", String(active));
      });
    }

    async function renderPhotos() {
      const revision = ++photoRevision;
      const selection = index;
      const frames = photos.map((button, slot) => {
        const colorIndex = wrap(selection + slot - 1);
        const src = window.JTN_DESIGN_CONTENT?.["new_photo_"+colors[colorIndex]] || `./assets/wp-content/uploads/2026/09/girl-${colors[colorIndex]}.webp`;
        if (!photoCache.has(src)) {
          const preload = new Image();
          responsiveImage(preload, src);
          preload.loading = "eager";
          photoCache.set(src, preload.decode().catch(() => {}));
        }
        return {button, colorIndex, src};
      });
      // Commit all neighbours together; obsolete image loads cannot repaint.
      await Promise.all(frames.map(frame => photoCache.get(frame.src)));
      if (revision !== photoRevision) return;
      frames.forEach(({button, colorIndex, src}) => {
        const image = button.querySelector("img");
        button.querySelectorAll(".j81-photo-outgoing").forEach(el => el.remove());
        button.dataset.index = String(colorIndex);
        button.setAttribute("aria-label", `Выбрать: ${names[colorIndex].toLowerCase()} форма`);
        button.setAttribute("aria-pressed", String(colorIndex === selection));
        // Each slot shows one decoded photograph, without overlapping faces.
        responsiveImage(image, src);
      });
    }

    function select(next, announce = true) {
      index = wrap(next);
      renderPhotos();
      placeKits();

      if (announce && status) {
        status.textContent = `${names[index]} форма выбрана`;
      }

      schedule();
    }

    colors.forEach((color, i) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "j81-kit";
      button.dataset.color = color;
      button.setAttribute(
        "aria-label",
        `Выбрать: ${names[i].toLowerCase()} форма`
      );

      const image = new Image(400, 600);
      responsiveImage(image,window.JTN_DESIGN_CONTENT?.["new_kit_"+color] || `./assets/wp-content/uploads/jetron-kits-mobile/kit-${color}.webp?v=client-v2`);
      image.alt = "";
      image.draggable = false;
      image.decoding = "async";
      /* Optical micro-nudge for unequal transparent crops. */
      const optical = {
        orange: "0 0",
        cyan: "0 0",
        purple: "1px 0",
        white: "0 1px",
        pink: "-1px 0"
      };
      if (optical[color]) {
        image.style.translate = optical[color];
      }

      button.append(image);
      button.addEventListener("click", () => select(i));
      scene.append(button);
      kits.push(button);
    });

    for (let slot = 0; slot < 3; slot++) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "j81-photo";

      const image = new Image(300, 450);
      image.alt = "";
      image.draggable = false;
      image.decoding = "async";

      button.append(image);
      button.addEventListener("click", () => {
        if (performance.now() < suppressPhotoClickUntil) return;
        select(Number(button.dataset.index));
      });

      gallery.append(button);
      photos.push(button);
    }

    gallery.addEventListener("touchstart", event => {
      if (event.touches.length !== 1) {
        photoGesture = null;
        return;
      }

      const touch = event.touches[0];

      photoGesture = {
        x: touch.clientX,
        y: touch.clientY,
        at: performance.now()
      };

      stop();
    }, { passive: true });

    gallery.addEventListener("touchend", event => {
      const start = photoGesture;
      photoGesture = null;

      if (!start || !event.changedTouches.length) {
        schedule();
        return;
      }

      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;

      const horizontal =
        Math.abs(dx) >= 30 &&
        Math.abs(dx) > Math.abs(dy) * 1.5 &&
        performance.now() - start.at < 1500;

      if (horizontal) {
        suppressPhotoClickUntil = performance.now() + 400;
        select(index + (dx < 0 ? 1 : -1));
      } else {
        schedule();
      }
    }, { passive: true });

    gallery.addEventListener("touchcancel", () => {
      photoGesture = null;
      schedule();
    }, { passive: true });

    gallery.addEventListener("focusin", stop);
    gallery.addEventListener("focusout", () => {
      requestAnimationFrame(schedule);
    });

    new ResizeObserver(placeKits).observe(scene);

    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
    }).observe(root);

    document.addEventListener("visibilitychange", schedule);
    reduce.addEventListener("change", schedule);

    mobile.addEventListener("change", () => {
      placeKits();
      schedule();
    });

    select(0, false);
  });
})();
