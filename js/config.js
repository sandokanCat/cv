// I18N CONFIG
export const i18nConfig = {
    root: document.documentElement,
    titleSelector: 'title',
    textSelector: '[data-i18n]',
    attrSelector: '[data-i18n-attr]',
};

// CAROUSEL CONFIG
export const carouselConfig = {
    imgs: null,
	startIndex: 0,
	interval: 6000,
    locale: null,
    refs: function getCarouselRefs() {
        return {
            container: document.querySelector('.carousel-container'),
            track: document.querySelector('.carousel-track'),
            scrollbar: document.querySelector('.carousel-scrollbar'),
            advanceBtn: document.querySelector('.carousel-advance'),
            backBtn: document.querySelector('.carousel-back'),
            imgWrapper: document.querySelector('.carousel-imgs')
        };
    }
}

// MODAL CONFIG
export function getModalRefs() {
    return {
        linkSelector: document.querySelectorAll('.modal-link'),
        containerSelector: document.getElementById('#modal-container'),
        contentSelector: document.getElementById('#modal-content'),
        iframeSelector: document.getElementById('#modal-iframe'),
        closeSelector: document.getElementById('#modal-close')
    };
}