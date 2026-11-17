(() => {
  "use strict";

  const root = document.querySelector(
    "body.jetron-design-preview [data-jtn2]"
  );

  if (!root || root.dataset.layout81) return;
  root.dataset.layout81 = "true";

  const desktop = matchMedia("(min-width:1025px)");

  root.querySelectorAll('.j81-card').forEach(card => {
    const price = card.querySelector('.j81-price');
    const caption = card.querySelector('.j81-caption');
    if (price && caption) caption.append(price);
  });

  /* Используем существующие кнопки и их существующие обработчики. */
  root.querySelectorAll("[data-color-choice]").forEach(button => {
    if (button.querySelector(".j81-color-dot")) return;

    const dot = document.createElement("span");
    dot.className = "j81-color-dot";
    dot.setAttribute("aria-hidden", "true");

    dot.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M-2 7Q4 2 10 7T22 7T34 7
             M-2 13Q4 8 10 13T22 13T34 13
             M-2 19Q4 14 10 19T22 19T34 19"
          stroke="currentColor"
          stroke-width="2.4"
        />
      </svg>`;

    button.append(dot);
  });

  const side = root.querySelector(".jtn2-side");
  const main = root.querySelector(".jtn2-main");
  const calculator = root.querySelector(".jtn2-calc");

  if (!side || !main || !calculator) return;

  let frame = 0;
  let previousHeight = -1;

  function measure() {
    frame = 0;

    if (!desktop.matches) {
      side.style.removeProperty("height");
      previousHeight = -1;
      return;
    }

    const sideRect = side.getBoundingClientRect();
    const calcRect = calculator.getBoundingClientRect();

    if (!sideRect.width || !calcRect.height) return;

    const height = Math.round(calcRect.bottom - sideRect.top);

    if (height > 0 && height !== previousHeight) {
      previousHeight = height;
      side.style.setProperty("height", `${height}px`, "important");
    }
  }

  function requestMeasure() {
    if (!frame) frame = requestAnimationFrame(measure);
  }

  /*
   * Наблюдаем основной контент, не сам изменяемый sidebar:
   * нет самоподдерживающегося цикла изменения высоты.
   */
  new ResizeObserver(requestMeasure).observe(main);

  window.addEventListener("resize", requestMeasure, {
    passive: true
  });

  window.addEventListener("load", requestMeasure, {
    once: true
  });

  root.addEventListener("load", requestMeasure, true);
  desktop.addEventListener("change", requestMeasure);
  document.fonts?.ready.then(requestMeasure);

  requestMeasure();
})();
