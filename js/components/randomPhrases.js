// IMPORTS
import { logger } from "https://open-utils-dev-sandokan-cat.vercel.app/js/logger.js";
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js"
import { getLocale } from "../utils/index.js"; // USE GLOBAL i18n LOCALE DETECTION

// GLOBAL VARIABLES
const json = "./js/data/phrases.json"; // SOURCE JSON FILE

const target = document.getElementById('random-phrases'); // CACHED ID
let phrasesCache = []; // FULL JSON CACHED
let phrasesPool = [];  // TEMPORARY SHUFFLED LIST
let lastPhrase = null; // LAST SHOWN PHRASE
let intervalStarted = false; // PREVENT MULTIPLE INSTANCES

// FETCHES AND VALIDATES REMOTE JSON VIA PUBLIC LIBRARY
const loadPhrasesData = async (locale) => {
    if (phrasesCache.length) return phrasesCache; // USE CACHE IF ALREADY LOADED

    const raw = await validateJSON(json); // FETCH AND BASE VALIDATION
    const lang = locale.split("-")[0]; // LANG FALLBACK

    // FILTER VALID OBJECTS WITH LOCALE/LANG FALLBACK
    phrasesCache = raw.filter(p =>
        p && typeof p === "object" && (p[locale] || p[lang] || p["en-GB"])
    );

    // THROW IF RESULTING CACHE IS EMPTY
    if (!phrasesCache.length)
        throw new Error(`EMPTY OR INVALID JSON DATA: ${JSON.stringify(raw)}`);

    return phrasesCache; // RETURN VALIDATED PHRASES DATA
};

// RELOAD RANDOM PHRASES
export async function reloadRandomMsg(locale = getLocale()) {
    resetRandomMsg();
    await showRandomMsg(locale);
}

// RESET RANDOM PHRASES
function resetRandomMsg() {
    intervalStarted = false;
    lastPhrase = null;
    phrasesPool = [];
    if (target) target.textContent = ""; // RESET CONTENT
}

// INIT RANDOM PHRASES
async function showRandomMsg(locale = getLocale()) {
    if (intervalStarted) return; // PREVENT MULTIPLE LOOPS
    intervalStarted = true;

    const shuffle = (arr) => { // FISHER–YATES
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    try {
        await loadPhrasesData(locale); // ENSURE PHRASES ARE LOADED
        
        const lang = locale.split("-")[0]; // FALLBACK TO BASE LANGUAGE (e.g., 'en')

        const MAX_SHUFFLE_ATTEMPTS = 10; // LIMIT LOOP TO AVOID INFINITE SHUFFLES

        // MAIN LOOP TO DISPLAY RANDOM PHRASES
        const loop = () => {
            if (!phrasesPool.length) { // REFILL POOL IF EMPTY (SHUFFLED COPY OF CACHE)
                let attempts = 0;
                do {
                    phrasesPool = shuffle([...phrasesCache]); // NEW SHUFFLED ARRAY
                    attempts++;
                    if (phrasesCache.length <= 1 || attempts >= MAX_SHUFFLE_ATTEMPTS) break;

                } while ( // AVOID REPEATING LAST PHRASE ON NEXT LOOP
                    phrasesPool[phrasesPool.length - 1][locale] === lastPhrase?.[locale] ||
                    phrasesPool[phrasesPool.length - 1][lang] === lastPhrase?.[lang]
                );
            }

            // PICK NEXT RANDOM PHRASE
            const selected = phrasesPool.pop();
            lastPhrase = selected;

            // FIND TARGET ELEMENT
            if (!target) throw new Error(`NOT FOUND TARGET ELEMENT: ${target?.outerHTML ?? '[null]'}`);

            target.classList.add("fade-out"); // TRIGGER FADE-OUT

            // UPDATE TEXT AFTER FADE
            setTimeout(() => {
                if (!target) return;

                // SHOW TEXT WITH LOCALE/LANG FALLBACK
                target.textContent =
                    selected[locale] || selected[lang] || selected["en-GB"] || "";
                target.classList.remove("fade-out"); // TRIGGER FADE-IN
            }, 1200);

            setTimeout(loop, 12000); // RECURSIVE TIMER
        };

        loop(); // START LOOP
    } catch (err) {
        logger.er("randomPhrases.js ERROR", json, "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
    }

}

