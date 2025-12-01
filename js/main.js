// 🐱 OWN EXTERNAL IMPORTS
import { default as logger } from "https://open-utils-dev-sandokan-cat.vercel.app/js/logger.js";

// 📥 INTERNAL IMPORTS ORDERED BY LAYER: CONFIG → UTILS → COMPONENTS
import {
    i18nConfig,
    carouselConfig,
    cookiesConfig/*,
    getModalRefs*/
} from './config.js';
import {
    replaceClass,
    getLocale,
    initI18n,
    initToggler,
    reloadDynamicContent,
    signature,
    manageCookies
} from './utils/index.js';
import {
    initTheme,
    getLangMenuConfig,
    initCarousel,
    updateCarouselAlts,
    reloadRandomMsg,
    getBurgerConfig,
    updateProvisionalAlert,
    /* openModal,
    sendMail */
} from './components/index.js';

// 🧠 APP INITIALIZATION SEQUENCE: FROM GLOBALS TO INTERACTIVE UI
document.addEventListener("DOMContentLoaded", async () => {
    const { locale } = await getLocale();

    replaceClass('js-disabled', 'js-enabled');
    initTheme('#theme-dark-btn', document.documentElement);
    await initI18n({ ...i18nConfig, locale });

    await initToggler(await getLangMenuConfig(async (newLang) => {
        await initI18n({ ...i18nConfig, locale: newLang });
        await reloadDynamicContent(newLang);
    }));
    
    await initCarousel({ ...carouselConfig, locale, refs: carouselConfig.refs() });
    await reloadRandomMsg(locale);
    await initToggler(await getBurgerConfig(locale));
    await updateProvisionalAlert(locale);

    signature('#signature-year');
    manageCookies({ ...cookiesConfig });

    // openModal({getModalRefs(), locale});
    sendMail();
});

logger.gp("easter egg", () => {
    logger.lg( // BUSSINESS CARD
        "%c" +
        " /\\_/\\   Fullstack Dev | Desarrollo Creativo 🛠️\n" +
        "( o.o )        HTML5 • CSS3 • Vanilla JS\n" +
        " > ^ <     \"sandokan.cat loves code & purrs\" 🐱\n" +
        "  ╰─▶              dev@sandokan.cat",
        "color: #ff6d00; font-family: monospace; line-height: 1.3;");
    logger.lg( // TECH GREETINGS
        "%c💻 ¡HOLA DEV! 👋\n" +
        "Este CV web es 100% Vanilla JS y custom CSS.\n" +
        "👉 ¿Quieres echar un vistazo al código? https://github.com/sandokanCat \n" +
        "🚀 ¿Buscas un maquetador Fullstack? ¡Hablemos! https://linkedin.com/in/sandokanCat",
        "color: #2196f3; font-family: monospace; line-height: 1.5;"
    );
    logger.lg( // THANKS
        "%cGracias por inspeccionar. ¡Prepara más café, elige tu música y sigamos picando código! ☕️🎧",
        "color: #9b59b6; font-family: monospace; font-weight: 700;"
    )
    logger.in( // FOOTER
        `© ${new Date().getFullYear()} sandokan.cat. Todos los derechos reservados.`
    )
});

// A LITTE JOKE MORE
logger.as(
    (document.title === "sandokan.cat | Fullstack Web Developer") || 
    (document.title === "sandokan.cat | Desarrollador Web Fullstack") || 
    (document.title === "sandokan.cat | Desenvolupador Web Fullstack") ||
    (document.title === "sandokan.cat | Fullstack веб-разработчик") ||
    (document.title === "sandokan.cat | Fullstack مطور ويب"),
    `❌ ¡Meow alert! El título actual es '${document.title}'. ¡Git push urgente! 🐾`
)