// IMPORTS
import { reloadDynamicContent } from "./index.js";

// COMMON TOOGLE MENU FUNCTION
export async function initToggler({
    triggerSelector,
    multiple = false,
    targets = [],
    aria = false,
    labelFn = null,
    onClick = null,
    customToggleFn = null
}) {
    const triggers = multiple
        ? document.querySelectorAll(triggerSelector)
        : [document.querySelector(triggerSelector)];

    if (!triggers.length) {
        console.error(`NO TRIGGER(S) FOUND FOR SELECTOR: "${triggerSelector}"`);
        return;
    }

    triggers.forEach(trigger => {
        const elements = targets.map(sel => document.querySelector(sel)).filter(Boolean);

        trigger.addEventListener('click', async () => {
            const isExpanded = trigger.getAttribute("aria-expanded") === "true";
            const newState = !isExpanded;

            if (aria) {
                trigger.setAttribute("aria-expanded", newState.toString());
                trigger.setAttribute("aria-pressed", newState.toString());
            }

            if (typeof labelFn === 'function') {
                labelFn(newState);
            }

            if (typeof customToggleFn === 'function') {
                customToggleFn(trigger, elements, newState);
            } else {
                elements.forEach(el => el.classList.toggle('active'));
            }

            if (typeof onClick === 'function') {
                try {
                    await onClick(trigger, newState);
                } catch (err) {
                    console.error('ERROR IN TOGGLER onClick():', err.name, err.message, err.stack);
                }
            }
        });
    });
}