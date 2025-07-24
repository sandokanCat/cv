// I18N MODULE - LOAD AND APPLY TRANSLATIONS FROM JSON FILES
export const initI18n = async (
    lang = navigator.language.slice(0, 2), // DEFAULT TO BROWSER LANG
    path = '/js/i18n/',                    // JSON FILES DIRECTORY
    fallback = 'en'                        // FALLBACK LANGUAGE
) => {
    const selectedLang = ['ca', 'es', 'en',].includes(lang) ? lang : fallback;
    const url = `${path}${selectedLang}.json`;

    try {
        const res = await fetch(url); // LOAD JSON FILE
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const translations = await res.json();

        applyLang(translations); // APPLY STRINGS TO DOM
        applyAttrLang(translations); // APPLY TO ATTRIBUTES TOO

        updateLangBtn(userLang);

        localStorage.setItem('lang', selectedLang); // SAVE PREFERENCE
    } catch (err) {
        console.error('I18N ERROR:', err);
    }
};

// APPLY TRANSLATED TEXTS TO ELEMENTS WITH data-i18n ATTRIBUTES
function applyLang(data) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getNestedValue(data, key);
      if (value) el.textContent = value; // REPLACE TEXT
    });
}

// APPLY I18N TO HTML ATTRIBUTES DEFINED IN data-i18n-attr
function applyAttrLang(data) {
    const attrElements = document.querySelectorAll('[data-i18n-attr]');
    attrElements.forEach(el => {
        const mappings = el.getAttribute('data-i18n-attr').split(';');

        mappings.forEach(pair => {
            const [attr, key] = pair.split(':');
            const value = getNestedValue(data, key);
            if (value) el.setAttribute(attr.trim(), value); // SET TRANSLATED ATTR
        });
    });
}

// GET NESTED VALUE USING dot.notation
function getNestedValue(obj, key) {
    return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}

const toggleBtn = document.getElementById('lang-toggle');
const optionsBox = document.getElementById('lang-options');

// TOGGLE DROPDOWN
toggleBtn.addEventListener('click', () => {
    optionsBox.classList.toggle('hidden');
});

// HANDLE LANGUAGE SWITCH
document.querySelectorAll('#lang-options [data-lang]').forEach(btn => {
    btn.addEventListener('click', async () => {
        const lang = btn.getAttribute('data-lang');
        await initI18n(lang);
        updateLangButton(lang); // UPDATE MAIN FLAG
        optionsBox.classList.add('hidden'); // CLOSE MENU
    });
});

// SET FLAG ICON IN MAIN BUTTON
function updateLangButton(lang) {
    const flags = {
        ca: '🏴',
        es: '🇪🇸',
        en: '🇬🇧'
    };
    toggleBtn.textContent = flags[lang] || '🌐';
}