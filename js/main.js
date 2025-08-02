// 📥 IMPORTS ORDERED TO MATCH DOM HIERARCHY (TOP TO BOTTOM)
import { activeJS } from './utils/activeJS.js';
import { getLocale, initI18n, initLangSwitcher } from './utils/i18n.js';
import { themeDark, initCarousel, openBurger/*, openModal*/ } from './components/index.js';
import { signature } from './utils/signature.js';
import { manageCookies } from './utils/manageCookies.js';

// 🧠 FUNCTION CALLS STRUCTURED FOR TRACEABILITY + REUSABILITY
document.addEventListener("DOMContentLoaded", async () => {
    const locale = getLocale()

    activeJS('js-disabled', 'js-enabled');
    await initI18n({
        root: document.documentElement,
        titleSelector: 'title',
        textSelector: '*[data-i18n]',
        attrSelector: '*[data-i18n-attr]',
        locale: locale
    });
    await initLangSwitcher('button[data-lang]', locale);
    themeDark('#theme-dark-btn', document.documentElement);
    await initCarousel(locale);
    openBurger('#burger-btn', '#github-icon', '#vercel-icon');
    // openModal({
    //     linkSelector: '.modal-link',
    //     containerSelector: '#modal-container',
    //     contentSelector: '#modal-content',
    //     iframeSelector: '#modal-iframe',
    //     closeSelector: '#modal-close'
    // });
    signature('#signature-year');
    manageCookies('#cookies-bar', '#accept-cookies');
});

console.group('EASTER EGG');
    console.log( // BUSSINESS CARD
        "%c" +
        " /\\_/\\   Frontend Dev | Maquetación Creativa 🛠️\n" +
        "( o.o )        HTML5 • CSS3 • Vanilla JS\n" +
        " > ^ <     \"sandokan.cat loves code & purrs\" 🐱\n" +
        "  ╰─▶              dev@sandokan.cat",
        "color: #ff6d00; font-family: monospace; line-height: 1.3;"
    );
    console.log( // TECH GREETINGS
        "%c💻 ¡HOLA DEV! 👋\n" +
        "Este CV web es 100% Vanilla JS y custom CSS.\n" +
        "👉 ¿Quieres echar un vistazo al código? https://github.com/sandokanCat \n" +
        "🚀 ¿Buscas un maquetador frontend? ¡Hablemos! https://linkedin.com/in/sandokanCat",
        "color: #2196f3; font-family: monospace; line-height: 1.5;"
    );
    console.log( // THANKS
        "%cGracias por inspeccionar. ¡Prepara más café, elige tu música y sigamos picando código! ☕️🎧",
        "color: #9b59b6; font-family: monospace; font-weight: 700;"
    );
    console.info( // FOOTER
        `© ${new Date().getFullYear()} sandokan.cat. Todos los derechos reservados.`
    );
console.groupEnd('EASTER EGG');

// A LITTE JOKE MORE
console.assert(
    (document.title === "Gonzalo Cabezas | Web Frontend developer") || 
    (document.title === "Gonzalo Cabezas | Desarrollador Frontend web") || 
    (document.title === "Gonzalo Cabezas | Desenvolupador Frontend web") 
    `❌ ¡Meow alert! El título actual es '${document.title}'. ¡Git push urgente! 🐾`
);