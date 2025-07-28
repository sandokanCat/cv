// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js"; // FETCH + STRUCTURE + FORMAT VALIDATION

// SUPPORTED LANGUAGES
const langs = ['en', 'es', 'ca'];
const fallback = 'en'; // DEFAULT

// DETECT LANGUAGE FROM STORAGE OR BROWSER
const detectLang = () => {
    const stored = localStorage.getItem('lang');
    const browser = navigator.language.slice(0, 2).toLowerCase();
    return langs.includes(stored) ? stored : langs.includes(browser) ? browser : fallback;
};

// RETURN JSON PATH FOR A GIVEN LANGUAGE
const getJsonPath = lang => `/js/i18n/${lang}.json`;

// GET NESTED VALUE USING dot.notation
const getNestedValue = (obj, key) => key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);

// APPLY TEXT CONTENT TO SELECTED ELEMENTS
function applyLang(data, textSelector) {
    document.querySelectorAll(textSelector).forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = getNestedValue(data, key);
        if (value) el.textContent = value;
    });
}

// APPLY ATTRIBUTE TRANSLATIONS
function applyAttrLang(data, attrSelector) {
    document.querySelectorAll(attrSelector).forEach(el => {
        el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
            const [attr, key] = pair.split(':');
            const value = getNestedValue(data, key);
            if (value) el.setAttribute(attr.trim(), value);
        });
    });
}

// SET MAIN FLAG ICON
function updateLangButton(lang, toggleBtnSelector) {
    const toggleBtn = document.querySelector(toggleBtnSelector);
    if (!toggleBtn) return;

    const flag = `<svg class="icons-scale" role="img" aria-hidden="true" width="40" height="40" preserveAspectRatio="xMinYMin meet"><use href="img/sprite.svg#${lang}-flag"></use></svg>`;
    toggleBtn.innerHTML = flag;
}

// MAIN FUNCTION
export const initI18n = async (
    htmlSelector = 'html',
    titleSelector = 'title',
    toggleBtnSelector = '#lang-toggle',
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
        updateLangButton(lang, toggleBtnSelector);

        localStorage.setItem('lang', lang);

        // UPDATE <html lang="">
        const htmlElement = document.querySelector(htmlSelector);
        if (htmlElement) htmlElement.setAttribute('lang', lang);

        // UPDATE <title> IF TRANSLATED
        const titleEl = document.querySelector(titleSelector);
        if (titleEl && translations.title) titleEl.textContent = translations.title;

    } catch (err) {
        console.error('I18N ERROR:', err);
    }
};

// TOGGLE DROPDOWN
const toggleBtn = document.querySelector('#lang-toggle');
const optionsBox = document.querySelector('#lang-options');

toggleBtn?.addEventListener('click', () => {
    optionsBox?.classList.toggle('hidden');
});

// SWITCH LANGUAGE ON BUTTON CLICK
document.querySelectorAll('#lang-options [data-lang]').forEach(btn => {
    btn.addEventListener('click', async () => {
        const lang = btn.getAttribute('data-lang');
        await initI18n('html', 'title', '#lang-toggle', '[data-i18n]', '[data-i18n-attr]', lang);
        optionsBox?.classList.add('hidden');
    });
});