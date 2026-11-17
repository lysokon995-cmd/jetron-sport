$(function () {
    let screenWidth = document.documentElement.clientWidth; // Ширина экрана

  Fancybox.bind("[data-fancybox]", {
    Carousel: {
      Thumbs: false,
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["close"],
        },
      },
      Zoomable: {
        Panzoom: {
          maxScale: "cover",
          panMode: "mousemove",
          mouseMoveFactor: 1.1,
        },
      },
    },
  });

  /*
   *  Dropdown
   */

  $(".navigation__link").on('click', function (e) {
    if ($(this).siblings('.dropdown').length > 0) {
      e.preventDefault();
      $(this).toggleClass('open').siblings('.dropdown').slideToggle();
    }
  });

  /*
   *  Carousels
   */

  $(".gallery__carousel").slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    autoplay: false,
    autoplaySpeed: 4000,
    fade: false,
    arrows: false,
    asNavFor: ".gallery__thumbs",
  });

  $(".gallery__thumbs").slick({
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    asNavFor: ".gallery__carousel",
    dots: false,
    focusOnSelect: true,
    prevArrow:
      '<button class="prev" type="button" aria-label="Назад"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#back"></svg></button>',
    nextArrow:
      '<button class="next" type="button" aria-label="Вперёд"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#forward"></svg></button>',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          variableWidth: true,
        },
      },
    ],
  });

  $(".product-gallery__carousel").slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    autoplay: false,
    autoplaySpeed: 4000,
    fade: false,
    asNavFor: ".product-gallery__thumbs",
    prevArrow:
      '<button class="prev" type="button" aria-label="Назад"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#back"></svg></button>',
    nextArrow:
      '<button class="next" type="button" aria-label="Вперёд"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#forward"></svg></button>',
    responsive: [
      {
        breakpoint: 576,
        settings: {
          prevArrow: '',
          nextArrow: '',
        },
      },
    ]
  });

  $(".product-gallery__thumbs").slick({
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    centerPadding: '0px',
    centerMode: true,
    adaptiveHeight: true,
    focusOnSelect: true,
    asNavFor: ".product-gallery__carousel",
    prevArrow:
      '<button class="prev" type="button" aria-label="Назад"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#back"></svg></button>',
    nextArrow:
      '<button class="next" type="button" aria-label="Вперёд"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#forward"></svg></button>',
    responsive: [
      {
        breakpoint: 1360,
        settings: {
          vertical: false,
          verticalSwiping: false,
          adaptiveHeight: false,
          centerPadding: '0px',
          centerMode: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          vertical: true,
          verticalSwiping: true,
          adaptiveHeight: true,
          centerPadding: '0px',
          centerMode: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          vertical: false,
          verticalSwiping: false,
          adaptiveHeight: false,
          centerPadding: '0px',
          centerMode: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 4,
          vertical: false,
          verticalSwiping: false,
          adaptiveHeight: false,
          centerPadding: '0px',
          centerMode: false,
        },
      },
    ],
  });

  function nearViewport(selector,init){
    const node=document.querySelector(selector);
    if(!node)return;
    if(!('IntersectionObserver' in window)){init();return;}
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();init();}
    },{rootMargin:'1000px 0px'});
    observer.observe(node);
  }
  nearViewport(".js-materials-carousel",()=>{
  const materialsSlider = $(".js-materials-carousel");

  materialsSlider.slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    autoplay: false,
    autoplaySpeed: 4000,
    fade: false,
    prevArrow:
      '<button class="prev" type="button" aria-label="Назад"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#arrow-back"></svg></button>',
    nextArrow:
      '<button class="next" type="button" aria-label="Вперёд"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#arrow-forward"></svg></button>',
  });

  $('.js-materials .counter__total').text(materialsSlider.slick("getSlick").slideCount);
  materialsSlider.on('afterChange', function (event, slick, currentSlide) {
    $(".js-materials .counter__current").text(currentSlide + 1);
  });

  });
  nearViewport(".js-works-carousel",()=>{
  const worksSlider = $(".js-works-carousel");

  worksSlider.slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    autoplay: false,
    autoplaySpeed: 4000,
    fade: false,
    prevArrow:
      '<button class="prev" type="button" aria-label="Назад"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#arrow-back"></svg></button>',
    nextArrow:
      '<button class="next" type="button" aria-label="Вперёд"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#arrow-forward"></svg></button>',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  $('.js-works .counter__total').text(worksSlider.slick("getSlick").slideCount);
  worksSlider.on('afterChange', function (event, slick, currentSlide) {
    $(".js-works .counter__current").text(currentSlide + 1);
  });

  });
  nearViewport(".js-reviews-carousel",()=>{
  const reviewsSlider = $(".js-reviews-carousel");

  reviewsSlider.slick({
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: false,
    autoplay: false,
    autoplaySpeed: 4000,
    fade: false,
    prevArrow:
      '<button class="prev" type="button" aria-label="Назад"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#arrow-back"></svg></button>',
    nextArrow:
      '<button class="next" type="button" aria-label="Вперёд"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#arrow-forward"></svg></button>',
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  $('.js-reviews .counter__total').text(reviewsSlider.slick("getSlick").slideCount);
  reviewsSlider.on('afterChange', function (event, slick, currentSlide) {
    $(".js-reviews .counter__current").text(currentSlide + 1);
  });

  });
  const goodsSlider = $(".js-goods-carousel");

  goodsSlider.slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    autoplay: false,
    autoplaySpeed: 4000,
    fade: false,
    prevArrow:
      '<button class="prev" type="button" aria-label="Назад"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#arrow-back"></svg></button>',
    nextArrow:
      '<button class="next" type="button" aria-label="Вперёд"><svg><use href="./assets/wp-content/themes/jetronsport/assets/icons/sprite.svg#arrow-forward"></svg></button>',
    responsive: [
      {
        breakpoint: 1360,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  $('.js-goods .counter__total').text(goodsSlider.slick("getSlick").slideCount);
  goodsSlider.on('afterChange', function (event, slick, currentSlide) {
    $(".js-goods .counter__current").text(currentSlide + 1);
  });

  /*
   *   Маска телефона
   */

  $(".phone").mask("+7 (999) 999-99-99");

  /*
   *  Tabs
   */

  let hash = window.location.hash;
  $(hash)
    .addClass("active")
    .show()
    .siblings(".js-tab")
    .hide()
    .removeClass("active");

  $(".js-tab-link").on("click", function (e) {
    e.preventDefault();
    let link = $(this).attr('href');

    $(this).addClass("active").parents('.js-tab-nav-item').siblings('.js-tab-nav-item').children(".js-tab-link").removeClass("active");
    $(link)
      .addClass("active")
      .fadeIn()
      .siblings(".js-tab")
      .hide()
      .removeClass("active");
  });

  /*
   *   Accordion
   */

  $(".accordion__header").on("click", function () {
    $(this)
      .toggleClass("open")
      .siblings(".accordion__text")
      .slideToggle()
      .parents(".accordion__item")
      .siblings(".accordion__item")
      .find(".accordion__header")
      .removeClass("open")
      .siblings(".accordion__text")
      .slideUp();
  });

  $('.accordion__question').on('click', function (e) {
    e.preventDefault();
  });

  /*
   *  Modal
   */

  (function ($) {
    $.modal = {
      open: function (selector) {
        const $modal = $(selector);

        $modal.trigger("modal:open");

        $("body").addClass("noscroll");

        return new Promise(resolve => {
          $modal.fadeIn(200, function () {
            $modal.trigger("modal:opened");
            resolve($modal);
          });
        });
      },

      close: function (selector) {
        const $modal = $(selector);

        $modal.trigger("modal:close");

        return new Promise(resolve => {
          $modal.fadeOut(200, function () {
            $modal.trigger("modal:closed");

            if ($(".js-modal:visible").length === 0) {
              $("body").removeClass("noscroll");
            }

            resolve($modal);
          });
        });
      },

      apply: function (selector) {
        const $modal = $(selector);

        $modal.trigger("modal:apply");

        return new Promise(resolve => {
          $modal.fadeOut(200, function () {
            $modal.trigger("modal:applied");

            if ($(".js-modal:visible").length === 0) {
              $("body").removeClass("noscroll");
            }

            resolve($modal);
          });
        });
      }
    };

    // Автоматические обработчики
    $("body").on("click", ".js-modal-show", function (e) {
      e.preventDefault();

      const target = $(this).data("target");
      $.modal.open(target);
    });

    $("body").on("click", ".js-modal-close", function (e) {
      e.preventDefault();

      const $modal = $(this).closest(".js-modal");
      $.modal.close($modal);
    });

    $("body").on("click", ".js-modal-apply", function (e) {
      e.preventDefault();

      const $modal = $(this).closest(".js-modal");
      $.modal.apply($modal);
    });

    $("body").on("click", ".js-modal", function (e) {
      if (e.target.classList.contains("js-modal") || e.target.classList.contains("modal-content")) {
        $.modal.close(this);
      }

      e.stopPropagation();
    });
  })(jQuery);

  /*
   *  Mobile menu
   */

  $('.js-menu-open').on('click', function () {
    $('.mobile-menu').slideDown();
    $('body').addClass('noscroll');
  });

  $('.js-menu-close').on('click', function () {
    $('.mobile-menu').slideUp();
    $('body').removeClass('noscroll');
  });

  $('.js-main-menu-open').on('click', function () {
    $('.mobile-main-menu').slideDown();
    $('body').addClass('noscroll');
  });

  $('.js-main-menu-close').on('click', function () {
    $('.mobile-main-menu').slideUp();
    $('body').removeClass('noscroll');
  });

  $('.mobile-menu .navigation__link').on('click', function (e) {
    const href = $(this).attr('href');

    // Проверяем, есть ли якорь
    if (href && href.includes('#')) {

      const currentUrl = window.location.href.split('#')[0];
      const linkUrl = this.href.split('#')[0];

      // Если это та же страница
      if (currentUrl === linkUrl) {

        const targetId = href.split('#')[1];
        const $target = $('#' + targetId);

        if ($target.length) {
          e.preventDefault();

          // Закрываем меню
          $('.mobile-menu').slideUp();
          $('body').removeClass('noscroll');

          // Скроллим после закрытия меню
          setTimeout(function () {
            $('html, body').animate({
              scrollTop: $target.offset().top - 80
            }, 500);
          }, 300); // время должно совпадать со slideUp
        }
      }
    }
  });

  /*
   *  Delivery
   */

  $('.delivery__link').on('click', function (e) {
    e.preventDefault();
    const city = $(this).text();
    $.modal.close($(this).parents(".js-modal"));

    $('.select-city span').text(city);
    $('.product-delivery__change > div').text(city);

    Cookies.set('city', city, { expires: 30 });
    reloadCdekDelivery(true);
  });

  /*
   *  Seo text
   */

  $(".seo-text__toggle").click(function () {
    const textContainer = $(".seo-text__wrap");

    if (textContainer.hasClass("expanded")) {
      textContainer.removeClass("expanded");
      $(this).find('span').text("Развернуть");
    } else {
      textContainer.addClass("expanded");
      $(this).find('span').text("Свернуть");
    }
  });

  /*
   *  Filter
   */

  $(document).on('click', '.js-filter-select-toggle', function () {
    if (screenWidth <= 767) return;

    const $header = $(this);
    const $dropdown = $header.siblings('.filter-select__dropdown');
    const opening = !$header.hasClass('open');

    $header.parents('.filter-select').siblings('.filter-select')
        .find('.filter-select__header').removeClass('open')
        .siblings('.filter-select__dropdown').stop(true, true).hide();

    $header.toggleClass('open', opening);
    // Open atomically: slideToggle exposed a partially painted dropdown for a frame.
    $dropdown.stop(true, true)[opening ? 'show' : 'hide']();
  });

    $('.js-filter-mobile').on('click', function () {
    $(this).toggleClass('open').parents('.filter').toggleClass('open').find('.filter__wrap').slideToggle();
  });

  /*
   *  Копирование ссылки
   */

  $('.js-copy').on('click', function () {
    const text = $(this).siblings('.share__text').text();
    const tooltip = $(this).siblings('.share__tooltip');
    navigator.clipboard.writeText(text);
    tooltip.fadeIn();

    setTimeout(
        function () {
          tooltip.fadeOut();
        }, 1200
    );
  });

  /*
   *  Sticky header
   */

  $(window).scroll(function () {
    if ($(window).scrollTop() > 200) {
      $('.sticky').addClass("open");
    } else {
      $('.sticky').removeClass("open");
    }
  });
});


function alertShow(text) {
  $("#alert .alert-error__text").html(text);

  Fancybox.show([
    {
      src: "#alert",
    }
  ], {
    Toolbar: false,
    closeButton: false,
    on: {
      destroy: (fancybox, slide) => {
        $("#alert .alert-error__text").html('');
      },
    },
  });
}