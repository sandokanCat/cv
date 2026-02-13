// IMPORTS
import { getLocale, logger } from "../../utils/index.js";
import { loadCarouselData, reloadCarousel, updateCarouselAlts } from "../carousel.js";

// HELPER TO ENSURE ROOT-RELATIVE PATHS
const toAbs = (path) => {
    if (!path || typeof path !== 'string') return '';
    const trimmed = path.trim();
    // If it already starts with / or http, leave it. Otherwise prepend /
    return (trimmed.startsWith('/') || trimmed.startsWith('http')) ? trimmed : '/' + trimmed;
};

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
        }

        btn.innerHTML = svg;
        return btn;
    };

    try {
        // USE SHARED DATA (FAST & CACHED) - ADD FAIL-SAFE TIMEOUT
        const loadWithTimeout = (promise, ms) => {
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), ms));
            return Promise.race([promise, timeout]);
        };

        const imgsData = await loadWithTimeout(loadCarouselData(), 5000);
        if (!imgsData || !imgsData.length) throw new Error('NO_IMAGES_DATA');

        // NORMALIZE & FIND INDEX
        const clickedImg = link.querySelector('img') || link;
        const clickedSrc = clickedImg.src;
        const normalize = src => new URL(src, window.location.origin).href;

        // FIND INDEX (BEING DEFENSIVE WITH PATHS)
        const clickedIndex = imgsData.findIndex(img => {
            const fallbackAbs = toAbs(img.png.fallback);
            return normalize(fallbackAbs) === normalize(clickedSrc);
        });

        if (clickedIndex === -1) {
            logger.wa('modalCarousel: index not found among', imgsData.length, 'images. Falling back to 0');
        }

        // CLEAN MODAL CONTENT
        imgWrapper.innerHTML = '';

        // CREATE STRUCTURE
        const figure = document.createElement('figure');
        figure.classList.add('carousel-container');

        const imgsDiv = document.createElement('div');
        imgsDiv.classList.add('carousel-imgs');
        const olTrack = document.createElement('ol');
        olTrack.classList.add('carousel-track');
        olTrack.setAttribute('aria-live', 'polite');

        // RENDER SLIDES (FORCING @3x FOR MODAL)
        imgsData.forEach(({ webp, png }) => {
            const li = document.createElement("li");
            const picture = document.createElement("picture");

            // Extract path without descriptor for img.src, keep it for source.srcset
            const getHighResEntry = (srcSet) => {
                const match = srcSet.match(/([^, ]*@3x\.[a-z0-9]+)/i);
                return match ? match[1].trim() : srcSet.split(',')[0].trim();
            };

            const rawHighResWebp = getHighResEntry(webp.srcSet);
            const rawHighResPng = getHighResEntry(png.srcSet);

            // Strip descriptor (e.g. " 3x") if it leaked into the entry for the actual URL
            const getUrlOnly = (entry) => entry.split(' ')[0];

            const absWebp = toAbs(getUrlOnly(rawHighResWebp));
            const absPng = toAbs(getUrlOnly(rawHighResPng));

            const srcWebp = document.createElement("source");
            srcWebp.type = "image/webp";
            srcWebp.srcset = toAbs(rawHighResWebp); // srcset can keep descriptors

            const srcPng = document.createElement("source");
            srcPng.srcset = toAbs(rawHighResPng);

            const img = document.createElement("img");
            img.src = absPng; // src MUST NOT have descriptors
            img.loading = "lazy";
            img.alt = "";

            img.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); });

            picture.appendChild(srcWebp);
            picture.appendChild(srcPng);
            picture.appendChild(img);
            li.appendChild(picture);
            olTrack.appendChild(li);
        });

        imgsDiv.appendChild(olTrack);

        // CONTROLS
        const controls = document.createElement('aside');
        controls.classList.add('carousel-control');
        controls.appendChild(createBtn('left'));
        controls.appendChild(createBtn('right'));

        // SCROLLBAR
        const scrollbar = document.createElement('div');
        scrollbar.classList.add('carousel-scrollbar');

        figure.appendChild(imgsDiv);
        figure.appendChild(controls);
        figure.appendChild(scrollbar);
        imgWrapper.appendChild(figure);

        // INIT RELOAD (NO AUTO-SCROLL)
        const cleanup = reloadCarousel(
            figure,
            '.carousel-track',
            '.carousel-advance',
            '.carousel-back',
            imgsData,
            clickedIndex === -1 ? 0 : clickedIndex,
            0
        );

        // ASYNC ALTS (DON'T BLOCK RETURN)
        getLocale().then(loc => updateCarouselAlts(imgsData, loc.locale, { trackSelector: olTrack }));

        return { success: true, cleanup };

    } catch (err) {
        logger.er('modalCarousel ERROR →', err.name, err.message);
        return { success: false };
    }
}
