// IMPORTS
import { logger } from './index.js';

// GET/SET COOKIE WITH EXPIRATION DAYS
export function manageCookies(cookieBarSelector, acceptBtnSelector) {
    const cookieName = 'sandokan.cat_consent'; // COOKIE NAME

    // SET COOKIE WITH EXPIRATION DAYS
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax; Secure`;
    }

    // GET COOKIE BY NAME
    function getCookie(name) {
        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for (let c of cookies) {
            c = c.trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
    }

    // GET CONSENT INFO (WITH DAYS REMAINING)
    function getConsentInfo() {
        const raw = getCookie(cookieName);
        if (!raw) return null;

        try {
            const [value, expires] = raw.split('|');
            const daysRemaining = Math.floor((new Date(expires) - new Date()) / (1000 * 60 * 60 * 24));
            return { name: cookieName, value: value === 'true', daysRemaining };
        } catch (err) {
            console.warn('Error al parsear la cookie:', err.name, err.message, err.stack);
            return null;
        }
    }

    // SHOW OR HIDE THE COOKIE BAR
    function checkAndShowCookieBar() {
        const bar = document.querySelector(cookieBarSelector);
        const consent = getConsentInfo();

        if (!bar) return;

        if (!consent || consent.value !== true || consent.daysRemaining <= 0) {
            bar.style.display = 'block';
        } else {
            bar.style.display = 'none';
            loadConsentScripts();
            logConsent(consent);
        }
    }

    // ACCEPT CONSENT
    function acceptConsent(event) {
        if (event) event.preventDefault();

        const expiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        setCookie(cookieName, `true|${expiration}`, 365);

        const bar = document.querySelector(cookieBarSelector);
        if (bar) bar.style.display = 'none';

        loadConsentScripts();
        
        const newConsent = { name: cookieName, value: true, daysRemaining: 365 };
        logConsent(newConsent);
    }

    // LOAD EXTERNAL TRACKERS AFTER CONSENT
    function loadConsentScripts() {
        loadGoogleAnalytics();
        loadMicrosoftClarity();
        loadYandexMetrika();
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

        const btn = document.querySelector(acceptBtnSelector);

        if (btn && !btn.dataset.listenerAdded) {
            btn.addEventListener('click', acceptConsent);
            btn.dataset.listenerAdded = 'true';
        } else if (!btn) {
            console.error(`BUTTON ${acceptBtnSelector} NOT FOUND`);
        }
    }

    // LOG CONSENT INFO
    function logConsent(consent) {
        logger.lg(`Consentimiento para cookies analíticas: %c${consent.value}%c. Expira en %c${consent.daysRemaining}%c días.`,
            'color: rgb(0,255,0)', '', 'color: rgb(0,255,0)', '');
    }

    initCookieBar();
}