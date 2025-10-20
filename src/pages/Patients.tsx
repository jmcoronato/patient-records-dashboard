import { useMemo } from "react";
import { PatientList } from "@/components/PatientList";
import { PatientPageLayout } from "@/components/layouts/PatientPageLayout";
import { useInfinitePatientsQuery } from "@/hooks/use-infinite-patients-query";
import { usePatientHandlers } from "@/hooks/use-patient-handlers";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { MESSAGES } from "@/constants/app";

const Patients = () => {
  // Hook for infinite scroll with React Query (automatic cache and better performance)
  const patientsState = useInfinitePatientsQuery();

  // Hook to handle handlers and modal state
  // React Query mutations update the cache automatically, without refetch
  const {
    favorites,
    isModalOpen,
    editingPatient,
    handleToggleFavorite,
    handleAddPatient,
    handleEditPatient,
    handleSavePatient,
    closeModal,
  } = usePatientHandlers({
    patients: patientsState.patients,
    // No callbacks needed anymore - mutations update the cache directly
  });

  // Hook for the back to top button
  const { showBackToTop, scrollToTop } = useScrollToTop();

  // Memoize the state for PatientList to avoid recreating the object
  const listState = useMemo(
    () => ({
      patients: patientsState.patients,
      currentPage: patientsState.currentPage,
      hasMore: patientsState.hasMore,
      isLoading: patientsState.isLoading,
      error: patientsState.error,
    }),
    [
      patientsState.patients,
      patientsState.currentPage,
      patientsState.hasMore,
      patientsState.isLoading,
      patientsState.error,
    ]
  );

  return (
    <PatientPageLayout
      title="All Patients"
      subtitle="Manage and track information for all patients"
      showAddButton={true}
      showFavoritesButton={true}
      onAddPatient={handleAddPatient}
      isModalOpen={isModalOpen}
      onModalClose={closeModal}
      onModalSave={handleSavePatient}
      editingPatient={editingPatient}
      showBackToTop={showBackToTop}
      onScrollToTop={scrollToTop}
      error={patientsState.error}
      onRetryError={patientsState.reset}
    >
      <PatientList
        state={listState}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onEditPatient={handleEditPatient}
        onLoadMore={patientsState.loadMore}
        emptyMessage={MESSAGES.EMPTY.NO_PATIENTS}
      />
    </PatientPageLayout>
  );
};

export default Patients;
