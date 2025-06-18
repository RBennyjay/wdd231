document.addEventListener('DOMContentLoaded', function() {
    console.log('join.js loaded');

    // --- Global Elements Caching (if needed for join.html) ---
    const lastModifiedSpan = document.getElementById('lastModified');
    const yearSpan = document.getElementById('year');
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.main-nav');
    const mainContent = document.querySelector('main');
    const hamburgerIcon = document.querySelector('.hamburger-menu i');

    // --- Modal Elements for .modal (div-based modals) ---
    const allModals = document.querySelectorAll('.modal, .modal-overlay');
    const allModalCloseBtns = document.querySelectorAll('.modal-content .close-button, .close-modal-btn');

    // --- Last Modified Date Logic ---
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    // --- Current Year Logic ---
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Hamburger Menu Logic ---
    if (hamburger && navMenu && mainContent && hamburgerIcon) {
        console.log("Hamburger menu elements found, initializing toggle logic.");
        const toggleMenu = () => {
            console.log("Toggle menu clicked! Current active state:", navMenu.classList.contains('active'));
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('open');

            const isMenuOpen = hamburger.classList.contains('open');
            hamburgerIcon.classList.toggle('fa-bars', !isMenuOpen);
            hamburgerIcon.classList.toggle('fa-times', isMenuOpen);

            document.body.classList.toggle('menu-open', isMenuOpen);
            console.log(`Menu active state after toggle: ${navMenu.classList.contains('active')}`);
        };

        hamburger.addEventListener('click', toggleMenu);

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (event) => {
                console.log(`Nav link clicked: ${event.target.href}. Menu active: ${navMenu.classList.contains('active')}`);
                // Always close the menu when a link is clicked
                if (navMenu.classList.contains('active')) {
                    toggleMenu();
                }
                // Allow default navigation to proceed
            });
        });

        let isMobileView = window.matchMedia("(max-width: 768px)").matches;
        window.addEventListener('resize', () => {
            const newIsMobileView = window.matchMedia("(max-width: 768px)").matches;
            if (!newIsMobileView && isMobileView && navMenu.classList.contains('active')) {
                console.log("Resized to desktop view, closing menu.");
                toggleMenu(); // Close menu if resized to desktop while open
            }
            isMobileView = newIsMobileView; // Update mobile view state
        });
    } else {
        console.warn("Hamburger menu or main navigation element not found. Check your HTML IDs (id='hamburgerMenu', id='mainNav').");
    }

    // --- Search Bar Toggle Logic (if needed for join.html) ---
    const searchIcon = document.querySelector('.search-icon');
    let searchBarContainer = document.querySelector('.search-bar-container');
    if (!searchBarContainer) {
        searchBarContainer = document.createElement('div');
        searchBarContainer.classList.add('search-bar-container');
        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('placeholder', 'Search...');
        searchInput.classList.add('search-input');
        searchBarContainer.appendChild(searchInput);
        const headerRightGroup = document.querySelector('.header-right-group');
        if (headerRightGroup) {
            headerRightGroup.parentNode.insertBefore(searchBarContainer, headerRightGroup.nextSibling);
        }
    }

    if (searchIcon && searchBarContainer) {
        searchIcon.addEventListener('click', function() {
            searchBarContainer.classList.toggle('active');
            if (searchBarContainer.classList.contains('active')) {
                const searchInput = searchBarContainer.querySelector('.search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });

        document.addEventListener('click', function(event) {
            const isClickInsideSearchBar = searchBarContainer.contains(event.target) || searchIcon.contains(event.target);
            if (!isClickInsideSearchBar && searchBarContainer.classList.contains('active')) {
                searchBarContainer.classList.remove('active');
            }
        });
    }

    // --- Join Page Specific JavaScript ---
    const membershipCards = document.querySelectorAll('.membership-card');
    if (membershipCards.length > 0) {
        console.log("Join page specific JS active.");
        const membershipForm = document.getElementById('membershipForm');
        if (membershipForm) {
            membershipForm.addEventListener('submit', () => {
                const timestampInput = document.getElementById('timestamp');
                if (timestampInput) {
                    timestampInput.value = new Date().toISOString();
                }
            });
        }

        membershipCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'slideInUp 0.6s ease-out forwards';
            }, index * 150);
        });

        const openMembershipModalBtns = document.querySelectorAll('.open-modal-btn');
        openMembershipModalBtns.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const modalId = event.target.dataset.modalTarget;
                console.log(`[Join Page] Opening modal for ID: ${modalId}`);
                openGenericModal(modalId);
            });
            btn.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    const modalId = event.target.dataset.modalTarget;
                    console.log(`[Join Page] Opening modal (keydown) for ID: ${modalId}`);
                    openGenericModal(modalId);
                }
            });
        });
    }

    // --- GENERIC MODAL FUNCTIONS FOR .modal CLASS ---
    function openGenericModal(modalId) {
        console.log(`[Generic Modal] Attempting to open modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            setTimeout(() => {
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.focus();
                }
            }, 10);
        } else {
            console.error(`[Generic Modal] Modal element with ID '${modalId}' not found for openGenericModal.`);
        }
    }

    function closeGenericModal(modal) {
        console.log(`[Generic Modal] Attempting to close modal: ${modal.id || modal.className}`);
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');

            const handleTransitionEnd = (e) => {
                if (e.propertyName === 'opacity' && !modal.classList.contains('active')) {
                    console.log(`[Generic Modal] Modal ${modal.id || modal.className} opacity transition ended, hiding.`);
                    modal.classList.add('hidden');
                    modal.removeEventListener('transitionend', handleTransitionEnd);
                }
            };
            modal.addEventListener('transitionend', handleTransitionEnd);

            setTimeout(() => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    modal.classList.add('hidden');
                    console.warn(`[Generic Modal] Modal ${modal.id || modal.className} forcefully hidden by timeout (transitionend likely missed).`);
                }
            }, 350);
        }
    }

    // --- Event Listeners for ALL .modal close buttons ---
    allModalCloseBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            console.log(`[Generic Modal Listener] Close button clicked. Event target:`, event.target);
            const modal = btn.closest('.modal') || btn.closest('.modal-overlay');
            if (modal) {
                console.log(`[Generic Modal Listener] Found parent modal: ${modal.id || modal.className}`);
                closeGenericModal(modal);
            } else {
                console.error("[Generic Modal Listener] Close button clicked, but no parent .modal or .modal-overlay found. Event prevented.");
                event.preventDefault();
            }
        });
        btn.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                console.log(`[Generic Modal Listener] Close button keydown. Event target:`, event.target);
                const modal = btn.closest('.modal') || btn.closest('.modal-overlay');
                if (modal) {
                    closeGenericModal(modal);
                }
            }
        });
    });

    // Close any .modal when clicking outside of the modal content
    allModals.forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                console.log(`[Generic Modal Listener] Clicked outside modal ${overlay.id || overlay.className}, closing.`);
                closeGenericModal(overlay);
            }
        });
    });

    // Close any .modal when Escape key is pressed
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const currentlyOpenModals = document.querySelectorAll('.modal.active, .modal-overlay.active');
            if (currentlyOpenModals.length > 0) {
                console.log("[Generic Modal Listener] Escape key pressed, closing active modals.");
            }
            currentlyOpenModals.forEach(modal => closeGenericModal(modal));
        }
    });
});