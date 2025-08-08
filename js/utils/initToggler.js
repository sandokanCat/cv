// TOGGLE BURGER MENU STATES
export async function initToggler({
    triggerSelector,
    multiple = false,
    targets = [],
    aria = false,
    labelFn = null,
    onClick = null, // async optional
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

            // ARIA TOGGLE
            if (aria) {
                trigger.setAttribute("aria-expanded", newState.toString());
                trigger.setAttribute("aria-pressed", newState.toString());
            }

            // ARIA LABEL
            if (typeof labelFn === 'function') labelFn(newState);

            // CUSTOM BEHAVIOR
            if (typeof customToggleFn === 'function') {
                customToggleFn(trigger, elements, newState);
            } else {
                // DEFAULT: toggle .active
                elements.forEach(el => el.classList.toggle('active'));
            }

            // ASYNC LOGIC (like changing language)
            if (typeof onClick === 'function') {
                try {
                    await onClick(trigger, newState);
                } catch (err) {
                    console.error('ERROR IN TOGGLER onClick():', err.name, err.message, err.stack);
                }
            }
        });
    });

    // EASTER EGG
    console.log(
        "%c🍔 Menú desplegable hecho con CSS puro y amor. ¡No jQuery aquí!",
        "color: #2ecc71;"
    );
}