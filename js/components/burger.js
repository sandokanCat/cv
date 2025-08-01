// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js"; // FETCH + STRUCTURE + FORMAT VALIDATION
import { getLocale, getI18nData } from "../utils/i18n.js"; // USE GLOBAL i18n LOCALE DETECTION

// GLOBAL VARIABLES
const burgerBtn = document.getElementById("burger-btn");
const githubIcon = document.getElementById("github-icon");
const vercelIcon = document.getElementById("vercel-icon");

// RELOAD HAMBURGER DATA
export async function reloadBurgerData(locale = getLocale()) {
    if (!burgerBtn) return console.error(`${burgerBtn} BURGER BUTTON NOT FOUND`);

    const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
    const newState = !isExpanded;

    const { burgerBtn: burgerLabels } = await getI18nData(locale);
    const labels = burgerLabels?.["aria-label"];

    burgerBtn.setAttribute("aria-label", labels?.[newState ? "open" : "close"] || "Open menu");
}

// OPEN HAMBURGER MENU
export function openBurger() {
    if (!burgerBtn) return console.error(`${burgerBtn} BURGER BUTTON NOT FOUND`);

    burgerBtn.addEventListener("click", () => {
        const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
        const newState = !isExpanded;

        // SET BTN ARIA STATES
        burgerBtn.setAttribute("aria-expanded", newState.toString());
        burgerBtn.setAttribute("aria-pressed", newState.toString());

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