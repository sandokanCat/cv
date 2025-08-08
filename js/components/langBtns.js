import { getLocale, setLocaleStorage, fallbackLocale, initI18n, reloadDynamicContent } from '../utils/index.js';

export function getLangMenuConfig() {
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


// IMPORTS
// import {
//     getLocale,
//     fallbackLocale,
//     getI18nData,
//     initI18n,
//     reloadDynamicContent,
//     initToggler } from '../utils/index.js';

// INIT LANG SWITCHER
// export async function initLangSwitcher(selector, onChange) {
//     const langBtns = document.querySelectorAll(selector);
//     let currentLocale = getLocale() || fallbackLocale;

//     const setAriaPressed = (locale) => {
//         let found = false;
//         langBtns.forEach(btn => {
//             const btnLang = btn.getAttribute('data-lang')?.trim();
//             if (btnLang === locale) found = true;
//             btn.setAttribute('aria-pressed', btnLang === locale ? 'true' : 'false');
//         });
//         if (!found) console.error(`NO LANG BUTTON FOUND FOR LOCALE "${locale}"`);
//     };

//     setAriaPressed(currentLocale);

//     langBtns.forEach(btn => {
//         btn.addEventListener('click', async () => {
//             try {
//                 const lang = btn.getAttribute('data-lang')?.trim();
//                 if (!lang) return;

//                 if (lang && lang !== currentLocale) {
//                     setLocaleStorage(lang);
//                     if (typeof onChange === 'function') {
//                         await onChange(lang);
//                     } else {
//                         await initI18n({ locale: lang });
//                     }
//                     setAriaPressed(lang);
//                     currentLocale = lang;

//                     const current = getLocale();
//                     if (lang === current) return;

//                     setLocaleStorage(lang);
//                     await initI18n({ locale: lang });
//                     await reloadDynamicContent(lang);

//                     document.querySelectorAll('[data-lang]').forEach(el =>
//                         el.setAttribute('aria-pressed', el === btn ? 'true' : 'false')
//                     );

//                     const use = btn.querySelector('use');
//                     const lang = btn.getAttribute('data-lang');
//                     if (use && lang) {
//                         use.setAttribute('href', `img/sprite.svg#${lang}`);
//                     }
                    
//                     await reloadDynamicContent(lang);
//                 }
//             } catch (err) {
//                 console.error('ERROR CHANGING LANGUAGE:', err.name, err.message, err.stack);
//             }
//         });
//     });

//     return currentLocale;
// }