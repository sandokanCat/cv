// IMPORTS
import { getI18nData } from "../utils/i18n.js";

// GLOBAL VARIABLES
const burgerBtn = document.getElementById("burger-btn");
const githubIcon = document.getElementById("github-icon");
const vercelIcon = document.getElementById("vercel-icon");

// OPEN HAMBURGER MENU
export function openMenu(locale = getLocale()) {
    const i18nData = getI18nData();
    const labels = i18nData.burgerBtn?.["aria-label"];

    burgerBtn.addEventListener("click", () => {
        const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
        const newState = !isExpanded;
        
        // GET I18N LABEL
        burgerBtn.setAttribute("aria-label", labels?.[newState ? "close" : "open"] || "Menu");

        // SET BTN ARIA STATES
        burgerBtn.setAttribute("aria-expanded", newState.toString());
        burgerBtn.setAttribute("aria-pressed", newState.toString()); burgerBtn.setAttribute("aria-label", labels?.[newState ? "close" : "open"] || "Menu");
        burgerBtn.setAttribute("aria-label", label || "Open menu"); // en-GB FALLBACK

        // switch (locale) { // ARIA-LABEL WITH I18N
        //     case "es-ES":
        //         burgerBtn.setAttribute("aria-label", newState ? "Cerrar menú" : "Abrir menú");
        //         break;
        //     case "ca-ES":
        //         burgerBtn.setAttribute("aria-label", newState ? "Tancar menú" : "Obrir menú");
        //         break;
        //     default: burgerBtn.setAttribute("aria-label", newState ? "Close menu" : "Open menu");
        // }

        // TOGGLE ICONS
        githubIcon.classList.toggle("active");
        vercelIcon.classList.toggle("active");

        // EASTER EGG
        console.log(
            "%c🍔 Menú desplegable hecho con CSS puro y amor. ¡No jQuery aquí!",
            "color: #2ecc71;"
        );
    });
}
