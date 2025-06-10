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

    // --- MODAL ELEMENTS FOR DYNAMIC CONTENT ---
    const dialogBox = document.querySelector("#dialogBox");
    const closeButton = document.querySelector("#closeButton");
    const dialogContent = document.querySelector("#dialogContent"); 


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
        const toggleMenu = () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('open');

            const isMenuOpen = hamburger.classList.contains('open');
            hamburgerIcon.classList.toggle('fa-bars');
            hamburgerIcon.classList.toggle('fa-times');

            // hamburgerIcon.classList.remove(isMenuOpen ? 'fa-bars' : 'fa-times');
            // hamburgerIcon.classList.add(isMenuOpen ? 'fa-times' : 'fa-bars');

            if (window.innerWidth <= 768) {
                mainContent.style.marginTop = isMenuOpen ? `${navMenu.offsetHeight}px` : '0';
            } else {
                mainContent.style.marginTop = '0';
            }
        };

        hamburger.addEventListener('click', toggleMenu);

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

    // --- Membership Level Mapping ---
    function getMembershipLevel(level) {
        switch (level) {
            case 1: return "Gold";
            case 2: return "Silver";
            case 3: return "Bronze";
            default: return "Standard Member";
        }
    }

    // Close dialog box when the close button is clicked 
    if (closeButton && dialogBox) {
        closeButton.addEventListener("click", () => {
            dialogBox.close(); 
        });
    }

    // Close dialog if clicking outside (backdrop click)
    if (dialogBox) {
        dialogBox.addEventListener('click', (e) => {
            if (e.target === dialogBox) {
                dialogBox.close();
            }
        });
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

    // --- MODAL LOGIC globally accessible for onclick ---
    window.openModal = function(modalId, contentHtml) {
        const modal = document.getElementById(modalId);
        if (modal && dialogContent) { 
            dialogContent.innerHTML = contentHtml; 
            modal.showModal(); 
        } else {
            console.error(`Modal with ID ${modalId} or dialogContent not found.`);
        }
    };

    // --- Thank You Page Logic ---
    if (formSubmissionDetails && window.location.search) {        
        const params = new URLSearchParams(window.location.search);      

        let detailsHtml = '<ul>';
        let hasDetailsToDisplay = false; 

        params.forEach((value, key) => {
            if (key !== 'timestamp') { 
                const displayKey = key.charAt(0).toUpperCase() + key.slice(1);
                detailsHtml += `<li><strong>${displayKey}:</strong> ${decodeURIComponent(value)}</li>`;
                hasDetailsToDisplay = true; 
            }
        });
        detailsHtml += '</ul>';

        

        if (hasDetailsToDisplay) {            
            formSubmissionDetails.innerHTML = ''; 
            formSubmissionDetails.innerHTML += detailsHtml; 
            
        } else {
            formSubmissionDetails.innerHTML = '<p>No specific submission details found (or all were timestamps).</p>';
          
        }
    } else {
      
    }

    // Initiate loading of members 
    if (membersContainer) {
        loadMembers();
    }
});