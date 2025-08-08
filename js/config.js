// COMMON CONFIG FOR initI18n
export const i18nConfig = {
    root: document.documentElement,
    titleSelector: 'title',
    textSelector: '[data-i18n]',
    attrSelector: '[data-i18n-attr]',
};

// LANGUAGE MENU CONFIG
export const langMenuConfig = {
    triggerSelector: '[data-lang]',
    multiple: true,
    aria: true,
}

// CAROUSEL CONFIG
export function getCarouselRefs() {
    return {
        container: document.querySelector('.carousel-container'),
        track: document.querySelector('.carousel-track'),
        scrollbar: document.querySelector('.carousel-scrollbar'),
        advanceBtn: document.querySelector('.carousel-advance'),
        backBtn: document.querySelector('.carousel-back'),
        imgWrapper: document.querySelector('.carousel-imgs')
    };
}

// BURGER MENU CONFIG
export const burgerConfig = {
    triggerSelector: '#burger-btn',
    targets: ['#github-icon', '#vercel-icon'],
    aria: true,
};