// IMPORTS
import { getLocale, logger } from "../../utils/index.js";
import { handlePdf } from "./pdfLogic.js";
import { modalCarousel } from "./modalCarousel.js";

// OPEN MODAL HANDLER
export async function openModal({
    refs = {},
    locale = getLocale()
} = {}) {
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
        if (!document.dataset?.modalDelegation) {
            document.addEventListener('click', async (event) => {
                const link = event.target.closest('.modal-link');
                if (!link) return;

                // ⚡ STOP AND PROACTIVE SHOW
                event.preventDefault();
                event.stopPropagation();

                // 1. SHOW MODAL IMMEDIATELY AND LOCK SCROLL
                container.classList.remove('image', 'carousel', 'pdf', 'form');
                container.classList.add('show');
                document.documentElement.classList.add('no-scroll');
                document.body.classList.add('no-scroll');
                site.setAttribute('aria-hidden', 'true');
                container.setAttribute('aria-hidden', 'false');
                container.focus();

                try {
                    // 2. CLEANUP PREVIOUS INSTANCE
                    if (carouselCleanup) {
                        try {
                            carouselCleanup();
                        } catch (e) {
                            logger.wa("Cleanup failed", e);
                        }
                        carouselCleanup = null;
                    }

                    // 3. RESET DOM
                    iframe.src = 'about:blank';
                    while (imgWrapper.firstChild) imgWrapper.removeChild(imgWrapper.firstChild);

                    const src = link.dataset.modal || link.dataset.pdf || link.href || '';
                    if (!src) throw new Error('EMPTY_SRC');

                    // 4. PDF LOGIC (MOBILE REDIRECTION)
                    const pdfStatus = handlePdf(link);
                    if (pdfStatus === 'new-tab') {
                        closeModal(); // CANCEL MODAL IF NEW TAB
                        return;
                    }

                    // 5. FORM DETECTION
                    const isForm = !pdfStatus && (src.includes('form.php') || link.id === 'mail');

                    if (pdfStatus === true) {
                        // PDF CLASS IS ALREADY ADDED BY handlePdf
                    } else if (isForm) {
                        container.classList.add('form');
                        iframe.src = src;
                    } else {
                        // 6. CAROUSEL OR IMAGE (WITH FAIL-SAFE TIMEOUT)
                        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('MODAL_RENDER_TIMEOUT')), 6000));
                        const result = await Promise.race([modalCarousel(link, imgWrapper), timeoutPromise]);

                        if (result?.success) {
                            container.classList.add('carousel');
                            carouselCleanup = result.cleanup;
                        } else {
                            // FALLBACK TO SINGLE IMAGE
                            const originalImg = link.querySelector('img');
                            const img = document.createElement('img');
                            img.src = originalImg ? originalImg.src : src;
                            img.alt = originalImg ? originalImg.alt : '';
                            imgWrapper.appendChild(img);
                            container.classList.add('image');
                        }
                    }

                } catch (err) {
                    logger.er("Modal open sequence failed", err.name, err.message);
                    closeModal(); // FAIL-SAFE RECOVERY: UNLOCK SCROLL!
                }
            });

            if (!document.dataset) document.dataset = {};
            document.dataset.modalDelegation = 'true';
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
                iframe.src = 'about:blank';
                while (imgWrapper.firstChild) imgWrapper.removeChild(imgWrapper.firstChild);
                document.documentElement.classList.remove('no-scroll');
                document.body.classList.remove('no-scroll');
                site.removeAttribute('aria-hidden');
                container.setAttribute('aria-hidden', 'true');
                container.classList.remove('pdf', 'image', 'carousel', 'form');
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