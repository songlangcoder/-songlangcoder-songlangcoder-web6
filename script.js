// ============================================
// NAVIGATION
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
if (navLinks.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });
}

// Set active nav link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Call on page load
setActiveNavLink();

// ============================================
// PARTICLES ANIMATION
// ============================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ============================================
// ANIMATE ON SCROLL (AOS)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    if (el.dataset.aos === 'fade-up') {
        el.style.transform = 'translateY(30px)';
    } else if (el.dataset.aos === 'fade-right') {
        el.style.transform = 'translateX(-30px)';
    } else if (el.dataset.aos === 'fade-left') {
        el.style.transform = 'translateX(30px)';
    }
    
    observer.observe(el);
});

// ============================================
// GALLERY FILTER & IMAGES INITIALIZATION
// ============================================
let galleryItems = [];
let allGalleryImages = [];
let currentImageIndex = 0;

// Gallery images array - all available images
const galleryImages = [
    'w1.png', 'w2.png', 'w3.png', 'w4.png', 'w5.png', 'w6.png', 'w7.png', 'w8.png', 'w9.png', 'w10.png',
    'w11.png', 'w12.jpg', 'w13.png', 'w14.png', 'w15.png', 'w16.png', 'w17.png', 'w18.png', 'w19.jpg', 'w20.png',
    'w21.jpg', 'w22.png', 'w23.png', 'w24.png', 'w25.png', 'w26.jpg', 'w27.png'
];

function initializeGallery() {
    galleryItems = document.querySelectorAll('.gallery-item');
    allGalleryImages = [];
    let imageIndexCounter = 0;

    if (galleryItems.length === 0) {
        console.log('No gallery items found');
        return;
    }

    // Initialize gallery images
    galleryItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const imageDiv = item.querySelector('.gallery-image');
        
        if (!imageDiv) {
            console.log('No gallery-image div found for item', index);
            return;
        }
        
        // Check if image already exists
        let img = imageDiv.querySelector('img');
        if (!img) {
            // Create new img element
            img = document.createElement('img');
            
            // Get next available image (cycle through all images)
            const imageSrc = galleryImages[imageIndexCounter % galleryImages.length];
            imageIndexCounter++;
            
            img.src = imageSrc;
            img.alt = `Glossy Nails - ${category} ${index + 1}`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.display = 'block';
            img.loading = 'lazy';
            
            // Get overlay element
            const overlay = imageDiv.querySelector('.gallery-overlay');
            
            // Insert image before overlay if overlay exists
            if (overlay && imageDiv.contains(overlay)) {
                imageDiv.insertBefore(img, overlay);
            } else {
                // If no overlay or overlay not found, prepend to imageDiv
                imageDiv.insertBefore(img, imageDiv.firstChild);
            }
            
            // Store image source for lightbox
            allGalleryImages.push(imageSrc);
            
            console.log(`Added image ${imageSrc} to gallery item ${index}`);
        } else {
            // Image already exists, just store the src
            const imgSrc = img.src.includes('/') ? img.src.split('/').pop() : img.src;
            allGalleryImages.push(imgSrc);
        }
        
        // Add click event listener if not already added
        if (!item.hasAttribute('data-gallery-initialized')) {
            item.setAttribute('data-gallery-initialized', 'true');
            item.addEventListener('click', () => {
                openLightbox(index);
            });
        }
    });

    // Initialize filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        // Check if already initialized
        if (button.hasAttribute('data-filter-initialized')) {
            return;
        }
        button.setAttribute('data-filter-initialized', 'true');
        
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
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
}

// ============================================
// GALLERY LIGHTBOX
// ============================================
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

function openLightbox(index) {
    if (!lightbox || !lightboxImage) return;
    currentImageIndex = index;
    const item = galleryItems[index];
    if (item) {
        const img = item.querySelector('img');
        if (img && img.src) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt || `Gallery image ${index + 1}`;
        } else if (allGalleryImages[index]) {
            lightboxImage.src = allGalleryImages[index];
        }
    } else if (allGalleryImages[index]) {
        lightboxImage.src = allGalleryImages[index];
    }
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showNextImage() {
    if (galleryItems.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
    const item = galleryItems[currentImageIndex];
    const img = item ? item.querySelector('img') : null;
    if (img && img.src) {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || `Gallery image ${currentImageIndex + 1}`;
    } else if (allGalleryImages[currentImageIndex]) {
        lightboxImage.src = allGalleryImages[currentImageIndex];
    }
}

function showPrevImage() {
    if (galleryItems.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentImageIndex];
    const img = item ? item.querySelector('img') : null;
    if (img && img.src) {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || `Gallery image ${currentImageIndex + 1}`;
    } else if (allGalleryImages[currentImageIndex]) {
        lightboxImage.src = allGalleryImages[currentImageIndex];
    }
}

// Initialize lightbox event listeners
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}
if (lightboxNext) {
    lightboxNext.addEventListener('click', showNextImage);
}
if (lightboxPrev) {
    lightboxPrev.addEventListener('click', showPrevImage);
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevTestimonial = document.getElementById('prevTestimonial');
const nextTestimonial = document.getElementById('nextTestimonial');
const testimonialDots = document.getElementById('testimonialDots');

let currentTestimonial = 0;

// Create dots
testimonialCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTestimonial(index));
    testimonialDots.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

function updateTestimonialSlider() {
    testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
    });
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonialSlider();
}

function nextTestimonialSlide() {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    updateTestimonialSlider();
}

function prevTestimonialSlide() {
    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    updateTestimonialSlider();
}

prevTestimonial.addEventListener('click', prevTestimonialSlide);
nextTestimonial.addEventListener('click', nextTestimonialSlide);

// Auto-play testimonials
setInterval(nextTestimonialSlide, 5000);

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(start));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
}

const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };
    
    // Show success message
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-check"></i> Đã Gửi!';
    submitButton.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
    
    // Reset form
    setTimeout(() => {
        contactForm.reset();
        submitButton.innerHTML = originalText;
        submitButton.style.background = '';
        
        // Show notification
        showNotification('Cảm ơn bạn! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.');
    }, 2000);
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', formData);
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #d4af37 0%, #c9a961 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
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
`;
document.head.appendChild(style);

// ============================================
// PARALLAX EFFECT
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ============================================
// SERVICE CARDS HOVER EFFECT
// ============================================
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// CURSOR EFFECT (Optional - for desktop)
// ============================================
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #d4af37;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.display = 'block';
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    document.querySelectorAll('a, button, .gallery-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'rgba(212, 175, 55, 0.2)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'transparent';
        });
    });
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #d4af37, #c9a961);
    z-index: 10000;
    transition: width 0.1s ease;
    width: 0%;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});

// ============================================
// TYPING EFFECT FOR HERO TITLE (Optional)
// ============================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ============================================
// BOOKING MODAL
// ============================================
const bookingModal = document.getElementById('bookingModal');
const openBookingModal = document.getElementById('openBookingModal');
const openBookingModalBtn = document.getElementById('openBookingModalBtn');
const closeBookingModal = document.getElementById('closeBookingModal');
const bookingFormModal = document.getElementById('bookingFormModal');

// Open booking modal
function openBookingModalFunc() {
    if (bookingModal) {
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('booking-date-modal');
        if (dateInput) {
            dateInput.setAttribute('min', today);
        }
    }
}

// Close booking modal
function closeBookingModalFunc() {
    if (bookingModal) {
        bookingModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form
        if (bookingFormModal) {
            bookingFormModal.reset();
        }
    }
}

// Event listeners
if (openBookingModal) {
    openBookingModal.addEventListener('click', (e) => {
        e.preventDefault();
        openBookingModalFunc();
    });
}

if (openBookingModalBtn) {
    openBookingModalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openBookingModalFunc();
    });
}

// Floating booking button
const openBookingModalBtnFloat = document.getElementById('openBookingModalBtnFloat');
if (openBookingModalBtnFloat) {
    openBookingModalBtnFloat.addEventListener('click', (e) => {
        e.preventDefault();
        openBookingModalFunc();
    });
}

if (closeBookingModal) {
    closeBookingModal.addEventListener('click', closeBookingModalFunc);
}

// Close modal when clicking overlay
if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
        if (e.target.classList.contains('booking-modal-overlay')) {
            closeBookingModalFunc();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('active')) {
        closeBookingModalFunc();
    }
});

// Booking form submission
if (bookingFormModal) {
    bookingFormModal.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('booking-name-modal').value,
            phone: document.getElementById('booking-phone-modal').value,
            email: document.getElementById('booking-email-modal').value,
            date: document.getElementById('booking-date-modal').value,
            time: document.getElementById('booking-time-modal').value,
            service: document.getElementById('booking-service-modal').value,
            technician: document.getElementById('booking-technician-modal').value,
            notes: document.getElementById('booking-notes-modal').value
        };
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang Xử Lý...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitButton.innerHTML = '<i class="fas fa-check"></i> Đặt Lịch Thành Công!';
            submitButton.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
            
            // Show success message
            showNotification('Cảm ơn bạn đã đặt lịch! Chúng tôi đã gửi email xác nhận đến ' + formData.email + '. Vui lòng kiểm tra email của bạn.');
            
            // Reset form and close modal
            setTimeout(() => {
                this.reset();
                submitButton.innerHTML = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
                closeBookingModalFunc();
            }, 2000);
        }, 2000);
        
        console.log('Booking submitted:', formData);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize gallery
    initializeGallery();
    console.log('Glossy Nails website loaded successfully!');
    console.log('Gallery items found:', document.querySelectorAll('.gallery-item').length);
});

