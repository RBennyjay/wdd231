// Function to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

import { fetchProperties, filterProperties } from './data.js';
import { renderProperties, openModal, closeModal } from './ui.js';
import { saveFilterPreferences, loadFilterPreferences } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const propertyListingsContainer = document.getElementById('property-listings-container');
    const featuredPropertiesContainer = document.getElementById('featured-properties-container');
    const filterForm = document.getElementById('property-filter-form');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    
    const propertyDetailsModal = document.getElementById('property-details-modal');
    const closeModalButton = propertyDetailsModal?.querySelector('.close-button');

    let allProperties = [];

    // --- Common UI for all pages ---
    const mobileNavToggleCheckbox = document.getElementById('mobile-nav-toggle-checkbox');
    const navList = document.querySelector('.nav-list');

    if (mobileNavToggleCheckbox && navList) {
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavToggleCheckbox.checked = false;
            });
        });
    }

    const yearEl = document.getElementById("year");
    const lastModEl = document.getElementById("lastModified");

    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    if (lastModEl) {
        lastModEl.textContent = document.lastModified;
    }

    // --- Logic specific to properties.html ---
    if (propertyListingsContainer) {
        try {
            allProperties = await fetchProperties();
            
            const savedFilters = loadFilterPreferences();
            if (savedFilters) {
                const propertyTypeEl = document.getElementById('property-type');
                if (propertyTypeEl) propertyTypeEl.value = savedFilters.type || '';
                const propertyCategoryEl = document.getElementById('property-category');
                if (propertyCategoryEl) propertyCategoryEl.value = savedFilters.category || '';
                const minPriceEl = document.getElementById('min-price');
                if (minPriceEl) minPriceEl.value = savedFilters.minPrice || '';
                const maxPriceEl = document.getElementById('max-price');
                if (maxPriceEl) maxPriceEl.value = savedFilters.maxPrice || '';
                const bedroomsEl = document.getElementById('bedrooms');
                if (bedroomsEl) bedroomsEl.value = savedFilters.bedrooms || '';
            }

            const initialFilteredProperties = filterProperties(allProperties, savedFilters);
            renderProperties(initialFilteredProperties, propertyListingsContainer);

            if (filterForm) {
                filterForm.addEventListener('submit', (event) => {
                    event.preventDefault();

                    const formData = new FormData(filterForm);
                    const filters = {
                        type: formData.get('type'),
                        category: formData.get('category'),
                        minPrice: formData.get('minPrice') ? parseFloat(formData.get('minPrice')) : null,
                        maxPrice: formData.get('maxPrice') ? parseFloat(formData.get('maxPrice')) : null,
                        bedrooms: formData.get('bedrooms') ? parseInt(formData.get('bedrooms')) : null,
                    };

                    saveFilterPreferences(filters);
                    const filteredProperties = filterProperties(allProperties, filters);
                    renderProperties(filteredProperties, propertyListingsContainer);
                });

                if (resetFiltersBtn) {
                    resetFiltersBtn.addEventListener('click', () => {
                        filterForm.reset();
                        saveFilterPreferences({});
                        renderProperties(allProperties, propertyListingsContainer);
                    });
                }
            }

            propertyListingsContainer.addEventListener('click', (event) => {
                const viewDetailsBtn = event.target.closest('.view-details-btn');
                if (viewDetailsBtn) {
                    const propertyCard = viewDetailsBtn.closest('.property-card');
                    const propertyId = propertyCard?.dataset.id;
                    if (propertyId) {
                        const property = allProperties.find(p => p.id === propertyId);
                        if (property) {
                            openModal(property, propertyDetailsModal);
                        }
                    }
                }
            });

        } catch (error) {
            if (propertyListingsContainer) {
                propertyListingsContainer.innerHTML = '<p class="error-message">Failed to load properties. Please try again later.</p>';
            }
        }
    }

    // --- Logic specific to index.html (featured properties) ---
    if (featuredPropertiesContainer) {
        try {
            if (allProperties.length === 0) {
                allProperties = await fetchProperties();
            }

            if (!Array.isArray(allProperties) || allProperties.length === 0) {
                featuredPropertiesContainer.innerHTML = '<p class="error-message">No properties available to display.</p>';
                return;
            }

            const shuffledProperties = shuffleArray([...allProperties]);
            const featuredProperties = shuffledProperties.slice(0, 3);
            renderProperties(featuredProperties, featuredPropertiesContainer);

            featuredPropertiesContainer.addEventListener('click', (event) => {
                const viewDetailsBtn = event.target.closest('.view-details-btn');
                if (viewDetailsBtn) {
                    const propertyCard = viewDetailsBtn.closest('.property-card');
                    const propertyId = propertyCard?.dataset.id;
                    if (propertyId) {
                        const property = allProperties.find(p => p.id === propertyId);
                        if (property) {
                            openModal(property, propertyDetailsModal);
                        }
                    }
                }
            });

        } catch (error) {
            featuredPropertiesContainer.innerHTML = '<p class="error-message">Failed to load featured properties.</p>';
        }
    }

    // --- Modal Close Listeners ---
    if (propertyDetailsModal) {
        if (closeModalButton) {
            closeModalButton.addEventListener('click', () => closeModal(propertyDetailsModal));
        }
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && propertyDetailsModal?.style.display === 'flex') {
                closeModal(propertyDetailsModal);
            }
        });
        propertyDetailsModal.addEventListener('click', (event) => {
            if (event.target === propertyDetailsModal) {
                closeModal(propertyDetailsModal);
            }
        });
    }

    // --- Logic specific to submission-success.html ---
    const submittedDataDisplay = document.getElementById('submitted-data-display');
    if (submittedDataDisplay) {
        const urlParams = new URLSearchParams(window.location.search);
        let dataHtml = '<h3>Submitted Information:</h3>';
        if (urlParams.toString()) {
            urlParams.forEach((value, key) => {
                dataHtml += `<p><strong>${key}:</strong> ${decodeURIComponent(value)}</p>`;
            });
        } else {
            dataHtml += '<p>No data submitted or data not found.</p>';
        }
        submittedDataDisplay.innerHTML = dataHtml;
    }
});
