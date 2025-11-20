// 📥 IMPORTS ORDERED BY UTILITY
import { signature } from '../utils/signature.js';
import { getSystemTheme, applyTheme } from './themeDark.js';

// 🧠 APP INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    applyTheme(document.documentElement, localStorage.getItem('theme') || getSystemTheme());
    signature('#signature-year');
});
