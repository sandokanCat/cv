// GET LOCALES VIA FETCH
export async function loadLocaleData(locale = 'en-GB') {
    try {
        const response = await fetch(`./js/i18n/${locale}.json`);
        if (!response.ok) throw new Error('Translation file not found');
        return await response.json();
    } catch (err) {
        console.error(`FAILED TO LOAD ${locale} LOCALE. FALLING BACK TO EN-GB.`, err);
        if (locale !== 'en-GB') return loadLocaleData('en-GB');
        return {}; // EMPTY FALLBACK
    }
}