/**
 * Main patient service
 * Orchestrates business operations combining API and local storage
 */

import { Patient } from "@/types/patient";
import { fetchPatients as apiFetchPatients, FetchPatientsParams } from "./api/patientApi";
import {
  getLocalPatients,
  addLocalPatient,
  updateLocalPatient,
} from "./storage/patientsStorage";
import {
  getFavoritePatients,
  saveFavoritePatients,
  isFavorite,
  toggleFavorite as toggleFavoriteStorage,
  updateFavoritePatient as updateFavoritePatientStorage,
} from "./storage/favoritesStorage";

/**
 * Get patients combining API and local storage
 */
export const fetchPatients = async (
  params: FetchPatientsParams = {}
): Promise<Patient[]> => {
  return apiFetchPatients(params);
};

/**
 * Add a new patient
 */
export const addPatient = (
  patientData: Omit<Patient, "id" | "createdAt">
): Patient => {
  return addLocalPatient(patientData);
};

/**
 * Update an existing patient
 */
export const updatePatient = (
  patientId: string,
  patientData: Partial<Patient>
): Patient | null => {
  return updateLocalPatient(patientId, patientData);
};

// Re-export functions for favorites to maintain compatibility
export { getFavoritePatients, saveFavoritePatients, isFavorite, updateFavoritePatientStorage as updateFavoritePatient };
export { toggleFavoriteStorage as toggleFavorite };
export { getLocalPatients, saveLocalPatients } from "./storage/patientsStorage";
export type { FetchPatientsParams };
