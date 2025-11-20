const mail = document.getElementById('mail');

export function sendMail() {
    mail.addEventListener('click', (event) => {
        event.preventDefault();

        window.location.href = "server/contact/form.php"; // REDIRECT TO FORM PAGE
    })
}