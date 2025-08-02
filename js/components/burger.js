// IMPORTS
import { getLocale, getI18nData } from "../utils/i18n.js"; // USE GLOBAL i18n LOCALE DETECTION

// CACHED DOM ELEMENTS
const burgerBtn = document.getElementById("burger-btn");
const githubIcon = document.getElementById("github-icon");
const vercelIcon = document.getElementById("vercel-icon");

// CACHED LABELS
let cachedLabels = {
    open: "Open menu",
    close: "Close menu"
};

// UPDATE ARIA-LABEL BASED ON STATE
function updateBurgerAriaLabel(newState) {
    burgerBtn.setAttribute("aria-label", cachedLabels[!newState ? "open" : "close"]);
}

// RELOAD I18N LABELS ON INIT
export async function updateBurgerData(locale = getLocale()) {
    if (!burgerBtn) return console.error(`${burgerBtn} BURGER BUTTON NOT FOUND`);

    const data = await getI18nData(locale);
    const labels = data?.burgerBtn?.["aria-label"];

    if (!labels) console.error(`MISSING ${data.burgerBtn} IN ${locale}.json FILE`);

    // CACHE LABELS FOR RUNTIME USE
    cachedLabels = {
        open: labels?.open || "Open menu",
        close: labels?.close || "Close menu"
    };

    // SET INITIAL ARIA-LABEL BASED ON CURRENT STATE
    const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
    const newState = !isExpanded;
    updateBurgerAriaLabel(newState);
}

// TOGGLE BURGER MENU STATES
export function openBurger(burgerBtn, githubIcon, vercelIcon) {
    if (!burgerBtn) return console.error(`${burgerBtn} BURGER BUTTON NOT FOUND`);

    burgerBtn.addEventListener("click", () => {
        // GET BTN STATE
        const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
        const newState = !isExpanded;

        // TOGGLE ICONS
        githubIcon.classList.toggle("active");
        vercelIcon.classList.toggle("active");

        // SET BTN ARIA STATES
        burgerBtn.setAttribute("aria-expanded", newState.toString());
        burgerBtn.setAttribute("aria-pressed", newState.toString());
        
        // SET ARIA-LABEL
        updateBurgerAriaLabel(newState);

        // EASTER EGG
        console.log(
            "%c🍔 Menú desplegable hecho con CSS puro y amor. ¡No jQuery aquí!",
            "color: #2ecc71;"
        );
    });
}