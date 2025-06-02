// spotlight.js

document.addEventListener('DOMContentLoaded', () => {
    // Members JSON data
    const chamberMembers = [
        {
            "name": "Eko Bakery & Confectionery",
            "address": "15 Adeola Odeku St, Victoria Island, Lagos",
            "phone": "+234 809 123 4567",
            "website": "http://ekobakery.com",
            "image": "images/bread.webp",
            "membership": 3, // Assuming 1=Gold, 2=Silver, 3=Bronze
            "description": "Freshly baked bread, pastries, and custom cakes for all occasions."
        },
        {
            "name": "Lagos Tech Solutions",
            "address": "2 Ikoyi Rd, Ikoyi, Lagos",
            "phone": "+234 901 234 5678",
            "website": "http://lagostechsolutions.com",
            "image": "images/tech.webp",
            "membership": 2, // Silver
            "description": "Comprehensive IT support, software development, and network solutions."
        },
        {
            "name": "Green Thumb Landscaping & Nurseries",
            "address": "7 Oba Akran Ave, Ikeja, Lagos",
            "phone": "+234 703 456 7890",
            "website": "http://greenthumb.com.ng",
            "image": "images/landscape.webp",
            "membership": 1, // Gold
            "description": "Expert landscape design, garden maintenance, and plant supply."
        },
        {
            "name": "Fitness Hub Lagos",
            "address": "Plot 5, Admiralty Way, Lekki Phase 1, Lagos",
            "phone": "+234 815 678 9012",
            "website": "http://fitnesshublagos.com",
            "image": "images/fitness.webp",
            "membership": 3, // Bronze
            "description": "State-of-the-art gym facilities, personal training, and group fitness classes."
        },
        {
            "name": "PawCare Vet Clinic",
            "address": "4 Tinubu St, Surulere, Lagos",
            "phone": "+234 802 345 6789",
            "website": "http://pawcarevet.ng",
            "image": "images/clinic.webp",
            "membership": 2, // Silver
            "description": "Compassionate veterinary care, pet grooming, and boarding services."
        },
        {
            "name": "Buka Bites Restaurant",
            "address": "Block B, Balogun Market, Lagos Island, Lagos",
            "phone": "+234 706 789 0123",
            "website": "http://bukabites.ng",
            "image": "images/restuarant.webp",
            "membership": 1, // Gold
            "description": "Authentic Nigerian cuisine in a vibrant and welcoming atmosphere."
        },
        {
            "name": "Digital Waves Agency",
            "address": "10 Bourdeillon Rd, Ikoyi, Lagos",
            "phone": "+234 908 765 4321",
            "website": "http://digitalwaves.ng",
            "image": "images/waves.webp",
            "membership": 2, // Silver
            "description": "Innovative digital marketing, branding, and web development services."
        }
    ];

    // Helper to map numeric membership level to a string (for display)
    function getMembershipLevelString(level) {
        switch (level) {
            case 1: return "Gold";
            case 2: return "Silver";
            case 3: return "Bronze";
            default: return "Standard";
        }
    }

    function displayBusinessSpotlights() {
        const spotlightContainer = document.getElementById('business-spotlights');
        if (!spotlightContainer) {
            console.error("Business spotlight container with ID 'business-spotlights' not found!");
            return;
        }
        
        const h2Title = spotlightContainer.querySelector('h2');
        spotlightContainer.querySelectorAll('.business-card').forEach(card => card.remove());

        // 1. Filter for Gold (membership 1) or Silver (membership 2) members
        const eligibleMembers = chamberMembers.filter(member => 
            member.membership === 1 || member.membership === 2
        );

        // 2. Select exactly 3 members, or fewer if not enough eligible members exist
        const desiredNumSpotlights = 3;
        const actualNumSpotlights = Math.min(desiredNumSpotlights, eligibleMembers.length); 

        const selectedMembers = [];
        const tempEligibleMembers = [...eligibleMembers]; // Create a mutable copy to pick from

        for (let i = 0; i < actualNumSpotlights; i++) {
            if (tempEligibleMembers.length === 0) break; // No more members to select
            const randomIndex = Math.floor(Math.random() * tempEligibleMembers.length);
            selectedMembers.push(tempEligibleMembers.splice(randomIndex, 1)[0]); // Add and remove to prevent duplicates
        }

        // 3. Display the selected members
        selectedMembers.forEach(member => {
            const card = document.createElement('div');
            card.className = 'business-card'; 

            card.innerHTML = `
                <div class="business-card-top">
                    <h4 class="business-name">${member.name}</h4>
                    <p class="business-tagline">${member.description || ''}</p>
                </div>
                <div class="business-card-divider"></div>
                <div class="business-card-bottom">
                    <div class="business-image-placeholder">
                    <img src="${member.image}" alt="${member.name} Logo" width="150" height="150">                        
                    </div>
                    <div class="contact-info">
                        ${member.phone ? `<p>PHONE: ${member.phone}</p>` : ''}
                        ${member.address ? `<p>ADDRESS: ${member.address}</p>` : ''}
                        ${member.website ? `<p>URL: <a href="${member.website}" target="_blank">${member.website.replace(/(^\w+:|^)\/\//, '')}</a></p>` : ''}
                        <p class="membership-level">Membership: <strong>${getMembershipLevelString(member.membership)}</strong></p>
                    </div>
                </div>
            `;
            if (h2Title) {
                h2Title.insertAdjacentElement('afterend', card);
            } else {
                spotlightContainer.appendChild(card);
            }
        });
    }

    displayBusinessSpotlights();
});