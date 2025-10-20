/**
 * Storage service for favorite patients
 * Handles the persistence of favorites in localStorage
 */

import { Patient } from "@/types/patient";
import { StorageAdapter } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/app";

const storage = new StorageAdapter<Patient[]>(STORAGE_KEYS.FAVORITES);

/**
 * Get all favorite patients
 */
export const getFavoritePatients = (): Patient[] => {
    return storage.getOrDefault([]);
};

/**
 * Save the list of favorite patients
 */
export const saveFavoritePatients = (patients: Patient[]): boolean => {
    return storage.set(patients);
};

/**
 * Check if a patient is favorite
 */
export const isFavorite = (patientId: string): boolean => {
    const favorites = getFavoritePatients();
    return favorites.some((p) => p.id === patientId);
};

/**
 * Add a patient to favorites
 */
export const addToFavorites = (patient: Patient): boolean => {
    const favorites = getFavoritePatients();

    // Avoid duplicates
    if (isFavorite(patient.id)) {
        return false;
    }

    const updated = [patient, ...favorites];
    return saveFavoritePatients(updated);
};

/**
 * Remove a patient from favorites
 */
export const removeFromFavorites = (patientId: string): boolean => {
    const favorites = getFavoritePatients();
    const updated = favorites.filter((p) => p.id !== patientId);
    return saveFavoritePatients(updated);
};

/**
 * Toggle the favorite status of a patient
 * Returns true if added, false if removed
 */
export const toggleFavorite = (patient: Patient): boolean => {
    if (isFavorite(patient.id)) {
        removeFromFavorites(patient.id);
        return false;
    } else {
        addToFavorites(patient);
        return true;
    }
};

/**
 * Update an existing favorite patient
 */
export const updateFavoritePatient = (updatedPatient: Patient): boolean => {
    const favorites = getFavoritePatients();
    const updated = favorites.map((p) =>
        p.id === updatedPatient.id ? updatedPatient : p
    );
    return saveFavoritePatients(updated);
};

/**
 * Clear all favorites
 */
export const clearFavorites = (): boolean => {
    return storage.set([]);
};

