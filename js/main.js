// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
        this.updateThemeUI();

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.currentTheme === 'system') {
                this.applySystemTheme();
            }
        });
    }

    setupEventListeners() {
        // Desktop theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        const themeDropdown = document.getElementById('theme-dropdown');

        themeToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('hidden');
            // Close mobile dropdown if open
            const mobileThemeDropdown = document.getElementById('mobile-theme-dropdown');
            mobileThemeDropdown?.classList.add('hidden');
        });

        // Mobile theme toggle - show dropdown
        const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
        const mobileThemeDropdown = document.getElementById('mobile-theme-dropdown');

        mobileThemeToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileThemeDropdown.classList.toggle('hidden');
            // Close desktop dropdown if open
            themeDropdown?.classList.add('hidden');
        });

        // Theme selection buttons
        document.querySelectorAll('[data-theme]').forEach(button => {
            button.addEventListener('click', (e) => {
                const theme = e.currentTarget.dataset.theme;
                this.setTheme(theme);
                themeDropdown?.classList.add('hidden');
                mobileThemeDropdown?.classList.add('hidden');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            themeDropdown?.classList.add('hidden');
            mobileThemeDropdown?.classList.add('hidden');
        });
    }

    cycleTheme() {
        const themes = ['dark', 'light', 'system'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        this.setTheme(nextTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
        this.updateThemeUI();
    }

    applyTheme(theme) {
        document.documentElement.removeAttribute('data-theme');

        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else if (theme === 'system') {
            this.applySystemTheme();
        } else {
            // Dark theme is default
        }
    }

    applySystemTheme() {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    updateThemeUI() {
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');
        const mobileThemeIcon = document.getElementById('mobile-theme-icon');
        const mobileThemeText = document.getElementById('mobile-theme-text');

        const themeConfig = {
            dark: { icon: 'fa-moon', text: 'dark' },
            light: { icon: 'fa-sun', text: 'light' },
            system: { icon: 'fa-desktop', text: 'system' }
        };

        // Ensure currentTheme is valid, fallback to 'dark' if not
        if (!themeConfig[this.currentTheme]) {
            this.currentTheme = 'dark';
        }

        const config = themeConfig[this.currentTheme];

        if (themeIcon && themeText && config) {
            themeIcon.className = `fas ${config.icon} text-sm`;
            themeText.textContent = config.text;
        }

        if (mobileThemeIcon && config) {
            mobileThemeIcon.className = `fas ${config.icon} text-sm`;
        }

        if (mobileThemeText && config) {
            mobileThemeText.textContent = config.text;
        }

        // Update active state in dropdown
        document.querySelectorAll('[data-theme]').forEach(button => {
            button.classList.toggle('text-dev-accent', button.dataset.theme === this.currentTheme);
            button.classList.toggle('bg-dev-border', button.dataset.theme === this.currentTheme);
        });

        // Refresh background animations when theme changes
        if (typeof createStars === 'function') {
            createStars();
        }
        if (typeof createSnowflakes === 'function') {
            createSnowflakes();
        }
    }
}

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    const themeManager = new ThemeManager();

    // Background Animation Functions
    function createStars() {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) {
            console.log('Stars container not found');
            return;
        }

        const numberOfStars = 80;

        // Clear existing stars
        starsContainer.innerHTML = '';

        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (Math.random() * 2 + 2) + 's';
            starsContainer.appendChild(star);
        }

        console.log(`Created ${numberOfStars} stars`);
    }

    let snowflakeInterval = null;

    function createSnowflakes() {
        const snowflakesContainer = document.getElementById('snowflakes');
        if (!snowflakesContainer) {
            console.log('Snowflakes container not found');
            return;
        }

        const snowflakeSymbols = ['❄', '❅', '❆', '•', '◦'];

        // Clear existing snowflakes and interval
        snowflakesContainer.innerHTML = '';
        if (snowflakeInterval) {
            clearInterval(snowflakeInterval);
        }

        function addSnowflake() {
            if (!snowflakesContainer) return;

            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.animationDuration = (Math.random() * 6 + 8) + 's'; // Slower: 8-14 seconds
            snowflake.style.opacity = Math.random() * 0.4 + 0.8; // More visible: 0.8-1.2 opacity
            snowflake.style.fontSize = (Math.random() * 12 + 16) + 'px'; // Larger: 16-28px

            snowflakesContainer.appendChild(snowflake);

            // Remove snowflake after animation completes
            setTimeout(() => {
                if (snowflake && snowflake.parentNode) {
                    snowflake.parentNode.removeChild(snowflake);
                }
            }, 15000); // Longer timeout to match slower animation
        }

        // Create initial snowflakes
        for (let i = 0; i < 15; i++) {
            setTimeout(() => addSnowflake(), Math.random() * 2000);
        }

        // Continue adding snowflakes
        snowflakeInterval = setInterval(addSnowflake, 1000); // Slower interval: every 1000ms

        console.log('Snowflakes animation initialized');
    }

    // Initialize background animations with a small delay to ensure DOM is ready
    console.log('Initializing background animations...');
    setTimeout(() => {
        createStars();
        createSnowflakes();
    }, 100);

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            // Close mobile menu if open
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Add scroll effect to navigation
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (nav) {
            if (window.scrollY > 100) {
                nav.classList.add('bg-dev-bg/95');
                nav.classList.remove('bg-dev-bg/90');
            } else {
                nav.classList.add('bg-dev-bg/90');
                nav.classList.remove('bg-dev-bg/95');
            }
        }
    });
});