// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js";
import { reloadCarousel, reloadRandomMsg, reloadProvisionalAlert } from "../components/index.js";

// SUPPORTED LOCALES
const supportedLocales = ['en-GB', 'es-ES', 'ca-ES'];

// GET PATH TO JSON FILE BASED ON LOCALE
const getJsonPath = locale => `js/i18n/${locale}.json`; // SOURCE JSON FILES

// GET <html lang="xx-XX"> OR DEFAULT
const htmlLang = document.documentElement.lang?.trim() || 'en-GB';
const htmlLangBase = htmlLang.split('-')[0].toLowerCase();
const fallbackLocale = 'en-GB';

// RESOLVE ACTUAL LOCALE
const getCurrentLocale = (selectedLang = null) => {
    const stored = localStorage.getItem('lang');
    const preferred = selectedLang || stored || navigator.language;
    const normalized = preferred.trim();

    if (supportedLocales.includes(normalized)) return normalized;

    const base = normalized.split('-')[0];
    return supportedLocales.find(l => l.startsWith(base)) || fallbackLocale;
};

// NESTED PROPERTY ACCESSOR
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

// DOM ELEMENTS
const htmlEl = document.querySelector('html');
const titleEl = document.querySelector('title');
const i18nBtns = document.querySelectorAll('[data-lang]');
const i18nElements = document.querySelectorAll('[data-i18n]');
const i18nAttrElements = document.querySelectorAll('[data-i18n-attr]');

// TRANSLATE TEXT CONTENT OR HTML
function applyLang(data) {
    i18nElements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = getNestedValue(data, key);
        if (typeof value !== 'undefined') el.innerHTML = value;
    });
}

// TRANSLATE ATTRIBUTES (aria-label, alt, etc.)
function applyAttrLang(data) {
    i18nAttrElements.forEach(el => {
        const pairs = el.getAttribute('data-i18n-attr').split(',');

        pairs.forEach(pair => {
            const [attr, key] = pair.split(':');
            if (!attr || !key) return;
            const value = getNestedValue(data, key);
            if (typeof value !== 'undefined') el.setAttribute(attr, value);
        });
    });
}

// SET <html lang="xx-XX"> + STORE IN localStorage
function setLangMetadata(locale) {
    localStorage.setItem('lang', locale);
    if (htmlEl) htmlEl.setAttribute('lang', locale);
}

// RELOAD DYNAMIC CONTENTS
async function reloadDynamicContent(locale) {
    await reloadCarousel('.carousel-container', '.carousel-imgs', '.carousel-advance', '.carousel-back', locale);
    await reloadRandomMsg('#random-phrases', locale);
    await reloadProvisionalAlert('a[data-status]', locale);
}

// MAIN INIT FUNCTION
export const initI18n = async (locale) => {
    if (document.documentElement.lang === locale) return; // AVOID REDUNDANT INIT

    const jsonPath = getJsonPath(locale);

    try {
        const translations = await validateJSON(jsonPath);

        applyLang(translations);
        applyAttrLang(translations);
        setLangMetadata(locale);

        // SET PAGE TITLE
        if (titleEl) {
            const titleValue = getNestedValue(translations, 'title');
            if (typeof titleValue !== 'undefined') titleEl.textContent = titleValue;
        }

        // UPDATE FLAGS (only country code in lowercase)
        const countryCode = locale.split('-')[1].toLowerCase(); // e.g., 'ES'
        i18nBtns.forEach(btn => {
            const use = btn.querySelector('use');
            if (use) use.setAttribute('href', `img/sprite.svg#${countryCode}-flag`);
        });

        await reloadDynamicContent(locale); // CALL DYNAMIC CONTENT RELOAD

    } catch (err) {
        console.error('i18n.js ERROR:', jsonPath, "→", err.name, err.message, err.stack);
    }
};

// LANG SWITCH LISTENER
document.addEventListener('DOMContentLoaded', () => {
    i18nBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const lang = btn.getAttribute('data-lang')?.trim();
            if (lang) await initI18n(lang);
        });
    });
});
