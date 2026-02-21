// 📥 IMPORTS ORDERED BY LAYER: UTILS → COMPONENTS
import {
    getLocale, initPopStateListener, initI18n, updateUrlLocale, changeLocale,
    signature
} from '../utils/index.js';
import { initTheme } from '../components/index.js';

// 🧠 APP INITIALIZATION
document.addEventListener("DOMContentLoaded", async () => {
    const { locale } = await getLocale();

    // ⚡ SYNC PAGE WITH TARGET LOCALE IF DIFFERENT FROM SERVER RENDER
    if (locale !== document.documentElement.lang) {
        await initI18n({ locale });
        await updateUrlLocale(locale);
    }

    initTheme('#theme-dark-btn', document.documentElement);

    initPopStateListener(changeLocale);

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

        responseDiv.style.display = 'block';
        if (result.result === 'OK') {
            responseDiv.className = 'form-message success';
            responseDiv.textContent = '¡Correo enviado con éxito! / Email sent successfully!';
            form.reset();
        } else {
            responseDiv.className = 'form-message error';
            responseDiv.textContent = 'Error: ' + (result.error || 'Unknown error');
        }
    } catch (err) {
        console.error('Submission error:', err);
        responseDiv.style.display = 'block';
        responseDiv.className = 'form-message error';
        responseDiv.textContent = 'Error de conexión / Connection error';
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
});