// IMPORTS
import { logger } from 'open-utils';
import { getI18nData, getLocale } from './i18n.js';

// PROTECT EXECUTION
let isEasterEggLoaded = false;

// EASTER EGG LOGGING
export async function easterEgg() {
    if (isEasterEggLoaded) return;
    isEasterEggLoaded = true;

    try {
        // 1. GET HYDRATED DATA
        const { locale } = await getLocale();
        const brand = (await getI18nData(locale)).brand || {};

        // 2. BUSSINESS CARD DATA
        const nick = (typeof BRAND_NICK !== 'undefined') ? BRAND_NICK : 'sandokan.cat';
        const email = (typeof BRAND_EMAIL !== 'undefined') ? BRAND_EMAIL : 'dev@sandokan.cat';
        const role = brand.role || 'Fullstack Web Developer';

        logger.gp("easter egg", () => {
            logger.lg( // BUSSINESS CARD
                "%c" +
                ` /\\_/\\   ${role} | Desarrollo Creativo 🛠️\n` +
                "( o.o )        HTML5 • CSS3 • Vanilla JS\n" +
                ` > ^ <     "${nick} loves code & purrs" 🐱\n` +
                `  ╰─▶              ${email}`,
                "color: #ff6d00; font-family: monospace; line-height: 1.3;"
            );
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
            );
            logger.in( // FOOTER
                `© ${new Date().getFullYear()} ${nick}. Todos los derechos reservados.`
            );
        });

        // 3. AUTOMATIC TITLE VALIDATION
        const scriptEl = document.getElementById('globals-data');
        const globals = scriptEl ? JSON.parse(scriptEl.textContent || '{}') : {};
        const brandDict = globals.brand || {};

        const validTitles = Object.keys(brandDict)
            .filter(key => key.includes('-'))
            .map(key => `${nick} | ${brandDict[key].role}`);

        logger.as(
            validTitles.includes(document.title),
            `❌ ¡Meow alert! El título actual es '${document.title}'. ¡Git push urgente! 🐾`
        );

    } catch (err) {
        logger.er("EASTER EGG FAILED", err.name, err.message, err.stack);
    }
}
