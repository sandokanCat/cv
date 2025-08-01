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
export async function reloadBurgerData(locale = getLocale()) {
    if (!burgerBtn) return console.error(`${burgerBtn} BURGER BUTTON NOT FOUND`);

    // GET LABELS FROM JSON
    // const { burgerBtn: burgerLabels } = await getI18nData(locale);
    // const labels = burgerLabels?.["aria-label"];

    const data = await getI18nData(locale);
    console.log("🧩 burger.js I18N DATA:", data); // 🔍 DEPURACIÓN
    const { burgerBtn: burgerLabels } = data;

    if (!burgerLabels) {
        console.error(`⚠️ MISSING "burgerBtn" IN LOCALE "${locale}" JSON`);
    }

    const labels = burgerLabels?.["aria-label"];

    if (!labels) {
        console.error(`⚠️ MISSING "aria-label" IN "burgerBtn" IN LOCALE "${locale}"`);
    }

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
export function openBurger() {
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