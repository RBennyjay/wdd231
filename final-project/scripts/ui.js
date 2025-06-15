// This module handles DOM manipulation and UI rendering.

// Define the Naira formatter once at the top of the module
const nairaFormatter = new Intl.NumberFormat('en-NG', { // 'en-NG' for English (Nigeria) locale
    style: 'currency',
    currency: 'NGN', // 'NGN' is the currency code for Nigerian Naira
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0  
});


export function renderProperties(properties, containerElement) {
    if (!containerElement) {
        console.error('Container element not found for rendering properties.');
        return;
    }

    if (properties.length === 0) {
        containerElement.innerHTML = '<p class="no-results-message">No properties found matching your criteria.</p>';
        return;
    }

    const html = properties.map(property => `
        <div class="property-card" data-id="${property.id}">
            <img src="${property.image}" alt="${property.address}" loading="lazy">
            <div class="property-card-content">
                <h3>${property.address}</h3>
                <p><strong>Type:</strong> ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</p>
                <p><strong>Category:</strong> ${property.category.charAt(0).toUpperCase() + property.category.slice(1)}</p>
                <p><strong>Bedrooms:</strong> ${property.bedrooms}</p>
                <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
                <p class="price">${nairaFormatter.format(property.price)}</p> <button class="view-details-btn button primary-button">View Details</button>
            </div>
        </div>
    `).join('');

    containerElement.innerHTML = html;
}

export function openModal(propertyData, modalElement) {
    if (!modalElement) {
        console.error('Modal element not found.');
        return;
    }

    const modalTitle = modalElement.querySelector('#modal-title');
    const modalBody = modalElement.querySelector('#modal-description');

    if (modalTitle && modalBody) {
        modalTitle.textContent = propertyData.address;
        modalBody.innerHTML = `
            <img src="${propertyData.image}" alt="${propertyData.address}">
            <p><strong>Price:</strong> ${nairaFormatter.format(propertyData.price)}</p> <p><strong>Type:</strong> ${propertyData.type.charAt(0).toUpperCase() + propertyData.type.slice(1)}</p>
            <p><strong>Category:</strong> ${propertyData.category.charAt(0).toUpperCase() + propertyData.category.slice(1)}</p>
            <p><strong>Bedrooms:</strong> ${propertyData.bedrooms}</p>
            <p><strong>Bathrooms:</strong> ${propertyData.bathrooms}</p>
            <p><strong>Area:</strong> ${propertyData.area_sqft.toLocaleString()} sqft</p>
            <p><strong>Description:</strong> ${propertyData.description}</p>
            <p><strong>Agent:</strong> ${propertyData.agent}</p>
            <p><strong>Contact:</strong> <a href="mailto:${propertyData.contact}">${propertyData.contact}</a></p>
        `;
    }

    modalElement.style.display = 'flex'; // Show the modal
    document.body.classList.add('modal-open'); // Prevent body scrolling
}

export function closeModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'none'; // Hide the modal
        document.body.classList.remove('modal-open'); // Re-enable body scrolling
    }
}