/**
 * Hook for patient mutations using React Query
 * Handles creating/updating patients with optimistic cache updates
 */

import { useQueryClient } from "@tanstack/react-query";
import { Patient, PatientFormData } from "@/types/patient";
import { addPatient, updatePatient } from "@/services/patientService";
import {
  isFavorite,
  updateFavoritePatient as updateFavoritePatientService,
} from "@/services/storage/favoritesStorage";
import { toast } from "react-hot-toast";
import { MESSAGES } from "@/constants/app";

interface PatientPage {
  patients: Patient[];
  nextPage: number | null;
}

export const usePatientMutations = () => {
  const queryClient = useQueryClient();

  /**
   * Adds a patient to React Query cache without refetching
   */
  const addPatientToCache = (newPatient: Patient) => {
    queryClient.setQueryData<{ pages: PatientPage[]; pageParams: number[] }>(
      ["patients"],
      (oldData) => {
        if (!oldData) return oldData;

        // Add the new patient at the beginning of the first page
        const updatedPages = [...oldData.pages];
        if (updatedPages.length > 0) {
          updatedPages[0] = {
            ...updatedPages[0],
            patients: [newPatient, ...updatedPages[0].patients],
          };
        }

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );
  };

  /**
   * Updates a patient in React Query cache without refetching
   */
  const updatePatientInCache = (updatedPatient: Patient) => {
    queryClient.setQueryData<{ pages: PatientPage[]; pageParams: number[] }>(
      ["patients"],
      (oldData) => {
        if (!oldData) return oldData;

        // Find and update the patient in all pages
        const updatedPages = oldData.pages.map((page) => ({
          ...page,
          patients: page.patients.map((patient) =>
            patient.id === updatedPatient.id ? updatedPatient : patient
          ),
        }));

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    );
  };

  /**
   * Creates a new patient and updates the cache
   */
  const createPatient = (data: PatientFormData): Patient => {
    // Create the patient locally
    const newPatient = addPatient(data);

    // Actualizar el cache sin hacer refetch
    addPatientToCache(newPatient);

    toast.success(MESSAGES.SUCCESS.PATIENT_ADDED);

    return newPatient;
  };

  /**
   * Updates an existing patient and updates the cache
   */
  const updateExistingPatient = (
    patientId: string,
    data: Partial<Patient>
  ): Patient | null => {
    // Update the patient locally
    const updated = updatePatient(patientId, data);

    if (updated) {
      // Actualizar el cache sin hacer refetch
      updatePatientInCache(updated);

      // If the patient is favorite, also update it in favorites
      if (isFavorite(patientId)) {
        updateFavoritePatientService(updated);
      }

      toast.success(MESSAGES.SUCCESS.PATIENT_UPDATED);
    } else {
      toast.error(MESSAGES.ERROR.UPDATE_PATIENT);
    }

    return updated;
  };

  /**
   * Saves a patient (creates or updates depending on the case)
   */
  const savePatient = (
    data: PatientFormData,
    existingPatient?: Patient | null
  ): Patient | null => {
    if (existingPatient) {
      // Update existing patient, preserving createdAt
      return updateExistingPatient(existingPatient.id, {
        ...data,
        createdAt: existingPatient.createdAt,
      });
    } else {
      // Create new patient
      return createPatient(data);
    }
  };

  return {
    createPatient,
    updateExistingPatient,
    savePatient,
    addPatientToCache,
    updatePatientInCache,
  };
};
