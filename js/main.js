// 📥 INTERNAL IMPORTS ORDERED BY LAYER: CONFIG → UTILS → COMPONENTS
import {
    i18nConfig,
    carouselConfig,
    cookiesConfig/*,
    getModalRefs*/
} from './config.js';
import {
    logger,
    replaceClass,
    getLocale,
    initI18n,
    initToggler,
    reloadDynamicContent,
    updateUrlLocale,
    initPopStateListener,
    signature,
    manageCookies,
    easterEgg
} from './utils/index.js';
import {
    initTheme,
    getLangMenuConfig,
    initCarousel,
    getBurgerConfig/*,
    openModal,
    sendMail */
} from './components/index.js';

// 🔄 CHANGE LOCALE FUNCTION
const changeLocale = async (newLang) => {
    try {
        const { locale: currentLocale } = await getLocale();

        if (newLang === currentLocale) return;

        await initI18n({ ...i18nConfig, locale: newLang });
        await reloadDynamicContent(newLang);
        await updateUrlLocale(newLang);
    } catch (err) {
        logger.er("CHANGE LOCALE FAILED", err.name, err.message, err.stack);
    }
};

// 🧠 APP INITIALIZATION SEQUENCE: FROM GLOBALS TO INTERACTIVE UI
document.addEventListener("DOMContentLoaded", async () => {
    const { locale } = await getLocale();

    replaceClass('js-disabled', 'js-enabled');
    initTheme('#theme-dark-btn', document.documentElement);

    initPopStateListener(changeLocale);

    await initToggler(await getLangMenuConfig(changeLocale));

    await initCarousel({ ...carouselConfig, locale, refs: carouselConfig.refs() });

    await initToggler(await getBurgerConfig(locale));

    signature('#signature-year');
    manageCookies({ ...cookiesConfig });

    // openModal({getModalRefs(), locale});
    // sendMail();

    easterEgg();
});
