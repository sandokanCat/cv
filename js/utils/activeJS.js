// REPLACE .js-disabled WITH .js-enabled
export function activeJS() {
    document.querySelectorAll('.js-disabled').forEach(el => {
        el.classList.remove('js-disabled');
        el.classList.add('js-enabled');
    });
}