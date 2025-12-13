// GET SYSTEM PREFERENCE
export const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

// APPLY THEME TO HTML AND SAVE
export const applyTheme = (htmlSelector, theme) => {
    htmlSelector.setAttribute('data-theme', theme); // SET DATA-THEME
    localStorage.setItem('theme', theme); // SAVE PREFERENCE

    // FORCE SVG RELOAD
    const svgContainer = document.getElementById('theme-dark-btn');
    if (svgContainer) {
        svgContainer.style.display = 'none';
        svgContainer.offsetHeight; // TRIGGER REFLOW
        svgContainer.style.display = '';
    }
};

// UPDATE BUTTON ICON
export const updateToggleIcon = (button, theme) => {
    if (!button) return;
    button.textContent = theme === 'dark' ? '☀️' : '🌙'; // SUN: LIGHT, MOON: DARK
};

// INIT TOGGLE BUTTON
export const initThemeToggle = (buttonSelector, htmlSelector) => {
    const button = document.querySelector(buttonSelector);
    if (!button) return; // EXIT IF BUTTON NOT FOUND

    button.addEventListener('click', () => {
        const currentTheme = htmlSelector.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(htmlSelector, nextTheme);
        updateToggleIcon(button, nextTheme);
    });
};

// MAIN INITIALIZER
export const initTheme = (buttonSelector, htmlSelector) => {
    const html = htmlSelector;
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = getSystemTheme();
    const initialTheme = savedTheme || systemTheme;

    applyTheme(html, initialTheme);
    updateToggleIcon(document.querySelector(buttonSelector), initialTheme);
    initThemeToggle(buttonSelector, html);
};
