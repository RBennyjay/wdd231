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
            // --- End Icon Change Logic ---

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

        // Close the menu when a nav link is clicked (for mobile usability)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active'); 
                hamburger.classList.remove('open');
                
                // --- Icon Change Logic on Close: Reset to bars icon ---
                hamburgerIcon.classList.remove('fa-times');
                hamburgerIcon.classList.add('fa-bars');
                // --- End Icon Change Logic on Close ---

                mainContent.style.marginTop = '0';
            });
        });

        // Optional: Reset margin-top and close nav if window is resized from mobile to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                mainContent.style.marginTop = '0';
                navMenu.classList.remove('active');
                hamburger.classList.remove('open');
                
                // --- Icon Change Logic on Resize: Reset to bars icon ---
                hamburgerIcon.classList.remove('fa-times');
                hamburgerIcon.classList.add('fa-bars');
                // --- End Icon Change Logic on Resize ---
            }
        });
    }
});