document.addEventListener('DOMContentLoaded', () => {
    const interestCardsGrid = document.querySelector('.interest-cards-grid');
    const visitorMessageElement = document.getElementById('visitor-message');

    // --- HAMBURGER MENU TOGGLE (ADD THIS SECTION) ---
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mainNav = document.getElementById('mainNav');

    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Optional: Toggle icon (e.g., bars to times)
            const icon = hamburgerMenu.querySelector('i');
            if (icon) { // Check if the icon element exists
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
            document.body.classList.toggle('menu-open');
        });

        // Optional: Close the nav when a link inside it is clicked
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Only close if it's currently active (important for desktop view)
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    // Reset icon
                    const icon = hamburgerMenu.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });

        // Optional: Close nav if window is resized above mobile breakpoint
        let isMobileView = window.matchMedia("(max-width: 768px)").matches;
        window.addEventListener('resize', () => {
            const newIsMobileView = window.matchMedia("(max-width: 768px)").matches;
            if (!newIsMobileView && isMobileView && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                // Reset icon
                const icon = hamburgerMenu.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            isMobileView = newIsMobileView;
        });

    } else {
        console.warn("Hamburger menu or main navigation element not found. Check your HTML IDs (id='hamburgerMenu', id='mainNav').");
    }
    // --- END HAMBURGER MENU TOGGLE ---


    // Function to handle the fade-out process for the visitor message
    const fadeOutVisitorMessage = () => {
        if (visitorMessageElement) {
            visitorMessageElement.classList.add('fade-out'); // Add CSS class to trigger transition
            visitorMessageElement.addEventListener('transitionend', () => {
                visitorMessageElement.classList.add('hidden'); // Fully hide the element after fade
            }, { once: true }); // Ensure this listener only fires once
        }
    };

    // Function to calculate and display last visit message
    function displayLastVisitMessage() {
        if (!visitorMessageElement) return; // Exit if message element doesn't exist

        const lastVisit = localStorage.getItem('lastVisit');
        const now = Date.now(); // Current time in milliseconds

        if (!lastVisit) {
            // First visit
            visitorMessageElement.textContent = "Welcome! Let us know if you have any questions.";
        } else {
            const lastVisitDate = parseInt(lastVisit);
            const timeDifference = now - lastVisitDate; // Difference in milliseconds

            const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in one day

            if (timeDifference < oneDay) {
                visitorMessageElement.textContent = "Back so soon! Awesome!";
            } else {
                const daysDifference = Math.round(timeDifference / oneDay);
                if (daysDifference === 1) {
                    visitorMessageElement.textContent = "You last visited 1 day ago.";
                } else {
                    visitorMessageElement.textContent = `You last visited ${daysDifference} days ago.`;
                }
            }
        }

        // Store the current visit time for the next visit
        localStorage.setItem('lastVisit', now.toString());

        // Trigger the auto-fade out after the message is displayed
        const autoFadeDuration = 8000; // Message fades out after 8 seconds
        setTimeout(fadeOutVisitorMessage, autoFadeDuration);
    }

    // --- MODAL ELEMENTS ---

    
    let placeModal = document.getElementById('placeModal');
    if (!placeModal) { // Only create if it doesn't already exist
        const modalDiv = document.createElement('div');
        modalDiv.id = 'placeModal';
        modalDiv.classList.add('modal');
        modalDiv.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h3 id="modal-title"></h3>
                <img id="modal-image" src="" alt="" loading="lazy">
                <p id="modal-address"></p>
                <p id="modal-description"></p>
            </div>
        `;
        document.body.appendChild(modalDiv);
        placeModal = document.getElementById('placeModal'); // Re-assign after appending
    }

    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalAddress = document.getElementById('modal-address');
    const modalDescription = document.getElementById('modal-description');
    const closeButton = placeModal ? placeModal.querySelector('.close-button') : null; // Ensure placeModal exists before querying

    // --- MODAL FUNCTIONS ---
    // Function to open the modal and populate its content
    function openModal(placeData) {
        if (!placeModal || !modalTitle || !modalImage || !modalAddress || !modalDescription) {
            console.error("Modal elements not found for openModal. Check your HTML and dynamic creation logic.");
            return;
        }
        modalTitle.textContent = placeData.name;
        modalImage.src = placeData.image;
        modalImage.alt = placeData.name;
        modalAddress.textContent = placeData.address;
        modalDescription.textContent = placeData.description;

        placeModal.classList.add('active');
    }

    // Function to close the modal
    function closeModal() {
        if (placeModal) {
            placeModal.classList.remove('active');
        }
    }

    // Event listeners to close the modal
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the modal content (on the overlay)
    window.addEventListener('click', (event) => {
        if (event.target === placeModal) {
            closeModal();
        }
    });

    // Close modal with the Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && placeModal && placeModal.classList.contains('active')) {
            closeModal();
        }
    });


    // Function to fetch data and build cards
    async function getPlacesOfInterest() {
        if (!interestCardsGrid) {
            console.warn("Interest cards grid element not found. Skipping data fetch for places of interest.");
            return; // Exit if the grid isn't present on this page
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

    // add event listeners to "Learn More" buttons
    function displayPlaces(places) {
        if (!interestCardsGrid) return; // Exit if the grid isn't present

        places.forEach(place => {
            const card = document.createElement('div');
            card.classList.add('interest-card');

            const h2 = document.createElement('h2');
            h2.textContent = place.name;

            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = place.image;
            img.alt = place.name;
            img.loading = 'lazy';
            img.width = 300;
            img.height = 200;

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = place.name;

            figure.appendChild(img);
            figure.appendChild(figcaption);

            const address = document.createElement('address');
            address.textContent = place.address;

            const description = document.createElement('p');
            description.textContent = place.description;

            const learnMoreBtn = document.createElement('a');
            learnMoreBtn.href = '#';
            learnMoreBtn.textContent = 'Learn More';
            learnMoreBtn.classList.add('learn-more-btn');

            // Add event listener to the "Learn More" button
            learnMoreBtn.addEventListener('click', (event) => {
                event.preventDefault();
                openModal(place);
            });

            card.appendChild(h2);
            card.appendChild(figure);
            card.appendChild(address);
            card.appendChild(description);
            card.appendChild(learnMoreBtn);

            interestCardsGrid.appendChild(card);
        });
    }

    // Call functions on page load conditionally
    // Check if the current page has the visitor message element before calling
    if (visitorMessageElement) {
        displayLastVisitMessage();
    }
    // Check if the current page has the interest cards grid before calling
    if (interestCardsGrid) {
        getPlacesOfInterest();
    }


    const currentYearSpan = document.getElementById('currentyear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    const lastModifiedSpan = document.getElementById('lastModified');
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }
});



document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('.search-icon');
    const searchBarContainer = document.createElement('div'); // Create a new div for the search bar
    searchBarContainer.classList.add('search-bar-container'); // Add a class for styling

    // Create the search input field
    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'Search...');
    searchInput.classList.add('search-input'); // Add a class for styling

    // Append the input to the container
    searchBarContainer.appendChild(searchInput);

    // Insert the search bar container 
    const headerRightGroup = document.querySelector('.header-right-group');
    if (headerRightGroup) {
        headerRightGroup.parentNode.insertBefore(searchBarContainer, headerRightGroup.nextSibling);
    }

    // Add a click event listener to the search icon
    searchIcon.addEventListener('click', function() {
        // Toggle the 'active' class to show/hide the search bar
        searchBarContainer.classList.toggle('active');

        //  Focus the input field when it appears
        if (searchBarContainer.classList.contains('active')) {
            searchInput.focus();
        }
    });

    //  Hide search bar if user clicks outside of it
    document.addEventListener('click', function(event) {
        const isClickInsideSearchBar = searchBarContainer.contains(event.target) || searchIcon.contains(event.target);
        if (!isClickInsideSearchBar && searchBarContainer.classList.contains('active')) {
            searchBarContainer.classList.remove('active');
        }
    });
});