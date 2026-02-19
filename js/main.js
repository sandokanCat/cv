// 📥 INTERNAL IMPORTS ORDERED BY LAYER: CONFIG → UTILS → COMPONENTS
import {
    carouselConfig,
    getModalRefs
} from './config.js';
import {
    replaceClass,
    getLocale,
    initPopStateListener,
    initI18n,
    updateUrlLocale,
    changeLocale,
    initToggler,
    signature,
    manageCookies,
    easterEgg
} from './utils/index.js';
import {
    initTheme,
    initLangMenu,
    initCarousel,
    getBurgerConfig,
    reloadRandomMsg,
    updateProvisionalAlert,
    openModal/*,
    sendMail*/
} from './components/index.js';

// 🧠 APP INITIALIZATION SEQUENCE: FROM GLOBALS TO INTERACTIVE UI
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

    await initCarousel({ ...carouselConfig, locale, refs: carouselConfig.refs() });

    await initToggler(await getBurgerConfig(locale));

    signature('#signature-year');

    await reloadRandomMsg(locale);

    manageCookies('#cookies-bar');

    await updateProvisionalAlert(locale);

    await openModal({ refs: getModalRefs });

    // sendMail();

    await easterEgg();
});
