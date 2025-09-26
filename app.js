
// Photography Portfolio JavaScript
// Modern, clean implementation with ES6+ features

class PortfolioApp {
    constructor() {
        this.burger = document.querySelector('.burger');
        this.nav = document.querySelector('nav');
        this.navLinks = document.querySelectorAll('.nav-links li');
        this.photos = document.querySelectorAll('.photo-container img');
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupPhotoLoading();
        this.setupKeyboardNavigation();
        this.setupAccessibility();
    }

    // Navigation functionality
    setupNavigation() {
        if (this.burger) {
            this.burger.addEventListener('click', () => this.toggleNav());
        }

        // Close nav when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeNav());
        });

        // Close nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && !this.burger.contains(e.target)) {
                this.closeNav();
            }
        });

        // Close nav on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeNav();
            }
        });
    }

    toggleNav() {
        this.nav.classList.toggle('nav-active');
        this.burger.classList.toggle('toggle');
        
        // Animate nav links
        this.navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Prevent body scroll when nav is open
        document.body.style.overflow = this.nav.classList.contains('nav-active') ? 'hidden' : '';
    }

    closeNav() {
        this.nav.classList.remove('nav-active');
        this.burger.classList.remove('toggle');
        this.navLinks.forEach(link => {
            link.style.animation = '';
        });
        document.body.style.overflow = '';
    }

    // Photo loading and optimization
    setupPhotoLoading() {
        // Intersection Observer for lazy loading optimization
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observe all images except the first one (eager loading)
        this.photos.forEach((img, index) => {
            if (index === 0) {
                this.loadImage(img);
            } else {
                imageObserver.observe(img);
            }
        });
    }

    loadImage(img) {
        // Add loading class for smooth transition
        img.classList.add('loading');
        
        img.addEventListener('load', () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
        });

        img.addEventListener('error', () => {
            img.classList.remove('loading');
            img.classList.add('error');
            console.warn(`Failed to load image: ${img.src}`);
        });

        // If image is already cached
        if (img.complete) {
            img.classList.add('loaded');
        }
    }

    // Keyboard navigation for accessibility
    setupKeyboardNavigation() {
        let currentPhotoIndex = 0;

        document.addEventListener('keydown', (e) => {
            // Only handle keyboard navigation when not in nav
            if (this.nav.classList.contains('nav-active')) return;

            switch(e.key) {
                case 'ArrowDown':
                case 'j':
                    e.preventDefault();
                    currentPhotoIndex = Math.min(currentPhotoIndex + 1, this.photos.length - 1);
                    this.focusPhoto(currentPhotoIndex);
                    break;
                case 'ArrowUp':
                case 'k':
                    e.preventDefault();
                    currentPhotoIndex = Math.max(currentPhotoIndex - 1, 0);
                    this.focusPhoto(currentPhotoIndex);
                    break;
                case 'Home':
                    e.preventDefault();
                    currentPhotoIndex = 0;
                    this.focusPhoto(currentPhotoIndex);
                    break;
                case 'End':
                    e.preventDefault();
                    currentPhotoIndex = this.photos.length - 1;
                    this.focusPhoto(currentPhotoIndex);
                    break;
            }
        });
    }

    focusPhoto(index) {
        if (this.photos[index]) {
            this.photos[index].focus();
            this.photos[index].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // Accessibility improvements
    setupAccessibility() {
        // Add ARIA labels and roles
        this.photos.forEach((img, index) => {
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'img');
            img.setAttribute('aria-label', `Photography by Conall Fahey, image ${index + 1} of ${this.photos.length}`);
        });

        // Add keyboard interaction for burger menu
        if (this.burger) {
            this.burger.setAttribute('tabindex', '0');
            this.burger.setAttribute('role', 'button');
            this.burger.setAttribute('aria-label', 'Toggle navigation menu');
            this.burger.setAttribute('aria-expanded', 'false');

            this.burger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleNav();
                    this.burger.setAttribute('aria-expanded', 
                        this.nav.classList.contains('nav-active').toString()
                    );
                }
            });
        }
    }
}

// CSS for nav link animation (injected via JS to keep CSS clean)
const style = document.createElement('style');
style.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0px);
        }
    }
    
    .photo-container img.loading {
        opacity: 0.5;
    }
    
    .photo-container img.loaded {
        opacity: 1;
    }
    
    .photo-container img.error {
        opacity: 0.3;
        filter: grayscale(100%);
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Handle form submission (if contact form exists)
function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Basic form validation
    if (!data.email || !data.message) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset form
    event.target.reset();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}
