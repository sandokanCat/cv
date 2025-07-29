// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js";
import { reloadRandomMsg } from "../components/randomPhrases.js";

// SUPPORTED LANGUAGES
const langs = ['en-GB', 'es-ES', 'ca-ES'].split("-")[0] || "en-GB";

const locale = document.documentElement.lang?.toLowerCase() || "en-GB"; // FULL LOCALE (e.g., es-ES)
const lang = locale.split("-")[0]; // BASE LANGUAGE (e.g., es)

// GLOBAL VARIABLES
const htmlEl = document.querySelector('html');
const titleEl = document.querySelector('title');
const i18nBtns = document.querySelectorAll('[data-lang]');
const i18nElements = document.querySelectorAll('[data-i18n]');
const i18nAttrElements = document.querySelectorAll('[data-i18n-attr]');
const flagIcons = Array.from(i18nBtns).map(btn => ({
    btn,
    lang: btn.getAttribute('data-lang'),
    use: btn.querySelector('use')
}));

// DETECT LANGUAGE
const detectLang = () => {
    const stored = localStorage.getItem('lang')?.toLowerCase();
    const browser = navigator.language.slice(0, 2).toLowerCase();
    return langs.includes(stored) ? stored : langs.includes(browser) ? browser : fallback;
};

// JSON PATH BY LANGUAGE
const getJsonPath = lang => `js/i18n/${langs.includes(lang) ? lang : fallback}.json`;

// GET VALUE USING dot.notation
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}    

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
            if (!attr || !key) return; // EXIT IF INVALID PAIR
            const value = getNestedValue(data, key);
            if (typeof value !== 'undefined') el.setAttribute(attr, value);
        });
    });
}

// SET <html lang=""> AND STORE IN localStorage
function setLangMetadata(lang) {
    localStorage.setItem('lang', lang);
    if (htmlEl) htmlEl.setAttribute('lang', lang);
}

// MAIN INIT FUNCTION
export const initI18n = async (selectedLang = null) => {
    await reloadRandomMsg('#random-phrases');

    const lang = selectedLang || detectLang();

    try {
        const jsonPath = getJsonPath(lang);
        const translations = await validateJSON(jsonPath);

        applyLang(translations);
        applyAttrLang(translations);
        setLangMetadata(lang);

        // SET PAGE TITLE
        if (titleEl) {
            const titleValue = getNestedValue(translations, 'title');
            if (typeof titleValue !== 'undefined') titleEl.textContent = titleValue;
        }

        // UPDATE FLAG ICONS
        flagIcons.forEach(({ lang, use }) => {
            if (use && lang) use.setAttribute('href', `img/sprite.svg#${lang}-flag`);
        });

    } catch (err) {
        console.error('i18n.js ERROR:', json, "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
    }
};

// LANG SWITCH LISTENER
document.addEventListener('DOMContentLoaded', () => {
    i18nBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const lang = btn.getAttribute('data-lang');
            await initI18n(lang);
        });
    });
});