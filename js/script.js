// ============================================
// Rafe Global Equipment - COMPLETE WORKING SCRIPT
// ============================================

console.log("🚀 Initializing Rafe Global Equipment Website...");

// ============================================
// 1. GLOBAL STATE
// ============================================
let currentLanguage = 'en';
let isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let lastClickTime = 0;

const equipmentDatabase = {
    1: { name: { en: "Bobcat Loaders", ar: "لوادر بوبكات" }, category: "heavy" },
    2: { name: { en: "Scissor Lifts", ar: "رافعات مقصية" }, category: "access" },
    3: { name: { en: "Mobile Cranes", ar: "رافعات متنقلة" }, category: "heavy" },
    4: { name: { en: "Forklifts", ar: "رافعات شوكية" }, category: "material" },
    5: { name: { en: "Telescopic Forklifts", ar: "رافعات شوكية تلسكوبية" }, category: "material" },
    6: { name: { en: "Man Lifts", ar: "رافعات الأشخاص" }, category: "access" },
    7: { name: { en: "Light Towers", ar: "أبراج الإضاءة" }, category: "lighting" },
    8: { name: { en: "Industrial Forklifts", ar: "رافعات شوكية صناعية" }, category: "heavy" },
    9: { name: { en: "Boom Lifts", ar: "رافعات ذراعية" }, category: "access" },
    10: { name: { en: "Backhoe Loader (JCB)", ar: "حفار خلفي (JCB)" }, category: "heavy" },
    11: { name: { en: "Telehandler", ar: "تليهاندلر" }, category: "heavy" }
};

// ============================================
// 2. INITIALIZATION
// ============================================
function initializeApp() {
    console.log("🚀 Starting application initialization...");
    
    try {
        // Setup all features
        setupLanguageSwitcher();
        setupMobileMenu();
        setupRentalButtons();
        setupRentalModal();
        setupScrollAndNavigation();
        setupBackToTop();
        setupImageLazyLoading();
        setupPageSpecificFeatures();
        
        // Initialize with current language
        updatePageLanguage();
        
        console.log("✅ Application initialized successfully!");
        
    } catch (error) {
        console.error("❌ Error during initialization:", error);
    }
}

// ============================================
// 3. LANGUAGE SWITCHER
// ============================================
function setupLanguageSwitcher() {
    console.log("🌐 Setting up language switcher...");
    
    const langButtons = document.querySelectorAll('.lang-btn');
    
    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('rafe_language', lang);
        
        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update active button
        langButtons.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            btn.classList.toggle('active', btnLang === lang);
            
            // Update button text if needed
            if (btnLang === 'ar') {
                btn.textContent = lang === 'ar' ? 'EN' : 'AR';
            }
        });
        
        // Update all translatable elements
        updatePageLanguage();
        
        // Update modal content if open
        const modal = document.getElementById('rentalModal');
        if (modal && modal.classList.contains('active')) {
            const equipmentId = modal.querySelector('#rentalEquipmentName').getAttribute('data-equipment-id');
            if (equipmentId) {
                updateModalEquipmentName(equipmentId);
            }
        }
        
        console.log(`✅ Language changed to: ${lang}`);
    }
    
    // Update all translatable elements on page
    function updatePageLanguage() {
        document.querySelectorAll('[data-en], [data-ar]').forEach(element => {
            if (element.hasAttribute('data-en') && element.hasAttribute('data-ar')) {
                const text = currentLanguage === 'ar' ? 
                    element.getAttribute('data-ar') : 
                    element.getAttribute('data-en');
                
                if (text && text.trim() !== '') {
                    // Handle different element types
                    const tagName = element.tagName;
                    
                    if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
                        element.placeholder = text;
                    } else if (tagName === 'IMG') {
                        element.alt = text;
                    } else if (element.classList.contains('btn-title') || 
                               element.classList.contains('btn-subtitle') ||
                               element.classList.contains('spec-label') ||
                               element.classList.contains('logo-text') ||
                               element.classList.contains('logo-subtitle')) {
                        // Don't update these with textContent, they might have HTML
                        if (element.textContent !== text) {
                            element.textContent = text;
                        }
                    } else {
                        // Check if element has children that should be preserved
                        if (element.children.length === 0) {
                            element.textContent = text;
                        } else {
                            // Only update if there are no nested translatable elements
                            const hasNestedTranslatable = Array.from(element.children).some(child => 
                                child.hasAttribute('data-en') || child.hasAttribute('data-ar')
                            );
                            if (!hasNestedTranslatable) {
                                element.textContent = text;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update modal equipment name
    function updateModalEquipmentName(equipmentId) {
        const equipment = equipmentDatabase[equipmentId];
        if (equipment) {
            const nameElement = document.getElementById('rentalEquipmentName');
            if (nameElement) {
                const equipmentName = equipment.name[currentLanguage] || equipment.name.en;
                nameElement.textContent = equipmentName;
            }
        }
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
    
    console.log("✅ Language switcher setup complete");
}

// ============================================
// 4. MOBILE MENU
// ============================================
function setupMobileMenu() {
    console.log("📱 Setting up mobile menu...");
    
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
            // Prevent scrolling
            document.addEventListener('touchmove', preventScroll, { passive: false });
        } else {
            document.body.classList.remove('menu-open');
            document.body.style.overflow = '';
            document.removeEventListener('touchmove', preventScroll);
        }
        
        console.log(`Menu ${isOpening ? 'opened' : 'closed'}`);
    }
    
    function preventScroll(e) {
        if (navMenu.classList.contains('active')) {
            e.preventDefault();
        }
    }
    
    // Close menu function
    function closeMenu() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        document.removeEventListener('touchmove', preventScroll);
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
            // Only close if it's a hash link (same page navigation)
            const href = this.getAttribute('href');
            if (href && href.includes('#')) {
                e.preventDefault();
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    closeMenu();
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            } else {
                closeMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
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
    
    // Close menu on window resize (if resizing to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    console.log("✅ Mobile menu setup complete");
}

// ============================================
// 5. RENTAL BUTTONS - IMPROVED
// ============================================
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
                 (rentButton.classList.contains('card-button') && rentButton.getAttribute('data-equipment-id')))) {
                break;
            }
            rentButton = rentButton.parentElement;
        }
        
        // If we found a rent button
        if (rentButton && rentButton !== document) {
            e.preventDefault();
            e.stopPropagation();
            
            const equipmentId = rentButton.getAttribute('data-equipment-id');
            console.log(`🎯 Rent button clicked: ${equipmentId}`);
            
            if (!equipmentId) {
                console.error("❌ No equipment ID found on button:", rentButton);
                alert(currentLanguage === 'ar' ? 
                    "يرجى الاتصال بنا مباشرة لهذه المعدات" : 
                    "Please contact us directly for this equipment");
                return;
            }
            
            const now = Date.now();
            if (now - lastClickTime < 300) return; // Debounce
            
            lastClickTime = now;
            
            // Visual feedback
            const originalTransform = rentButton.style.transform;
            rentButton.style.transform = 'scale(0.95)';
            rentButton.style.transition = 'transform 0.2s';
            
            setTimeout(() => {
                rentButton.style.transform = originalTransform;
            }, 200);
            
            openRentalModal(equipmentId);
        }
    });
    
    // Add hover effects for desktop
    if (!isMobile) {
        document.addEventListener('mouseover', function(e) {
            const rentButton = e.target;
            if (rentButton.classList && rentButton.classList.contains('rent-now')) {
                rentButton.style.transform = 'translateY(-2px)';
                rentButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }
        });
        
        document.addEventListener('mouseout', function(e) {
            const rentButton = e.target;
            if (rentButton.classList && rentButton.classList.contains('rent-now')) {
                rentButton.style.transform = '';
                rentButton.style.boxShadow = '';
            }
        });
    }
    
    console.log("✅ Rental buttons setup complete");
}

// ============================================
// 6. RENTAL MODAL
// ============================================
function setupRentalModal() {
    console.log("💰 Setting up rental modal...");
    
    const modal = document.getElementById('rentalModal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    if (!modal) {
        console.error("❌ Rental modal not found!");
        return;
    }
    
    // Open modal function
    window.openRentalModal = function(equipmentId) {
        const equipment = equipmentDatabase[equipmentId];
        if (!equipment) {
            console.error(`❌ Equipment ID ${equipmentId} not found`);
            alert(currentLanguage === 'ar' ? 
                "لم يتم العثور على المعدات. يرجى المحاولة مرة أخرى." : 
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
                `مرحباً رفع العالمية، أنا مهتم بتأجير: ${equipmentName} (رقم المعدة: ${equipmentId})` :
                `Hello Rafe Global, I'm interested in renting: ${equipmentName} (Equipment ID: ${equipmentId})`;
            
            const phone = whatsappBtn.href.includes('502345678') ? '966534672153' : '966502345678';
            whatsappBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        }
        
        // Update Email link
        const emailBtn = modal.querySelector('.email-btn');
        if (emailBtn) {
            const subject = currentLanguage === 'ar' ? 
                `استفسار تأجير: ${equipmentName}` :
                `Rental Inquiry: ${equipmentName}`;
            
            const body = currentLanguage === 'ar' ?
                `أنا مهتم بتأجير ${equipmentName} (رقم المعدة: ${equipmentId}). يرجى إرسال المزيد من المعلومات لي.\n\nمعلومات المشروع:\n- الموقع:\n- المدة:\n- أي متطلبات خاصة:` :
                `I'm interested in renting ${equipmentName} (Equipment ID: ${equipmentId}). Please send me more information.\n\nProject Details:\n- Location:\n- Duration:\n- Special Requirements:`;
            
            emailBtn.href = `mailto:${emailBtn.href.includes('contact@') ? 'contact@rafeglobal.com' : 'info@rafeglobal.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
        
        // Show modal with animation
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        
        // Add focus trap for accessibility
        trapFocus(modal);
        
        console.log(`✅ Modal opened for: ${equipmentName}`);
    };
    
    // Close modal function
    window.closeModal = function() {
        const modal = document.getElementById('rentalModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            
            // Remove focus trap
            const activeElement = document.activeElement;
            if (activeElement && modal.contains(activeElement)) {
                activeElement.blur();
            }
        }
        console.log("🔒 Modal closed");
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
    
    // Focus trap for accessibility
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
        
        // Focus first element
        setTimeout(() => {
            if (firstFocusable) firstFocusable.focus();
        }, 100);
    }
    
    console.log("✅ Rental modal setup complete");
}

// ============================================
// 7. SCROLL & NAVIGATION
// ============================================
function setupScrollAndNavigation() {
    console.log("🔗 Setting up scroll and navigation...");
    
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
    
    // View Details buttons - make sure they work
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function(e) {
            const onclick = this.getAttribute('onclick');
            if (onclick && onclick.includes('window.location.href')) {
                const match = onclick.match(/window\.location\.href=['"]([^'"]+)['"]/);
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

// ============================================
// 8. HELPER FUNCTIONS
// ============================================
function setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
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

function setupImageLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }
}

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

// ============================================
// 9. START THE APPLICATION
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ============================================
// 10. DEBUG HELPER
// ============================================
window.debugButtons = function() {
    console.log("🔍 DEBUG: Checking all rent buttons");
    const buttons = document.querySelectorAll('.rent-now, .card-button[data-equipment-id]');
    buttons.forEach((btn, i) => {
        console.log(`Button ${i}:`, {
            text: btn.textContent.trim(),
            id: btn.getAttribute('data-equipment-id'),
            class: btn.className,
            parent: btn.parentElement.className
        });
    });
    
    console.log("Total rent buttons found:", buttons.length);
};

// Auto-debug on load
setTimeout(() => {
    window.debugButtons();
}, 1000);