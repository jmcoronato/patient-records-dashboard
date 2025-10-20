/**
 * Storage service for local patients
 * Handles the persistence of patients created/edited locally
 */

import { Patient } from "@/types/patient";
import { StorageAdapter } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/app";

const storage = new StorageAdapter<Patient[]>(STORAGE_KEYS.LOCAL_PATIENTS);

/**
 * Get all local patients
 */
export const getLocalPatients = (): Patient[] => {
    return storage.getOrDefault([]);
};

/**
 * Save the list of local patients
 */
export const saveLocalPatients = (patients: Patient[]): boolean => {
    return storage.set(patients);
};

/**
 * Add a new local patient
 */
export const addLocalPatient = (
    patientData: Omit<Patient, "id" | "createdAt">
): Patient => {
    const localPatients = getLocalPatients();

    const newPatient: Patient = {
        id: Date.now().toString(),
        ...patientData,
        createdAt: new Date().toISOString(),
    };

    const updated = [newPatient, ...localPatients];
    saveLocalPatients(updated);

    return newPatient;
};

/**
 * Update an existing local patient or create a new one if it doesn't exist
 */
export const updateLocalPatient = (
    patientId: string,
    patientData: Partial<Patient>
): Patient | null => {
    const localPatients = getLocalPatients();
    const patientIndex = localPatients.findIndex((p) => p.id === patientId);

    if (patientIndex === -1) {
        // If not in local patients, create a local copy of the patient.
        // This allows editing patients that originally came from the server
        const newLocalPatient: Patient = {
            id: patientId,
            name: patientData.name || "",
            description: patientData.description || "",
            website: patientData.website || "",
            avatar: patientData.avatar || "",
            createdAt: patientData.createdAt || new Date().toISOString(),
        };

        const updated = [newLocalPatient, ...localPatients];
        saveLocalPatients(updated);
        return newLocalPatient;
    }

    // Update existing patient
    const updatedPatient = {
        ...localPatients[patientIndex],
        ...patientData,
        id: patientId, // Ensure the ID doesn't change
    };

    localPatients[patientIndex] = updatedPatient;
    saveLocalPatients(localPatients);

    return updatedPatient;
};

/**
 * Delete a local patient
 */
export const deleteLocalPatient = (patientId: string): boolean => {
    const localPatients = getLocalPatients();
    const updated = localPatients.filter((p) => p.id !== patientId);
    return saveLocalPatients(updated);
};

/**
 * Check if a patient exists in the local storage
 */
export const isLocalPatient = (patientId: string): boolean => {
    const localPatients = getLocalPatients();
    return localPatients.some((p) => p.id === patientId);
};

/**
 * Get a specific local patient
 */
export const getLocalPatient = (patientId: string): Patient | null => {
    const localPatients = getLocalPatients();
    return localPatients.find((p) => p.id === patientId) || null;
};

/**
 * Clear all local patients
 */
export const clearLocalPatients = (): boolean => {
    return storage.set([]);
};

