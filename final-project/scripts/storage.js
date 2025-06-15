// This module handles interactions with browser's local storage.

const FILTER_PREFS_KEY = 'propertyFilterPreferences';

export function saveFilterPreferences(filters) {
    try {
        localStorage.setItem(FILTER_PREFS_KEY, JSON.stringify(filters));
        console.log('Filter preferences saved:', filters);
    } catch (e) {
        console.error('Error saving filter preferences to local storage:', e);
    }
}

export function loadFilterPreferences() {
    try {
        const stored = localStorage.getItem(FILTER_PREFS_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error('Error loading filter preferences from local storage:', e);
        return null;
    }
}

