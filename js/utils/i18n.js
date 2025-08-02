// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js";
import { updateCarouselAlts, /*reloadRandomMsg,*/ updateBurqerData/*, reloadProvisionalAlert*/ } from "../components/index.js";

// SUPPORTED LOCALES
const supportedLocales = ['en-GB', 'es-ES', 'ca-ES'];
export const fallbackLocale = 'en-GB';

// GET PATH TO JSON FILE BASED ON LOCALE
const getJsonPath = locale => `js/i18n/${locale}.json`; // SOURCE JSON FILES

// RELOAD DYNAMIC CONTENTS
async function reloadDynamicContent(locale) {
    await updateCarouselAlts(locale);
    // await reloadRandomMsg(locale);
    await updateBurqerData(locale);
    // await reloadProvisionalAlert(locale);
};

// CACHED DOM ELEMENTS
const htmlEl = document.querySelector('html');
const titleEl = document.querySelector('title');
const i18nBtns = document.querySelectorAll('[data-lang]');
const i18nElements = document.querySelectorAll('[data-i18n]');
const i18nAttrElements = document.querySelectorAll('[data-i18n-attr]');

// RESOLVE ACTUAL LOCALE
export const getLocale = () => {
    const locale = (localStorage.getItem('lang') || navigator.language || fallbackLocale).trim();

    if (supportedLocales.includes(locale)) return locale;

    const base = locale.split('-')[0].toLowerCase();
    return supportedLocales.find(l => l.toLowerCase().startsWith(base)) || fallbackLocale;
}

// GET TRANSLATION JSON BASED ON LOCALE
export const getI18nData = async (locale) => {
    try {
        return await validateJSON(getJsonPath(locale));
    } catch (err) {
        console.error(`LOCALE FALLBACK: ${locale} → ${fallbackLocale}`, err.name, err.message, err.stack);

        try {
            return await validateJSON(getJsonPath(fallbackLocale));
        } catch (fallbackErr) {
            console.error(`FATAL: FALLBACK ${fallbackLocale} ALSO FAILED`, fallbackErr.name, fallbackErr.message, fallbackErr.stack);
            return {}; // PREVENT APP CRASH
        }
    }
};

// INIT i18n TO TRANSLATE PAGE
export const initI18n = async (locale = getLocale()) => {
    if (document.documentElement.lang === locale) return; // AVOID REDUNDANT INIT

    // NESTED PROPERTY ACCESSOR
    function getNestedValue(obj, key) {
        return key.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    try {
        const translations = await getI18nData(locale);

        // SET HTML LANG & STORE IT
        localStorage.setItem('lang', locale);
        if (htmlEl) {
            htmlEl.setAttribute('lang', locale);
        } else {
            console.error("ERROR ON APPLY LANG METADATA OR STORE IN localStorage");
        }
        
        // TRANSLATE PAGE TITLE
        const titleValue = getNestedValue(translations, 'title');
        if (titleValue) {
            titleEl.textContent = titleValue;
        } else {
            console.error("ERROR TRANSLATING PAGE TITLE");
        }
        
        // TRANSLATE CONTENT
        i18nElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = getNestedValue(translations, key);
            
            if (!value) {
                console.error(`TRANSLATION KEY "${key}" NOT FOUND`);
                return;
            }
            
            if (typeof value === 'object') {
                if ('html' in value) { // CHECK FOR HTML
                    el.innerHTML = value.html;
                } else if ('text' in value) { // CHECK FOR TEXT
                    el.textContent = value.text;
                } else {
                    console.error(`NO html/text IN "${key}"`);
                }
            } else if (typeof value === 'string') { // FALLBACK
                el.textContent = value;
            } else {
                console.error(`UNSUPPORTED VALUE TYPE FOR KEY "${key}" →`, value);
            }
        });

        // TRANSLATE ATTRIBUTES
        i18nAttrElements.forEach(el => {
            const pairs = el.getAttribute('data-i18n-attr').split(',');
            pairs.forEach(pair => {
                const [attr, key] = pair.split(':');
                const nested = getNestedValue(translations, key);
                const value = (nested && typeof nested === "object") ? nested[attr] : nested;

                if (typeof value === "string") {
                    el.setAttribute(attr, value);
                } else if (el.hasAttribute(attr)) {
                    console.error(`MISSING TRANSLATION FOR REQUIRED ATTRIBUTE "${attr}" IN KEY "${key}"`);
                } else {
                    console.error(`TRANSLATION KEY "${key}" NOT FOUND OR INVALID VALUE →`, value);
                }
            });
        });

        await reloadDynamicContent(locale);
    } catch (err) {
        console.error('i18n.js ERROR:', getJsonPath, "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
    }
};

// INIT LANG SWITCHER
export async function initLangSwitcher(locale = getLocale()) {
    const setAriaPressed = (locale) => {
        i18nBtns.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang')?.trim();
            btn.setAttribute('aria-pressed', btnLang === locale ? 'true' : 'false');
        });
    };

    setAriaPressed(locale);

    i18nBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const lang = btn.getAttribute('data-lang')?.trim();
            if (lang) {
                localStorage.setItem('lang', lang);
                const newLocale = await initI18n();
                setAriaPressed(newLocale);

                // const use = btn.querySelector('use');
                // if (use) use.setAttribute('href', `img/sprite.svg#${locale}`);

                // await reloadDynamicContent(locale);
            }
        });
    });
}
