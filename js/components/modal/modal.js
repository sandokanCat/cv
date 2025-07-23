// IMPORTS
import { handlePdf } from "./pdfLogic.js"; // ADDING PDF LOGIC
import { validateCarousel } from "https://open-utils-dev-sandokan-cat.vercel.app/js/validateCarousel.js"; // FETCH + STRUCTURE + FORMAT VALIDATION
import { modalCarousel } from "./modalCarousel.js"; // ADDING CAROUSEL LOGIC CLONER

// OPEN MODAL HANDLER
export function openModal() {
    // DOM ELEMENTS
    const site = document.getElementById('site-wrapper');
    const links = document.getElementsByClassName('modal-link');
    const container = document.getElementById('modal-container');
    const iframe = document.getElementById('modal-iframe');
    const imgWrapper = document.getElementById('modal-img-wrapper');
    const closeBtn = document.getElementById('modal-close');

    // LOOP THROUGH ALL MODAL LINKS
    Array.from(links).forEach(link => {
        if (link.dataset.listenerAttached === 'true') return; // AVOID MULTIPLE LISTENERS

        link.addEventListener('click', async (event) => {
        event.preventDefault();

        container.classList.remove('image', 'carousel'); // RESET STATE
        while (imgWrapper.firstChild) { // CLEAR PREVIOUS MODAL CONTENT
            imgWrapper.removeChild(imgWrapper.firstChild);
        };

        const isPdf = handlePdf(link); // CALL PDF HANDLER

        if (!isPdf) {
            const cloned = await modalCarousel(link, imgWrapper); // AWAIT THE ASYNC CLONE

            if (cloned) {
                container.classList.add('carousel'); // SET MODAL TYPE
            } else {
                // SINGLE IMAGE
                const originalImg = link.querySelector('img'); // GET THE ORIGINAL
                if (!originalImg) return;

                const src = originalImg.src || link.href || '';
                const alt = originalImg.alt || '';

                const validImgs = validateCarousel([{ src, alt }]); // VALIDATE
                if (validImgs.length === 0) return;

                const img = document.createElement('img'); // CREATE IMG
                img.src = src;
                img.alt = alt;
                imgWrapper.appendChild(img);

                container.classList.add('image'); // SET TYPE
            }
        }

        // SHOW MODAL
        container.classList.add('show');
        document.body.classList.add('no-scroll');

        site.setAttribute('aria-hidden', 'true');
        container.setAttribute('aria-hidden', 'false');
        container.focus(); // FOCUS MODAL
    });


        link.dataset.listenerAttached = 'true'; // MARK AS ALREADY ATTACHED
    });

    // TRAP FOCUS INSIDE MODAL FOR KEYBOARD USERS
    container.addEventListener('keydown', (event) => {
        const focusableElements = container.querySelectorAll('a, button, input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])');
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (event.key === 'Tab' && event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus(); // LOOP FOCUS BACK TO LAST
        } else if (event.key === 'Tab' && !event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus(); // LOOP FOCUS BACK TO FIRST
        }

        if (!first || !last) return;
    });

    // CLOSE FUNCTION
    const closeModal = () => {
        container.classList.remove('show'); // HIDE MODAL

        setTimeout(() => {
            // RESET MODAL STATE
            iframe.src = '';
            while (imgWrapper.firstChild) {
                imgWrapper.removeChild(imgWrapper.firstChild);
            };

            document.body.classList.remove('no-scroll');
            site.removeAttribute('aria-hidden');
            container.setAttribute('aria-hidden', 'true');
            container.classList.remove('pdf', 'image'); // REMOVE TYPE CLASSES
        }, 300); // MATCH FADE TRANSITION
    };

    // CLOSERS
    closeBtn.addEventListener('click', closeModal); // ON BUTTON CLICK
    window.addEventListener('click', (event) => {
        if (event.target === container) closeModal(); // ON OVERLAY CLICK
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && container.classList.contains('show')) {
            closeModal(); // ON ESCAPE KEY
        }
    });
}