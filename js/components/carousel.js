// IMPORTS
import {
    logger,
    validateCarousel,
    getLocale
} from "../utils/index.js";

// JSON FILE PATH
const json = "/js/data/carousel.json";

// Shared promise to handle concurrent calls
let dataPromise = null;
let currentLocaleForCarousel = null;

/**
 * FETCHES AND VALIDATES REMOTE JSON (WITH PROMISE SHARING)
 */
export const loadCarouselData = (forceReload = false) => {
    if (forceReload || !dataPromise) {
        dataPromise = validateCarousel(json).catch(err => {
            dataPromise = null; // Reset on failure so next call retries
            throw err;
        });
    }
    return dataPromise;
}

/**
 * UPDATE ONLY IMG ALTS BASED ON CURRENT LOCALE
 */
export async function updateCarouselAlts(validImgs = null, locale = null, refs = {}) {
    const currentLocale = locale || (await getLocale()).locale;
    currentLocaleForCarousel = currentLocale;

    const { trackSelector } = refs;
    if (!trackSelector) return;

    const imgs = trackSelector.querySelectorAll("img");
    if (!imgs.length) return;

    try {
        const data = validImgs || await loadCarouselData();
        imgs.forEach((img, i) => {
            const altData = data[i]?.alt;
            if (altData) {
                img.alt = altData[currentLocale] || Object.values(altData)[0] || '';
            }
        });
    } catch (err) {
        logger.wa("Failed to update carousel alts", err);
    }
}

/**
 * HELPER: SETUP TOUCH SWIPE
 */
export function setupSwipe(container, onSlide, onPause, onResume) {
    if (!container) return () => { };
    const isRTL = document.documentElement.dir === "rtl";
    let touchStartX = 0;

    const start = (e) => {
        if (!e.changedTouches?.[0]) return;
        onPause?.();
        touchStartX = e.changedTouches[0].screenX;
    };

    const end = (e) => {
        if (!e.changedTouches?.[0]) return;
        const touchEndX = e.changedTouches[0].screenX;
        const delta = touchEndX - touchStartX;
        const threshold = 50;

        if (Math.abs(delta) > threshold) {
            const isAdvance = isRTL ? delta > 0 : delta < 0;
            onSlide(isAdvance ? 1 : -1);
        } else {
            onResume?.();
        }
    };

    container.addEventListener("touchstart", start, { passive: true });
    container.addEventListener("touchend", end, { passive: true });

    return () => {
        container.removeEventListener("touchstart", start);
        container.removeEventListener("touchend", end);
    };
}

/**
 * HELPER: SETUP KEYBOARD NAVIGATION
 */
export function setupKeyboard(onSlide) {
    const handler = (e) => {
        if (e.key === "ArrowRight") onSlide(document.documentElement.dir === "rtl" ? -1 : 1);
        if (e.key === "ArrowLeft") onSlide(document.documentElement.dir === "rtl" ? 1 : -1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
}

/**
 * CORE RELOAD/INIT LOGIC FOR SPECIFIC CONTAINER
 */
export function reloadCarousel(container, trackSelector, advanceSelector, backSelector, validImgs, startIndex = 0, interval = 6000, hoverPauseSelector = null) {
    if (!container || !validImgs.length) return () => { };

    const track = typeof trackSelector === 'string' ? container.querySelector(trackSelector) : trackSelector;
    const advanceBtn = typeof advanceSelector === 'string' ? container.querySelector(advanceSelector) : advanceSelector;
    const backBtn = typeof backSelector === 'string' ? container.querySelector(backSelector) : backSelector;
    const hoverPauseArea = typeof hoverPauseSelector === 'string' ? container.querySelector(hoverPauseSelector) : hoverPauseSelector;
    const isRTL = document.documentElement.dir === "rtl";

    let index = startIndex;
    let localTimer;

    const update = (delta = 0) => {
        if (delta !== 0) {
            index = (index + delta + validImgs.length) % validImgs.length;
        }

        const dirMultiplier = isRTL ? 1 : -1;
        if (track) track.style.transform = `translate3d(${dirMultiplier * index * 100}%, 0, 0)`;

        const width = 100 / validImgs.length;
        const offset = index * width;

        const scrollbar = container.querySelector('.carousel-scrollbar');
        if (scrollbar) {
            scrollbar.style.setProperty('--scrollbar-offset', `${offset}%`);
            scrollbar.style.setProperty('--scrollbar-width', `${width}%`);
        }

        clearTimeout(localTimer);
        if (interval > 0) {
            localTimer = setTimeout(() => update(1), interval);
        }
    };

    const next = (e) => { e?.preventDefault(); e?.stopPropagation(); update(1); };
    const prev = (e) => { e?.preventDefault(); e?.stopPropagation(); update(-1); };
    advanceBtn?.addEventListener("click", next);
    backBtn?.addEventListener("click", prev);

    const pause = () => clearTimeout(localTimer);
    const resume = () => update(0);
    if (hoverPauseArea && interval > 0) {
        hoverPauseArea.addEventListener("mouseenter", pause);
        hoverPauseArea.addEventListener("mouseleave", resume);
    }

    const cleanupSwipe = setupSwipe(container, (delta) => update(delta), pause, resume);
    const cleanupKeyboard = setupKeyboard((delta) => update(delta));

    update();

    return () => {
        clearTimeout(localTimer);
        advanceBtn?.removeEventListener("click", next);
        backBtn?.removeEventListener("click", prev);
        if (hoverPauseArea) {
            hoverPauseArea.removeEventListener("mouseenter", pause);
            hoverPauseArea.removeEventListener("mouseleave", resume);
        }
        cleanupSwipe?.();
        cleanupKeyboard?.();
    };
}

/**
 * INIT CAROUSEL WITH AUTOSCROLL + MANUAL CONTROLS (Main Page)
 */
export async function initCarousel({
    imgs,
    startIndex,
    interval,
    locale = null,
    refs = {}
}) {
    try {
        const validImgs = imgs || await loadCarouselData();
        if (!validImgs?.length) throw new Error("EMPTY VALID IMAGE LIST");

        const {
            containerSelector,
            trackSelector,
            scrollbarSelector,
            advanceBtnSelector,
            backBtnSelector,
            imgWrapperSelector
        } = refs;

        if (!trackSelector || !scrollbarSelector || !imgWrapperSelector)
            throw new Error("MISSING REQUIRED ELEMENTS");

        trackSelector.innerHTML = '';

        validImgs.forEach(({ webp, png }, i) => {
            const isFirst = i === 0;
            const li = document.createElement("li");
            const picture = document.createElement("picture");

            const srcWebp = document.createElement("source");
            srcWebp.type = "image/webp";
            srcWebp.srcset = webp.srcSet.trim();

            const srcPng = document.createElement("source");
            srcPng.srcset = png.srcSet.trim();

            const img = document.createElement("img");
            img.src = png.fallback;
            img.alt = '';
            img.className = "modal-link";
            img.setAttribute("data-modal", png.fallback);

            img.fetchPriority = isFirst ? "high" : "auto";
            img.decoding = isFirst ? "sync" : "async";
            img.loading = isFirst ? "eager" : "lazy";

            picture.appendChild(srcWebp);
            picture.appendChild(srcPng);
            picture.appendChild(img);
            li.appendChild(picture);
            trackSelector.appendChild(li);
        });

        const currentLocale = locale || (await getLocale()).locale;

        const cleanup = reloadCarousel(
            containerSelector,
            trackSelector,
            advanceBtnSelector,
            backBtnSelector,
            validImgs,
            startIndex,
            interval,
            imgWrapperSelector
        );

        await updateCarouselAlts(validImgs, currentLocale, refs);

        return cleanup;

    } catch (err) {
        logger.er("carousel.js ERROR →", err.name, err.message);
    }
}