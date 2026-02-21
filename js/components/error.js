// 📥 IMPORTS ORDERED BY LAYER: UTILS → COMPONENTS
import {
    replaceClass,
    getLocale, initPopStateListener, initI18n, updateUrlLocale, changeLocale,
    signature,
    manageCookies,
} from '../utils/index.js';
import {
    initTheme,
    initLangMenu
} from '../components/index.js';

// 🧠 APP INITIALIZATION
document.addEventListener("DOMContentLoaded", async () => {
    const { locale } = await getLocale();

    // ⚡ SYNC PAGE WITH TARGET LOCALE IF DIFFERENT FROM SERVER RENDER
    if (locale !== document.documentElement.lang) {
        await initI18n({ locale });
        await updateUrlLocale(locale);
    }

    replaceClass('js-disabled', 'js-enabled');

    initTheme('#theme-dark-btn', document.documentElement);

    initPopStateListener(changeLocale);

    initLangMenu(locale, changeLocale);

    signature('#signature-year');

    manageCookies('#cookies-bar');
});
