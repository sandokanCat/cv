// IMPORTS
import { validateJSON } from 'open-utils';

// LOAD + VALIDATE LOCALIZED ARRAY FROM JSON
export async function loadLocalizedArray({
    jsonPath,
    locale,
    cache,
    setCache,
    setPool,
    createPoolFn,
    errorLabel = "DATA"
}) {
    if (cache.length) return cache; // RETURN CACHED ARRAY

    // FETCH + JSON VALIDATION
    const raw = await validateJSON(jsonPath);
    if (!raw || typeof raw !== "object")
        throw new Error(`INVALID ${errorLabel} JSON FORMAT (EXPECTED OBJECT)`);

    // PICK EXACT OR BASE
    const exact = raw[locale];
    const base = raw[locale.split("-")[0]];
    const selected = exact || base;

    // Support for mixed object { alerts: [], buttons: {} }
    const poolData = (selected && !Array.isArray(selected) && Array.isArray(selected.alerts))
        ? selected.alerts
        : selected;

    if (!poolData || !Array.isArray(poolData) || poolData.length === 0)
        throw new Error(`NO ${errorLabel} FOUND FOR LOCALE '${locale}'`);

    const cloned = poolData.slice();
    setCache(cloned); // UPDATE MODULE CACHE
    setPool(createPoolFn(cloned)); // INIT RANDOM POOL

    return selected;
}

// MANAGE RANDOM ITEMS WITH TEMP POOL + NO IMMEDIATE REPEATS
export function createRandomPool(items = []) {
    let pool = [];
    let last = null;

    return {
        getNext() {
            if (!items.length) return null;

            // REFILL POOL IF EMPTY
            if (!pool.length) {
                pool = [...items];
                shuffle(pool);

                // AVOID IMMEDIATE REPEAT
                if (pool.length > 1 && pool[pool.length - 1] === last) {
                    const first = pool.pop();
                    pool.unshift(first);
                }
            }

            const selected = pool.pop();
            last = selected;
            return selected;
        },
        reset(newItems = null) {
            if (Array.isArray(newItems)) items = newItems.slice();
            pool = [];
            last = null;
        }
    };
}

// FISHER–YATES SHUFFLE
const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// RESET ALL
export function resetRandomModule({ cache, poolRef }) {
    cache.length = 0;
    poolRef.current?.reset();
    poolRef.current = null;
}
