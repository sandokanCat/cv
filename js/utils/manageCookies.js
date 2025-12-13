// IMPORTS
import { logger } from "./index.js";

// GLOBAL VARIABLES
const cookieName = 'sandokan.cat_consent';

// GET/SET COOKIE WITH EXPIRATION DAYS
export function manageCookies({ barSelector, acceptBtnSelector, rejectBtnSelector }) {
    const barEl = document.querySelector(barSelector);
    const acceptBtnEl = document.querySelector(acceptBtnSelector);
    const rejectBtnEl = document.querySelector(rejectBtnSelector);

    // IGNORE COOKIES
    function iStillDontCareAboutCookies() {
        if (!rejectBtnEl) return;

        rejectBtnEl.addEventListener('click', (event) => {
            event.preventDefault();

            if (barEl) barEl.style.display = 'none';

            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax; Secure`;
        })
    }

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
        } else {
            barEl.style.display = 'none';
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

    // GOOGLE ANALYTICS SCRIPT
    function loadGoogleAnalytics() {
        if (document.querySelector('script[src="https://www.googletagmanager.com/gtag/js?id=G-JMZTXS94TS"]')) return;

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-JMZTXS94TS';
        document.head.appendChild(script);

        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-JMZTXS94TS');
        };
    }

    // MICROSOFT CLARITY SCRIPT
    function loadMicrosoftClarity() {
        if (document.querySelector('script[src="https://www.clarity.ms/tag/sgweog5585"]')) return;

        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "sgweog5585");
    }

    // YANDEX METRIKA SCRIPT
    function loadYandexMetrika() {
        if (document.querySelector('script[src="https://mc.yandex.ru/metrika/tag.js?id=103528686"]')) return;

        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=103528686', 'ym');
    
        ym(103528686, 'init', {ssr:true, webvisor:true, trackHash:true, clickmap:true, accurateTrackBounce:true, trackLinks:true});
    }

    // COOKIE BAR INITIALIZATION
    function initCookieBar() {
        checkAndShowCookieBar();

        if (acceptBtnEl && !acceptBtnEl.dataset.listenerAdded) {
            acceptBtnEl.addEventListener('click', acceptConsent);
            acceptBtnEl.dataset.listenerAdded = 'true';
        } else if (!acceptBtnEl) {
            logger.er(`BUTTON ${acceptBtnEl} NOT FOUND`);
        }

        if (rejectBtnEl && !rejectBtnEl.dataset.listenerAdded) {
            iStillDontCareAboutCookies();
        } else {
            logger.er(`BUTTON ${rejectBtnEl} NOT FOUND`);
        }
    }

    // LOG CONSENT INFO
    function logConsent(consent) {
        logger.lg(`Consentimiento para cookies analíticas: %c${consent.value}%c. Expira en %c${consent.daysRemaining}%c días.`,
            'color: rgb(0,255,0)', '', 'color: rgb(0,255,0)', '');
    }

    initCookieBar();
}