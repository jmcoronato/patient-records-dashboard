/**
 * Application constants
 * Centralizes all hardcoded values to facilitate maintenance
 */

/**
 * localStorage storage keys
 */
export const STORAGE_KEYS = {
    FAVORITES: 'favoritePatients',
    LOCAL_PATIENTS: 'localPatients',
} as const;

/**
 * Pagination configuration
 */
export const PAGINATION = {
    ITEMS_PER_PAGE: 100,
    LOAD_MORE_THRESHOLD: 200,
    SCROLL_THRESHOLD: 300,
} as const;

/**
 * Application messages
 */
export const MESSAGES = {
    SUCCESS: {
        PATIENT_ADDED: 'Patient added successfully',
        PATIENT_UPDATED: 'Patient updated successfully',
        ADDED_TO_FAVORITES: 'Added to favorites',
        REMOVED_FROM_FAVORITES: 'Removed from favorites',
    },
    ERROR: {
        FETCH_PATIENTS: 'Failed to fetch patients',
        LOAD_PATIENTS: 'Error loading patients',
        UPDATE_PATIENT: 'Error updating patient',
        GENERIC: 'An error occurred',
    },
    EMPTY: {
        NO_PATIENTS: 'No patients registered yet',
        NO_SEARCH_RESULTS: 'No patients found matching your search',
        NO_FAVORITES: 'No favorite patients yet',
        NO_FAVORITES_SEARCH: 'No favorite patients found matching your search',
    },
    PLACEHOLDER: {
        SEARCH_PATIENTS: 'Search patients...',
        SEARCH_FAVORITES: 'Search in favorites...',
        PATIENT_NAME: 'Enter patient name',
        PATIENT_DESCRIPTION: 'Enter patient description',
        PATIENT_WEBSITE: 'https://example.com',
        PATIENT_AVATAR: 'https://example.com/avatar.jpg',
    },
    VALIDATION: {
        NAME_REQUIRED: 'Name is required',
        DESCRIPTION_REQUIRED: 'Description is required',
        WEBSITE_REQUIRED: 'Website is required',
        WEBSITE_INVALID: 'Please enter a valid URL (starting with http:// or https://)',
        AVATAR_REQUIRED: 'Avatar URL is required',
        AVATAR_INVALID: 'Please enter a valid URL (starting with http:// or https://)',
    },
} as const;

/**
 * Application routes
 */
export const ROUTES = {
    HOME: '/',
    PATIENTS: '/patients',
    FAVORITES: '/favorites',
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
    BASE_URL: 'https://63bedcf7f5cfc0949b634fc8.mockapi.io/users',
    TIMEOUT: 10000,
} as const;

/**
 * UI configuration
 */
export const UI_CONFIG = {
    TOAST_POSITION: 'bottom-left' as const,
    SKELETON_COUNT: 6,
    LOADING_SKELETON_COUNT: 3,
    MOBILE_BREAKPOINT: 768,
} as const;

/**
 * Validation limits
 */
export const VALIDATION_LIMITS = {
    NAME: {
        MIN: 1,
        MAX: 100,
    },
    DESCRIPTION: {
        MIN: 10,
        MAX: 1000,
    },
    INITIALS_LENGTH: 2,
} as const;

