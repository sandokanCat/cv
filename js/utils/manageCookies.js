// IMPORTS
import { logger } from 'open-utils';

// GLOBAL VARIABLES
const cookieName = 'sandokan.cat_consent';

/**
 * PREFERENCE STORE (localStorage wrapper)
 * Centralizes settings and enforces consent rules.
 */
export const PreferenceStore = {
    get(key, defaultValue) {
        try {
            const val = localStorage.getItem(key);
            return val !== null ? val : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },
    set(key, value) {
        // WE ONLY PERSIST IF CONSENT IS 'all' OR 'essential'
        const consent = getConsentLevel();
        if (consent === 'all' || consent === 'essential') {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                logger.wa(`PreferenceStore: Failed to persist ${key}`);
            }
        }
    }
};

// HELPER TO GET RAW CONSENT TYPE
function getConsentLevel() {
    const nameEQ = cookieName + "=";
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
        c = c.trim();
        if (c.startsWith(nameEQ)) {
            const raw = decodeURIComponent(c.substring(nameEQ.length));
            return raw.split('|')[0]; // 'all', 'essential', 'false' or 'none'
        }
    }
    return 'none';
}

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
            return { name: cookieName, value, daysRemaining };
        } catch (err) {
            logger.wa('ERROR PARSING COOKIE', err.name, err.message);
            return null;
        }
    }

    // SHOW OR HIDE THE COOKIE BAR
    function checkAndShowCookieBar() {
        const consent = getConsentInfo();

        if (!barEl) return;

        const needsConsent = !consent || consent.daysRemaining <= 0 || (consent.value !== 'all' && consent.value !== 'essential' && consent.value !== 'false');

        if (needsConsent) {
            barEl.style.display = 'block';
            barEl.style.visibility = 'visible';
            barEl.style.opacity = '1';
        } else {
            barEl.style.display = 'none';
            barEl.style.visibility = 'hidden';

            if (consent.value === 'all') {
                loadConsentScripts();
            }
            logConsent(consent);
        }
    }

    // ACCEPT CONSENT
    function acceptConsent(event, type = 'all') {
        if (event) event.preventDefault();

        const expiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
        setCookie(cookieName, `${type}|${expiration}`, 365);

        if (barEl) barEl.style.display = 'none';

        // TRACKERS ONLY FOR 'all'
        if (type === 'all') {
            loadConsentScripts();
        }

        const newConsent = { name: cookieName, value: type, daysRemaining: 365 };
        logConsent(newConsent);

        // SYNC SETTINGS AFTER CONSENT (THEME/LANG IN localStorage)
        if (type !== 'false') {
            syncPreferencesToStore();
        }
    }

    // PERSIST CURRENT PAGE STATE TO PreferenceStore
    function syncPreferencesToStore() {
        const theme = document.documentElement.getAttribute('data-theme');
        const lang = document.documentElement.getAttribute('lang');
        if (theme) PreferenceStore.set('theme', theme);
        if (lang) PreferenceStore.set('lang', lang);
    }

    // LOAD EXTERNAL TRACKERS AFTER CONSENT
    function loadConsentScripts() {
        const trackers = [
            // GOOGLE ANALYTICS 4
            `<script async src="https://www.googletagmanager.com/gtag/js?id=G-JMZTXS94TS"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-JMZTXS94TS');
            </script>`,

            // MICROSOFT CLARITY
            `<script type="text/javascript">
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "sgweog5585");
            </script>`,

            // YANDEX METRIKA
            `<script type="text/javascript">
                (function(m,e,t,r,i,k,a){
                    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                    m[i].l=1*new Date();
                    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=103528686', 'ym');

                ym(103528686, 'init', {ssr:true, webvisor:true, trackHash:true, clickmap:true, referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
            </script>`
        ];

        trackers.forEach(html => injectRawHTML(html, nonce));
    }

    /**
     * INJECTS RAW HTML STRINGS INTO HEAD
     * Ensures all <script> tags within the string carry the nonce and execute.
     */
    function injectRawHTML(htmlString, nonce) {
        const range = document.createRange();
        const fragment = range.createContextualFragment(htmlString);
        const scripts = fragment.querySelectorAll('script');

        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            const placeholderSrc = oldScript.getAttribute('src');

            // 1. NONCE & ASYNC FIRST
            if (nonce) {
                newScript.setAttribute('nonce', nonce);
                newScript.nonce = nonce;
            }
            if (oldScript.async) newScript.async = true;
            if (oldScript.defer) newScript.defer = true;

            // 2. COPY OTHER ATTRIBUTES EXCEPT SRC
            Array.from(oldScript.attributes).forEach(attr => {
                const name = attr.name.toLowerCase();
                if (name !== 'src' && name !== 'nonce' && name !== 'async' && name !== 'defer') {
                    newScript.setAttribute(attr.name, attr.value);
                }
            });

            // 3. APPLY CONTENT OR SRC LAST
            if (placeholderSrc) {
                newScript.src = placeholderSrc;
            } else if (oldScript.textContent) {
                newScript.textContent = oldScript.textContent;
            }

            // 4. ATTACH TO DOM
            document.head.appendChild(newScript);
        });
    }

    // COOKIE BAR INITIALIZATION
    function initCookieBar() {
        if (!barEl) return;

        checkAndShowCookieBar();

        // DELEGATED LISTENER ON BAR (RESISTANT TO i18n CHANGES)
        if (!barEl.dataset.delegationAdded) {
            barEl.addEventListener('click', (event) => {
                const acceptAllBtn = event.target.closest('#all-cookies');
                const essentialBtn = event.target.closest('#essential-cookies');
                const rejectBtn = event.target.closest('#reject-cookies');

                if (acceptAllBtn) {
                    acceptConsent(event, 'all');
                } else if (essentialBtn) {
                    acceptConsent(event, 'essential');
                } else if (rejectBtn) {
                    event.preventDefault();
                    acceptConsent(event, 'false');
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
