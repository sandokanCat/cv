// IMPORTS
import { getLocale, fallbackLocale, validateCarousel } from "../utils/index.js"; // USE GLOBAL i18n LOCALE DETECTION

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

    const { track } = refs;
    if (!track) return;

    const imgs = track.querySelectorAll("img.modal-link");
    if (!imgs.length) return;

    const data = validImgs || await loadCarouselData();

    imgs.forEach((img, i) => {
        const altData = data[i]?.alt;
        if (altData) {
            img.alt = altData[locale] || altData[fallbackLocale] || Object.values(altData)[0] || '';
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
	try {
		// FETCH + VALIDATE IMAGES (IF NOT PASSED MANUALLY)
		const validImgs = imgs || await loadCarouselData();
        
		if (!validImgs.length) throw new Error("initCarousel: EMPTY VALID IMAGE LIST");

        // DESTRUCTURE REFS
        const {
            container,
            track,
            scrollbar,
            advanceBtn,
            backBtn,
            imgWrapper
        } = refs;

		// MANDATORY ELEMENTS CHECK
		if (!track || !scrollbar || !imgWrapper)
			throw new Error("initCarousel: MISSING REQUIRED ELEMENTS IN CONTAINER");

		let index = startIndex, timer;
		track.innerHTML = ''; // CLEAN PREVIOUS SLIDES

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
			track.appendChild(li); // APPEND LI TO TRACK
		});

		// MOVE TRACK + UPDATE SCROLLBAR
		const update = () => {
			track.style.transform = `translateX(${-index * 100}%)`;
			const width = 100 / validImgs.length;
			scrollbar.style.setProperty('--scrollbar-offset', `${index * width}%`);
			scrollbar.style.setProperty('--scrollbar-width', `${width}%`);
			clearTimeout(timer);
			timer = setTimeout(() => {
				index = (index + 1) % validImgs.length;
				update();
			}, interval);
		};

		// MANUAL BUTTON CONTROLS
		advanceBtn?.addEventListener("click", () => {
			index = (index + 1) % validImgs.length;
			update();
		});
		backBtn?.addEventListener("click", () => {
			index = (index - 1 + validImgs.length) % validImgs.length;
			update();
		});

		// AUTOSCROLL PAUSE ON HOVER
		imgWrapper.addEventListener("mouseenter", () => clearTimeout(timer));
		imgWrapper.addEventListener("mouseleave", update);

		update(); // START LOOP

        await updateCarouselAlts(validImgs, locale, refs); // SET i18n ALT TEXTS

	} catch (err) {
		console.error("carousel.js ERROR", json, "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
	}
}