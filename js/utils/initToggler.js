// TOGGLE BURGER MENU STATES
export async function initToggler({
    triggerSelector,
    multiple = false,
    targets = [],
    aria = false,
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

            elements.forEach(el => el.classList.toggle('active'));
        });
    });
}