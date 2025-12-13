// IMPORTS
import { logger } from "../../utils/index.js";
import { reloadCarousel } from "../carousel.js";

// BUILD & INIT NEW CAROUSEL IN MODAL
export async function modalCarousel(link, imgWrapper) {

	// HELPER TO CREATE INLINE SVG BUTTONS
	const createBtn = (type) => {
		const btn = document.createElement("button");
		let svg = "";

		switch (type) {
			case "left":
				btn.className = "carousel-back";
				btn.setAttribute("aria-label", "Retroceder");
				svg = `<svg aria-hidden="true" width="30" height="30" viewBox="0 0 64 74" fill="none">
							<path d="M0.25,37 L64.25,0.05 L64.25,74Z" fill="currentColor" />
						</svg>`;
				break;
			case "right":
				btn.className = "carousel-advance";
				btn.setAttribute("aria-label", "Avanzar");
				svg = `<svg aria-hidden="true" width="30" height="30" viewBox="0 0 64 74" fill="none">
							<path d="M63.75,37 L0.75,0.05 L0.75,74Z" fill="currentColor" />
						</svg>`;
				break;
			case "close":
				btn.className = "modal-close";
				btn.setAttribute("aria-label", "Cerrar");
				svg = `<svg aria-hidden="true" width="30" height="30" viewBox="0 0 12 12" fill="none">
							<circle cx="6" cy="6" r="6" fill="currentColor" />
							<line x1="3" y1="3" x2="9" y2="9" stroke="currentColor" stroke-width="2" />
							<line x1="9" y1="3" x2="3" y2="9" stroke="currentColor" stroke-width="2" />
						</svg>`;
				break;
		}

		btn.innerHTML = svg;
		return btn;
	};

	// FETCH IMAGES DATA FROM JSON
	let imgsData;
	try {
		const response = await fetch('./js/data/carousel.json');
		if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
		imgsData = await response.json();
	} catch (err) {
		logger.er('modalCarousel: failed to load carousel JSON', err);
		return false;
	}

	// FIND CLICKED IMG SRC AND NORMALIZE URL
	const clickedImg = link.querySelector('img') || link;
	const clickedSrc = clickedImg.src;
	const normalize = src => new URL(src, window.location.origin).href;

	// FIND INDEX FROM JSON THAT MATCHES CLICKED IMG
	const clickedIndex = imgsData.findIndex(img =>
		normalize(img.png.fallback) === normalize(clickedSrc)
	);
	if (clickedIndex === -1) {
		logger.wa('modalCarousel: image not found in JSON');
		return false;
	}

	// CLEAN MODAL CONTENT
	imgWrapper.innerHTML = '';

	// CREATE NEW CAROUSEL STRUCTURE
	const figure = document.createElement('figure');
	figure.classList.add('carousel-container');

	// IMG TRACK
	const imgsDiv = document.createElement('div');
	imgsDiv.classList.add('carousel-imgs');
	const olTrack = document.createElement('ol');
	olTrack.classList.add('carousel-track');
	olTrack.setAttribute('aria-live', 'polite');
	imgsDiv.appendChild(olTrack);

	// CONTROLS
	const controls = document.createElement('aside');
	controls.classList.add('carousel-control');
	controls.setAttribute('aria-label', 'Carousel controls');
	controls.appendChild(createBtn('left'));
	controls.appendChild(createBtn('right'));

	// SCROLLBAR
	const scrollbar = document.createElement('div');
	scrollbar.classList.add('carousel-scrollbar');

	// APPEND ELEMENTS
	figure.appendChild(imgsDiv);
	figure.appendChild(controls);
	figure.appendChild(scrollbar);
	imgWrapper.appendChild(figure);

	// INIT CAROUSEL
	reloadCarousel(
		figure,
		'.carousel-imgs',
		'.carousel-advance',
		'.carousel-back',
		imgsData,
		clickedIndex
	);

	return true;
}
