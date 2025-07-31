// IMPORTS
import { getI18nData } from "../utils/i18n.js";

// GLOBAL VARIABLES
const burgerBtn = document.getElementById("burger-btn");
const githubIcon = document.getElementById("github-icon");
const vercelIcon = document.getElementById("vercel-icon");

// OPEN HAMBURGER MENU
export async function openMenu(locale) {
    const { burgerBtn: burgerLabels } = await getI18nData(locale);
    const labels = burgerLabels?.["aria-label"];

    burgerBtn.addEventListener("click", () => {
        const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
        const newState = !isExpanded;

        // SET BTN ARIA STATES
        burgerBtn.setAttribute("aria-expanded", newState.toString());
        burgerBtn.setAttribute("aria-pressed", newState.toString());
        burgerBtn.setAttribute("aria-label", labels?.[newState ? "close" : "open"] || "Open menu"); // FALLBACK

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