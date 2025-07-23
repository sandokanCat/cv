const userLang = localStorage.getItem('lang') || navigator.language.slice(0, 2);
initI18n(userLang);

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

    applyTranslations(translations); // APPLY STRINGS TO DOM
    localStorage.setItem('lang', selectedLang); // SAVE PREFERENCE
  } catch (err) {
    console.error('I18N ERROR:', err);
  }
};

// APPLY TRANSLATED TEXTS TO ELEMENTS WITH data-i18n ATTRIBUTES
function applyTranslations(data) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = getNestedValue(data, key);
    if (value) el.textContent = value; // REPLACE TEXT
  });
}

// GET NESTED VALUE USING dot.notation
function getNestedValue(obj, key) {
  return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
}
