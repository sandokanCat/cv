// IMPORTS
import {
    i18nConfig,
    carouselConfig
} from "../config.js";

import {
    logger,
    validateJSON
} from 'open-utils';

import {
    initCarousel, updateCarouselAlts,
    reloadRandomMsg,
    getBurgerConfig,
    updateProvisionalAlert
} from "../components/index.js";

import { PreferenceStore } from "./manageCookies.js";

// TRANSLATION CACHE
let globalsData = null;
let langMapData = null;
let cachedLocale = null;
const cachedTranslations = {};
const reloadedLocales = new Set();

// RELOAD DYNAMIC CONTENTS
async function reloadDynamicContent(locale) {
    if (reloadedLocales.has(locale)) return;

    // RELOAD CAROUSEL IF PRESENT
    if (document.querySelector('.carousel-container')) {
        if (typeof initCarousel === 'function') await initCarousel({ ...carouselConfig, locale, refs: carouselConfig.refs() });
        if (typeof updateCarouselAlts === 'function') await updateCarouselAlts(locale);
    }

    // RELOAD RANDOM MSG IF PRESENT
    if (document.getElementById('random-phrases')) {
        if (typeof reloadRandomMsg === 'function') await reloadRandomMsg(locale);
    }

    // RELOAD BURGER MENU IF PRESENT
    if (document.getElementById('burger-btn')) {
        if (typeof getBurgerConfig === 'function') await getBurgerConfig(locale);
    }

    // RELOAD PROVISIONAL ALERT IF PRESENT
    if (document.querySelectorAll('[data-alert]')) {
        if (typeof updateProvisionalAlert === 'function') await updateProvisionalAlert(locale);
    }

    reloadedLocales.add(locale);
}

// LOAD GLOBALS JSON
async function loadGlobals() {
    if (globalsData) return globalsData;

    try {
        const scriptEl = document.getElementById('globals-data');
        if (!scriptEl) throw new Error("DOM_ELEMENT_MISSING");

        globalsData = JSON.parse(scriptEl.textContent || '{}');
        if (Object.keys(globalsData).length === 0) throw new Error("DOM_DATA_EMPTY");
    } catch (err) {
        // FAILOVER
        const isParseError = (err instanceof SyntaxError);
        const msg = isParseError ? "CORRUPT DOM DATA" : "GLOBALS DATA NOT IN DOM";

        logger.wa(`${msg}, FALLING BACK TO FETCH...`, err.name, err.message);

        try {
            globalsData = await validateJSON('/js/globals.json');
        } catch (fetchErr) {
            globalsData = {};
            logger.er("ALL GLOBAL DATA SOURCES FAILED", fetchErr.name, fetchErr.message);
        }
    }

    return globalsData;
}

// LOAD LANGMAP
async function loadLangMap() {
    if (langMapData) return langMapData;

    try {
        const data = await loadGlobals();
        langMapData = {
            op: Object.fromEntries(
                Object.entries(data.lang?.op || { en: ["en-GB", "English"] })
                    .map(([key, value]) => [key, value[0]])
            ),
            inCase: data.lang?.inCase || "en-GB",
            rtl: data.lang?.rtl || []
        };
    } catch (err) {
        logger.er("FAILED TO LOAD LANGMAP", err.name, err.message, err.stack);
        langMapData = {
            op: { en: "en-GB" },
            inCase: "en-GB",
            rtl: []
        };
    }

    return langMapData;
}

// GET CURRENT LOCALE
export const getLocale = async (inputLocale = null) => {
    try {
        if (inputLocale) {
            const { op, inCase } = await loadLangMap();
            const base = inputLocale.split("-")[0].toLowerCase();
            const resolved = { locale: op[base] || inCase, base };

            cachedLocale = resolved;
            reloadedLocales.clear();
            return resolved;
        }

        if (cachedLocale) return cachedLocale;

        const { op, inCase } = await loadLangMap();
        let raw = inputLocale;

        if (!raw) {
            try {
                // PRIORITIZE HTML LANG (SERVER RENDERED TRUTH) OVER STORE/BROWSER
                raw = PreferenceStore.get("lang") || document.documentElement.lang || navigator.language || inCase;
            } catch (err) {
                logger.wa("PreferenceStore UNAVAILABLE, FALLBACK TO NAVIGATOR OR DEFAULT", err.name, err.message, err.stack);
                raw = document.documentElement.lang || navigator.language || inCase;
            }
        }

        const base = raw.split("-")[0].toLowerCase();
        const result = { locale: op[base] || inCase, base };

        if (!inputLocale && !cachedLocale) cachedLocale = result;
        else if (cachedLocale && cachedLocale.locale !== result.locale) reloadedLocales.clear();

        return result;
    } catch (err) {
        logger.er("FAILED TO RESOLVE LOCALE, USING FALLBACK", err.name, err.message, err.stack);
        return { locale: "en-GB", base: "en" };
    }
};

// SET LOCALE IN PREFERENCE STORE
const setLocaleStorage = (locale) => {
    try {
        PreferenceStore.set('lang', locale);
    } catch (err) {
        logger.wa("FAILED TO SET LOCALE IN PreferenceStore", err.name, err.message, err.stack);
    }
}

// GET TRANSLATION JSON BASED ON LOCALE
export const getI18nData = async (locale) => {
    // CHECK CACHE
    if (cachedTranslations[locale]) return cachedTranslations[locale];

    const { op, inCase } = await loadLangMap();

    if (!Object.values(op).includes(locale)) {
        logger.er(`UNEXPECTED LOCALE: ${locale}, FORCING FALLBACK ${inCase}`);
        locale = inCase;
    }

    // FALLBACK TO NETWORK
    try {
        const data = await validateJSON(`/js/i18n/${locale}.json`);
        return cachedTranslations[locale] = data || {};
    } catch (err) {
        logger.er(`LOCALE FALLBACK: ${locale} → ${inCase}`, err.name, err.message);
        if (locale !== inCase) return getI18nData(inCase);
        return {};
    }
};

// GET I18N ERROR MESSAGES FROM ERRORS.JSON
export const getI18nErrors = async () => {
    try {
        return await validateJSON('/js/data/errors.json');
    } catch (err) {
        logger.er("FAILED TO LOAD ERRORS.JSON", err.name, err.message);
        return {};
    }
};

// NESTED VALUE UTIL
const getNestedValue = (obj, key, fallback = "") =>
    key.split(".").reduce((acc, part) => (acc && typeof acc === "object") ? acc[part] : undefined, obj) ?? fallback;

// RESOLVE TRANSLATION WITH BRAND FALLBACK
const resolveValue = (translations, key, brand = {}, locale, fallback = "") => {
    const fromBrandLocale = brand?.[locale]?.[key];
    if (fromBrandLocale !== undefined) return fromBrandLocale;

    const fromI18n = getNestedValue(translations, key);
    if (fromI18n !== undefined && fromI18n !== "") return fromI18n;

    const fromBrandRoot = brand?.[key];
    if (fromBrandRoot !== undefined) return fromBrandRoot;

    return fallback;
};

// INTERPOLATE BRAND PLACEHOLDERS
const interpolateBrand = (str, brand = {}, locale = 'en-GB') => {
    if (typeof str !== 'string') return str;

    return str.replace(/\{\{brand\.([a-zA-Z0-9_]+)\}\}/g, (_, key) => {
        if (!(key in brand)) return `{{brand.${key}}}`;
        const val = brand[key];
        if (typeof val === 'object') return val[locale] ?? Object.values(val)[0] ?? '';
        return val;
    });
};

// INIT i18n TO TRANSLATE PAGE
export const initI18n = async ({
    textSelector = '[data-i18n]',
    attrSelector = '[data-i18n-attr]',
    locale = null
} = {}) => {
    const { rtl } = await loadLangMap();

    const { locale: resolvedLocale, base } = await getLocale(locale);

    if (document.documentElement.lang === resolvedLocale) return;
    else if (document.documentElement.lang !== resolvedLocale) reloadedLocales.clear();

    try {
        // GET DATA
        const globals = await loadGlobals();
        const brand = globals.brand || {};
        let translations = await getI18nData(resolvedLocale);

        // MERGE WITH ERRORS IF IT'S AN ERROR PAGE
        if (document.getElementById('error-container')) {
            const errorTrans = await getI18nErrors();
            translations = { ...translations, ...(errorTrans[resolvedLocale] || {}) };
        }

        // SET HTML LANG & DIR
        setLocaleStorage(resolvedLocale);
        document.documentElement.setAttribute("lang", resolvedLocale);
        document.documentElement.setAttribute("dir", rtl.includes(base) ? "rtl" : "ltr");

        // UPDATE TITLE (SKIP FOR ERRORS/FORMS)
        const isUtilityPage = (typeof IS_ERROR !== 'undefined' && IS_ERROR) || (typeof IS_FORM !== 'undefined' && IS_FORM);
        if (!isUtilityPage) {
            const brandNick = BRAND_NICK?.trim() || 'sandokan.cat';
            const role = brand[resolvedLocale]?.role?.trim() || '';
            document.title = role ? `${brandNick} | ${role}` : brandNick;
        }

        // TRANSLATE VISIBLE CONTENT
        document.querySelectorAll(textSelector).forEach(el => {
            const key = el.getAttribute("data-i18n");
            const raw = resolveValue(translations, key, brand, resolvedLocale);

            const content = (raw === undefined || raw === "") ? brand[resolvedLocale]?.[key] ?? "" : raw;

            if (typeof content === "object") {
                el.innerHTML = interpolateBrand(content.html ?? content.text ?? "", brand, resolvedLocale);
            } else {
                el.textContent = interpolateBrand(content, brand, resolvedLocale);
            }
        });

        // TRANSLATE ATTRIBUTES
        document.querySelectorAll(attrSelector).forEach(el => {
            const attrRaw = el.getAttribute("data-i18n-attr");

            if (!attrRaw) logger.wa(`ELEMENT WITHOUT ${attrSelector} ATTRIBUTE`);
            else attrRaw.split(",").forEach(pair => {
                const [attr, key] = pair.split(":").map(s => s.trim());
                const raw = resolveValue(translations, key, brand, resolvedLocale);
                let value = (raw && typeof raw === "object") ? raw[attr] : raw;

                if (value) el.setAttribute(attr, interpolateBrand(value, brand, resolvedLocale));
                else logger.wa(`ATTRIBUTE TRANSLATION MISSING: ${attr} for key ${key} in locale ${resolvedLocale}`);
            });
        });

        await reloadDynamicContent(resolvedLocale);
    } catch (err) {
        logger.er(`i18n.js ERROR: ${resolvedLocale}`, err.name, err.message, err.stack);
    }
};

// UPDATE URL WITH LOCALE
export const updateUrlLocale = async (locale) => {
    const { op, inCase } = await loadLangMap();
    const validLocales = Object.values(op);

    if (!validLocales.includes(locale)) {
        logger.wa(`INVALID LOCALE FOR URL: ${locale}, USING FALLBACK ${inCase}`);
        locale = inCase;
    }

    const pathSegments = window.location.pathname
        .replace(/^\/|\/$/g, '')
        .split('/')
        .filter(Boolean);

    // REMOVE OLD LOCALE (MATCHES ANY 2-5 CHAR SEGMENT THAT LOOKS LIKE A LOCALE)
    if (pathSegments.length > 0 && /^[a-z]{2}(-[A-Z]{2})?$/.test(pathSegments[0])) {
        pathSegments.shift();
    }

    // PREPEND NEW LOCALE
    pathSegments.unshift(locale);

    const newPath = '/' + pathSegments.join('/') + (window.location.pathname.endsWith('/') ? '/' : '');

    // ONLY PUSH STATE IF PATH CHANGED
    if (newPath !== window.location.pathname) {
        history.pushState({ locale }, '', newPath);
    }
};

// HANDLE BACK / FORWARD NAVIGATION
export const initPopStateListener = async (changeLocaleFn) => {
    const { op, inCase } = await loadLangMap();
    const validLocales = new Set(Object.values(op));

    window.addEventListener('popstate', (event) => {
        let localeToUse = event.state?.locale;

        if (!localeToUse) {
            const pathLocale = window.location.pathname.split('/').filter(Boolean)[0];
            localeToUse = validLocales.has(pathLocale) ? pathLocale : inCase;
        }

        if (!validLocales.has(localeToUse)) localeToUse = inCase;

        changeLocaleFn(localeToUse);
    });
};

// CHANGE LOCALE FUNCTION
export const changeLocale = async (newLang) => {
    try {
        const { locale: currentLocale } = await getLocale();
        if (newLang === currentLocale) return;

        setLocaleStorage(newLang);
        await initI18n({ ...i18nConfig, locale: newLang });
        await reloadDynamicContent(newLang);
        await updateUrlLocale(newLang);
    } catch (err) {
        logger.er("CHANGE LOCALE FAILED", err.name, err.message, err.stack);
    }
};
