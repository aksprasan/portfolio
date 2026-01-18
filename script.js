// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function printResume() {
    // Create and show print options modal
    showPrintModal();
}

function showPrintModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('print-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'print-modal';
        modal.className = 'print-modal';
        modal.innerHTML = `
            <div class="print-modal-content">
                <h3>Print Options</h3>
                <p>Select page format:</p>
                <div class="print-options">
                    <label class="print-option">
                        <input type="radio" name="pageCount" value="1">
                        <span>1 Page (Compact)</span>
                    </label>
                    <label class="print-option">
                        <input type="radio" name="pageCount" value="2" checked>
                        <span>2 Pages (Readable)</span>
                    </label>
                </div>
                <div class="print-modal-buttons">
                    <button class="btn-print-ok" onclick="executePrint()">Print</button>
                    <button class="btn-print-cancel" onclick="closePrintModal()">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.classList.add('active');
}

function closePrintModal() {
    const modal = document.getElementById('print-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function executePrint() {
    const isMobile = /iphone|ipad|ipod|android|mobile/i.test(navigator.userAgent.toLowerCase());
    const selectedOption = document.querySelector('input[name="pageCount"]:checked');
    const pageCount = selectedOption ? selectedOption.value : '2';
    
    closePrintModal();
    
    // Remove any existing print classes
    document.body.classList.remove('print-one-page');
    document.body.classList.remove('mobile-print');
    
    if (pageCount === '1') {
        // 1-page uses compact styles
        if (isMobile) {
            document.body.classList.add('mobile-print');
        } else {
            document.body.classList.add('print-one-page');
        }
    }
    
    setTimeout(() => {
        window.print();
        
        // Clean up after print
        setTimeout(() => {
            document.body.classList.remove('mobile-print');
            document.body.classList.remove('print-one-page');
        }, 1000);
    }, 100);
}

function switchToResume() {
    switchView('resume');
}

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = html.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ============================================================================
// VIEW SWITCHING
// ============================================================================

const toggleButtons = document.querySelectorAll('.toggle-btn');
const portfolioView = document.getElementById('portfolio-view');
const resumeView = document.getElementById('resume-view');

function switchView(viewName) {
    if (!portfolioView || !resumeView) return;
    
    if (viewName === 'portfolio') {
        portfolioView.classList.add('active');
        resumeView.classList.remove('active');
        toggleButtons[0].classList.add('active');
        toggleButtons[1].classList.remove('active');
    } else if (viewName === 'resume') {
        portfolioView.classList.remove('active');
        resumeView.classList.add('active');
        toggleButtons[0].classList.remove('active');
        toggleButtons[1].classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    localStorage.setItem('preferredView', viewName);
}

toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        switchView(view);
    });
});

const savedView = localStorage.getItem('preferredView');
if (savedView && portfolioView && resumeView) {
    switchView(savedView);
}

// ============================================================================
// MOBILE MENU
// ============================================================================

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navLinks = document.getElementById('nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ============================================================================
// SMOOTH SCROLLING
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================================================
// NAVBAR SHADOW ON SCROLL
// ============================================================================

let lastScroll = 0;
const navbar = document.getElementById('navbar');

if (navbar && portfolioView) {
    window.addEventListener('scroll', () => {
        if (!portfolioView.classList.contains('active')) return;
        const currentScroll = window.pageYOffset;
        navbar.style.boxShadow = currentScroll <= 0 ? 'var(--shadow)' : 'var(--shadow-lg)';
        lastScroll = currentScroll;
    });
}

// ============================================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards in portfolio view
document.querySelectorAll('#portfolio-view .section, #portfolio-view .education-card, #portfolio-view .honor-card, #portfolio-view .award-item, #portfolio-view .experience-card, #portfolio-view .timeline-item, #portfolio-view .activity-card, #portfolio-view .skill-category, #portfolio-view .contact-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================================================
// ACTIVE NAV LINK ON SCROLL
// ============================================================================

window.addEventListener('scroll', () => {
    if (!portfolioView || !portfolioView.classList.contains('active')) return;
    
    let current = '';
    const sections = document.querySelectorAll('#portfolio-view section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });

    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
