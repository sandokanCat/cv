// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js";  // FETCH + STRUCTURE + FORMAT VALIDATION

// VARIABLES FOR DEVELOPMENT
const mode = "prod"; // CHANGE AS NEEDED: dev | ngrok | prod
const sources = {
    dev: "http://127.0.0.1:5500/js/data/alerts.json",
    ngrok: "https://example.ngrok-free.app/js/data/alerts.json",
    prod: "js/data/alerts.json"
};

// GLOBAL VARIABLES
let lastAlert = null; // LAST SHOWN ALERT

// FETCHES AND VALIDATES REMOTE ALERTS.JSON VIA PUBLIC LIBRARY
const loadAlertsData = async () => {
    // FETCH AND BASE VALIDATION
    const alerts = await validateJSON(sources[mode], {
        allowedTypes: "string", // ENSURE ARRAY OF STRINGS
        requireContent: true,   // FAIL IF EMPTY
        debug: mode !== "prod"  // LOG ONLY IN DEV OR NGROK
    });

    return alerts; // RETURN VALIDATED ALERT LIST
};

// INIT PROVISIONAL ALERTS
export async function provisionalAlert(selector = 'a[data-status]') {
    try {
        const alerts = await loadAlertsData(); // ENSURE ALERTS ARE LOADED

        // ATTACH CLICK EVENTS TO ALL MATCHING LINKS
        document.querySelectorAll(selector).forEach(link => {
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
        });

    } catch (err) {
        console.error("provisionalAlert.js ERROR", sources[mode], "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
    }
}