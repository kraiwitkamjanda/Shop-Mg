class App {
    constructor() {
        this.currentLang = localStorage.getItem('app_lang') || 'en';
        this.translations = {};
        
        this.init();
    }

    async init() {
        this.setupTheme();
        await this.loadTranslations(this.currentLang);
        this.setupEventListeners();
        
        // Set the initial value of the select dropdown
        document.getElementById('lang-select').value = this.currentLang;
    }

    // --- i18n Logic ---
    async loadTranslations(lang) {
        try {
            const response = await fetch(`/locales/${lang}.json`);
            this.translations = await response.json();
            this.applyTranslations();
            
            // Save preference
            localStorage.setItem('app_lang', lang);
            this.currentLang = lang;
            document.documentElement.lang = lang;
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (this.translations[key]) {
                if (el.tagName.toLowerCase() === 'input' && el.hasAttribute('placeholder')) {
                    el.placeholder = this.translations[key];
                } else {
                    el.textContent = this.translations[key];
                }
            }
        });
    }

    // --- Theme Logic ---
    setupTheme() {
        const themeToggleBtn = document.getElementById('theme-toggle');
        
        // Check local storage or system preference
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            if (document.documentElement.classList.contains('dark')) {
                localStorage.setItem('color-theme', 'dark');
            } else {
                localStorage.setItem('color-theme', 'light');
            }
        });
    }

    // --- Event Listeners ---
    setupEventListeners() {
        const langSelect = document.getElementById('lang-select');
        langSelect.addEventListener('change', (e) => {
            this.loadTranslations(e.target.value);
        });
    }
}

// Initialize App on load
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});