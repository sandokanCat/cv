// IMPORTS
import {
    logger,
    validateJSON
} from "./index.js";

import {
    initCarousel,
    updateCarouselAlts,
    reloadRandomMsg,
    getBurgerConfig,
    updateProvisionalAlert
} from "../components/index.js";

// TRANSLATION CACHE
let langMapData = null;
let cachedLocale = null;
const cachedTranslations = {};
const reloadedLocales = new Set();

// RELOAD DYNAMIC CONTENTS
export async function reloadDynamicContent(locale) {
    if (reloadedLocales.has(locale)) return;

    // if (typeof initCarousel === 'function') await initCarousel({ locale });
    if (typeof updateCarouselAlts === 'function') await updateCarouselAlts(locale);
    if (typeof reloadRandomMsg === 'function') await reloadRandomMsg(locale);
    if (typeof getBurgerConfig === 'function') await getBurgerConfig(locale);
    if (typeof updateProvisionalAlert === 'function') await updateProvisionalAlert(locale);

    reloadedLocales.add(locale);
}

// LOAD LANGMAP
async function loadLangMap() {
    if (langMapData) return langMapData;

    try {
        const data = await validateJSON('js/globals.json');
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
        if (!inputLocale && cachedLocale) return cachedLocale;

        const { op, inCase } = await loadLangMap();
        let raw = inputLocale;

        if (!raw) {
            try {
                raw = localStorage.getItem("lang") || navigator.language || inCase;
            } catch (err) {
                logger.wa("LOCALSTORAGE UNAVAILABLE, FALLBACK TO NAVIGATOR OR DEFAULT", err.name, err.message, err.stack);
                raw = navigator.language || inCase;
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

// SET LOCALE IN LOCAL STORAGE
export const setLocaleStorage = (locale) => {
    try {
        localStorage.setItem('lang', locale);
    } catch (err) {
        logger.wa("FAILED TO SET LOCALE IN LOCALSTORAGE", err.name, err.message, err.stack);
    }
}

// GET TRANSLATION JSON BASED ON LOCALE
export const getI18nData = async (locale) => {
    if (cachedTranslations[locale]) return cachedTranslations[locale];

    const { op, inCase } = await loadLangMap();

    if (!Object.values(op).includes(locale)) {
        logger.er(`UNEXPECTED LOCALE: ${locale}, FORCING FALLBACK ${inCase}`);
        locale = inCase;
    }

    try {
        const data = await validateJSON(`js/i18n/${locale}.json`);
        return cachedTranslations[locale] = data || {};
    } catch (err) {
        logger.er(`LOCALE FALLBACK: ${locale} → ${inCase}`, err.name, err.message, err.stack);
        if (locale !== inCase) return getI18nData(inCase);
        return {};
    }
};

// NESTED VALUE UTIL
const getNestedValue = (obj, key, fallback = "") =>
    key.split(".").reduce((acc, part) => (acc && typeof acc === "object") ? acc[part] : undefined, obj) ?? fallback;

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
    root = document.documentElement,
    titleSelector = 'title',
    textSelector = '[data-i18n]',
    attrSelector = '[data-i18n-attr]',
    locale = null
} = {}) => {
    const { rtl } = await loadLangMap();

    const { locale: resolvedLocale, base } = await getLocale(locale);

    if (document.documentElement.lang === resolvedLocale) return;
    else if (document.documentElement.lang !== resolvedLocale) reloadedLocales.clear();

    try {
        // GET TRANSLATIONS
        const translations = await getI18nData(resolvedLocale);

        // SET HTML LANG & STORE IT
        setLocaleStorage(resolvedLocale);
        root.setAttribute("lang", resolvedLocale);
        root.setAttribute("dir", rtl.includes(base) ? "rtl" : "ltr");

        // TRANSLATE PAGE TITLE
        const titleEl = root.querySelector(titleSelector);
        if (!titleEl) {
            logger.wa(`TRANSLATION ${titleSelector} NOT FOUND for locale ${resolvedLocale}`);
        } else {
            const roleObj = window.GLOBALS?.brand?.role ?? '';
            const role = typeof roleObj === 'object' ? roleObj[resolvedLocale] ?? Object.values(roleObj)[0] : roleObj;
            if (role) document.title = `${BRAND_NICK} | ${role}`;
        }

        // TRANSLATE CONTENT
        root.querySelectorAll(textSelector).forEach(el => {
            const key = el.getAttribute("data-i18n");
            const value = getNestedValue(translations, key, "");

            if (value === "") logger.wa(`TRANSLATION KEY NOT FOUND: ${key} for locale ${resolvedLocale}`);
            else if (value && typeof value === "object") {
                const content = value.html ?? value.text ?? "";
                el.innerHTML = interpolateBrand(content, window.GLOBALS?.brand, resolvedLocale);
            } else {
                el.textContent = interpolateBrand(value, window.GLOBALS?.brand, resolvedLocale);
            }
        });

        // TRANSLATE ATTRIBUTES
        root.querySelectorAll(attrSelector).forEach(el => {
            const attrRaw = el.getAttribute("data-i18n-attr");

            if (!attrRaw) logger.wa(`ELEMENT WITHOUT ${attrSelector} ATTRIBUTE`);
            else attrRaw.split(",").forEach(pair => {
                const [attr, key] = pair.split(":").map(s => s.trim());
                const nested = getNestedValue(translations, key, {});
                let value = (nested && typeof nested === "object") ? nested[attr] : nested;

                if (value) el.setAttribute(attr, interpolateBrand(value, window.GLOBALS?.brand, resolvedLocale));
                else logger.wa(`ATTRIBUTE TRANSLATION MISSING: ${attr} for key ${key} in locale ${resolvedLocale}`);
            });
        });

        await reloadDynamicContent(resolvedLocale);
    } catch (err) {
        logger.er(`i18n.js ERROR: ${resolvedLocale}`, err.name, err.message, err.stack);
    }
};
