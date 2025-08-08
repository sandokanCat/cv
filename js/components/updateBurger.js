// IMPORTS
import { getLocale, getI18nData } from "../utils/index.js";


// BURGER MENU CONFIG
export async function getBurgerConfig(locale = getLocale()) {
    const burgerBtn = document.getElementById("burger-btn");
    if (!burgerBtn) {
        console.error("BURGER BUTTON NOT FOUND");
        return {};
    }

    const data = await getI18nData(locale);
    const labels = data?.burgerBtn?.["aria-label"] || {};

    if (!labels) console.error(`MISSING ${data.burgerBtn} IN ${locale}.json FILE`);

    const cachedLabels = {
        open: labels?.open || "Open menu",
        close: labels?.close || "Close menu"
    };

    return {
        triggerSelector: '#burger-btn',
        targets: ['#github-icon', '#vercel-icon'],
        aria: true,
        labelFn: (newState) => {
            burgerBtn.setAttribute("aria-label", cachedLabels[!newState ? "open" : "close"]);
        },
        onClick: (newState) => {
            console.log( // EASTER EGG
                "%c🍔 Menú desplegable hecho con CSS puro y amor. ¡No jQuery aquí!",
                "color: #2ecc71;"
            );
        }
    };
}