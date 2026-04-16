// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navLinks.classList.toggle('glass-panel');
        });
    }

    // Set active link in nav
    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        if (itemHref === currentPath || (currentPath === '' && itemHref === 'index.html')) {
            item.style.color = 'var(--accent-color)';
        }
    });

    // Lightbox Logic for Projects Page
    const projectCards = document.querySelectorAll('.project-card[data-images]');
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        
        let currentImages = [];
        let currentIndex = 0;

        function showImage(index) {
            if (index >= currentImages.length) currentIndex = 0;
            else if (index < 0) currentIndex = currentImages.length - 1;
            else currentIndex = index;
            
            lightboxImg.src = currentImages[currentIndex];
        }

        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const imagesStr = card.getAttribute('data-images');
                if (imagesStr) {
                    try {
                        currentImages = JSON.parse(imagesStr);
                        if (currentImages.length > 0) {
                            currentIndex = 0;
                            showImage(currentIndex);
                            lightbox.style.display = 'block';
                        }
                    } catch (err) {
                        console.error("Invalid image array format");
                    }
                }
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        // Close when clicking outside image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent modal close
            showImage(currentIndex - 1);
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent modal close
            showImage(currentIndex + 1);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') lightbox.style.display = 'none';
                if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentIndex + 1);
            }
        });
        
        // Hide prev/next buttons if only 1 image
        const updateControls = () => {
            if(currentImages.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            }
        };
        
        // proxy showImage to also updateControls
        const originalShow = showImage;
        showImage = function(index) {
            originalShow(index);
            updateControls();
        }
    }
});
