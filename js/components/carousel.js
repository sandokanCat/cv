// IMPORTS
import {
    logger,
    validateCarousel,
    getLocale
} from "../utils/index.js";

// JSON FILE PATH
const json = "./js/data/carousel.json";

// CACHED DATA
let cachedCarouselImgs = null;
let currentLocaleForCarousel = null;

// FETCHES AND VALIDATES REMOTE JSON VIA PUBLIC LIBRARY
const loadCarouselData = async (forceReload = false) => {
    if (forceReload || !cachedCarouselImgs) {
        cachedCarouselImgs = await validateCarousel(json);
    }
    return cachedCarouselImgs;
}

// UPDATE ONLY IMG ALTS BASED ON CURRENT LOCALE
export async function updateCarouselAlts(validImgs = null, locale = getLocale(), refs = {}) {
    currentLocaleForCarousel = locale;

    const { trackSelector } = refs;
    if (!trackSelector) return;

    const imgs = trackSelector.querySelectorAll("img.modal-link");
    if (!imgs.length) return;

    const data = validImgs || await loadCarouselData();

    imgs.forEach((img, i) => {
        const altData = data[i]?.alt;
        if (altData) {
            img.alt = altData[locale] || Object.values(altData)[0] || '';
        }
    });
}

// INIT CAROUSEL WITH AUTOSCROLL + MANUAL CONTROLS
export async function initCarousel({
    imgs,
    startIndex,
    interval,
    locale = getLocale(),
    refs = {}
}) {
    const isRTL = document.documentElement.dir === "rtl";

    try {
        // FETCH + VALIDATE IMAGES (IF NOT PASSED MANUALLY)
        const validImgs = imgs || await loadCarouselData();

        if (!validImgs.length) throw new Error("initCarousel: EMPTY VALID IMAGE LIST");

        // DESTRUCTURE REFS
        const {
            containerSelector,
            trackSelector,
            scrollbarSelector,
            advanceBtnSelector,
            backBtnSelector,
            imgWrapperSelector
        } = refs;

        // MANDATORY ELEMENTS CHECK
        if (!trackSelector || !scrollbarSelector || !imgWrapperSelector)
            throw new Error("initCarousel: MISSING REQUIRED ELEMENTS IN CONTAINER");

        let index = startIndex, timer;
        trackSelector.innerHTML = ''; // CLEAN PREVIOUS SLIDES

        // RENDER <picture> SLIDES
        validImgs.forEach(({ webp, png, alt }) => {
            const li = document.createElement("li");
            const picture = document.createElement("picture");

            const sourceWebp = document.createElement("source"); // SOURCE WEBP
            sourceWebp.type = "image/webp";
            sourceWebp.srcset = webp.srcSet.trim();

            const sourcePng = document.createElement("source"); // SOURCE PNG
            sourcePng.srcset = png.srcSet.trim();

            const img = document.createElement("img"); // IMG FALLBACK
            img.src = png.fallback;
            img.alt = ''; // SET TEMPORARY EMPTY ALT – UPDATED LATER BY i18n
            img.className = "modal-link";
            img.setAttribute("data-modal", png.fallback);
            img.fetchPriority = "high"; //primera foto
            img.decoding = "sync"; //primera foto
            img.loading = "eager"; //primera foto
            // RESTO FOTOS: auto, async, lazy   <=============================VOLVER AQUI=====================================

            picture.appendChild(sourceWebp); // APPEND CHILDREN TO PICTURE
            picture.appendChild(sourcePng);
            picture.appendChild(img);
            li.appendChild(picture); // APPEND PICTURE TO LI
            trackSelector.appendChild(li); // APPEND LI TO trackSelector
        });

        // MOVE TRACK + UPDATE SCROLLBAR
        const update = () => {
            // RTL SUPPORT: REVERSE TRANSLATION AND SCROLLBAR
            const dirMultiplier = isRTL ? 1 : -1;
            trackSelector.style.transform = `translate3d(${dirMultiplier * index * 100}%, 0, 0)`;

            const width = 100 / validImgs.length;
            const offset = index * width;

            if (isRTL) scrollbarSelector.style.setProperty('--scrollbar-offset', `calc(100% - ${offset}% - ${width}%)`);
            else scrollbarSelector.style.setProperty('--scrollbar-offset', `${offset}%`);

            scrollbarSelector.style.setProperty('--scrollbar-width', `${width}%`);

            clearTimeout(timer);
            timer = setTimeout(() => {
                index = isRTL
                    ? (index - 1 + validImgs.length) % validImgs.length
                    : (index + 1) % validImgs.length;

                update();
            }, interval);
        };

        // MANUAL BUTTON CONTROLS
        advanceBtnSelector?.addEventListener("click", () => {
            index = isRTL
                ? (index - 1 + validImgs.length) % validImgs.length
                : (index + 1) % validImgs.length;
            update();
        });
        backBtnSelector?.addEventListener("click", () => {
            index = isRTL
                ? (index + 1) % validImgs.length
                : (index - 1 + validImgs.length) % validImgs.length;
            update();
        });

        // AUTOSCROLL PAUSE ON HOVER
        imgWrapperSelector.addEventListener("mouseenter", () => clearTimeout(timer));
        imgWrapperSelector.addEventListener("mouseleave", update);

        // TOUCH SWIPE LOGIC
        let touchStartX = 0;
        let touchEndX = 0;

        imgWrapperSelector.addEventListener("touchstart", (e) => {
            clearTimeout(timer);
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        imgWrapperSelector.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const delta = touchEndX - touchStartX;
            const threshold = 50;

            if (Math.abs(delta) > threshold) {
                if (delta > 0) { // SWIPE RIGHT (Back in LTR)
                    index = isRTL
                        ? (index + 1) % validImgs.length
                        : (index - 1 + validImgs.length) % validImgs.length;
                } else { // SWIPE LEFT (Advance in LTR)
                    index = isRTL
                        ? (index - 1 + validImgs.length) % validImgs.length
                        : (index + 1) % validImgs.length;
                }
                update();
            } else {
                update(); // RESUME AUTOSCROLL IF NO THRESHOLD SWIPE
            }
        }, { passive: true });

        update(); // START LOOP

        await updateCarouselAlts(validImgs, locale, refs); // SET i18n ALT TEXTS

    } catch (err) {
        logger.er("carousel.js ERROR", json, "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
    }
}