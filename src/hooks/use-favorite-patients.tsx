import { useState, useEffect, useCallback, useMemo } from "react";
import { Patient } from "@/types/patient";
import {
  getFavoritePatients,
  saveFavoritePatients,
  updateFavoritePatient as updateFavoritePatientService,
} from "@/services/patientService";

export const useFavoritePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(() => {
    setIsLoading(true);
    try {
      const favorites = getFavoritePatients();

      setPatients(favorites);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePatientInList = useCallback((updatedPatient: Patient) => {
    // Update in localStorage
    updateFavoritePatientService(updatedPatient);

    // Update in the local state
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
  }, []);

  const removeFavorite = useCallback((patientId: string) => {
    const favorites = getFavoritePatients();
    const updatedFavorites = favorites.filter((p) => p.id !== patientId);
    saveFavoritePatients(updatedFavorites);

    setPatients((prev) => prev.filter((p) => p.id !== patientId));
  }, []);

  const refreshFavorites = useCallback(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Load favorites when the component mounts
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Memoize the return object
  return useMemo(
    () => ({
      patients,
      isLoading,
      updatePatientInList,
      removeFavorite,
      refreshFavorites,
    }),
    [patients, isLoading, updatePatientInList, removeFavorite, refreshFavorites]
  );
};
