// COMMON CONFIG FOR initI18n
export const i18nConfig = {
    root: document.documentElement,
    titleSelector: 'title',
    textSelector: '*[data-i18n]',
    attrSelector: '*[data-i18n-attr]',
};

// CAROUSEL CONFIG
export const carouselRefs = {
    container: document.querySelector('.carousel-container'),
    track: document.querySelector('.carousel-track'),
    scrollbar: document.querySelector('.carousel-scrollbar'),
    advanceBtn: document.querySelector('.carousel-advance'),
    backBtn: document.querySelector('.carousel-back'),
    imgWrapper: document.querySelector('.carousel-imgs')
};