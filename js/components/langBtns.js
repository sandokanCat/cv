// IMPORTS
import {
    getLocale,
    setLocaleStorage,
    initI18n,
    reloadDynamicContent } from '../utils/index.js';

// LANG MENU CONFIG
export async function getLangMenuConfig() {
    return {
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