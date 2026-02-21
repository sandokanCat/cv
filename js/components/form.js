// 📥 IMPORTS ORDERED BY LAYER: UTILS → COMPONENTS
import {
    logger,
    getLocale,
    signature
} from '../utils/index.js';

import { initTheme } from '../components/index.js';

// 🧠 APP INITIALIZATION
document.addEventListener("DOMContentLoaded", async () => {
    const { locale } = await getLocale();

    // ⚡ SYNC PAGE WITH TARGET LOCALE IF DIFFERENT FROM SERVER RENDER
    if (locale !== document.documentElement.lang) {
        await changeFormLanguage(locale);
    }

    initTheme('#theme-dark-btn', document.documentElement);

    signature('#signature-year');

    // Sync layout with parent modal for accurate breakpoints inside the iframe
    const syncLayout = () => {
        try {
            const width = (window.self !== window.top) ? window.parent.innerWidth : window.innerWidth;
            document.documentElement.classList.toggle('tablet-layout', width <= 768);
        } catch (e) { }
    };
    window.addEventListener('resize', syncLayout);
    if (window.self !== window.top) {
        try {
            window.parent.addEventListener('resize', syncLayout);
            window.addEventListener('unload', () => {
                window.parent.removeEventListener('resize', syncLayout);
            });
        } catch (e) { }
    }
    syncLayout();
});

// 🔄 DYNAMIC FORM LOCALIZATION
async function changeFormLanguage(targetLang) {
    try {
        const response = await fetch('/partials/contact/form.xml');
        if (!response.ok) throw new Error('Failed to load form.xml');

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const langNode = xmlDoc.querySelector(`lang[locale="${targetLang}"]`) || xmlDoc.querySelector(`lang[locale="en-GB"]`);
        if (!langNode) return;

        const fields = langNode.querySelectorAll('field');
        fields.forEach(field => {
            const name = field.querySelector('name')?.textContent;
            const label = field.querySelector('label')?.textContent;
            const type = field.querySelector('type')?.textContent;

            if (!name || !label) return;

            if (type === 'submit' || type === 'reset') {
                const btn = document.getElementById(name);
                if (btn) btn.value = label;
            } else {
                const domLabel = document.querySelector(`label[for="${name}"]`);
                if (domLabel) {
                    domLabel.textContent = label;
                }
            }
        });

        document.documentElement.lang = targetLang;

        try {
            const globalsScript = document.getElementById('globals-data');
            if (globalsScript) {
                const globals = JSON.parse(globalsScript.textContent);
                const rtlLangs = globals.lang?.rtl || [];
                const langPrefix = targetLang.split('-')[0];
                document.documentElement.dir = rtlLangs.includes(langPrefix) ? 'rtl' : 'ltr';
            } else {
                document.documentElement.dir = (targetLang === 'ar-SA') ? 'rtl' : 'ltr';
            }
        } catch (e) {
            logger.wa('Failed to parse hydrated globals data for RTL check', e.name, e.message);
            document.documentElement.dir = (targetLang === 'ar-SA') ? 'rtl' : 'ltr';
        }

    } catch (error) {
        logger.er('Error fetching/parsing form.xml:', error.name, error.message);
    }
}

// 📧 CONTACT FORM SUBMISSION
document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const responseDiv = document.getElementById('form-response');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Disable button
    if (submitBtn) submitBtn.disabled = true;

    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        const result = await response.json();

        // Dynamically get translated messages from XML
        let successMsg = 'Email sent successfully!';
        let errorMsg = 'Connection error. Please try again later.';

        try {
            const xmlResponse = await fetch('/partials/contact/form.xml');
            if (xmlResponse.ok) {
                const xmlText = await xmlResponse.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                const langNode = xmlDoc.querySelector(`lang[locale="${document.documentElement.lang}"]`) || xmlDoc.querySelector(`lang[locale="en-GB"]`);
                if (langNode) {
                    const sendingNode = langNode.querySelector('sending');
                    if (sendingNode) {
                        successMsg = sendingNode.querySelector('success')?.textContent || successMsg;
                        errorMsg = sendingNode.querySelector('error')?.textContent || errorMsg;
                    }
                }
            }
        } catch (e) {
            logger.er('Failed to load localized form messages', e);
        }

        responseDiv.style.display = 'block';
        if (result.result === 'OK') {
            responseDiv.className = 'form-message success';
            responseDiv.textContent = successMsg;
            HTMLFormElement.prototype.reset.call(form);
        } else {
            responseDiv.className = 'form-message error';
            responseDiv.textContent = 'Error: ' + (result.error || errorMsg);
        }
    } catch (err) {
        logger.er('Submission error:', err.name, err.message);
        responseDiv.style.display = 'block';
        responseDiv.className = 'form-message error';

        // Fallback translation if XML fetching already failed
        const lang = document.documentElement.lang;
        let fallbackError = 'Connection error / Error de conexión';
        if (lang === 'es-ES') fallbackError = 'Error de conexión. Por favor, intenta más tarde.';
        else if (lang === 'ca-ES') fallbackError = 'Error de connexió. Si us plau, intenta més tard.';
        else if (lang === 'ru-RU') fallbackError = 'Ошибка подключения. Пожалуйста, попробуйте позже.';
        else if (lang === 'ar-SA') fallbackError = 'خطأ في الاتصال. يرجى المحاولة مرة أخرى لاحقًا.';
        else if (lang === 'zh-CN') fallbackError = '连接错误。请稍后再试。';
        else fallbackError = 'Connection error. Please try again later.';

        responseDiv.textContent = fallbackError;
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
});