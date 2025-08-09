// IMPORTS
import { validateJSON } from "./index.js";
import {
    updateCarouselAlts,
    reloadRandomMsg,
    getBurgerConfig,
    updateProvisionalAlert } from "../components/index.js";

// SUPPORTED LOCALES
const supportedLocales = ['en-GB', 'es-ES', 'ca-ES'];
export const fallbackLocale = 'en-GB';
const rtlLangs = ['ar', 'he'];

// GET PATH TO JSON FILE BASED ON LOCALE
const getJsonPath = locale => `js/i18n/${locale}.json`;

// TRANSLATION CACHE
const cachedTranslations = {};

// SET LOCALE IN LOCAL STORAGE
export const setLocaleStorage = (locale) => localStorage.setItem('lang', locale);

// RELOAD DYNAMIC CONTENTS
export async function reloadDynamicContent(locale) {
    console.log('reloadDynamicContent called with locale:', locale);

    if (typeof updateCarouselAlts === 'function') {
        console.log('Calling updateCarouselAlts...');
        await updateCarouselAlts(locale);
    }
    if (typeof reloadRandomMsg === 'function') {
        console.log('Calling reloadRandomMsg...');
        await reloadRandomMsg(locale);
    }
    if (typeof getBurgerConfig === 'function') {
        console.log('Calling getBurgerConfig...');
        await getBurgerConfig(locale);
    }
    if (typeof updateProvisionalAlert === 'function') {
        console.log('Calling updateProvisionalAlert...');
        await updateProvisionalAlert(locale);
    }
}

// RESOLVE ACTUAL LOCALE
export const getLocale = () => {
    const locale = (localStorage.getItem('lang') || navigator.language || fallbackLocale).trim();
    if (supportedLocales.includes(locale)) return locale;

    const base = locale.split('-')[0].toLowerCase();
    return supportedLocales.find(l => l.toLowerCase().startsWith(base)) || fallbackLocale;
}

// GET TRANSLATION JSON BASED ON LOCALE
export const getI18nData = async (locale) => {
    const fallbackData = null;
    
    try {
        if (cachedTranslations[locale]) return cachedTranslations[locale];
        else if (fallbackLocale !== locale) cachedTranslations[fallbackLocale] = fallbackData;

        const data = await validateJSON(getJsonPath(locale));
        cachedTranslations[locale] = data;
        return data || fallbackData;
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
    textSelector = '[data-i18n]',
    attrSelector = '[data-i18n-attr]',
    locale
} = {}) => {
    if (!locale || typeof locale !== 'string') {
        console.error('LOCALE IS UNDEFINED OR INVALID');
        return;
    }    
    if (document.documentElement.lang === locale) return; // AVOID REDUNDANT INIT

    // NESTED PROPERTY ACCESSOR
    function getNestedValue(obj, key) {
        return key.split('.').reduce((acc, part) => (acc && typeof acc === 'object') ? acc[part] : undefined, obj);
    }    

    try {
        const translations = await getI18nData(locale);

        // SET HTML LANG & STORE IT
        setLocaleStorage(locale);
        if (root) {
            root.setAttribute('lang', locale);

            const base = locale.split('-')[0].toLowerCase();
            const direction = rtlLangs.includes(base) ? 'rtl' : 'ltr';
            root.setAttribute('dir', direction);
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
            const attrRaw = el.getAttribute('data-i18n-attr');
            if (!attrRaw) return;
            const pairs = attrRaw.split(',');

            pairs.forEach(pair => {
                const [attr, key] = pair.split(':').map(s => s.trim());
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
        console.error(`i18n.js ERROR: ${getJsonPath(locale)} →`, err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
    }
};