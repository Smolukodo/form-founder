/**
 * F&F (Form & Founder) — Client-Side Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    initScrollReveals();
    initWorkFilters();
    initContactForm();
    initActiveNavHighlight();
});

/**
 * Header scroll styling
 */
function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const checkScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('shadow-sm', 'bg-ff-secondary/95', 'backdrop-blur-md', 'border-b', 'border-ff-tertiary/20');
            header.classList.remove('bg-ff-secondary/80');
        } else {
            header.classList.remove('shadow-sm', 'border-b', 'border-ff-tertiary/20');
            header.classList.add('bg-ff-secondary/80');
        }
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
}

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIconOpen = document.getElementById('menu-icon-open');
    const menuIconClose = document.getElementById('menu-icon-close');

    if (!toggleBtn || !mobileMenu) return;

    function openMenu() {
        mobileMenu.classList.remove('menu-closed');
        mobileMenu.classList.add('menu-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        if (menuIconOpen) menuIconOpen.classList.add('hidden');
        if (menuIconClose) menuIconClose.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    function closeMenu() {
        mobileMenu.classList.add('menu-closed');
        mobileMenu.classList.remove('menu-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (menuIconOpen) menuIconOpen.classList.remove('hidden');
        if (menuIconClose) menuIconClose.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }

    toggleBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('menu-open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on navigation link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('menu-open')) {
            closeMenu();
        }
    });
}

/**
 * Subtle Scroll Reveals with IntersectionObserver
 */
function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-init');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('reveal-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/**
 * Portfolio Category Filter for work.html
 */
function initWorkFilters() {
    const filterButtons = document.querySelectorAll('.work-filter-btn');
    const projectCards = document.querySelectorAll('.work-project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update button styles
            filterButtons.forEach(b => {
                b.classList.remove('bg-ff-primary', 'text-ff-secondary', 'border-ff-primary');
                b.classList.add('bg-transparent', 'text-ff-ink', 'border-ff-tertiary/40');
            });
            btn.classList.remove('bg-transparent', 'text-ff-ink', 'border-ff-tertiary/40');
            btn.classList.add('bg-ff-primary', 'text-ff-secondary', 'border-ff-primary');

            // Filter cards with smooth opacity
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/**
 * Interactive Contact Form (mailto builder + copy fallback)
 */
function initContactForm() {
    const contactForm = document.getElementById('ff-contact-form');
    if (!contactForm) return;

    const emailRecipient = 'hello@formandfounder.com';

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const companyInput = document.getElementById('contact-company');
        const serviceSelect = document.getElementById('contact-service');
        const budgetSelect = document.getElementById('contact-budget');
        const messageInput = document.getElementById('contact-message');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const company = companyInput ? companyInput.value.trim() : 'N/A';
        const service = serviceSelect ? serviceSelect.value : 'General Inquiry';
        const budget = budgetSelect ? budgetSelect.value : 'Not specified';
        const message = messageInput ? messageInput.value.trim() : '';

        if (!name || !email || !message) {
            alert('Please fill out your Name, Email, and Message before submitting.');
            return;
        }

        // Build Email Body
        const emailSubject = encodeURIComponent(`[F&F Project Inquiry] ${service} — ${name}${company !== 'N/A' && company !== '' ? ` (${company})` : ''}`);
        
        const rawBodyText = `Hello F&F Team,

I'd like to discuss a new project with Form & Founder.

--- PROJECT DETAILS ---
Name: ${name}
Email: ${email}
Company / Organization: ${company}
Service Interest: ${service}
Estimated Budget / Timeline: ${budget}

--- PROJECT BRIEF & GOALS ---
${message}

---
Sent via Form & Founder (F&F) studio inquiry form`;

        const encodedBody = encodeURIComponent(rawBodyText);
        const mailtoUrl = `mailto:${emailRecipient}?subject=${emailSubject}&body=${encodedBody}`;

        // Show confirmation feedback overlay
        showSubmissionModal(name, email, service, rawBodyText, mailtoUrl);

        // Open mailto in window
        window.location.href = mailtoUrl;
    });
}

/**
 * Display Confirmation & Copy helper modal
 */
function showSubmissionModal(name, email, service, fullText, mailtoUrl) {
    let modal = document.getElementById('submission-feedback-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'submission-feedback-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-ff-primary/70 backdrop-blur-sm transition-opacity duration-300';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="bg-ff-secondary border border-ff-tertiary/30 rounded-none max-w-xl w-full p-8 md:p-10 shadow-2xl relative">
            <button id="modal-close-btn" class="absolute top-6 right-6 text-ff-ink/60 hover:text-ff-ink transition-colors p-2 text-2xl leading-none" aria-label="Close modal">&times;</button>
            
            <div class="mb-6">
                <span class="editorial-tag text-ff-accent block mb-2">Inquiry Initiated</span>
                <h3 class="text-2xl md:text-3xl font-fraunces text-ff-primary">Thank you, ${escapeHtml(name)}.</h3>
            </div>
            
            <p class="text-ff-ink/80 text-sm md:text-base mb-6 leading-relaxed">
                Your email client should have opened with your project summary ready to send to <strong class="text-ff-primary">hello@formandfounder.com</strong>.
            </p>
            
            <div class="bg-ff-canvas-soft border border-ff-tertiary/20 p-4 mb-6 text-xs text-ff-ink/80 rounded font-mono overflow-x-auto max-h-44">
                <pre class="whitespace-pre-wrap font-sans text-xs">${escapeHtml(fullText)}</pre>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-3">
                <a href="${mailtoUrl}" class="btn-primary text-center px-6 py-3 text-sm font-medium tracking-wider uppercase inline-block">
                    Re-Open Email Client
                </a>
                <button id="modal-copy-btn" class="btn-secondary px-6 py-3 text-sm font-medium tracking-wider uppercase inline-block">
                    Copy Details to Clipboard
                </button>
            </div>
            <p id="copy-status" class="text-xs text-ff-accent font-medium mt-3 hidden text-center sm:text-left">Copied to clipboard!</p>
        </div>
    `;

    modal.classList.remove('hidden');

    const closeBtn = document.getElementById('modal-close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    const copyBtn = document.getElementById('modal-copy-btn');
    const copyStatus = document.getElementById('copy-status');
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(fullText).then(() => {
            if (copyStatus) {
                copyStatus.classList.remove('hidden');
                setTimeout(() => copyStatus.classList.add('hidden'), 3000);
            }
        });
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Highlight current active navigation item
 */
function initActiveNavHighlight() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('text-ff-accent', 'font-medium');
            link.classList.remove('text-ff-ink/80');
        }
    });
}
