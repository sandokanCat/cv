// OWN EXTERNAL IMPORTS
import { default as logger } from "https://open-utils-dev-sandokan-cat.vercel.app/js/logger.js";

// INTERNAL IMPORTS
import {
    getLocale,
    loadLocalizedArray, createRandomPool, resetRandomModule
} from "../utils/index.js";

// GLOBAL VARIABLES
const json = "./js/data/alerts.json"; // SOURCE JSON FILE
const alertLinks = document.querySelectorAll('a[data-status]'); // CACHED DOM ELEMENTS

let alertsCache = []; // CACHE ARRAY OF STRINGS

// CONTAINER REFERENCE FOR POOL
export const alertsRandomPoolRef = { current: null };

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
    resetProvisionalAlert();
    await provisionalAlert(locale);
}

// RESET ALL ALERT LINKS
function resetProvisionalAlert() {
    resetRandomModule({
        cache: alertsCache,
        poolRef: alertsRandomPoolRef
    });

    alertLinks.forEach(link => { link.dataset.alertBound = "false"; });
}

// ATTACH ALERT FUNCTIONALITY TO LINKS
async function provisionalAlert(locale = getLocale()) {
    try {
        await loadAlertsData(locale); // ENSURE JSON IS LOADED

        alertLinks.forEach(link => {
            const oldHandler = link._alertHandler;
            if (oldHandler) link.removeEventListener('click', oldHandler);
        
            const handler = (event) => {
                event.preventDefault();
                const pool = alertsRandomPoolRef.current;
                if (!pool || !alertsCache.length) return;
        
                const selected = pool.getNext(); // GET NEXT RANDOM PHRASE
                if (typeof selected !== "string") // ENSURE IT'S A STRING
                    throw new Error("INVALID ALERT TYPE (EXPECTED STRING)");
        
                if (confirm(selected)) window.open(link.href, '_blank');
            };
        
            link.addEventListener('click', handler);
            link._alertHandler = handler;
        });

    } catch (err) {
        logger.er("provisionalAlert.js ERROR", json, "→", err.name, err.message, err.stack);  // LOG ANY ERROR
    }
}
