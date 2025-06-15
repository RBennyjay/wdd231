// data.js

// Fetch properties from a local JSON file asynchronously
export async function fetchProperties() {
    try {
        const response = await fetch('data/properties.json'); // Ensure file is placed in /data folder
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const properties = await response.json();
        return properties;
    } catch (error) {
        console.error('Failed to fetch properties:', error);
        throw error;
    }
}

// Filter logic for properties
export function filterProperties(properties, filters) {
    let filtered = [...properties]; // Avoid mutating original array

    filters = filters || {}; // Default to empty object if null or undefined

    const { type, category, minPrice, maxPrice, bedrooms } = filters;

    if (type) {
        filtered = filtered.filter(p => p.type === type);
    }

    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }

    if (minPrice !== null && minPrice !== undefined && !isNaN(minPrice)) {
        filtered = filtered.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== null && maxPrice !== undefined && !isNaN(maxPrice)) {
        filtered = filtered.filter(p => p.price <= maxPrice);
    }

    if (bedrooms !== null && bedrooms !== undefined && !isNaN(bedrooms)) {
        filtered = filtered.filter(p => p.bedrooms >= bedrooms);
    }

    return filtered;
}
