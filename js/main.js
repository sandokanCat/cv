// IMPORTS
import { activeJS } from './utils/activeJS.js';
import { initI18n } from './utils/i18n.js';

import * as components from './components/index.js';

import { signature } from './utils/signature.js';
import { manageCookies } from './utils/manageCookies.js';

// GLOBAL VARIABLES
const userLang = localStorage.getItem('lang') || navigator.language.slice(0, 2);

// CALLING FUNCTIONS
document.addEventListener("DOMContentLoaded", async () => {
    activeJS('js-disabled', 'js-enabled');

    initI18n(userLang);
    
    components.themeDark('#theme-dark-btn');
    await components.initCarousel('.carousel-container', '.carousel-imgs', '.carousel-advance', '.carousel-back');
    await components.showRandomMsg('#random-phrases');
    components.openMenu('#burger-btn', '#github-icon', '#vercel-icon');
    await components.provisionalAlert('a[data-status]');
    components.openModal('.modal-link', '#modal-container', '#modal-content', '#modal-iframe', '#modal-close');

    signature('#signature-year');
    manageCookies('#cookies-bar', '#accept-cookies');
});

console.group('EASTER EGG');
    console.log( // BUSSINESS CARD
        "%c" +
        " /\\_/\\   Frontend Dev | Maquetación Creativa 🛠️\n" +
        "( o.o )        HTML5 • CSS3 • JS Vanilla\n" +
        " > ^ <     \"sandokan.cat loves code & purrs\" 🐱\n" +
        "  ╰─▶              dev@sandokan.cat",
        "color: #ff6d00; font-family: monospace; line-height: 1.3;"
    );
    console.log( // TECH GREETINGS
        "%c💻 ¡HOLA DEV! 👋\n" +
        "Este CV web es 100% vanilla JS y CSS custom.\n" +
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