// LOAD PDF INTO MODAL IFRAME
export function handlePdf(link) {
    // DOM ELEMENTS
    const container = document.getElementById('modal-container');
    const iframe = document.getElementById('modal-iframe');

    const src = link.dataset.pdf || link.dataset.modal || link.href || ''; // GET PDF LINK
    const isPdf = /\.pdf($|\?)/i.test(src); // CHECK IF FILE IS A PDF (ALLOW QUERY PARAMS)

    if (!isPdf) return false; // NOT A PDF

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent); // DETECT MOBILE DEVICES

    if (isMobile) { // OPEN IN NEW TAB FOR MOBILE
        window.open(src, '_blank');
        return 'new-tab'; // EXIT IF MOBILE6
    } else { // LOAD PDF INTO MODAL
        container.classList.add('pdf'); // SET MODAL TYPE
        iframe.src = src;
        return true; // EXIT IF PDF
    }
}