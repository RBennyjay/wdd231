document.addEventListener('DOMContentLoaded', function() {
    console.log('direct.js loaded (consolidated)');

    // --- Global Elements Caching ---
    const lastModifiedSpan = document.getElementById('lastModified');
    const yearSpan = document.getElementById('year');
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.main-nav');
    const mainContent = document.querySelector('main');
    const hamburgerIcon = document.querySelector('.hamburger-menu i');
    const membersContainer = document.getElementById("membersContainer");
    const gridBtn = document.getElementById("gridBtn");
    const listBtn = document.getElementById("listBtn");
    const formSubmissionDetails = document.getElementById('formSubmissionDetails');

    // --- Original <dialog> elements for openModal(dialogId, contentHtml) ---
    const dialogBox = document.querySelector("#dialogBox");
    const closeButtonDialog = document.querySelector("#closeButton"); 
    const dialogContent = document.querySelector("#dialogContent");

    // ---  Modal Elements for .modal (div-based modals) ---

    const allModals = document.querySelectorAll('.modal, .modal-overlay');
    // Now selects both .modal-content .close-button (for discover) and .close-modal-btn (for join)
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

    // --- Search Bar Toggle Logic ---
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

    // --- Directory Members Loading & Display Logic ---
    if (membersContainer && window.location.pathname.includes('directory.html')) {
        console.log("Directory page specific JS active.");
        async function loadMembers() {
            try {
                const response = await fetch("data/members.json");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                displayMembers(data);
            } catch (error) {
                console.error("Failed to load members:", error);
                membersContainer.innerHTML = "<p>Error loading directory. Please try again later.</p>";
            }
        }


        if (!membersContainer.classList.contains('grid-view') && !membersContainer.classList.contains('list-view')) {
            // Check if it's a mobile view, and if so, default to list-view, otherwise grid-view
            const isMobileView = window.matchMedia("(max-width: 768px)").matches; // Use the same breakpoint as your CSS

            if (isMobileView) {
                membersContainer.classList.add('list-view'); // Default to list on mobile
            } else {
                membersContainer.classList.add('grid-view'); // Default to grid on desktop
            }
        }






        // Set current timestamp before form submission - This block handles the timestamp for the join form
        // and should ideally be moved closer to the "Join Page Specific JavaScript" section.
        // I've kept it here for now as it was in your original code, but noting its placement.
        const membershipForm = document.getElementById('membershipForm');
        if (membershipForm) {
            membershipForm.addEventListener('submit', () => {
                const timestampInput = document.getElementById('timestamp');
                if (timestampInput) {
                    timestampInput.value = new Date().toISOString();
                }
            });
        }


        function displayMembers(members) {
            membersContainer.innerHTML = "";
            members.forEach(member => {
                const card = document.createElement("div");
                card.classList.add("member-card", "card-base");

                let membershipClass = '';
                if (member.membership === 1) membershipClass = 'gold-member';
                else if (member.membership === 2) membershipClass = 'silver-member';
                else if (member.membership === 3) membershipClass = 'bronze-member';
                if (membershipClass) card.classList.add(membershipClass);

                card.innerHTML = `
                    <img src="${member.image}" alt="${member.name} logo" loading="lazy"
                            width="150" height="150" class="member-logo" />
                    <h3>${member.name}</h3>
                    <p>${member.description}</p>
                    <p><strong>Address:</strong> ${member.address}</p>
                    <p><strong>Phone:</strong> ${member.phone}</p>
                    <p><a href="${member.website}" target="_blank">Visit Website</a></p>
                    <p class="membership">Membership: <strong>${getMembershipLevel(member.membership)}</strong></p>
                `;
                membersContainer.appendChild(card);
            });

            if (!membersContainer.classList.contains('grid-view') && !membersContainer.classList.contains('list-view')) {
                membersContainer.classList.add('grid-view');
            }
        }

        function getMembershipLevel(level) {
            switch (level) {
                case 1: return "Gold";
                case 2: return "Silver";
                case 3: return "Bronze";
                default: return "Standard Member";
            }
        }

        // View Toggle Buttons Logic
        if (gridBtn && listBtn) {
            console.log("Directory view toggle buttons found.");
            gridBtn.addEventListener("click", () => {
                console.log("Grid button clicked.");
                membersContainer.classList.add("grid-view");
                membersContainer.classList.remove("list-view");
            });
            listBtn.addEventListener("click", () => {
                console.log("List button clicked.");
                membersContainer.classList.add("list-view");
                membersContainer.classList.remove("grid-view");
            });
        } else {
            console.warn("Grid or List buttons not found on directory page.");
        }
        loadMembers();
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

    // --- Discover Page Specific JavaScript ---
    const visitorMessageElement = document.getElementById('visitor-message');
    const interestCardsGrid = document.querySelector('.interest-cards-grid');

    if (visitorMessageElement || interestCardsGrid) {
        console.log("Discover page specific JS active.");
        // Visitor Message Logic
        const fadeOutVisitorMessage = () => {
            if (visitorMessageElement) {
                visitorMessageElement.classList.add('fade-out');
                visitorMessageElement.addEventListener('transitionend', function handler() {
                    visitorMessageElement.classList.add('hidden');
                    visitorMessageElement.removeEventListener('transitionend', handler);
                }, { once: true });
            }
        };

        function displayLastVisitMessage() {
            if (!visitorMessageElement) return;
            const lastVisit = localStorage.getItem('lastVisit');
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;

            if (!lastVisit) {
                visitorMessageElement.textContent = "Welcome! Let us know if you have any questions.";
            } else {
                const lastVisitDate = parseInt(lastVisit);
                const timeDifference = now - lastVisitDate;
                if (timeDifference < oneDay) {
                    visitorMessageElement.textContent = "Back so soon! Awesome!";
                } else {
                    const daysDifference = Math.round(timeDifference / oneDay);
                    visitorMessageElement.textContent = `You last visited ${daysDifference} day${daysDifference === 1 ? '' : 's'} ago.`;
                }
            }
            localStorage.setItem('lastVisit', now.toString());
            const autoFadeDuration = 8000;
            setTimeout(fadeOutVisitorMessage, autoFadeDuration);
        }

        if (visitorMessageElement) {
            displayLastVisitMessage();
        }

        // Places of Interest Logic
        const placeModal = document.getElementById('placeModal');
        const modalTitlePlace = document.getElementById('modal-title');
        const modalImagePlace = document.getElementById('modal-image');
        const modalAddressPlace = document.getElementById('modal-address');
        const modalDescriptionPlace = document.getElementById('modal-description');

        // Function to open the Discover page's place modal
        // This function now receives the full 'place' object directly
        window.openPlaceModal = function(placeData) {
            console.log("[Discover Page] openPlaceModal called with data:", placeData); // Log the actual data received
            if (!placeModal || !modalTitlePlace || !modalImagePlace || !modalAddressPlace || !modalDescriptionPlace) {
                console.error("Discover modal elements not found.");
                return;
            }
            modalTitlePlace.textContent = placeData.name;
            modalImagePlace.src = placeData.image;
            modalImagePlace.alt = placeData.name;
            modalAddressPlace.textContent = placeData.address;
            modalDescriptionPlace.textContent = placeData.description;

            openGenericModal('placeModal');
        }

        async function getPlacesOfInterest() {
            if (!interestCardsGrid) {
                console.warn("Interest cards grid element not found. Skipping data fetch for places of interest.");
                return;
            }
            try {
                const response = await fetch('data/places.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const places = await response.json();
                displayPlaces(places);
            } catch (error) {
                console.error('Error fetching places data:', error);
                interestCardsGrid.innerHTML = '<p>Failed to load places of interest. Please try again later.</p>';
            }
        }

        function displayPlaces(places) {
            if (!interestCardsGrid) return;
            interestCardsGrid.innerHTML = '';
            places.forEach(place => {
                const card = document.createElement('div');
                card.classList.add('interest-card', 'card-base');

                card.innerHTML = `
                    <h2>${place.name}</h2>
                    <figure>
                        <img src="${place.image}" alt="${place.name}" loading="lazy" width="300" height="200">
                        <figcaption>${place.name}</figcaption>
                    </figure>
                    <address>${place.address}</address>
                    <p>${place.description}</p>
                    <a href="#" class="learn-more-btn" data-place-id="${place.id}">Learn More</a>
                `;

                const learnMoreBtn = card.querySelector('.learn-more-btn');
                learnMoreBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    // Directly pass the 'place' object to the openPlaceModal function
                    window.openPlaceModal(place);
                });

                interestCardsGrid.appendChild(card);
            });
        }

        if (interestCardsGrid) {
            getPlacesOfInterest();
        }
    }

    // --- GENERIC MODAL FUNCTIONS FOR .modal CLASS ---
    function openGenericModal(modalId) {
        console.log(`[Generic Modal] Attempting to open modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden'); // Ensure display:flex is applied FIRST
            modal.classList.add('active');   // Then apply opacity for transition
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
            modal.classList.remove('active'); // Start fade-out transition
            modal.setAttribute('aria-hidden', 'true');

            // Set up a one-time listener for the opacity transition to end
            const handleTransitionEnd = (e) => {
                // Check if the property transitioning is opacity and if the modal is indeed no longer active
                if (e.propertyName === 'opacity' && !modal.classList.contains('active')) {
                    console.log(`[Generic Modal] Modal ${modal.id || modal.className} opacity transition ended, hiding.`);
                    modal.classList.add('hidden'); // Hide completely after transition
                    modal.removeEventListener('transitionend', handleTransitionEnd); // Clean up listener
                }
            };
            modal.addEventListener('transitionend', handleTransitionEnd);

            // Fallback timeout in case transitionend doesn't fire (e.g., if something interrupts opacity transition)
            setTimeout(() => {
                if (modal.classList.contains('active')) { // Check if it's still active (meaning transitionend didn't hide it)
                    modal.classList.remove('active'); // Remove active to ensure no stuck state
                    modal.classList.add('hidden'); // Force hide
                    console.warn(`[Generic Modal] Modal ${modal.id || modal.className} forcefully hidden by timeout (transitionend likely missed).`);
                }
            }, 350); // Slightly longer than CSS transition duration (0.3s)
        }
    }

    // --- Event Listeners for ALL .modal close buttons ---
    allModalCloseBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            console.log(`[Generic Modal Listener] Close button clicked. Event target:`, event.target);
            // Determine which modal to close based on the button's parent structure
            const modal = btn.closest('.modal') || btn.closest('.modal-overlay');
            if (modal) {
                console.log(`[Generic Modal Listener] Found parent modal: ${modal.id || modal.className}`);
                closeGenericModal(modal);
            } else {
                console.error("[Generic Modal Listener] Close button clicked, but no parent .modal or .modal-overlay found. Event prevented.");
                event.preventDefault(); // Prevent default action if modal not found
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

  // --- Thank You Page Logic ---
if (formSubmissionDetails && window.location.search && window.location.pathname.includes('thankyou.html')) {
    console.log("Thank You page JS active.");
    const params = new URLSearchParams(window.location.search);
    let detailsHtml = '<ul>';
    let hasDetailsToDisplay = false;

    // Iterate over parameters, EXCLUDING 'timestamp' from this general display
    params.forEach((value, key) => {
        if (key !== 'timestamp') { // <--- Keep this condition to exclude the raw timestamp
            const displayKey = key.replace(/\+/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            detailsHtml += `<li><strong>${displayKey}:</strong> ${decodeURIComponent(value)}</li>`;
            hasDetailsToDisplay = true;
        }
    });

    // Explicitly handle and display the formatted timestamp
    const timestampValue = params.get('timestamp');
    if (timestampValue) {
        const date = new Date(timestampValue);
        const formattedTimestamp = date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        detailsHtml += `<li><strong>Submission Timestamp:</strong> ${formattedTimestamp}</li>`;
        hasDetailsToDisplay = true; // Ensure this is true if only timestamp is present
    }
    detailsHtml += '</ul>';

    if (hasDetailsToDisplay) {
        formSubmissionDetails.innerHTML = detailsHtml;
    } else {
        formSubmissionDetails.innerHTML = '<p>No specific submission details found.</p>';
    }
}

    // ---  Close Button Logic (for #dialogBox) ---
    if (closeButtonDialog && dialogBox) {
        console.log("Original dialog close button listener active.");
        closeButtonDialog.addEventListener("click", () => {
            dialogBox.close();
        });
    }

    // ---  Backdrop Click Logic (for #dialogBox) ---
    if (dialogBox) {
        console.log("Original dialog backdrop listener active.");
        dialogBox.addEventListener('click', (e) => {
            if (e.target === dialogBox) {
                dialogBox.close();
            }
        });
    }

    // ---  MODAL LOGIC  ---
    window.openModal = function(modalId, contentHtml) {
        console.log(`Calling original window.openModal for ID: ${modalId}`);
        const modalElement = document.getElementById(modalId);
        if (modalElement && modalElement === dialogBox && dialogContent) {
            dialogContent.innerHTML = contentHtml;
            modalElement.showModal();
        } else {
            console.error(`Original dialog modal with ID ${modalId} not found or is not the expected dialogBox. This function is only for the native <dialog> element.`);
        }
    };

});