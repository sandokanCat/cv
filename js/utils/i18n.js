// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js";
// import { reloadCarousel, reloadRandomMsg, reloadProvisionalAlert } from "../components/index.js";

// SUPPORTED LOCALES
const supportedLocales = ['en-GB', 'es-ES', 'ca-ES'];
const fallbackLocale = 'en-GB';

// GET PATH TO JSON FILE BASED ON LOCALE
const getJsonPath = locale => `js/i18n/${locale}.json`; // SOURCE JSON FILES

// CACHED DOM ELEMENTS
const htmlEl = document.querySelector('html');
const titleEl = document.querySelector('title');
const i18nBtns = document.querySelectorAll('[data-lang]');
const i18nElements = document.querySelectorAll('[data-i18n]');
const i18nAttrElements = document.querySelectorAll('[data-i18n-attr]');

// RESOLVE ACTUAL LOCALE
export const getLocale = () => {
    const stored = localStorage.getItem('lang');
    const preferred = stored || navigator.language || fallbackLocale;
    const normalized = preferred.trim();

    if (supportedLocales.includes(normalized)) return normalized;

    const base = normalized.split('-')[0].toLowerCase();
    return supportedLocales.find(l => l.toLowerCase().startsWith(base)) || fallbackLocale;
}

// MAIN INIT FUNCTION
export const initI18n = async () => {
    const locale = getLocale();
    if (document.documentElement.lang === locale) return; // AVOID REDUNDANT INIT

    // NESTED PROPERTY ACCESSOR
    function getNestedValue(obj, path) {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }
    
    const jsonPath = getJsonPath(locale);

    try {
        const translations = await validateJSON(jsonPath);

        // SET HTML LANG & STORE IT
        localStorage.setItem('lang', locale);
        if (htmlEl) {
            htmlEl.setAttribute('lang', locale);
        } else {
            throw new Error("setLangMetadata: ERROR ON APPLY LANG METADATA OR STORE IN localStorage");
        }
        
        // SET PAGE TITLE
        const titleValue = getNestedValue(translations, 'title');
        if (titleValue) {
            titleEl.textContent = titleValue;
        } else {
            throw new Error("setLangMetadata: ERROR ON TRANSLATE PAGE TITLE");
        }
        
        // TRANSLATE TEXT CONTENT OR HTML
        i18nElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = getNestedValue(translations, key);
            if (value !== undefined) el.innerHTML = value;
        });

        // TRANSLATE ATTRIBUTES (aria-label, alt, etc.)
        i18nAttrElements.forEach(el => {
            const pairs = el.getAttribute('data-i18n-attr').split(',');
            pairs.forEach(pair => {
                const [attr, key] = pair.split(':');
                const value = getNestedValue(translations, key);
                if (attr && key && value !== undefined) {
                    el.setAttribute(attr, value);
                }
            });
        });

        // UPDATE FLAGS
        // const countryCode = locale.split('-')[1].toLowerCase();
        // i18nBtns.forEach(btn => {
        //     const use = btn.querySelector('use');
        //     if (use) use.setAttribute('href', `img/sprite.svg#${countryCode}-flag`);
        // });

        // RELOAD DYNAMIC CONTENTS
        // async function reloadDynamicContent(locale) {
        //     await reloadCarousel('.carousel-container', '.carousel-imgs', '.carousel-advance', '.carousel-back', locale);
        //     await reloadRandomMsg('#random-phrases', locale);
        //     await reloadProvisionalAlert('a[data-status]', locale);
        // };
        // await reloadDynamicContent(locale);

    } catch (err) {
        console.error('i18n.js ERROR:', jsonPath, "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
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