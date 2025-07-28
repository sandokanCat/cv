// IMPORTS
import { validateJSON } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateJSON.js"; // FETCH + STRUCTURE + FORMAT VALIDATION

// SUPPORTED LANGUAGES
const langs = ['en', 'es', 'ca'];
const fallback = 'en';

// DETECT OR GET LANGUAGE FROM LOCALSTORAGE
const detectLang = () => {
    const stored = localStorage.getItem('lang');
    const browser = navigator.language.slice(0, 2).toLowerCase();
    return langs.includes(stored) ? stored : langs.includes(browser) ? browser : fallback;
};

// RETURN JSON PATH FOR A GIVEN LANGUAGE
const getJsonPath = lang => `/js/i18n/${lang}.json`;

// GET NESTED VALUE USING dot.notation
const getNestedValue = (obj, key) => key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);

// APPLY TRANSLATED TEXT TO ELEMENTS
function applyLang(data) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = getNestedValue(data, key);
        if (value) el.textContent = value;
    });
}

// APPLY TO ATTRIBUTES
function applyAttrLang(data) {
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
        el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
            const [attr, key] = pair.split(':');
            const value = getNestedValue(data, key);
            if (value) el.setAttribute(attr.trim(), value);
        });
    });
}

// UPDATE LANGUAGE BUTTON ICON
function updateLangButton(lang) {
    const flag = `<svg class="icons-scale" role="img" aria-hidden="true" width="40" height="40" preserveAspectRatio="xMinYMin meet"><use href="img/sprite.svg#${lang}-flag"></use></svg>`;
    toggleBtn.innerHTML = flag;
}

// FETCH, VALIDATE AND APPLY TRANSLATIONS
export const initI18n = async (selectedLang = detectLang()) => {
    try {
        const jsonPath = getJsonPath(selectedLang);
        const translations = await validateJSON(jsonPath);

        applyLang(translations);
        applyAttrLang(translations);
        updateLangButton(selectedLang);

        localStorage.setItem('lang', selectedLang);
        document.documentElement.lang = selectedLang;
    } catch (err) {
        console.error('I18N ERROR:', err);
    }
};

// HANDLE DROPDOWN TOGGLE
const toggleBtn = document.getElementById('lang-toggle');
const optionsBox = document.getElementById('lang-options');

toggleBtn?.addEventListener('click', () => {
    optionsBox?.classList.toggle('hidden');
});

// HANDLE LANGUAGE SWITCH BUTTONS
document.querySelectorAll('#lang-options [data-lang]').forEach(btn => {
    btn.addEventListener('click', async () => {
        const lang = btn.getAttribute('data-lang');
        await initI18n(lang);
        optionsBox.classList.add('hidden');
    });
});