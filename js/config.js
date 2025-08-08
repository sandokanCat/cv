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
    onClick: async (btn, newState) => {
        const lang = btn.getAttribute('data-lang')?.trim();
        if (!lang) return;

        const current = getLocale();
        if (lang === current) return;

        setLocaleStorage(lang);
        await initI18n({ locale: lang });
        await reloadDynamicContent(lang);

        // SET ARIA PRESSED TO TRUE ONLY ON CLICKED LANG BUTTON
        document.querySelectorAll('[data-lang]').forEach(el =>
        el.setAttribute('aria-pressed', el === btn ? 'true' : 'false')
        );
    },
    customToggleFn: (btn) => {
        // Cambia el icono SVG si es necesario
        const use = btn.querySelector('use');
        const lang = btn.getAttribute('data-lang');
        if (use && lang) {
        use.setAttribute('href', `img/sprite.svg#${lang}`);
        }
    }
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
    labelFn: null
};