// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js";
import { updateCarouselAlts, /*reloadRandomMsg,*/ updateBurgerData/*, updateProvisionalAlert*/ } from "../components/index.js";

// SUPPORTED LOCALES
const supportedLocales = ['en-GB', 'es-ES', 'ca-ES'];
export const fallbackLocale = 'en-GB';

// GET PATH TO JSON FILE BASED ON LOCALE
const getJsonPath = locale => `js/i18n/${locale}.json`;

// SET LOCALE IN LOCAL STORAGE
const setLocaleStorage = (locale) => localStorage.setItem('lang', locale);

// RELOAD DYNAMIC CONTENTS
async function reloadDynamicContent(locale) {
    await updateCarouselAlts(locale);
    // await reloadRandomMsg(locale);
    await updateBurgerData(locale);
    // await updateProvisionalAlert(locale);
};

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
export const initI18n = async ({
    root = document.documentElement,
    titleSelector = 'title',
    textSelector = '*[data-i18n]',
    attrSelector = '*[data-i18n-attr]',
    locale = getLocale()
} = {}) => {
    if (document.documentElement.lang === locale) return; // AVOID REDUNDANT INIT

    // NESTED PROPERTY ACCESSOR
    function getNestedValue(obj, key) {
        return key.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    try {
        const translations = await getI18nData(locale);

        // SET HTML LANG & STORE IT
        setLocaleStorage(locale);
        if (root) {
            root.setAttribute('lang', locale);
        } else {
            console.error("ERROR ON APPLY LANG METADATA OR STORE IN localStorage");
        }
        
        // TRANSLATE PAGE TITLE
        const titleValue = getNestedValue(translations, 'title');
        const titleEl = root.querySelector(titleSelector);
        if (titleEl && titleValue) {
            titleEl.textContent = titleValue;
        } else {
            console.error("ERROR TRANSLATING PAGE TITLE");
        }

        // TRANSLATE CONTENT
        const textElements = root.querySelectorAll(textSelector);
        textElements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = getNestedValue(translations, key);

            if (!value) {
                console.error(`TRANSLATION KEY "${key}" NOT FOUND`);
                return;
            }

            if (typeof value === 'object') {
                if ('html' in value) {
                    el.innerHTML = value.html;
                } else if ('text' in value) {
                    el.textContent = value.text;
                } else {
                    console.error(`NO html/text IN "${key}"`);
                }
            } else if (typeof value === 'string') {
                el.textContent = value;
            } else {
                console.error(`UNSUPPORTED VALUE TYPE FOR KEY "${key}" →`, value);
            }
        });

        // TRANSLATE ATTRIBUTES
        const attrElements = root.querySelectorAll(attrSelector);
        attrElements.forEach(el => {
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
export async function initLangSwitcher(selector, onChange) {
    const langBtns = document.querySelectorAll(selector);
    let currentLocale = getLocale();

    const setAriaPressed = (locale) => {
        let found = false;
        langBtns.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang')?.trim();
            if (btnLang === locale) found = true;
            btn.setAttribute('aria-pressed', btnLang === locale ? 'true' : 'false');
        });
        if (!found) console.error(`NO LANG BUTTON FOUND FOR LOCALE "${locale}"`);
    };    

    setAriaPressed(currentLocale);

    langBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            try {
                const lang = btn.getAttribute('data-lang')?.trim();
                if (lang && lang !== currentLocale) {
                    setLocaleStorage(lang);
                    if (typeof onChange === 'function') {
                        await onChange(lang);
                    } else {
                        await initI18n({ locale: lang });
                    }
                    setAriaPressed(lang);
                    currentLocale = lang;
                    
                    // const use = btn.querySelector('use');
                    // if (use) use.setAttribute('href', `img/sprite.svg#${lang}`);
                    
                    // await reloadDynamicContent(lang);
                }
            } catch (err) {
                console.error('ERROR CHANGING LANGUAGE:', err.name, err.message, err.stack);
            }
        });
    });

    return currentLocale;
}