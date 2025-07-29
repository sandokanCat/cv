// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js";  // FETCH + STRUCTURE + FORMAT VALIDATION

// GLOBAL VARIABLES
const json = "js/data/alerts.json"; // SOURCE JSON FILE

const alertLinks = document.querySelectorAll('a[data-status]'); // CACHED ALL ALERT LINKS
let lastAlert = null; // LAST SHOWN ALERT

// FETCHES AND VALIDATES REMOTE JSON VIA PUBLIC LIBRARY
const loadAlertsData = async () => {
    // FETCH AND BASE VALIDATION
    const alerts = await validateJSON(json, { allowedTypes: "string" }); // ENSURE ARRAY OF STRINGS

    return alerts; // RETURN VALIDATED ALERT DATA
};

// RELOAD PROVISIONAL ALERT
export async function reloadProvisionalAlert() {
    resetProvisionalAlert();
    await provisionalAlert();
}

// RESET PROVISIONAL ALERT
function resetProvisionalAlert() {
    if (alertLinks) alertLinks.textContent = ""; // RESET CONTENT
}

// INIT PROVISIONAL ALERTS
async function provisionalAlert() {
    try {
        const alerts = await loadAlertsData(); // ENSURE ALERTS ARE LOADED

        // ATTACH CLICK EVENTS TO ALL MATCHING LINKS
        alertLinks.forEach(link => {
            if (link.dataset.alertBound === "true") return;

            link.addEventListener('click', (event) => {
                event.preventDefault(); // PREVENT DEFAULT NAVIGATION

                let randomAlert;

                // PICK RANDOM ALERT (AVOID REPEATING LAST SHOWN)
                do {
                    randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
                } while (randomAlert === lastAlert && alerts.length > 1);

                lastAlert = randomAlert; // UPDATE LAST SHOWN ALERT

                // SHOW CONFIRM DIALOG → OPEN LINK IN NEW TAB IF ACCEPTED
                if (confirm(randomAlert)) {
                    window.open(link.href, '_blank');
                }
            });

            link.dataset.alertBound = "true"; // PREVENT MULTIPLE BINDINGS
        });

    } catch (err) {
        console.error("provisionalAlert.js ERROR", json, "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
    }
}