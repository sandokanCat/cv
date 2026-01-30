// IMPORTS
import {
    logger,
    getLocale,
    loadLocalizedArray, createRandomPool, resetRandomModule
} from "../utils/index.js";

// GLOBAL VARIABLES
const json = "./js/data/phrases.json"; // SOURCE JSON FILE
const target = document.getElementById('random-phrases'); // CACHED DOM ELEMENT

let phrasesCache = []; // CACHE ARRAY OF STRINGS
let intervalStarted = false; // PREVENT MULTIPLE LOOPS
let loopTimeout = null; // CURRENT SETTIMEOUT ID

// CONTAINER REFERENCE FOR POOL
export const phrasesRandomPoolRef = { current: null };

// FETCH AND VALIDATE JSON DATA FOR A GIVEN LOCALE
const loadPhrasesData = async (locale = getLocale()) => {
    return loadLocalizedArray({
        jsonPath: json,
        locale,
        cache: phrasesCache,
        setCache: (arr) => { phrasesCache = arr; },
        setPool: (pool) => { phrasesRandomPoolRef.current = pool; },
        createPoolFn: createRandomPool,
        errorLabel: "PHRASES"
    });
};

// PUBLIC FUNCTION: RELOAD PHRASES IN SPECIFIED LOCALE
export async function reloadRandomMsg(locale = getLocale()) {
    resetRandomMsg();
    await showRandomMsg(locale);
}

// RESET: CLEAR STATE AND TIMEOUTS
function resetRandomMsg() {
    resetRandomModule({
        cache: phrasesCache,
        poolRef: phrasesRandomPoolRef
    });

    target.textContent = '';
    intervalStarted = false;

    if (loopTimeout) clearTimeout(loopTimeout);
    loopTimeout = null;
}

// MAIN LOOP: DISPLAY RECURSIVELY
async function showRandomMsg(locale = getLocale()) {
    if (!target || intervalStarted) return;

    intervalStarted = true;

    try {
        await loadPhrasesData(locale); // ENSURE JSON IS LOADED

        const loop = () => {
            const pool = phrasesRandomPoolRef.current;
            if (!pool) return;

            const selected = pool.getNext(); // GET NEXT RANDOM PHRASE
            if (typeof selected !== "string") // ENSURE IT'S A STRING
                throw new Error("INVALID PHRASE TYPE (EXPECTED STRING)");

            target.classList.add("fade-out"); // ADD ANIMATION

            // UPDATE TEXT AFTER FADE DURATION
            setTimeout(() => {
                if (!target) return;
                target.textContent = selected;
                target.classList.remove("fade-out");
            }, 1200);

            loopTimeout = setTimeout(loop, 12000); // SCHEDULE NEXT LOOP
        };

        loop(); // START RECURSIVE LOOP EVERY 12s
    } catch (err) {
        logger.er("randomPhrases.js ERROR", json, "→", err.name, err.message, err.stack); // LOG ANY ERROR
    }
}