// 📥 INTERNAL IMPORTS ORDERED BY LAYER: CONFIG → UTILS → COMPONENTS
import {
    carouselConfig,
    getModalRefs
} from './config.js';
import {
    replaceClass,
    getLocale,
    initPopStateListener,
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
    openModal,
    sendMail
} from './components/index.js';

// 🧠 APP INITIALIZATION SEQUENCE: FROM GLOBALS TO INTERACTIVE UI
document.addEventListener("DOMContentLoaded", async () => {
    const { locale } = await getLocale();

    replaceClass('js-disabled', 'js-enabled');

    initTheme('#theme-dark-btn', document.documentElement);

    initPopStateListener(changeLocale);

    initLangMenu(locale, changeLocale);

    await initCarousel({ ...carouselConfig, locale, refs: carouselConfig.refs() });

    await initToggler(await getBurgerConfig(locale));

    signature('#signature-year');

    manageCookies('#cookies-bar');

    await reloadRandomMsg(locale);

    await updateProvisionalAlert(locale);

    await openModal({ refs: getModalRefs, locale });

    sendMail();

    await easterEgg();
});
