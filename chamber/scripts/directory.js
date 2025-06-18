document.addEventListener('DOMContentLoaded', function() {
    console.log('directory.js loaded');

    // Last Modified Date Logic
    const lastModifiedSpan = document.getElementById('lastModified');
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    // Hamburger Menu Logic
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.main-nav');
    const mainContent = document.querySelector('main'); 
    const hamburgerIcon = document.querySelector('.hamburger-menu i');     
    if (hamburger && navMenu && mainContent && hamburgerIcon) { 
        hamburger.addEventListener('click', function () {            
            navMenu.classList.toggle('active'); 
            hamburger.classList.toggle('open'); 

            // --- Icon Change Logic: Swap Font Awesome classes ---
            if (hamburger.classList.contains('open')) {
                hamburgerIcon.classList.remove('fa-bars'); 
                hamburgerIcon.classList.add('fa-times');  
            } else {
                hamburgerIcon.classList.remove('fa-times'); 
                hamburgerIcon.classList.add('fa-bars');  
            }
           
            // --- Content Pushing Logic ---
            if (window.innerWidth <= 768) {
                if (navMenu.classList.contains('active')) {
                    const navHeight = navMenu.offsetHeight; 
                    mainContent.style.marginTop = `${navHeight}px`;
                } else {
                    mainContent.style.marginTop = '0';
                }
            } else {
                mainContent.style.marginTop = '0';
            }
        });

        // Close the menu when a nav link is clicked 
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active'); 
                hamburger.classList.remove('open');
                
                // --- Icon Change Logic on Close: Reset to bars icon ---
                hamburgerIcon.classList.remove('fa-times');
                hamburgerIcon.classList.add('fa-bars');                

                mainContent.style.marginTop = '0';
            });
        });

        //  Reset margin-top and close nav if window is resized from mobile to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mainContent.style.marginTop = '0';
                navMenu.classList.remove('active');
                hamburger.classList.remove('open');
                
                // --- Icon Change Logic on Resize: Reset to bars icon ---
                hamburgerIcon.classList.remove('fa-times');
                hamburgerIcon.classList.add('fa-bars');
               
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.querySelector('.search-icon');
    const searchBarContainer = document.createElement('div'); // Create a new div for the search bar
    searchBarContainer.classList.add('search-bar-container'); 

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