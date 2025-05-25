document.addEventListener('DOMContentLoaded', function() {
    console.log('directory.js loaded (consolidated)');

    // --- Global Elements Caching ---
    const lastModifiedSpan = document.getElementById('lastModified');
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.main-nav');
    const mainContent = document.querySelector('main');
    const hamburgerIcon = document.querySelector('.hamburger-menu i');
    const membersContainer = document.getElementById("membersContainer");
    const gridBtn = document.getElementById("gridBtn");
    const listBtn = document.getElementById("listBtn");

    // --- Last Modified Date Logic ---
    if (lastModifiedSpan) {
        lastModifiedSpan.textContent = document.lastModified;
    }

    // --- Hamburger Menu Logic ---
    if (hamburger && navMenu && mainContent && hamburgerIcon) {        
        const toggleMenu = () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('open');

            const isMenuOpen = hamburger.classList.contains('open');
            hamburgerIcon.classList.remove(isMenuOpen ? 'fa-bars' : 'fa-times');
            hamburgerIcon.classList.add(isMenuOpen ? 'fa-times' : 'fa-bars');

            // Adjust main content margin only on smaller screens
            if (window.innerWidth <= 768) {
                mainContent.style.marginTop = isMenuOpen ? `${navMenu.offsetHeight}px` : '0';
            } else {
                mainContent.style.marginTop = '0'; 
            }
        };

        hamburger.addEventListener('click', toggleMenu);

        // Close menu when a nav link is clicked (for mobile usability)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {                
                if (navMenu.classList.contains('active')) {
                    toggleMenu(); 
                }
            });
        });

        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                if (navMenu.classList.contains('active')) { 
                    toggleMenu(); 
                }
                mainContent.style.marginTop = '0'; 
            }
        });
    }

    // --- Directory Members Loading & Display Logic ---
    async function loadMembers() {
        if (!membersContainer) {
            console.warn("Members container not found. Skipping directory loading.");
            return;
        }
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

    function displayMembers(members) {
        membersContainer.innerHTML = ""; 
        members.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("member-card");
            card.innerHTML = `
                <img src="${member.image}" alt="${member.name} logo" loading="lazy" 
                     width="150" height="150" class="member-logo" />
                <h3>${member.name}</h3>
                <p>${member.description}</p>
                <p><strong>Address:</strong> ${member.address}</p>
                <p><strong>Phone:</strong> ${member.phone}</p>
                <p><a href="${member.website}" target="_blank">Visit Website</a></p>
                <p class="membership">Membership: ${getMembershipLevel(member.membership)}</p>
            `;
          membersContainer.appendChild(card);
          
          
        });

        // Ensure the initial view is set after loading members, if not already
        if (!membersContainer.classList.contains('grid-view') && !membersContainer.classList.contains('list-view')) {
            membersContainer.classList.add('grid-view'); 
        }
    }

    function getMembershipLevel(level) {
        switch (level) {
            case 3: return "Gold";
            case 2: return "Silver";
            default: return "Member";
        }
    }

    // --- View Toggle Buttons Logic ---
    if (gridBtn && listBtn && membersContainer) {
        gridBtn.addEventListener("click", () => {
            membersContainer.classList.add("grid-view");
            membersContainer.classList.remove("list-view");
        });

        listBtn.addEventListener("click", () => {
            membersContainer.classList.add("list-view");
            membersContainer.classList.remove("grid-view");
        });
    }

    
    loadMembers();
});