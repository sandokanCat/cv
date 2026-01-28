// 📥 IMPORTS ORDERED BY LAYER: UTILS → COMPONENTS
import {
    replaceClass,
    getLocale,
    initPopStateListener,
    changeLocale,
    signature
} from '../utils/index.js';
import {
    initTheme,
    initLangMenu
} from '../components/index.js';

// 🧠 APP INITIALIZATION
document.addEventListener("DOMContentLoaded", async () => {
    const { locale } = await getLocale();

    replaceClass('js-disabled', 'js-enabled');

    initTheme('#theme-dark-btn', document.documentElement);

    initPopStateListener(changeLocale);

    initLangMenu(locale, changeLocale);

    signature('#signature-year');
});
