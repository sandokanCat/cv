// REPLACE .js-disabled WITH .js-enabled
export function activeJS(oldClass = 'js-disabled', newClass = 'js-enabled') {
    document.querySelectorAll(`.${oldClass}`).forEach(el => {
        el.classList.remove(oldClass);
        el.classList.add(newClass);
    });

    // JS BURGER MENU
    const burgerNav = document.getElementById('burger-nav');
    burgerNav.classList.remove('js-disabled');
    burgerNav.style.display = 'flex';
}