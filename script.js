// Simple script for additional interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth loading effect for images
    const images = document.querySelectorAll('.photo');
    
    images.forEach((img, index) => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        // If image is already loaded (cached)
        if (img.complete) {
            img.classList.add('loaded');
        }
    });

    // Add keyboard navigation (optional enhancement)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowDown') {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
});