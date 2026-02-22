// IMPORTS
import {
    logger,
    getLocale,
    loadLocalizedArray, createRandomPool, resetRandomModule
} from "../utils/index.js";

// GLOBAL VARIABLES
const json = `./js/data/alerts.json?v=1738000000`; // SOURCE JSON FILE (WITH CACHE BUSTER)

let alertsCache = []; // CACHE ARRAY OF STRINGS

// CONTAINER REFERENCE FOR POOL
export const alertsRandomPoolRef = { current: null, buttons: null };

// FETCH AND VALIDATE JSON DATA FOR A GIVEN LOCALE
const loadAlertsData = async (locale = getLocale()) => {
    return loadLocalizedArray({
        jsonPath: json,
        locale,
        cache: alertsCache,
        setCache: (arr) => { alertsCache = arr; },
        setPool: (pool) => { alertsRandomPoolRef.current = pool; },
        createPoolFn: createRandomPool,
        errorLabel: "ALERTS"
    });
};

// PUBLIC FUNCTION: RELOAD ALERTS IN SPECIFIED LOCALE
export async function updateProvisionalAlert(locale = getLocale()) {
    const alertLinks = document.querySelectorAll('button[data-status]');
    resetProvisionalAlert(alertLinks);
    await provisionalAlert(locale, alertLinks);
}

// RESET ALL ALERT LINKS
function resetProvisionalAlert(alertLinks) {
    resetRandomModule({
        cache: alertsCache,
        poolRef: alertsRandomPoolRef
    });

    alertLinks.forEach(link => { link.dataset.alertBound = "false"; });
}

// ATTACH ALERT FUNCTIONALITY TO LINKS
async function provisionalAlert(locale = getLocale(), alertLinks = document.querySelectorAll('button[data-status]')) {
    try {
        const data = await loadAlertsData(locale); // ENSURE JSON IS LOADED
        if (data && data.buttons) {
            alertsRandomPoolRef.buttons = data.buttons;

            // DYNAMICALLY UPDATE BUTTON TRANSLATIONS GLOBALLY ON LOCALE CHANGE
            const alertOkEl = document.getElementById('alert-ok');
            const alertCloseEl = document.getElementById('alert-close');
            if (alertOkEl && data.buttons.ok) alertOkEl.textContent = data.buttons.ok;
            if (alertCloseEl && data.buttons.close) alertCloseEl.textContent = data.buttons.close;
        } else {
            logger.wa("ALERTS: 'buttons' object not found in JSON for locale", locale, "data:", data);
        }

        alertLinks.forEach(link => {
            const oldHandler = link._alertHandler;
            if (oldHandler) link.removeEventListener('click', oldHandler);

            const handler = () => {
                const pool = alertsRandomPoolRef.current;
                if (!pool || !alertsCache.length) return;

                const selected = pool.getNext(); // GET NEXT RANDOM PHRASE
                if (typeof selected !== "string") // ENSURE IT'S A STRING
                    throw new Error("INVALID ALERT TYPE (EXPECTED STRING)");

                // UPDATE NATIVE POPOVER TEXT DYNAMICALLY
                const alertMessageEl = document.getElementById('alert-message');
                if (alertMessageEl) {
                    alertMessageEl.textContent = selected;
                }

                // DYNAMICALLY UPDATE THE DESTINATION URL OF THE 'CONTINUE' BUTTON
                const alertOkEl = document.getElementById('alert-ok');

                if (alertOkEl) {
                    // Extract URL from a child anchor, or data attribute if present.
                    // If none found, fallback to the hardcoded estopa one.
                    const destinationUrl = link.dataset.href || link.href || link.querySelector('a')?.href || "https://sandokan.github.io/estopa/";
                    alertOkEl.href = destinationUrl;
                }
            };

            link.addEventListener('click', handler);
            link._alertHandler = handler;
        });

    } catch (err) {
        logger.er("provisionalAlert.js ERROR", json, "→", err.name, err.message);  // LOG ANY ERROR
    }
}
