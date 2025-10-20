/**
 * Composite hook that combines favorites, modal and CRUD
 * Simplifies usage in components by providing a unified API
 *
 * This hook is a facade that combines more specific hooks
 */

import { useCallback, useRef, useEffect, useMemo } from "react";
import { Patient, PatientFormData } from "@/types/patient";
import { useFavorites } from "./use-favorites";
import { useModalState } from "./use-modal-state";
import { usePatientMutations } from "./use-patient-mutations";

export interface UsePatientHandlersProps {
  patients: Patient[];
  onPatientUpdate?: (patient: Patient) => void;
  onPatientAdd?: () => void;
  onFavoriteRemove?: (patientId: string) => void;
}

/**
 * Main hook for handling patient operations
 * Combines favorites, modal and CRUD operations
 */
export const usePatientHandlers = ({
  patients,
  onPatientUpdate,
  onPatientAdd,
  onFavoriteRemove,
}: UsePatientHandlersProps) => {
  // Use ref to maintain stable reference to patients
  const patientsRef = useRef(patients);
  const onPatientUpdateRef = useRef(onPatientUpdate);
  const onPatientAddRef = useRef(onPatientAdd);

  // Update refs when they change
  useEffect(() => {
    patientsRef.current = patients;
  }, [patients]);

  useEffect(() => {
    onPatientUpdateRef.current = onPatientUpdate;
  }, [onPatientUpdate]);

  useEffect(() => {
    onPatientAddRef.current = onPatientAdd;
  }, [onPatientAdd]);

  // Favorites state with stable callback
  const favoritesOptions = useMemo(
    () => ({
      onFavoriteRemove,
    }),
    [onFavoriteRemove]
  );

  const { favoriteIds, toggleFavorite: toggleFav } =
    useFavorites(favoritesOptions);

  // Modal state - extract stable functions
  const modal = useModalState<Patient>();
  const modalOpenRef = useRef(modal.open);
  const modalCloseRef = useRef(modal.close);
  const modalDataRef = useRef(modal.data);

  // Update refs when they change
  useEffect(() => {
    modalOpenRef.current = modal.open;
    modalCloseRef.current = modal.close;
    modalDataRef.current = modal.data;
  }, [modal.open, modal.close, modal.data]);

  // CRUD operations with React Query mutations (without unnecessary refetch)
  const { savePatient } = usePatientMutations();

  /**
   * Toggles the favorite status of a patient
   * Uses ref to avoid dependency on patients in useCallback
   */
  const handleToggleFavorite = useCallback(
    (patientId: string) => {
      const patient = patientsRef.current.find((p) => p.id === patientId);
      if (patient) {
        toggleFav(patient);
      }
    },
    [toggleFav] // Only depends on toggleFav, not on patients
  );

  /**
   * Opens the modal to add a patient
   * Uses ref to maintain stable function
   */
  const handleAddPatient = useCallback(() => {
    modalOpenRef.current();
  }, []);

  /**
   * Opens the modal to edit a patient
   * Uses ref to maintain stable function
   */
  const handleEditPatient = useCallback((patient: Patient) => {
    modalOpenRef.current(patient);
  }, []);

  /**
   * Saves a patient (create or update)
   * Uses ref to access current modal state and maintain stable function
   * Mutations update the cache without refetching the API
   */
  const handleSavePatient = useCallback(
    (data: PatientFormData) => {
      const result = savePatient(data, modalDataRef.current);

      // Notify callbacks if provided
      if (result) {
        if (modalDataRef.current && onPatientUpdateRef.current) {
          onPatientUpdateRef.current(result);
        } else if (!modalDataRef.current && onPatientAddRef.current) {
          onPatientAddRef.current();
        }
      }

      modalCloseRef.current();
    },
    [savePatient]
  );

  // Memoize only the handlers (without modal state)
  // to avoid modal changes causing re-renders of PatientCards
  const handlers = useMemo(
    () => ({
      handleToggleFavorite,
      handleAddPatient,
      handleEditPatient,
      handleSavePatient,
    }),
    [
      handleToggleFavorite,
      handleAddPatient,
      handleEditPatient,
      handleSavePatient,
    ]
  );

  // Return modal state and handlers separately
  // Handlers are stable, only modal state can change
  return useMemo(
    () => ({
      // State
      favorites: favoriteIds,
      isModalOpen: modal.isOpen,
      editingPatient: modal.data,
      closeModal: modal.close,

      // Stable handlers
      ...handlers,
    }),
    [favoriteIds, modal.isOpen, modal.data, modal.close, handlers]
  );
};
