// REPLACE oldClass WITH newClass IN ELEMENTS
export function activeJS(oldClass = 'js-disabled', newClass = 'js-enabled') {
    document.querySelectorAll(`.${oldClass}`).forEach(el => {
        el.classList.remove(oldClass);
        el.classList.add(newClass);
    });
}