import {
    getLocale,
    // fallbackLocale,
    setLocaleStorage,
    initI18n,
    reloadDynamicContent } from '../utils/index.js';

export async function getLangMenuConfig() {
    return {
        triggerSelector: '[data-lang]',
        multiple: true,
        aria: true,
        onClick: async (btn, newState) => {
            const lang = btn.getAttribute('data-lang')?.trim();
            if (!lang) return;

            const current = getLocale()/* || fallbackLocale*/;
            if (lang === current) return;

            setLocaleStorage(lang);
            await initI18n({ locale: lang });
            await reloadDynamicContent(lang);

            document.querySelectorAll('[data-lang]').forEach(el =>
                el.setAttribute('aria-pressed', el === btn ? 'true' : 'false')
            );
        },
        customToggleFn: (btn) => {
            const use = btn.querySelector('use');
            const lang = btn.getAttribute('data-lang');
            if (use && lang) {
                use.setAttribute('href', `img/sprite.svg#${lang}`);
            }
        }
    };
}