export function manageCookies(cookieBarSelector, acceptBtnSelector) {
    const storageKey = 'sandokan.cat';

    function setConsent(value, days) {
        const expiration = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        const consent = { value, expires: expiration };
        localStorage.setItem(storageKey, JSON.stringify(consent));
    }

    function getConsentInfo() {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return null;

        try {
            const { value, expires } = JSON.parse(raw);
            const daysRemaining = Math.floor((new Date(expires) - new Date()) / (1000 * 60 * 60 * 24));
            return { name: storageKey, value, daysRemaining };
        } catch (err) {
            console.warn('Error al parsear localStorage:', err);
            return null;
        }
    }

    function checkAndShowCookieBar() {
        const bar = document.querySelector(cookieBarSelector);
        const consent = getConsentInfo();

        if (!bar) return;

        if (!consent || consent.value !== true || consent.daysRemaining <= 0) {
            bar.style.display = 'block';
        } else {
            bar.style.display = 'none';
            loadConsentScripts()

            console.info(`Consentimiento para cookies analíticas: %c${consent.value}%c. Expira en %c${consent.daysRemaining}%c días.`,
                'color: rgb(0,255,0)', '', 'color: rgb(0,255,0)', '');
        }
    }

    function acceptConsent(event) {
        if (event) event.preventDefault();
        setConsent(true, 365);

        const bar = document.querySelector(cookieBarSelector);
        if (bar) bar.style.display = 'none';

        loadConsentScripts()
    }

    function loadConsentScripts() { // LOAD EXTERNAL TRACKERS AFTER CONSENT
        loadGoogleAnalytics();
        loadClarity();
    }

    function loadGoogleAnalytics() { // GA SCRIPT WITH ONLOAD/ONERROR
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-SSZNX4H48N';
        document.head.appendChild(script);

        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-SSZNX4H48N');
        };

        script.onerror = () => {
            console.warn('❌ No se pudo cargar Google Analytics');
        };
    }

    function loadClarity() { // CLARITY IIFE WITH ERROR HANDLER
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
            t = l.createElement(r);
            t.async = 1;
            t.src = "https://www.clarity.ms/tag/" + i;

            t.onerror = () => {
            console.warn('❌ No se pudo cargar Microsoft Clarity');
            };

            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", "ow6nbkzkw6");
    }

    function initCookieBar() { // INIT + BUTTON BINDING
        checkAndShowCookieBar();

        const btn = document.querySelector(acceptBtnSelector);
        if (btn) {
            btn.addEventListener('click', acceptConsent);
        } else {
            console.warn(`No se encontró el botón: ${acceptBtnSelector}`);
        }
    }

    initCookieBar();
}
