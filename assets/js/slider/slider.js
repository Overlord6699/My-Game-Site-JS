new Swiper('.image-slider', {
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'

        /*
        nextEl: value.nextElementSibling.nextElementSibling,
        prevEl: value.nextElementSibling
        */

    },

    /*
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    */

    centeredSlides: true,
    centeredSlidesBounds: true,
    touchRatio: 3,
    grabCursor: true,

    effect: 'flip',
});