// Gallery Script with WhatsApp Support

document.addEventListener('DOMContentLoaded', function() {
    // Gallery Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Gallery Modal Functionality
    const galleryModal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const closeBtn = galleryModal.querySelector('.modal-close');
    
    let currentIndex = 0;
    const galleryImages = [];
    
    // Collect all gallery items
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-info h3');
        const description = item.querySelector('.gallery-info p');
        
        galleryImages.push({
            src: img.src,
            title: title ? title.textContent : '',
            description: description ? description.textContent : '',
            arabicTitle: title ? title.getAttribute('data-ar') : '',
            arabicDescription: description ? description.getAttribute('data-ar') : ''
        });
        
        item.addEventListener('click', function() {
            currentIndex = index;
            updateModal();
            galleryModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Navigation
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateModal();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentIndex < galleryImages.length - 1) {
            currentIndex++;
            updateModal();
        }
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        galleryModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close modal on outside click
    galleryModal.addEventListener('click', function(e) {
        if (e.target === this) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (galleryModal.style.display === 'block') {
            if (e.key === 'Escape') {
                galleryModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        }
    });
    
    function updateModal() {
        const currentImage = galleryImages[currentIndex];
        const currentLanguage = document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';
        
        modalImage.src = currentImage.src;
        
        if (currentLanguage === 'ar') {
            modalTitle.textContent = currentImage.arabicTitle || currentImage.title;
            modalDescription.textContent = currentImage.arabicDescription || currentImage.description;
        } else {
            modalTitle.textContent = currentImage.title;
            modalDescription.textContent = currentImage.description;
        }
    }

    // Load More Button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let loadedItems = 8;
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more images
            this.textContent = this.getAttribute('data-ar') ? 
                (document.documentElement.getAttribute('lang') === 'ar' ? 'جاري التحميل...' : 'Loading...') : 
                'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                loadedItems += 4;
                
                // Show more items
                galleryItems.forEach((item, index) => {
                    if (index < loadedItems) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    }
                });
                
                // Update button text
                const currentLanguage = document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';
                if (currentLanguage === 'ar') {
                    this.textContent = loadedItems >= galleryItems.length ? 
                        'تم تحميل جميع الصور' : 
                        'تحميل المزيد من الصور';
                } else {
                    this.textContent = loadedItems >= galleryItems.length ? 
                        'All Photos Loaded' : 
                        'Load More Photos';
                }
                
                this.disabled = loadedItems >= galleryItems.length;
                
                // Hide button if all items are loaded
                if (loadedItems >= galleryItems.length) {
                    this.style.opacity = '0.5';
                    this.style.cursor = 'not-allowed';
                }
            }, 1000);
        });
    }
    
    // Video Controls - pause all when one plays
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('play', function() {
            // Pause all other videos
            videos.forEach(otherVideo => {
                if (otherVideo !== video) {
                    otherVideo.pause();
                }
            });
        });
    });
    
    // Image error handling
    const images = document.querySelectorAll('.gallery-image img');
    const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="%236b7280"%3EImage not available%3C/text%3E%3C/svg%3E';
    
    images.forEach(img => {
        img.onerror = function() {
            console.log('Gallery image failed to load:', this.src);
            this.src = fallbackImage;
            this.style.objectFit = 'contain';
            this.style.padding = '20px';
            this.style.backgroundColor = '#f3f4f6';
        };
    });
    
    console.log('Gallery script loaded successfully');
})
// Add this to your existing script.js file, at the end before the closing brace

// WhatsApp Button Language Updates
function updateWhatsAppButtons() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-button, .whatsapp-service');
    const currentLanguage = document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';
    
    whatsappButtons.forEach(button => {
        const text = button.getAttribute(`data-${currentLanguage}`) || button.textContent;
        button.textContent = text;
        
        // Add WhatsApp icon if not present
        if (!button.querySelector('.whatsapp-icon')) {
            const icon = document.createElement('span');
            icon.className = 'whatsapp-icon';
            icon.style.cssText = `
                display: inline-block;
                width: 20px;
                height: 20px;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M17.507 14.307l-.009.075c-.266-1.118-1.445-1.978-2.553-1.734l-5.578 1.35a4.987 4.987 0 0 0-2.745 1.574A8.28 8.28 0 0 1 4.61 16.33c-1.235.428-2.023 1.66-1.822 2.94l.112.673c.122.735.654 1.332 1.383 1.527 2.528.678 5.318.94 8.11.783 6.803-.384 12.287-5.822 12.6-12.624.093-2.02-.577-4.03-1.89-5.654-1.312-1.623-3.192-2.77-5.3-3.175-1.548-.293-3.14-.173-4.627.35-.99.35-1.87.92-2.57 1.66-1.1 1.16-1.82 2.62-2.08 4.19-.18 1.08-.1 2.19.23 3.24.33 1.05.93 2.01 1.75 2.79.52.5 1.12.9 1.77 1.19.65.29 1.35.47 2.06.52.71.05 1.42-.02 2.11-.2.69-.18 1.34-.48 1.92-.88z'/%3E%3C/svg%3E");
                background-size: contain;
                background-repeat: no-repeat;
                margin-right: 8px;
                vertical-align: middle;
            `;
            
            if (currentLanguage === 'ar') {
                icon.style.marginRight = '0';
                icon.style.marginLeft = '8px';
            }
            
            button.insertBefore(icon, button.firstChild);
        }
    });
}

// Update WhatsApp buttons when language changes
document.addEventListener('languageChanged', function() {
    updateWhatsAppButtons();
});

// Initialize WhatsApp buttons on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateWhatsAppButtons, 100);
});

// Image error handling for services page
const serviceImages = document.querySelectorAll('.equipment-image img');
const serviceFallback = './assets/services/fallback.png';

serviceImages.forEach(img => {
    img.onerror = function() {
        console.log('Service image failed to load:', this.src);
        this.src = serviceFallback;
        this.alt = 'Service Image';
    };
});