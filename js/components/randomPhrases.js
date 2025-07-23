// IMPORTS
import { validateJSON } from "https://open-utils-sandokancats-projects.vercel.app/api/validateCarousel.js";  // FETCH + STRUCTURE + FORMAT VALIDATION

// VARIABLES FOR DEVELOPMENT
const mode = "prod"; // CHANGE AS NEEDED: dev | ngrok | prod
const sources = {
	dev: "http://127.0.0.1:5500/js/data/phrases.json",
	ngrok: "https://a679-46-6-46-122.ngrok-free.app/js/data/phrases.json",
	prod: "js/data/phrases.json"
};

// GLOBAL VARIABLES
let phrasesCache = []; // FULL JSON CACHED
let phrasesPool = [];  // TEMPORARY SHUFFLED LIST
let lastPhrase = null; // LAST SHOWN PHRASE
let intervalStarted = false; // PREVENT MULTIPLE INSTANCES

// INIT RANDOM PHRASES
export async function showRandomMsg(selector = "#random-phrases") {
    if (intervalStarted) return; // PREVENT MULTIPLE LOOPS
    intervalStarted = true;

    // SHUFFLE ARRAY (FISHER–YATES)
    const shuffle = (arr) => {
        for (let i = arr.length-1; i>0; i--) {
            const j = Math.floor(Math.random()*(i+1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    try {
        // DETECT LOCATION & LANG
        const locale = document.documentElement.lang?.toLowerCase() || "es-es";
        const lang = locale.split("-")[0];

        // LOAD JSON ONLY ONCE
        if (!phrasesCache.length) { // FETCH & VALIDATE
            const raw = await validateJSON(sources[mode], {
                requireContent: true, // FAIL IF EMPTY
                debug: mode!=="prod" // LOG ONLY IN DEV OR NGROK
            });

            // FILTER WITH AT LEAST ONE OF THE LOCALE OR LANG KEYS
            phrasesCache = raw.filter(p =>
                p && typeof p==="object" && (p[locale] || p[lang] || p["es-es"])
            );
            if (!phrasesCache.length)
                throw new Error(`EMPTY OR INVALID JSON DATA: ${JSON.stringify(raw)}`);
        }

        const MAX_SHUFFLE_ATTEMPTS = 10; // MAX RE-SHUFFLES TO AVOID INFINITE LOOP

        const loop = () => {
            // REFILL POOL IF EMPTY
            if (!phrasesPool.length) {
                let attempts = 0;

                do {
                    // SHUFFLE A NEW COPY OF THE ORIGINAL CACHE
                    phrasesPool = shuffle([...phrasesCache]);
                    attempts++;

                    // STOP IF ONLY ONE PHRASE OR TOO MANY ATTEMPTS
                    if (phrasesCache.length<=1 || attempts>=MAX_SHUFFLE_ATTEMPTS) break;

                // AVOID REPEATING THE LAST SHOWN PHRASE
                } while (
                    phrasesPool[phrasesPool.length-1][locale]===lastPhrase?.[locale] ||
                    phrasesPool[phrasesPool.length-1][lang]===lastPhrase?.[lang]
                );
            }

            // SELECT NEXT PHRASE
            const selected = phrasesPool.pop();
            lastPhrase = selected;

            // FIND TARGET OR ABORT
            const target = document.querySelector(selector);
            if (!target) {
                console.error(`${selector} NOT FOUND`);
                return;
            }

            target.classList.add("fade-out"); // FADE OUT

            setTimeout(() => {
                const liveTarget = document.querySelector(selector); // CHECK IF STILL PRESENT
                if (!liveTarget) return;

                // SHOW TEXT WITH FALLBACK
                liveTarget.textContent =
                    selected[locale] || selected[lang] || selected["es-es"] || "";
                liveTarget.classList.remove("fade-out"); // FADE IN
            }, 1200);

            setTimeout(loop, 12000); // RECURSIVE CYCLE
        };

        loop(); // START LOOP

    } catch (err) {
        console.error("randomPhrases.js ERROR", sources[mode], "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
    }
}