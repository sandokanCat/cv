export const themeDark = (buttonSelector = '#theme-dark-btn', htmlSelector = document.documentElement) => {
    const themeDarkToggle = document.querySelector(buttonSelector); // TOGGLE BUTTON
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)'); // SYSTEM PREFERENCE

    function updateToggleIcon(isDark) {
        themeDarkToggle.textContent = isDark ? '☀️' : '🌙'; // SUN: LIGHT, MOON: DARK
    }

    function setthemeDark(isDark) {
        htmlSelector.setAttribute('data-theme', isDark ? 'dark' : 'light'); // SET DATA-THEME
        localStorage.setItem('theme', isDark ? 'dark' : 'light'); // SAVE PREFERENCE
        updateToggleIcon(isDark); // UPDATE ICON

        // FORCE SVG RELOAD
        const svgContainer = document.getElementById('change-color');
        if (svgContainer) {
            svgContainer.style.display = 'none';
            svgContainer.offsetHeight; // TRIGGER REFLOW
            svgContainer.style.display = '';
        }
    }

    themeDarkToggle.addEventListener('click', () => {
        const currentTheme = htmlSelector.getAttribute('data-theme');
        setthemeDark(currentTheme !== 'dark'); // TOGGLE THEME
    });

    const savedTheme = localStorage.getItem('theme'); // GET SAVED THEME
    const systemPrefersDark = prefersDarkScheme.matches; // SYSTEM THEME PREFERENCE

    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light'); // SELECT THEME

    setthemeDark(initialTheme === 'dark'); // APPLY INITIAL THEME
}
