// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js"; // FETCH + STRUCTURE + FORMAT VALIDATION
import { getLang } from "../utils/i18n.js"; // USE GLOBAL i18n LOCALE DETECTION

// GLOBAL VARIABLES
const json = "js/data/alerts.json"; // SOURCE JSON FILE

const locale = getLang(); // FULL LOCALE FROM GLOBAL FUNC

const alertLinks = document.querySelectorAll('a[data-status]'); // CACHED ALL ALERT LINKS
let lastAlert = null; // LAST SHOWN ALERT

// FETCHES AND VALIDATES REMOTE JSON VIA PUBLIC LIBRARY
const loadAlertsData = async () => {
    const alerts = await validateJSON(json);
    return alerts;
};

// RESET PROVISIONAL ALERT
function resetProvisionalAlert() {
    if (alertLinks) alertLinks.alt = ""; // RESET CONTENT
}

// RELOAD PROVISIONAL ALERT (EXPORTED)
export async function reloadProvisionalAlert(locale = "en-GB") {
    resetProvisionalAlert();
    await provisionalAlert(locale);
}

// INIT PROVISIONAL ALERTS
async function provisionalAlert(locale) {
    try {
        const alerts = await loadAlertsData(); // ENSURE ALERTS ARE LOADED

        // ATTACH CLICK EVENTS TO ALL MATCHING LINKS
        alertLinks.forEach(link => {
            if (link.dataset.alertBound === "true") return;

            link.addEventListener('click', (event) => {
                event.preventDefault(); // PREVENT DEFAULT NAVIGATION

                let alertText;
                let randomItem;

                // PICK RANDOM ITEM WITH A VALID ALERT FOR CURRENT LOCALE
                do {
                    randomItem = alerts[Math.floor(Math.random() * alerts.length)];
                    alertText = randomItem?.[locale];
                } while ((alertText === lastAlert || !alertText) && alerts.length > 1);

                lastAlert = alertText; // UPDATE LAST SHOWN ALERT

                // SHOW CONFIRM DIALOG → OPEN LINK IN NEW TAB IF ACCEPTED
                if (confirm(alertText)) {
                    window.open(link.href, '_blank');
                }
            });

            link.dataset.alertBound = "true"; // PREVENT MULTIPLE BINDINGS
        });

    } catch (err) {
        console.error("provisionalAlert.js ERROR", json, "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
    }
}
