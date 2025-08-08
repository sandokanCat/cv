import { getLocale, fallbackLocale, getI18nData } from "../utils/index.js";

export async function getBurgerConfig(locale = getLocale() || fallbackLocale) {
    const burgerBtn = document.getElementById("burger-btn");
    if (!burgerBtn) {
        console.error("BURGER BUTTON NOT FOUND");
        return {};
    }

    const data = await getI18nData(locale);
    const labels = data?.burgerBtn?.["aria-label"] || {};

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
        }
    };
}


// // IMPORTS
// import {
//     getLocale,
//     fallbackLocale,
//     getI18nData } from "../utils/index.js";

// // RELOAD I18N LABELS ON INIT
// export async function updateBurgerData(locale = getLocale() || fallbackLocale) {
//     const burgerBtn = document.getElementById("burger-btn");
//     if (!burgerBtn) return console.error(`${burgerBtn} BURGER BUTTON NOT FOUND`);

//     let cachedLabels = {
//         open: "Open menu",
//         close: "Close menu"
//     };

//     const data = await getI18nData(locale);
//     const labels = data?.burgerBtn?.["aria-label"];

//     if (!labels) console.error(`MISSING ${data.burgerBtn} IN ${locale}.json FILE`);

//     // CACHE LABELS FOR RUNTIME USE
//     cachedLabels = {
//         open: labels?.open || "Open menu",
//         close: labels?.close || "Close menu"
//     };

//     // SET INITIAL ARIA-LABEL BASED ON CURRENT STATE
//     const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
//     const newState = !isExpanded;

//     // UPDATE ARIA-LABEL BASED ON STATE
//     function updateBurgerAriaLabel(newState) {
//         burgerBtn.setAttribute("aria-label", cachedLabels[!newState ? "open" : "close"]);

//         if (onChange(newState)) {
//             // EASTER EGG
//             console.log(
//                 "%c🍔 Menú desplegable hecho con CSS puro y amor. ¡No jQuery aquí!",
//                 "color: #2ecc71;"
//             );
//         }
//     };
// }