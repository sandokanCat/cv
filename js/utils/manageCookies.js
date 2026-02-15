// IMPORTS
import { logger } from 'open-utils';

// GLOBAL VARIABLES
const cookieName = 'sandokan.cat_consent';

// GET/SET COOKIE WITH EXPIRATION DAYS
export function manageCookies(barSelector) {
    const barEl = document.querySelector(barSelector);

    // SAFE NONCE EXTRACTION (IDL Property first, content fallback)
    const globalsEl = document.getElementById('globals-data');
    let nonce = globalsEl?.nonce || '';

    if (!nonce && globalsEl?.textContent) {
        try {
            const data = JSON.parse(globalsEl.textContent);
            nonce = data.nonce || '';
        } catch (e) { }
    }

    if (nonce) logger.lg('CSP NONCE DATA: ', nonce);

    // SET COOKIE WITH EXPIRATION DAYS
    function setCookie(name, value, days) {
        try {
            if (!name) throw new Error('Cookie name is required');

            const encodedValue = encodeURIComponent(value); // ESCAPE VALUE
            const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
            document.cookie = `${name.trim()}=${encodedValue}; expires=${expires}; path=/; SameSite=Lax; Secure`;
        } catch (err) {
            logger.er('FAILED TO SET COOKIE:', err.name, err.message, err.stack);
        }
    }

    // GET COOKIE BY NAME
    function getCookie(name) {
        if (!name) return null;

        const nameEQ = name.trim() + "=";
        const cookies = document.cookie.split(';');

        for (let c of cookies) {
            c = c.trim();
            if (c.startsWith(nameEQ)) {
                try {
                    return decodeURIComponent(c.substring(nameEQ.length));
                } catch (err) {
                    logger.wa('FAILED TO DECODE COOKIE:', name, err.name, err.message);
                    return null;
                }
            }
        }
        return null;
    }

    // GET CONSENT INFO (WITH DAYS REMAINING)
    function getConsentInfo() {
        const raw = getCookie(cookieName);
        if (!raw) return null;

        try {
            const parts = raw.split('|');
            if (parts.length !== 2) return null;
            const [value, expires] = parts;

            const expireDate = new Date(expires);
            if (isNaN(expireDate)) return null; // INVALID DATE GUARD

            const daysRemaining = Math.max(0, Math.floor((expireDate - new Date()) / (1000 * 60 * 60 * 24)));
            return { name: cookieName, value: value === 'true', daysRemaining };
        } catch (err) {
            logger.wa('ERROR PARSING COOKIE', err.name, err.message, err.stack);
            return null;
        }
    }

    // SHOW OR HIDE THE COOKIE BAR
    function checkAndShowCookieBar() {
        const consent = getConsentInfo();

        if (!barEl) return;

        if (!consent || consent.value !== true || consent.daysRemaining <= 0) {
            barEl.style.display = 'block';
            barEl.style.visibility = 'visible';
            barEl.style.opacity = '1';
        } else {
            barEl.style.display = 'none';
            barEl.style.visibility = 'hidden';
            loadConsentScripts();
            logConsent(consent);
        }
    }

    // ACCEPT CONSENT
    function acceptConsent(event) {
        if (event) event.preventDefault();

        const expiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
        setCookie(cookieName, `true|${expiration}`, 365);

        if (barEl) barEl.style.display = 'none';

        loadConsentScripts();

        const newConsent = { name: cookieName, value: true, daysRemaining: 365 };
        logConsent(newConsent);
    }

    // LOAD EXTERNAL TRACKERS AFTER CONSENT
    function loadConsentScripts() {
        try {
            loadGoogleAnalytics();
        } catch (err) {
            logger.wa('GA FAILED', err.name, err.message, err.stack);
        }

        try {
            loadMicrosoftClarity();
        } catch (err) {
            logger.wa('CLARITY FAILED', err.name, err.message, err.stack);
        }

        try {
            loadYandexMetrika();
        } catch (err) {
            logger.wa('YANDEX FAILED', err.name, err.message, err.stack);
        }
    }

    function loadGoogleAnalytics() {
        if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;

        const script = document.createElement('script');
        if (nonce) {
            script.setAttribute('nonce', nonce);
            script.nonce = nonce;
        }
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-JMZTXS94TS';
        document.head.appendChild(script);

        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-JMZTXS94TS');
        };
    }

    function loadMicrosoftClarity() {
        if (window.clarity || document.querySelector('script[src*="clarity.ms/tag"]')) return;

        window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments) };

        const script = document.createElement('script');
        if (nonce) {
            script.setAttribute('nonce', nonce);
            script.nonce = nonce;
        }
        script.async = true;
        script.src = "https://www.clarity.ms/tag/sgweog5585";
        document.head.appendChild(script);
    }

    function loadYandexMetrika() {
        if (window.ym || document.querySelector('script[src*="mc.yandex.ru/metrika"]')) return;

        window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments) };
        window.ym.l = 1 * new Date();

        const script = document.createElement('script');
        if (nonce) {
            script.setAttribute('nonce', nonce);
            script.nonce = nonce;
        }
        script.async = true;
        script.src = 'https://mc.yandex.ru/metrika/tag.js?id=103528686';
        document.head.appendChild(script);

        ym(103528686, 'init', { ssr: true, webvisor: true, trackHash: true, clickmap: true, accurateTrackBounce: true, trackLinks: true });
    }

    // COOKIE BAR INITIALIZATION
    function initCookieBar() {
        if (!barEl) return;

        checkAndShowCookieBar();

        // DELEGATED LISTENER ON BAR (RESISTANT TO i18n CHANGES)
        if (!barEl.dataset.delegationAdded) {
            barEl.addEventListener('click', (event) => {
                const acceptBtn = event.target.closest('#accept-cookies');
                const rejectBtn = event.target.closest('#reject-cookies');

                if (acceptBtn) {
                    acceptConsent(event);
                } else if (rejectBtn) {
                    event.preventDefault();
                    if (barEl) barEl.style.display = 'none';
                    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax; Secure`;
                }
            });
            barEl.dataset.delegationAdded = 'true';
        }
    }

    // LOG CONSENT INFO
    function logConsent(consent) {
        logger.lg(`Consentimiento para cookies analíticas: %c${consent.value}%c. Expira en %c${consent.daysRemaining}%c días.`,
            'color: rgb(0,255,0)', '', 'color: rgb(0,255,0)', '');
    }

    initCookieBar();
}
