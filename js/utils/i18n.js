// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js";

// SUPPORTED LANGUAGES
const langs = ['en', 'es', 'ca'];
const fallback = 'en';

// DETECT LANGUAGE
const detectLang = () => {
    const stored = localStorage.getItem('lang');
    const browser = navigator.language.slice(0, 2).toLowerCase();
    return langs.includes(stored) ? stored : langs.includes(browser) ? browser : fallback;
};

// JSON PATH BY LANGUAGE
const getJsonPath = lang => `js/i18n/${lang}.json`;

// GET VALUE USING dot.notation
const getNestedValue = (obj, key) => key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);

// TRANSLATE TEXT CONTENT OR HTML
function applyLang(data, textSelector) {
    document.querySelectorAll(textSelector).forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = getNestedValue(data, key);
        if (!value) return;

        // AUTO DETECT TEXT VS HTML
        if (el.dataset.i18nType === 'html') el.innerHTML = value; // ⬅️ innerHTML
        else el.textContent = value; // ⬅️ textContent (default)
    });
}

// TRANSLATE ATTRIBUTES (aria-label, alt, etc.)
function applyAttrLang(data, attrSelector) {
    document.querySelectorAll(attrSelector).forEach(el => {
        const attrData = el.getAttribute('data-i18n-attr');
        if (!attrData) return; // SALIR SI NO HAY ATRIBUTO

        attrData.split(';').forEach(pair => {
            const [attr, key] = pair.split(':');
            const value = getNestedValue(data, key);
            if (value) el.setAttribute(attr.trim(), value);
        });
    });
}

// SET <html lang=""> AND STORE IN localStorage
function setLangMetadata(lang, htmlSelector) {
    localStorage.setItem('lang', lang);
    const htmlEl = document.querySelector(htmlSelector);
    if (htmlEl) htmlEl.setAttribute('lang', lang);
}

// MAIN INIT FUNCTION
export const initI18n = async (
    htmlSelector = 'html',
    titleSelector = 'title',
    toggleBtnSelector = '[data-lang]',
    textSelector = '[data-i18n]',
    attrSelector = '[data-i18n-attr]',
    selectedLang = null
) => {
    const lang = selectedLang || detectLang();

    try {
        const jsonPath = getJsonPath(lang);
        const translations = await validateJSON(jsonPath);

        applyLang(translations, textSelector);
        applyAttrLang(translations, attrSelector);
        setLangMetadata(lang, htmlSelector);

        // SET PAGE TITLE
        const titleEl = document.querySelector(titleSelector);
        if (titleEl) {
            const titleValue = getNestedValue(translations, 'dom.title');
            if (titleValue) titleEl.textContent = titleValue;
        }

        // UPDATE FLAG ICONS
        document.querySelectorAll(toggleBtnSelector).forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            const use = btn.querySelector('use');
            if (use && btnLang) use.setAttribute('href', `img/sprite.svg#${btnLang}-flag`);
        });

    } catch (err) {
        console.error('I18N ERROR:', err);
    }
};

// LANG SWITCH LISTENER
// (This must be called once at startup to ensure it binds)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const lang = btn.getAttribute('data-lang');
            await initI18n('html', 'title', '[data-lang]', '[data-i18n]', '[data-i18n-attr]', lang);
        });
    });
});