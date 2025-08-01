// REPLACE .js-disabled WITH .js-enabled
export function activeJS(oldClass, newClass) {
    document.querySelectorAll(`.${oldClass}`).forEach(el => {
        el.classList.remove(oldClass);
        el.classList.add(newClass);
    });
}