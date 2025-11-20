// OWN EXTERNAL IMPORTS
import { default as logger } from "https://open-utils-dev-sandokan-cat.vercel.app/js/logger.js";
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js"; // FETCH + VALIDATE JSON STRUCTURE

// INTERNAL IMPORTS
import {
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
        const data = await validateJSON('js/i18n/langMap.json');
        langMapData = {
            supportedLangs: data.supportedLangs || { en: "en-GB" },
            fallbackLang: data.fallbackLang?.en || "en-GB",
            rtlLangs: data.rtlLangs || []
        };
    } catch (err) {
        logger.er("FAILED TO LOAD LANGMAP", err.name, err.message, err.stack);
        langMapData = {
            supportedLangs: { en: "en-GB" },
            fallbackLang: "en-GB",
            rtlLangs: []
        };
    }

    return langMapData;
}

// GET CURRENT LOCALE
export const getLocale = async (inputLocale = null) => {
    try {
        if (!inputLocale && cachedLocale) return cachedLocale;

        const { supportedLangs, fallbackLang } = await loadLangMap();
        let raw = inputLocale;

        if (!raw) {
            try {
                raw = localStorage.getItem("lang") || navigator.language || fallbackLang;
            } catch (err) {
                logger.wa("LOCALSTORAGE UNAVAILABLE, FALLBACK TO NAVIGATOR OR DEFAULT", err.name, err.message, err.stack);
                raw = navigator.language || fallbackLang;
            }
        }

        const base = raw.split("-")[0].toLowerCase();
        const result = { locale: supportedLangs[base] || fallbackLang, base };

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

    const { supportedLangs, fallbackLang } = await loadLangMap();

    if (!Object.values(supportedLangs).includes(locale)) {
        logger.er(`UNEXPECTED LOCALE: ${locale}, FORCING FALLBACK ${fallbackLang}`);
        locale = fallbackLang;
    }

    try {
        const data = await validateJSON(`js/i18n/${locale}.json`);
        return cachedTranslations[locale] = data || {};
    } catch (err) {
        logger.er(`LOCALE FALLBACK: ${locale} → ${fallbackLang}`, err.name, err.message, err.stack);
        if (locale !== fallbackLang) return getI18nData(fallbackLang);
        return {};
    }
};

// NESTED VALUE UTIL
const getNestedValue = (obj, key, fallback = "") =>
    key.split(".").reduce((acc, part) => (acc && typeof acc === "object") ? acc[part] : undefined, obj) ?? fallback;

// INIT i18n TO TRANSLATE PAGE
export const initI18n = async ({
    root = document.documentElement,
    titleSelector = 'title',
    textSelector = '[data-i18n]',
    attrSelector = '[data-i18n-attr]',
    locale = null
} = {}) => {
    const { rtlLangs } = await loadLangMap();

    const { locale: resolvedLocale, base } = await getLocale(locale);

    if (document.documentElement.lang === resolvedLocale) return;
    else if (document.documentElement.lang !== resolvedLocale) reloadedLocales.clear();

    try {
        // GET TRANSLATIONS
        const translations = await getI18nData(resolvedLocale);

        // SET HTML LANG & STORE IT
        setLocaleStorage(resolvedLocale);
        root.setAttribute("lang", resolvedLocale);
        root.setAttribute("dir", rtlLangs.includes(base) ? "rtl" : "ltr");

        // TRANSLATE PAGE TITLE
        const titleValue = getNestedValue(translations, "title");
        const titleEl = root.querySelector(titleSelector);
        if (!titleEl) logger.wa(`TRANSLATION ${titleSelector} NOT FOUND for locale ${resolvedLocale}`);
        else if (titleEl && titleValue) titleEl.textContent = titleValue?.text ?? titleValue ?? "";

        // TRANSLATE CONTENT
        root.querySelectorAll(textSelector).forEach(el => {
            const key = el.getAttribute("data-i18n");
            const value = getNestedValue(translations, key, "");

            if (value === "") logger.wa(`TRANSLATION KEY NOT FOUND: ${key} for locale ${resolvedLocale}`);
            
            if (value && typeof value === "object") el.innerHTML = value.html ?? value.text ?? "";
            else el.textContent = value;
        });

        // TRANSLATE ATTRIBUTES
        root.querySelectorAll(attrSelector).forEach(el => {
            const attrRaw = el.getAttribute("data-i18n-attr");

            if (!attrRaw) logger.wa(`ELEMENT WITHOUT ${attrSelector} ATTRIBUTE`);
            else attrRaw.split(",").forEach(pair => {
                const [attr, key] = pair.split(":").map(s => s.trim());
                const nested = getNestedValue(translations, key, {});
                const value = (nested && typeof nested === "object") ? nested[attr] : nested;

                if (value) el.setAttribute(attr, value);
                else logger.wa(`ATTRIBUTE TRANSLATION MISSING: ${attr} for key ${key} in locale ${resolvedLocale}`);
            });
        });

        await reloadDynamicContent(resolvedLocale);
    } catch (err) {
        logger.er(`i18n.js ERROR: ${resolvedLocale}`, err.name, err.message, err.stack);
    }
};
