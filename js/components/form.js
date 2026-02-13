const mail = document.getElementById('mail');

export function sendMail() {
    if (!mail) return;

    // PREPARE LINK FOR MODAL
    mail.classList.add('modal-link');
    mail.setAttribute('data-modal', "server/contact/form.php");
    mail.setAttribute('target', '_blank'); // FALLBACK
}