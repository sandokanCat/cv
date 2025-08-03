// IMPORTS
import { getLocale, setLocaleStorage, reloadDynamicContent } from '../utils/i18n.js';

// INIT LANG SWITCHER
export async function initLangSwitcher(selector, onChange) {
    const langBtns = document.querySelectorAll(selector);
    let currentLocale = getLocale();

    const setAriaPressed = (locale) => {
        let found = false;
        langBtns.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang')?.trim();
            if (btnLang === locale) found = true;
            btn.setAttribute('aria-pressed', btnLang === locale ? 'true' : 'false');
        });
        if (!found) console.error(`NO LANG BUTTON FOUND FOR LOCALE "${locale}"`);
    };    

    setAriaPressed(currentLocale);

    langBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                const lang = btn.getAttribute('data-lang')?.trim();
                if (lang && lang !== currentLocale) {
                    setLocaleStorage(lang);
                    if (typeof onChange === 'function') {
                        await onChange(lang);
                    } else {
                        await initI18n({ locale: lang });
                    }
                    setAriaPressed(lang);
                    currentLocale = lang;
                    
                    // const use = btn.querySelector('use');
                    // if (use) use.setAttribute('href', `img/sprite.svg#${lang}`);
                    
                    await reloadDynamicContent(lang);
                }
            } catch (err) {
                console.error('ERROR CHANGING LANGUAGE:', err.name, err.message, err.stack);
            }
        });
    });

    return currentLocale;
}