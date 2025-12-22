// ---
// RAFE GLOBAL EQUIPMENT - COMPLETE FIXED SCRIPT
//
console.log("Initializing Rafe Global Equipment Website...");

// ---
// 1. GLOBAL STATE
//
let currentLanguage = 'ar'; // Default to Arabic
let isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let lastClickTime = 0;

const equipmentDatabase = {
    1: { name: { en: "Bobcat Loaders", ar: "بوبكات لودر" }, category: "heavy" },
    2: { name: { en: "Scissor Lifts", ar: "منصات رفع مقصية" }, category: "access" },
    3: { name: { en: "Mobile Cranes", ar: "كرينات متنقلة" }, category: "heavy" },
    4: { name: { en: "Forklifts", ar: "رافعات شوكية" }, category: "material" },
    5: { name: { en: "Telescopic Forklifts", ar: "رافعات شوكية تلسكوبية" }, category: "material" },
    6: { name: { en: "Man Lifts", ar: "رافعات أشخاص" }, category: "access" },
    7: { name: { en: "Light Towers", ar: "أبراج إضاءة" }, category: "lighting" },
    8: { name: { en: "Industrial Forklifts", ar: "رافعات شوكية صناعية" }, category: "heavy" },
    9: { name: { en: "Boom Lifts", ar: "رافعات ذراعية" }, category: "access" },
    10: { name: { en: "Backhoe Loader (JCB)", ar: "حفار خلفي (JCB)" }, category: "heavy" },
    11: { name: { en: "Telehandler", ar: "تيلي هاندلر" }, category: "heavy" }
};

// ---
// 2. INITIALIZATION
// ---
function initializeApp() {
    console.log("Starting application initialization...");
    
    try {
        // Setup all features
        setupLanguageSwitcher();
        setupMobileMenu();
        setupRentalButtons();
        setupRentalModal();
        setupScrollAndNavigation();
        setupBackToTop();
        setupPageSpecificFeatures();
        setupWhatsAppButton();
        
        // Initialize with current language
        updatePageLanguage();
        
        console.log("✅ Application initialized successfully!");
    } catch (error) {
        console.error("❌ Error during initialization:", error);
    }
}

// ---
// 3. LANGUAGE SWITCHER - FIXED
// ---
function setupLanguageSwitcher() {
    console.log("🔧 Setting up language switcher...");
    
    const langButtons = document.querySelectorAll('.lang-btn');
    
    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('rafe_language', lang);
        
        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update body class for RTL specific styles
        document.body.classList.toggle('rtl-layout', lang === 'ar');
        
        // Update active button
        langButtons.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            btn.classList.toggle('active', btnLang === lang);
        });
        
        // Update all translatable elements
        updatePageLanguage();
        
        // Update WhatsApp button text
        updateWhatsAppButtonText();
        
        console.log(`✅ Language changed to: ${lang}`);
    }
    
    // Setup click handlers
    langButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const lang = this.getAttribute('data-lang');
            if (lang) setLanguage(lang);
        });
    });
    
    // Load saved language or use browser default
    const savedLang = localStorage.getItem('rafe_language');
    const browserLang = navigator.language.split('-')[0];
    
    if (savedLang) {
        setLanguage(savedLang);
    } else if (browserLang === 'ar') {
        setLanguage('ar');
    } else {
        setLanguage('en');
    }
}

// Update all translatable elements on page
function updatePageLanguage() {
    document.querySelectorAll('[data-en], [data-ar]').forEach(element => {
        if (element.hasAttribute('data-en') && element.hasAttribute('data-ar')) {
            const text = currentLanguage === 'ar' ? 
                element.getAttribute('data-ar') : 
                element.getAttribute('data-en');
            
            if (text && text.trim() !== '') {
                const tagName = element.tagName;
                
                if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else if (tagName === 'IMG') {
                    element.alt = text;
                } else if (element.classList.contains('btn-title') || 
                           element.classList.contains('btn-subtitle') || 
                           element.classList.contains('spec-label')) {
                    element.textContent = text;
                } else if (element.children.length === 0) {
                    element.textContent = text;
                } else {
                    // Check for nested translatable elements
                    const hasNestedTranslatable = Array.from(element.children).some(child => 
                        child.hasAttribute('data-en') || child.hasAttribute('data-ar')
                    );
                    if (!hasNestedTranslatable) {
                        element.textContent = text;
                    }
                }
            }
        }
    });
}

// ---
// 4. MOBILE MENU - FIXED
// ---
function setupMobileMenu() {
    console.log("🔧 Setting up mobile menu...");
    
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navMenu) {
        console.error("❌ Mobile menu elements not found!");
        return;
    }
    
    // Toggle menu function
    function toggleMenu() {
        const isOpening = !navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpening);
        
        if (isOpening) {
            document.body.classList.add('menu-open');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
        }
    }
    
    // Close menu function
    function closeMenu() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    }
    
    // Toggle menu when hamburger is clicked
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    });
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            window.innerWidth <= 992 &&
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ---
// 5. RENTAL BUTTONS - CRITICAL FIX
// ---
function setupRentalButtons() {
    console.log("🔧 Setting up rental buttons...");
    
    // Use event delegation for better performance
    document.addEventListener('click', function(e) {
        // Check if clicked element or parent is a rent button
        let rentButton = e.target;
        
        // Traverse up to find rent button
        while (rentButton && rentButton !== document) {
            if (rentButton.classList && 
                (rentButton.classList.contains('rent-now') || 
                 (rentButton.classList.contains('card-button') && 
                  rentButton.hasAttribute('data-equipment-id')))) {
                break;
            }
            rentButton = rentButton.parentElement;
        }
        
        // If we found a rent button
        if (rentButton && rentButton !== document && rentButton.classList.contains('rent-now')) {
            e.preventDefault();
            e.stopPropagation();
            
            const equipmentId = rentButton.getAttribute('data-equipment-id');
            console.log(`🛠️ Rent button clicked: ${equipmentId}`);
            
            if (!equipmentId) {
                console.error("❌ No equipment ID found on button:", rentButton);
                alert(currentLanguage === 'ar' ? 
                    "يرجى الاتصال بنا مباشرة لهذه المعدات" : 
                    "Please contact us directly for this equipment");
                return;
            }
            
            // Debounce click
            const now = Date.now();
            if (now - lastClickTime < 300) return;
            lastClickTime = now;
            
            // Visual feedback
            const originalTransform = rentButton.style.transform;
            rentButton.style.transform = 'scale(0.95)';
            rentButton.style.transition = 'transform 0.2s';
            
            setTimeout(() => {
                rentButton.style.transform = originalTransform;
            }, 200);
            
            // Open modal
            openRentalModal(equipmentId);
        }
    });
    
    console.log("✅ Rental buttons setup complete");
}

// ---
// 6. RENTAL MODAL - FIXED
// ---
function setupRentalModal() {
    console.log("🔧 Setting up rental modal...");
    
    const modal = document.getElementById('rentalModal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    if (!modal) {
        console.log("ℹ️ Rental modal not found on this page - continuing without modal");
        return;
    }
    
    // Open modal function - NOW GLOBAL
    window.openRentalModal = function(equipmentId) {
        console.log(`🛠️ Opening modal for equipment ID: ${equipmentId}`);
        
        const equipment = equipmentDatabase[equipmentId];
        if (!equipment) {
            console.error(`❌ Equipment ID ${equipmentId} not found`);
            alert(currentLanguage === 'ar' ? 
                "لم يتم العثور على المعدات. يرجى المحاولة مرة أخرى" : 
                "Equipment not found. Please try again.");
            return;
        }
        
        // Get equipment name in current language
        const equipmentName = equipment.name[currentLanguage] || equipment.name.en;
        
        // Update modal content
        const nameElement = document.getElementById('rentalEquipmentName');
        if (nameElement) {
            nameElement.textContent = equipmentName;
            nameElement.setAttribute('data-equipment-id', equipmentId);
        }
        
        // Update WhatsApp link with pre-filled message
        const whatsappBtn = modal.querySelector('.whatsapp-main');
        if (whatsappBtn) {
            const message = currentLanguage === 'ar' ? 
                `مرحبًا رفع العالمية، أنا مهتم بتأجير: ${equipmentName} (رقم المعدة: ${equipmentId})` : 
                `Hello Rafe Global, I'm interested in renting: ${equipmentName} (Equipment ID: ${equipmentId})`;
            
            const phone = '966534672153';
            whatsappBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        }
        
        // Update Email link
        const emailBtn = modal.querySelector('.email-btn');
        if (emailBtn) {
            const subject = currentLanguage === 'ar' ? 
                `استفسار تأجير: ${equipmentName}` : 
                `Rental Inquiry: ${equipmentName}`;
            
            const body = currentLanguage === 'ar' ? 
                `أنا مهتم بتأجير ${equipmentName} (رقم المعدة: ${equipmentId}). يرجى إرسال المزيد من المعلومات.\n\nتفاصيل المشروع:\n- الموقع:\n- المدة:\n- المتطلبات الخاصة:` : 
                `I'm interested in renting ${equipmentName} (Equipment ID: ${equipmentId}). Please send me more information.\n\nProject Details:\n- Location:\n- Duration:\n- Special Requirements:`;
            
            emailBtn.href = `mailto:globalrafe@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
        
        // Show modal with animation
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        
        console.log(`✅ Modal opened for: ${equipmentName}`);
    };
    
    // Close modal function - NOW GLOBAL
    window.closeModal = function() {
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
        }
        
        // Remove focus trap
        const activeElement = document.activeElement;
        if (activeElement && modal.contains(activeElement)) {
            activeElement.blur();
        }
        
        console.log("✅ Modal closed");
    };
    
    // Setup close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.closeModal();
        });
    });
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            window.closeModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            window.closeModal();
        }
    });
    
    console.log("✅ Rental modal setup complete");
}

// ---
// 7. SCROLL & NAVIGATION
// ---
function setupScrollAndNavigation() {
    console.log("🔧 Setting up scroll and navigation...");
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement && targetId !== 'home') {
                e.preventDefault();
                
                // Close mobile menu if open
                const navMenu = document.getElementById('navMenu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const menuToggle = document.getElementById('menuToggle');
                    if (menuToggle) menuToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    document.body.style.overflow = '';
                }
                
                // Scroll to element
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, href);
            }
        });
    });
    
    // Explore Equipment button
    const exploreBtn = document.getElementById('exploreEquipment');
    const equipmentSection = document.getElementById('equipment');
    
    if (exploreBtn && equipmentSection) {
        exploreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            equipmentSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // View Details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function(e) {
            const onclick = this.getAttribute('onclick');
            if (onclick && onclick.includes('window.location.href')) {
                const match = onclick.match(/window\.location\.href=['"]([^"']+)['"]/);
                if (match && match[1]) {
                    e.preventDefault();
                    // Add loading state
                    this.classList.add('loading');
                    this.disabled = true;
                    setTimeout(() => {
                        window.location.href = match[1];
                    }, 100);
                }
            }
        });
    });
    
    // Update active nav link on scroll
    if (document.querySelector('a[href^="#"]')) {
        window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
    }
    
    console.log("✅ Scroll and navigation setup complete");
}

// ---
// 8. BACK TO TOP
// ---
function setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', currentLanguage === 'ar' ? 'العودة للأعلى' : 'Back to top');
    document.body.appendChild(backToTop);
    
    // RTL positioning
    if (document.documentElement.dir === 'rtl') {
        backToTop.style.right = 'auto';
        backToTop.style.left = '30px';
    }
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// ---
// 9. PAGE SPECIFIC FEATURES
// ---
function setupPageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Highlight current page in navigation
    if (currentPage !== 'index.html' && currentPage !== '') {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(currentPage)) {
                link.classList.add('active');
            }
        });
    }
}

// ---
// 10. WHATSAPP FLOATING BUTTON
// ---
function setupWhatsAppButton() {
    console.log("🔧 Setting up WhatsApp floating button...");
    
    // Create WhatsApp button if it doesn't exist
    if (!document.querySelector('.whatsapp-container')) {
        const whatsappHTML = `
        <div class="whatsapp-container">
            <a href="https://wa.me/+966534672153"
               class="whatsapp-float"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="WhatsApp"
               title="${currentLanguage === 'ar' ? 'تواصل معنا على واتساب' : 'Chat with us on WhatsApp'}">
                <div class="whatsapp-icon-wrapper">
                    <svg class="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.032,12.366c-0.344,0.196-0.693,0.406-0.693,0.815c0,0.406,0.554,0.815,0.901,1.08c0.348,0.266,0.826,0.406,1.297,0.406c0.48,0,0.934-0.154,1.297-0.406c0.365-0.25,0.901-0.683,0.901-1.08c0-0.409-0.357-0.619-0.693-0.815c-0.339-0.196-0.826-0.406-1.505-0.406c12.858,11.96,12.371,12.17,12.032,12.366z M17.606,6.384c-2.199-2.199-5.297-3.231-8.28-2.704c6.242,4.161,4.264,5.664,3.054,7.734c1.845,9.804,1.5,12.246,2.083,14.5c0.009,0.035,0.021,0.069,0.035,0.1021-1.399,5.11415.151-1.366c0.035,0.015,0.071,0.027,0.107,0.037c2.258,0.583,4.704,0.238,6.774-0.971c2.07-1.21,3.573-3.188,4.054-5.272c20.337,11.681,19.805,8.583,17.606,6.384z M16.656,15.358c-1.836,1.074-4.006,1.441-6.083,1.041-0.108-0.0241-0.104,0.0271-3.746,0.99210.998-3.64710.026-0.0951-0.022-0.102c-0.402-2.077-0.034-4.247,1.04-6.083c1.074-1.836,2.876-2.964,4.844-3.118c1.967-0.154,3.914,0.564,5.277,1.927c1.363,1.363,2.081,3.31,1.927,5.277C19.619,12.482,18.492,14.284,16.656,15.358z"/>
                    </svg>
                    <div class="whatsapp-pulse"></div>
                </div>
                <div class="whatsapp-tooltip">
                    <span data-en="Chat with us on WhatsApp" data-ar="تواصل معنا على واتساب">${currentLanguage === 'ar' ? 'تواصل معنا على واتساب' : 'Chat with us on WhatsApp'}</span>
                    <span class="whatsapp-number">+966 53 467 2153</span>
                </div>
            </a>
        </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', whatsappHTML);
    }
    
    // Add click animation
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            const iconWrapper = this.querySelector('.whatsapp-icon-wrapper');
            if (iconWrapper) {
                iconWrapper.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    iconWrapper.style.transform = '';
                }, 150);
            }
            console.log("📱 WhatsApp button clicked");
        });
    }
    
    console.log("✅ WhatsApp floating button setup complete");
}

// ---
// 11. WHATSAPP BUTTON TEXT UPDATER
// ---
function updateWhatsAppButtonText() {
    const tooltip = document.querySelector('.whatsapp-tooltip span');
    if (tooltip && tooltip.hasAttribute('data-en') && tooltip.hasAttribute('data-ar')) {
        const text = currentLanguage === 'ar' ? 
            tooltip.getAttribute('data-ar') : 
            tooltip.getAttribute('data-en');
        if (text) tooltip.textContent = text;
    }
    
    // Update WhatsApp float title
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.title = currentLanguage === 'ar' ? 
            'تواصل معنا على واتساب' : 
            'Chat with us on WhatsApp';
    }
}

// ---
// 12. HELPER FUNCTIONS
// ---
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(`#${current}`)) {
            link.classList.add('active');
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ---
// 13. ERROR HANDLING FOR IMAGES
// ---
function setupImageErrorHandling() {
    // Handle broken images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            console.error(`❌ Image failed to load: ${this.src}`);
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="%236b7280"%3EImage not available%3C/text%3E%3C/svg%3E';
            this.alt = currentLanguage === 'ar' ? 'الصورة غير متوفرة' : 'Image not available';
        });
    });
}

// ---
// 14. SEO FUNCTIONS
// ---
function initializeSEO() {
    console.log("🔧 Initializing SEO features...");
    
    // Set Arabic as default language for SEO
    if (!localStorage.getItem('rafe_language')) {
        localStorage.setItem('rafe_language', 'ar');
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
    }
    
    // Add structured data dynamically
    addDynamicStructuredData();
    
    // Handle language for search engines
    handleSearchEngineLanguage();
    
    // Track SEO events
    trackSEOEvents();
    
    // Setup image error handling
    setupImageErrorHandling();
}

function addDynamicStructuredData() {
    // Add FAQ schema if exists
    const faqElements = document.querySelectorAll('.faq-item');
    if (faqElements.length > 0) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": []
        };
        
        faqElements.forEach((faq, index) => {
            const question = faq.querySelector('h4')?.textContent || '';
            const answer = faq.querySelector('p')?.textContent || '';
            
            if (question && answer) {
                faqSchema.mainEntity.push({
                    "@type": "Question",
                    "name": question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": answer
                    }
                });
            }
        });
        
        if (faqSchema.mainEntity.length > 0) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(faqSchema);
            document.head.appendChild(script);
        }
    }
}

function handleSearchEngineLanguage() {
    const currentLang = localStorage.getItem('rafe_language') || 'ar';
    
    // Update canonical URL with language parameter for search engines
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
        const url = new URL(canonical.href);
        url.searchParams.set('lang', currentLang);
        canonical.href = url.toString();
    }
}

function trackSEOEvents() {
    // Track equipment views
    document.addEventListener('click', function(e) {
        const equipmentCard = e.target.closest('.equipment-card');
        if (equipmentCard) {
            const equipmentId = equipmentCard.getAttribute('data-equipment-id');
            const equipmentName = equipmentCard.querySelector('.card-title')?.textContent || '';
            
            console.log('📊 SEO Event: Equipment viewed', {
                id: equipmentId,
                name: equipmentName,
                url: window.location.href
            });
        }
    });
}

// ---
// 15. ENHANCED RENT BUTTON FIX
// ---
function enhanceRentButtons() {
    console.log("🔧 Enhancing rent buttons...");
    
    // Direct event listeners for rent buttons (fallback)
    document.querySelectorAll('.rent-now').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const equipmentId = this.getAttribute('data-equipment-id');
            if (equipmentId) {
                console.log(`🛠️ Direct rent button click: ${equipmentId}`);
                openRentalModal(equipmentId);
            }
        });
    });
}

// ---
// 16. START THE APPLICATION
// ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
        initializeSEO();
        enhanceRentButtons(); // Additional fix for rent buttons
    });
} else {
    initializeApp();
    initializeSEO();
    enhanceRentButtons(); // Additional fix for rent buttons
}

console.log("✅ All scripts loaded successfully!");