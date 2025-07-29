// IMPORTS
import { validateCarousel } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateCarousel.js"; // FETCH + STRUCTURE + FORMAT VALIDATION
import { getLocale } from "../utils/i18n.js"; // USE GLOBAL i18n LOCALE DETECTION

// GLOBAL VARIABLES
const json = "js/data/carousel.json"; // SOURCE JSON FILE

const locale = getLocale(); // FULL LOCALE FROM GLOBAL FUNC

// FETCHES AND VALIDATES REMOTE JSON VIA PUBLIC LIBRARY
const loadCarouselData = async () => {
    return await validateCarousel(json); // RETURN VALIDATED CAROUSEL DATA
};

// RELOAD RANDOM PHRASES
export async function reloadCarousel() {
    resetRandomMsg();
    await initCarousel();
}

// RESET RANDOM PHRASES
function resetCarousel() {
    intervalStarted = false;
    lastPhrase = null;
    phrasesPool = [];
    if (target) target.textContent = ""; // RESET CONTENT
}

// INIT CAROUSEL WITH AUTOSCROLL + MANUAL CONTROLS
async function initCarousel(
	containerSelector = '.carousel-container', // REQUIRED WRAPPER WITH .carousel-track INSIDE
	imgsSelector = '.carousel-imgs', // WRAPPER AROUND IMAGES (USED FOR AUTOSCROLL PAUSE)
	nextSelector = '.carousel-advance', // OPTIONAL NEXT BUTTON
	prevSelector = '.carousel-back',    // OPTIONAL PREVIOUS BUTTON
	imgs = null, // OPTIONAL: ALLOW PASSING CUSTOM IMG ARRAY (SKIPS FETCH)
	startIndex = 0, // OPTIONAL: INITIAL SLIDE INDEX
	interval = 6000 // OPTIONAL: AUTOSCROLL INTERVAL
) {
	try {
		// HANDLE SELECTOR OR DIRECT DOM ELEMENT
		let containers;
		if (typeof containerSelector==='string') {
			containers = document.querySelectorAll(containerSelector);
		} else if (containerSelector instanceof HTMLElement) {
			containers = [containerSelector];
		} else {
			throw new Error(`initCarousel: INVALID containerSelector → ${containerSelector}`);
		}
		if (!containers.length) throw new Error("initCarousel: NO CONTAINERS FOUND");

		// FETCH + VALIDATE IMAGES (IF NOT PASSED MANUALLY)
		const validImgs = imgs || await loadCarouselData();
        
		if (!validImgs.length) throw new Error("initCarousel: EMPTY VALID IMAGE LIST");

		// LOOP EACH MATCHING CONTAINER
		containers.forEach(container => {
			const track = container.querySelector('.carousel-track');
			const scrollbar = container.querySelector('.carousel-scrollbar');
			const advanceBtn = container.querySelector(nextSelector);
			const backBtn = container.querySelector(prevSelector);
			const imgWrapper = container.querySelector(imgsSelector);

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
				img.alt = alt;
				img.className = "modal-link";
				img.setAttribute("data-modal", png.fallback);
				img.decoding = "async";
				img.loading = "lazy";

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
		});

	} catch (err) {
		console.error("carousel.js ERROR", json, "→", err.name, err.message, err.stack); // LOG ERROR FOR DEBUGGING
	}
}
