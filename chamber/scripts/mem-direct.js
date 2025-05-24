document.addEventListener('DOMContentLoaded', () => {
    const membersContainer = document.getElementById('members-container');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');

    const membersDataURL = 'data/members.json'; // Path to your JSON file

    let members = []; // To store fetched member data

    // Function to fetch member data
    async function getMembersData() {
        try {
            const response = await fetch(membersDataURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            members = await response.json();
            displayMembers('grid'); // Display in grid view by default on load
        } catch (error) {
            console.error('Failed to fetch members data:', error);
            membersContainer.innerHTML = '<p>Error loading member directory. Please try again later.</p>';
        }
    }

    // Function to create a member card (for grid view)
    function createMemberCard(member) {
        const card = document.createElement('article');
        card.classList.add('member-card');

        card.innerHTML = `
            <div class="member-card-top">
                <h4 class="member-name">${member.name}</h4>
                ${member.other_info ? `<p class="member-tagline">${member.other_info.split('.')[0]}</p>` : ''}
            </div>
            <div class="member-card-divider"></div>
            <div class="member-card-bottom">
                <div class="member-image-placeholder">
                    <img src="images/${member.image}" alt="${member.name} Logo">
                </div>
                <div class="member-contact-info">
                    <p>${member.address}</p>
                    <p><a href="tel:${member.phone}">${member.phone}</a></p>
                    <p><a href="${member.website}" target="_blank">${member.website.replace(/(^\w+:|^)\/\//, '')}</a></p>
                </div>
            </div>
        `;
        return card;
    }

    // Function to create a member list item (for list view)
    function createMemberListItem(member) {
        const listItem = document.createElement('div');
        listItem.classList.add('member-list-item');

        listItem.innerHTML = `
            <div class="col-logo">
                <img src="images/${member.image}" alt="${member.name} Logo">
            </div>
            <div class="col-name">
                <h4>${member.name}</h4>
                ${member.other_info ? `<p>${member.other_info.split('.')[0]}</p>` : ''}
            </div>
            <div class="col-contact">
                <p>${member.address}</p>
                <p>${member.phone}</p>
            </div>
            <div class="col-website">
                <a href="${member.website}" target="_blank">${member.website.replace(/(^\w+:|^)\/\//, '')}</a>
            </div>
        `;
        return listItem;
    }

    // Function to display members based on view type
    function displayMembers(viewType) {
        membersContainer.innerHTML = ''; // Clear existing content
        membersContainer.classList.remove('grid-view', 'list-view'); // Remove existing view classes
        membersContainer.classList.add(viewType + '-view'); // Add the new view class

        if (viewType === 'list') {
            // Add the list header only for list view
            const listHeader = document.createElement('div');
            listHeader.classList.add('list-header');
            listHeader.innerHTML = `
                <span class="col-logo"></span>
                <span class="col-name">Business Name</span>
                <span class="col-contact">Contact Info</span>
                <span class="col-website">Website</span>
            `;
            membersContainer.appendChild(listHeader);
        }

        members.forEach(member => {
            if (viewType === 'grid') {
                membersContainer.appendChild(createMemberCard(member));
            } else if (viewType === 'list') {
                membersContainer.appendChild(createMemberListItem(member));
            }
        });
    }

    // Event Listeners for view toggle buttons
    gridViewBtn.addEventListener('click', () => {
        displayMembers('grid');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    listViewBtn.addEventListener('click', () => {
        displayMembers('list');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });

    // Initial load of data
    getMembersData();
});