export function openMenu() {
    const burgerBtn = document.getElementById("burger-btn");
    const burgerMenu = document.getElementById("burger-links");

    burgerBtn.addEventListener("click", () => {
        const isExpanded = burgerBtn.getAttribute("aria-expanded") === "true";
        const newState = !isExpanded;

        burgerBtn.setAttribute("aria-expanded", newState);
        burgerBtn.setAttribute("aria-label", newState ? "Cerrar menú" : "Abrir menú");
        burgerMenu.classList.toggle("active");

        console.log(
            "%c🍔 Menú desplegable hecho con CSS puro y amor. ¡No jQuery aquí!",
            "color: #2ecc71;"
        );
    });
}
