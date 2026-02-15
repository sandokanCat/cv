// IMPORTS
import { logger } from "../../utils/index.js";
import { handlePdf } from "./pdfLogic.js";
import { modalCarousel } from "./modalCarousel.js";

// OPEN MODAL HANDLER
export async function openModal({ refs = {} }) {
    let carouselCleanup = null;

    try {
        const {
            siteSelector: site,
            containerSelector: container,
            iframeSelector: iframe,
            imgWrapperSelector: imgWrapper,
            closeSelector: closeBtn
        } = typeof refs === 'function' ? refs() : refs;

        if (!container) return;

        // SINGLETON DELEGATION
        if (!document.documentElement.dataset?.modalDelegation) {
            let isProcessing = false;
            let touchStartPos = { x: 0, y: 0 };
            const MOVE_THRESHOLD = 15; // Pixels to distinguish tap from scroll

            /**
             * Primary handler for modal opening.
             * Triggered by click or touchend after validating it's a tap, not a scroll.
             */
            const openHandler = async (event) => {
                // Determine if this is a legitimate tap or click
                if (event.type === 'touchend') {
                    const touch = event.changedTouches[0];
                    const dist = Math.hypot(touch.clientX - touchStartPos.x, touch.clientY - touchStartPos.y);
                    if (dist > MOVE_THRESHOLD) return; // Discard if scrolled
                }

                // 1. Validate Target: Only proceed if it's a modal link
                const link = event.target.closest('.modal-link');
                if (!link) return;

                // 2. Sequential Check: Ignore events if already processing
                if (isProcessing) return;

                // 3. Prevent default behavior ONLY if it's a valid modal trigger
                if (event.cancelable) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                isProcessing = true;

                try {
                    // 4. Initial state lock: Show modal and disable page scroll
                    container.classList.remove('image', 'carousel', 'pdf', 'form');
                    container.classList.add('show');
                    document.documentElement.classList.add('no-scroll');
                    document.body.classList.add('no-scroll');

                    // Accessibility: Pull focus to the modal BEFORE hiding background
                    container.setAttribute('aria-hidden', 'false');
                    container.focus();

                    // Chromium: Ensure focus is moved before we hide the site wrapper
                    setTimeout(() => {
                        if (site && (container.contains(document.activeElement) || document.activeElement === container)) {
                            site.setAttribute('aria-hidden', 'true');
                        }
                    }, 100);

                    // 5. Cleanup: Dispose of previous instances
                    if (carouselCleanup) {
                        try {
                            carouselCleanup();
                        } catch (e) {
                            logger.wa("Cleanup failed", e);
                        }
                        carouselCleanup = null;
                    }

                    // 6. DOM Reset & Immediate Preview
                    iframe.src = 'about:blank';
                    if (imgWrapper) {
                        while (imgWrapper.firstChild) imgWrapper.removeChild(imgWrapper.firstChild);

                        // SHOW PLACEHOLDER IMMEDIATELY
                        const originalImg = (link.tagName?.toLowerCase() === 'img') ? link : link.querySelector('img');
                        const preview = document.createElement('img');
                        preview.src = originalImg ? originalImg.src : (link.dataset?.modal || link.href || '');
                        preview.alt = originalImg ? originalImg.alt : '';
                        preview.className = 'modal-preview';
                        imgWrapper.appendChild(preview);
                        container.classList.add('image');
                    }

                    const src = link.dataset.modal || link.dataset.pdf || link.href || '';
                    if (!src) throw new Error('EMPTY_SRC');

                    // 7. Route Handlers
                    const pdfStatus = handlePdf(link);
                    if (pdfStatus === 'new-tab') {
                        closeModal();
                        return;
                    }

                    // 8. Form/Static check
                    const isForm = !pdfStatus && (src.includes('form.php') || link.id === 'mail');

                    if (pdfStatus === true) {
                        // PDF class handled within handlePdf
                        container.classList.remove('image');
                    } else if (isForm) {
                        container.classList.remove('image');
                        container.classList.add('form');
                        iframe.src = src;
                    } else {
                        // 9. Full Carousel load
                        const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('MODAL_RENDER_TIMEOUT')), 5500)
                        );

                        const result = await Promise.race([modalCarousel(link, imgWrapper), timeoutPromise]);

                        if (result?.success) {
                            const previews = imgWrapper.querySelectorAll('.modal-preview');
                            previews.forEach(p => p.remove());

                            container.classList.remove('image');
                            container.classList.add('carousel');
                            carouselCleanup = result.cleanup;
                        } else {
                            // Fallback
                            const originalImg = (link.tagName?.toLowerCase() === 'img') ? link : link.querySelector('img');
                            const img = document.createElement('img');
                            img.src = originalImg ? originalImg.src : src;
                            img.alt = originalImg ? originalImg.alt : '';

                            if (imgWrapper) {
                                while (imgWrapper.firstChild) imgWrapper.removeChild(imgWrapper.firstChild);
                                imgWrapper.appendChild(img);
                            }
                            container.classList.remove('carousel');
                            container.classList.add('image');
                        }
                    }

                } catch (err) {
                    logger.er("Modal open sequence failed", err.name, err.message);
                    closeModal();
                } finally {
                    setTimeout(() => { isProcessing = false; }, 500);
                }
            };

            // Register event listeners
            document.addEventListener('touchstart', (e) => {
                touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }, { passive: true });

            document.addEventListener('touchend', openHandler, { passive: false });
            document.addEventListener('click', openHandler);

            // Initialize singleton on the root element
            if (!document.documentElement.dataset) document.documentElement.dataset = {};
            document.documentElement.dataset.modalDelegation = 'true';
        }

        // BARRIER
        container.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target === container) closeModal(e);
        });

        imgWrapper.addEventListener('click', (e) => e.stopPropagation());
        iframe.addEventListener('click', (e) => e.stopPropagation());
        closeBtn?.addEventListener('click', (e) => e.stopPropagation());

        // FOCUS TRAP
        container.addEventListener('keydown', (event) => {
            if (event.key !== 'Tab') return;
            const focusable = container.querySelectorAll('a, button, input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])');
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        // CLOSE LOGIC
        function closeModal(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            if (carouselCleanup) {
                try {
                    carouselCleanup();
                } catch (e) {
                    logger.wa("Cleanup on close failed", e);
                }
                carouselCleanup = null;
            }

            container.classList.remove('show');
            setTimeout(() => {
                try {
                    iframe.src = 'about:blank';
                    while (imgWrapper.firstChild) imgWrapper.removeChild(imgWrapper.firstChild);
                    site.removeAttribute('aria-hidden');
                    container.setAttribute('aria-hidden', 'true');
                    container.classList.remove('pdf', 'image', 'carousel', 'form');
                } catch (e) {
                    logger.er("Error during modal DOM cleanup", e);
                } finally {
                    // GUARANTEE SCROLL UNLOCK
                    document.documentElement.classList.remove('no-scroll');
                    document.body.classList.remove('no-scroll');
                }
            }, 300);
        }

        // EVENT ASSIGNMENT (ONCE)
        if (!container.dataset.closersAttached) {
            closeBtn?.addEventListener('click', closeModal);
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && container.classList.contains('show')) closeModal(e);
            });
            container.dataset.closersAttached = 'true';
        }

    } catch (err) {
        logger.er("modal.js ERROR →", err.name, err.message);
    }
}