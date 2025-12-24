// ====================================================
// RAFE GLOBAL EQUIPMENT - ENHANCED SCRIPT v3.0
// ====================================================

console.log("🚀 Initializing Rafe Global Equipment Website...");

// --- GLOBAL VARIABLES ---
let currentLanguage = 'ar';
let isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let lastClickTime = 0;
let isModalOpen = false;
let scrollProgress = 0;

// Equipment Database
const equipmentDatabase = {
    1: { 
        name: { en: "Bobcat Loaders", ar: "بوبكات لودر" }, 
        category: "heavy",
        price: { daily: "500", weekly: "2800", monthly: "9500" }
    },
    2: { 
        name: { en: "Scissor Lifts", ar: "منصات رفع مقصية" }, 
        category: "access",
        price: { daily: "350", weekly: "1900", monthly: "6500" }
    },
    3: { 
        name: { en: "Mobile Cranes", ar: "كرينات متنقلة" }, 
        category: "heavy",
        price: { daily: "1200", weekly: "6500", monthly: "22000" }
    },
    4: { 
        name: { en: "Forklifts", ar: "رافعات شوكية" }, 
        category: "material",
        price: { daily: "300", weekly: "1600", monthly: "5500" }
    },
    5: { 
        name: { en: "Telescopic Forklifts", ar: "رافعات شوكية تلسكوبية" }, 
        category: "material",
        price: { daily: "450", weekly: "2400", monthly: "8200" }
    },
    6: { 
        name: { en: "Man Lifts", ar: "رافعات أشخاص" }, 
        category: "access",
        price: { daily: "400", weekly: "2200", monthly: "7500" }
    },
    7: { 
        name: { en: "Light Towers", ar: "أبراج إضاءة" }, 
        category: "lighting",
        price: { daily: "150", weekly: "800", monthly: "2800" }
    },
    8: { 
        name: { en: "Industrial Forklifts", ar: "رافعات شوكية صناعية" }, 
        category: "heavy",
        price: { daily: "600", weekly: "3200", monthly: "11000" }
    },
    9: { 
        name: { en: "Hand Pallet Truck", ar: "عربة ناقلة يدوية" }, 
        category: "material",
        price: { daily: "50", weekly: "250", monthly: "850" }
    },
    10: { 
        name: { en: "Truck with Manipulator", ar: "شاحنة مع ذراع معالجة" }, 
        category: "material",
        price: { daily: "800", weekly: "4300", monthly: "15000" }
    }
};

// --- MAIN INITIALIZATION ---
function initializeApp() {
    console.log("🔄 Starting application initialization...");
    
    try {
        // Setup all features in order
        setupPreloader();
        setupProgressBar();
        setupLanguageSwitcher();
        setupMobileMenu();
        setupNavScroll();
        setupRentalButtons();
        setupRentalModal();
        setupFAQSystem();
        setupScrollAndNavigation(); // This is the key fix
        setupBackToTop();
        setupAnimations();
        setupWhatsAppButton();
        setupSocialMedia();
        setupNewsletterForm();
        setupPageAnalytics();
        setupPerformanceOptimization();
        
        // Initialize language
        updatePageLanguage();
        
        // Set initial states
        setTimeout(() => {
            document.querySelectorAll('.hero-title, .section-title').forEach(el => {
                el.classList.add('animated');
            });
        }, 100);
        
        console.log("✅ Application initialized successfully!");
    } catch (error) {
        console.error("❌ Error during initialization:", error);
        showErrorToast("حدث خطأ في تحميل الموقع. يرجى تحديث الصفحة.");
    }
}

// --- PRELOADER ---
function setupPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="loader"></div>
        <div class="loading-text" data-en="Loading Equipment..." data-ar="جاري تحميل المعدات...">
            جاري تحميل المعدات...
        </div>
    `;
    document.body.prepend(preloader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.remove(), 500);
        }, 800);
    });
}

// --- PROGRESS BAR ---
function setupProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        scrollProgress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${scrollProgress}%`;
    });
}

// --- LANGUAGE SWITCHER ---
function setupLanguageSwitcher() {
    console.log("🌍 Setting up language switcher...");
    
    const langButtons = document.querySelectorAll('.lang-btn');
    if (!langButtons.length) return;
    
    function setLanguage(lang) {
        if (currentLanguage === lang) return;
        
        currentLanguage = lang;
        localStorage.setItem('rafe_language', lang);
        
        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.classList.toggle('rtl-layout', lang === 'ar');
        
        // Update active button
        langButtons.forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            btn.classList.toggle('active', btnLang === lang);
        });
        
        // Update page content
        updatePageLanguage();
        
        // Dispatch language change event
        window.dispatchEvent(new CustomEvent('languageChange', { detail: { lang } }));
        
        console.log(`🌐 Language changed to: ${lang}`);
    }
    
    // Event listeners
    langButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const lang = this.getAttribute('data-lang');
            if (lang) setLanguage(lang);
        });
    });
    
    // Load saved or default language
    const savedLang = localStorage.getItem('rafe_language');
    const browserLang = navigator.language.split('-')[0];
    
    if (savedLang) {
        setLanguage(savedLang);
    } else if (browserLang === 'ar') {
        setLanguage('ar');
    } else {
        setLanguage('ar'); // Force Arabic for SEO
    }
}

function updatePageLanguage() {
    document.querySelectorAll('[data-en], [data-ar]').forEach(element => {
        if (element.hasAttribute('data-en') && element.hasAttribute('data-ar')) {
            const text = currentLanguage === 'ar' ? 
                element.getAttribute('data-ar') : 
                element.getAttribute('data-en');
            
            if (text && text.trim() !== '') {
                const tagName = element.tagName.toLowerCase();
                
                if (tagName === 'input' || tagName === 'textarea') {
                    element.placeholder = text;
                } else if (tagName === 'img') {
                    element.alt = text;
                } else if (element.hasAttribute('title')) {
                    element.title = text;
                } else if (element.children.length === 0 || 
                          element.classList.contains('btn-title') ||
                          element.classList.contains('btn-subtitle') ||
                          element.classList.contains('hero-stat-label')) {
                    element.textContent = text;
                }
            }
        }
    });
    
    // Update WhatsApp tooltip
    updateWhatsAppButtonText();
}

// --- MOBILE MENU ---
function setupMobileMenu() {
    console.log("📱 Setting up mobile menu...");
    
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navMenu) return;
    
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
        
        console.log(`🍔 Menu ${isOpening ? 'opened' : 'closed'}`);
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            window.innerWidth <= 992 &&
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// --- NAVIGATION SCROLL EFFECT ---
function setupNavScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 100));
    
    // Update active nav link
    window.addEventListener('scroll', debounce(updateActiveNav, 100));
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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

// --- RENTAL BUTTONS ---
function setupRentalButtons() {
    console.log("🛒 Setting up rental buttons...");
    
    // Event delegation for rent buttons
    document.addEventListener('click', function(e) {
        const rentButton = e.target.closest('.rent-now') || 
                          e.target.closest('.card-button[data-equipment-id]');
        
        if (rentButton) {
            e.preventDefault();
            e.stopPropagation();
            
            const equipmentId = rentButton.getAttribute('data-equipment-id');
            if (!equipmentId) return;
            
            // Debounce clicks
            const now = Date.now();
            if (now - lastClickTime < 500) return;
            lastClickTime = now;
            
            // Visual feedback
            animateButtonClick(rentButton);
            
            // Open modal
            openRentalModal(equipmentId);
        }
    });
    
    // View details buttons - FIXED: Don't prevent default for navigation
    document.addEventListener('click', function(e) {
        const viewDetailsBtn = e.target.closest('.view-details');
        
        if (viewDetailsBtn) {
            // Check if it's a link to another page
            if (viewDetailsBtn.hasAttribute('href')) {
                // Allow normal navigation
                return;
            }
            
            // Otherwise handle with JavaScript
            const onclick = viewDetailsBtn.getAttribute('onclick');
            if (onclick && onclick.includes('window.location.href')) {
                const match = onclick.match(/window\.location\.href=['"]([^"']+)['"]/);
                if (match && match[1]) {
                    // Add loading animation
                    const originalText = viewDetailsBtn.innerHTML;
                    viewDetailsBtn.innerHTML = '<span class="loading-spinner"></span>';
                    viewDetailsBtn.disabled = true;
                    
                    setTimeout(() => {
                        window.location.href = match[1];
                    }, 300);
                }
            }
        }
    });
}

function animateButtonClick(button) {
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
}

// --- RENTAL MODAL ---
function setupRentalModal() {
    console.log("📞 Setting up rental modal...");
    
    const modal = document.getElementById('rentalModal');
    if (!modal) {
        createRentalModal();
        return;
    }
    
    // Global modal functions
    window.openRentalModal = function(equipmentId) {
        if (isModalOpen) return;
        
        const modal = document.getElementById('rentalModal');
        if (!modal) return;
        
        const equipment = equipmentDatabase[equipmentId];
        if (!equipment) {
            showErrorToast("المعدة غير متوفرة حالياً. يرجى المحاولة لاحقاً.");
            return;
        }
        
        // Get equipment name
        const equipmentName = equipment.name[currentLanguage] || equipment.name.en;
        
        // Update modal content
        const nameElement = document.getElementById('rentalEquipmentName');
        if (nameElement) {
            nameElement.textContent = equipmentName;
            nameElement.setAttribute('data-equipment-id', equipmentId);
        }
        
        // Update WhatsApp link
        const whatsappBtns = modal.querySelectorAll('.whatsapp-main');
        whatsappBtns.forEach(whatsappBtn => {
            const message = currentLanguage === 'ar' ? 
                `مرحبًا رفع العالمية، أنا مهتم بتأجير: ${equipmentName} (رقم المعدة: ${equipmentId})` : 
                `Hello Rafe Global, I'm interested in renting: ${equipmentName} (Equipment ID: ${equipmentId})`;
            
            whatsappBtn.href = `https://wa.me/+966534672153?text=${encodeURIComponent(message)}`;
        });
        
        // Update Email link
        const emailBtns = modal.querySelectorAll('.email-btn');
        emailBtns.forEach(emailBtn => {
            const subject = currentLanguage === 'ar' ? 
                `استفسار تأجير: ${equipmentName}` : 
                `Rental Inquiry: ${equipmentName}`;
            
            const body = currentLanguage === 'ar' ? 
                `أنا مهتم بتأجير: ${equipmentName} (رقم المعدة: ${equipmentId}).\n\nيرجى إرسال المزيد من المعلومات.\n\nتفاصيل المشروع:\n- الموقع:\n- المدة:\n- المتطلبات الخاصة:` : 
                `I'm interested in renting: ${equipmentName} (Equipment ID: ${equipmentId}).\n\nPlease send me more information.\n\nProject Details:\n- Location:\n- Duration:\n- Special Requirements:`;
            
            emailBtn.href = `mailto:globalrafe@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
        
        // Show modal
        modal.classList.add('active');
        isModalOpen = true;
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        
        // Add keyboard trap
        trapFocus(modal);
        
        console.log(`📋 Modal opened for: ${equipmentName}`);
    };
    
    window.closeModal = function() {
        const modal = document.getElementById('rentalModal');
        if (modal) {
            modal.classList.remove('active');
            isModalOpen = false;
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            
            // Release focus
            const activeElement = document.activeElement;
            if (activeElement && modal.contains(activeElement)) {
                activeElement.blur();
            }
        }
    };
    
    // Event listeners
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            window.closeModal();
        }
    });
    
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.closeModal();
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isModalOpen) {
            window.closeModal();
        }
    });
}

function createRentalModal() {
    const modalHTML = `
    <div class="modal" id="rentalModal">
        <div class="modal-content rental-modal">
            <button class="modal-close" aria-label="إغلاق">&times;</button>
            <div class="modal-header">
                <h2 data-en="Rent Equipment" data-ar="طلب تأجير المعدات">طلب تأجير المعدات</h2>
                <p id="rentalEquipmentName">اسم المعدة</p>
                <p class="modal-subtitle" data-en="Get instant quote via WhatsApp or Email" data-ar="احصل على عرض سعر فوري عبر واتساب أو البريد الإلكتروني">
                    احصل على عرض سعر فوري عبر واتساب أو البريد الإلكتروني
                </p>
            </div>
            <div class="modal-body">
                <div class="rental-buttons">
                    <a href="https://wa.me/+966534672153" class="rental-btn whatsapp-main" 
                       target="_blank" rel="noopener noreferrer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                        </svg>
                        <div>
                            <div class="btn-title" data-en="Chat on WhatsApp" data-ar="محادثة واتساب">محادثة واتساب</div>
                            <div class="btn-subtitle ltr-number">+966 53 467 2153</div>
                            <div class="btn-info" data-en="Instant Response" data-ar="رد فوري">رد فوري</div>
                        </div>
                    </a>
                    
                    <a href="mailto:globalrafe@gmail.com" class="rental-btn email-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        <div>
                            <div class="btn-title" data-en="Send Email" data-ar="إرسال بريد إلكتروني">إرسال بريد إلكتروني</div>
                            <div class="btn-subtitle">globalrafe@gmail.com</div>
                            <div class="btn-info" data-en="Detailed Quote" data-ar="عرض مفصل">عرض مفصل</div>
                        </div>
                    </a>
                </div>
                
                <div class="rental-note">
                    <p data-en="Our team will contact you within 15 minutes" data-ar="سيقوم فريقنا بالتواصل معك خلال ١٥ دقيقة">
                        <strong>ملاحظة:</strong> سيقوم فريقنا بالتواصل معك خلال ١٥ دقيقة
                    </p>
                </div>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupRentalModal();
}

function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
    
    firstElement.focus();
}

// --- FAQ SYSTEM ---
function setupFAQSystem() {
    console.log("❓ Setting up FAQ system...");
    
    const faqCategories = document.querySelectorAll('.faq-category');
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqCategories.length) return;
    
    // Category filtering
    faqCategories.forEach(category => {
        category.addEventListener('click', function(e) {
            e.preventDefault();
            
            const categoryType = this.getAttribute('data-category');
            console.log(`FAQ Category clicked: ${categoryType}`);
            
            // Update active category
            faqCategories.forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide category content
            document.querySelectorAll('.faq-category-content').forEach(content => {
                if (categoryType === 'all') {
                    content.classList.add('active');
                    content.style.display = 'block';
                } else if (content.getAttribute('data-category') === categoryType) {
                    content.classList.add('active');
                    content.style.display = 'block';
                } else {
                    content.classList.remove('active');
                    content.style.display = 'none';
                }
            });
            
            // Close all FAQ items
            faqItems.forEach(item => {
                item.classList.remove('active');
                const answer = item.querySelector('div[itemprop="acceptedAnswer"]');
                if (answer) {
                    answer.style.maxHeight = '0';
                    answer.style.padding = '0';
                }
            });
        });
    });
    
    // FAQ accordion
    faqItems.forEach(item => {
        const question = item.querySelector('h4');
        const answer = item.querySelector('div[itemprop="acceptedAnswer"]');
        
        if (question && answer) {
            question.style.cursor = 'pointer';
            
            question.addEventListener('click', function(e) {
                e.preventDefault();
                
                const isActive = item.classList.contains('active');
                
                // Close other items in same category
                const parentCategory = item.closest('.faq-category-content');
                if (parentCategory) {
                    parentCategory.querySelectorAll('.faq-item').forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            const otherAnswer = otherItem.querySelector('div[itemprop="acceptedAnswer"]');
                            if (otherAnswer) {
                                otherAnswer.style.maxHeight = '0';
                                otherAnswer.style.padding = '0';
                            }
                        }
                    });
                }
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.padding = '0 var(--spacing-lg) var(--spacing-lg)';
                } else {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                    answer.style.padding = '0';
                }
            });
        }
    });
    
    // Initialize with 'all' category
    const allCategory = document.querySelector('.faq-category[data-category="all"]');
    if (allCategory) {
        setTimeout(() => allCategory.click(), 300);
    }
}

// --- SCROLL & NAVIGATION - FIXED VERSION ---
function setupScrollAndNavigation() {
    console.log("🎯 Setting up scroll and navigation...");
    
    // Smooth scroll ONLY for anchor links that exist on current page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            // Only prevent default if target exists on current page
            if (targetElement) {
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
                const headerOffset = 120;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            // If target doesn't exist, allow normal navigation (external page)
        });
    });
    
    // Explore Equipment button - FIXED
    const exploreBtn = document.getElementById('exploreEquipment');
    const equipmentSection = document.getElementById('equipment');
    
    if (exploreBtn && equipmentSection) {
        exploreBtn.addEventListener('click', function(e) {
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
            
            // Scroll to equipment section
            equipmentSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // Category links - FIXED: Allow normal navigation for .html links
    const categoryLinks = document.querySelectorAll('.category-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for internal hash links
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Update active link
                    categoryLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Scroll to equipment section
                    if (targetId === 'equipment') {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            }
            // For .html links, allow normal navigation (don't prevent default)
        });
    });
}

// --- BACK TO TOP ---
function setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
        </svg>
    `;
    backToTop.setAttribute('aria-label', 'العودة للأعلى');
    backToTop.setAttribute('title', 'العودة للأعلى');
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
}

// --- ANIMATIONS ---
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add specific animations based on element type
                if (entry.target.classList.contains('equipment-card')) {
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, entry.target.dataset.delay || 0);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements
    document.querySelectorAll('.equipment-card, .stat-card, .feature-item, .contact-card').forEach((el, index) => {
        el.dataset.delay = index * 100;
        observer.observe(el);
    });
    
    // Add hover animations to cards
    document.querySelectorAll('.equipment-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// --- WHATSAPP BUTTON ---
function setupWhatsAppButton() {
    console.log("💬 Setting up WhatsApp button...");
    
    if (!document.querySelector('.whatsapp-container')) {
        const whatsappHTML = `
        <div class="whatsapp-container">
            <a href="https://wa.me/+966534672153"
               class="whatsapp-float"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="WhatsApp"
               title="تواصل معنا على واتساب">
                <div class="whatsapp-icon-wrapper">
                    <svg class="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.032,12.366c-0.344,0.196-0.693,0.406-0.693,0.815c0,0.406,0.554,0.815,0.901,1.08c0.348,0.266,0.826,0.406,1.297,0.406c0.48,0,0.934-0.154,1.297-0.406c0.365-0.25,0.901-0.683,0.901-1.08c0-0.409-0.357-0.619-0.693-0.815c-0.339-0.196-0.826-0.406-1.505-0.406c12.858,11.96,12.371,12.17,12.032,12.366z M17.606,6.384c-2.199-2.199-5.297-3.231-8.28-2.704c6.242,4.161,4.264,5.664,3.054,7.734c1.845,9.804,1.5,12.246,2.083,14.5c0.009,0.035,0.021,0.069,0.035,0.1021-1.399,5.11415.151-1.366c0.035,0.015,0.071,0.027,0.107,0.037c2.258,0.583,4.704,0.238,6.774-0.971c2.07-1.21,3.573-3.188,4.054-5.272c20.337,11.681,19.805,8.583,17.606,6.384z M16.656,15.358c-1.836,1.074-4.006,1.441-6.083,1.041-0.108-0.0241-0.104,0.0271-3.746,0.99210.998-3.64710.026-0.0951-0.022-0.102c-0.402-2.077-0.034-4.247,1.04-6.083c1.074-1.836,2.876-2.964,4.844-3.118c1.967-0.154,3.914,0.564,5.277,1.927c1.363,1.363,2.081,3.31,1.927,5.277C19.619,12.482,18.492,14.284,16.656,15.358z"/>
                    </svg>
                    <div class="whatsapp-pulse"></div>
                </div>
                <div class="whatsapp-tooltip">
                    <span data-en="Chat with us on WhatsApp" data-ar="تواصل معنا على واتساب">تواصل معنا على واتساب</span>
                    <span class="whatsapp-number">+966 53 467 2153</span>
                </div>
            </a>
        </div>`;
        
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
                    iconWrapper.style.transform = "";
                }, 150);
            }
        });
    }
}

function updateWhatsAppButtonText() {
    const tooltip = document.querySelector('.whatsapp-tooltip span');
    if (tooltip && tooltip.hasAttribute('data-en') && tooltip.hasAttribute('data-ar')) {
        const text = currentLanguage === 'ar' ? 
            tooltip.getAttribute('data-ar') : 
            tooltip.getAttribute('data-en');
        if (text) tooltip.textContent = text;
    }
}

// --- SOCIAL MEDIA ---
function setupSocialMedia() {
    console.log("📱 Setting up social media...");
    
    // Add click tracking
    document.querySelectorAll('.social-icon, .footer-social-link').forEach(icon => {
        icon.addEventListener('click', function(e) {
            const platform = this.classList.contains('facebook') ? 'Facebook' :
                           this.classList.contains('instagram') ? 'Instagram' :
                           this.classList.contains('snapchat') ? 'Snapchat' : 'Social Media';
            
            console.log(`📊 Social media click: ${platform}`);
            
            // You can add analytics here
            trackEvent('Social Media', 'Click', platform);
        });
    });
}

// --- NEWSLETTER FORM ---
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email || !isValidEmail(email)) {
            showToast('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.innerHTML = `
            <span class="loading-spinner"></span>
            <span data-en="Subscribing..." data-ar="جاري الاشتراك...">جاري الاشتراك...</span>
        `;
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showToast('تم الاشتراك بنجاح! سنرسل لك آخر العروض والتحديثات', 'success');
            emailInput.value = '';
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Track newsletter subscription
            trackEvent('Newsletter', 'Subscribe', 'Footer');
        }, 1500);
    });
}

// --- PAGE ANALYTICS ---
function setupPageAnalytics() {
    // Track page views
    trackEvent('Page', 'View', window.location.pathname);
    
    // Track equipment views
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const sectionName = section.id || section.className;
                
                if (section.id === 'equipment') {
                    trackEvent('Section', 'View', 'Equipment');
                } else if (section.id === 'faq') {
                    trackEvent('Section', 'View', 'FAQ');
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });
}

// --- PERFORMANCE OPTIMIZATION ---
function setupPerformanceOptimization() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('optimizedResize'));
        }, 250);
    });
}

// --- HELPER FUNCTIONS ---
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    } else if (type === 'warning') {
        toast.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    } else {
        toast.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function showErrorToast(message) {
    showToast(message, 'error');
}

function trackEvent(category, action, label) {
    // This is where you would integrate with Google Analytics or other tracking
    console.log(`📊 Analytics: ${category} - ${action} - ${label}`);
    
    // Example with gtag (if installed)
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
}

.modal-subtitle {
    color: var(--text-light);
    font-size: 0.9rem;
    margin-top: 8px;
}

.rental-note {
    margin-top: 20px;
    padding: 12px;
    background: var(--light-bg);
    border-radius: var(--radius-md);
    border-left: 3px solid var(--accent-gold);
}

.rental-note p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--text-medium);
}

.btn-info {
    font-size: 0.8rem;
    opacity: 0.9;
    margin-top: 2px;
}
`;
document.head.appendChild(style);

// --- START APPLICATION ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export functions for global access if needed
window.RafeGlobal = {
    setLanguage: function(lang) {
        const event = new CustomEvent('languageChange', { detail: { lang } });
        window.dispatchEvent(event);
    },
    
    openRentalModal: window.openRentalModal,
    closeModal: window.closeModal,
    
    trackEvent: trackEvent,
    showToast: showToast
};

console.log("✅ Rafe Global Equipment Script loaded successfully!");