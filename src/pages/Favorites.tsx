import { useMemo } from "react";
import { PatientList } from "@/components/PatientList";
import { EmptyState } from "@/components/EmptyState";
import { PatientPageLayout } from "@/components/layouts/PatientPageLayout";
import { useFavoritePatients } from "@/hooks/use-favorite-patients";
import { usePatientHandlers } from "@/hooks/use-patient-handlers";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { MESSAGES } from "@/constants/app";
import { Heart } from "lucide-react";

const Favorites = () => {
  // Optimized hook for favorites
  const favoritesState = useFavoritePatients();

  // Hook to handle handlers and modal state
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
    patients: favoritesState.patients,
    onPatientUpdate: favoritesState.updatePatientInList,
    onPatientAdd: favoritesState.refreshFavorites,
    onFavoriteRemove: favoritesState.removeFavorite,
  });

  // Hook for the back to top button
  const { showBackToTop, scrollToTop } = useScrollToTop();

  // Memoize the state to avoid recreating the object on each render
  const favoritePatientsState = useMemo(
    () => ({
      patients: favoritesState.patients,
      currentPage: 1,
      hasMore: false, // Favorites are loaded all at once
      isLoading: favoritesState.isLoading,
      error: null,
    }),
    [favoritesState.patients, favoritesState.isLoading]
  );

  // Memoize the empty state check
  const showEmptyState = useMemo(
    () => favoritesState.patients.length === 0 && !favoritesState.isLoading,
    [favoritesState.patients.length, favoritesState.isLoading]
  );

  return (
    <PatientPageLayout
      title="Favorite Patients"
      subtitle="Quick access to your patients marked as favorites"
      showAddButton={true}
      showBackButton={true}
      onAddPatient={handleAddPatient}
      isModalOpen={isModalOpen}
      onModalClose={closeModal}
      onModalSave={handleSavePatient}
      editingPatient={editingPatient}
      showBackToTop={showBackToTop}
      onScrollToTop={scrollToTop}
    >
      {/* Favorites List o Empty State */}
      {showEmptyState ? (
        <EmptyState
          icon={Heart}
          title="No favorite patients yet"
          description="Click the star icon on any patient card to add it to favorites"
          iconClassName="text-red-500"
        />
      ) : (
        <PatientList
          state={favoritePatientsState}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onEditPatient={handleEditPatient}
          onLoadMore={() => {}} // Favorites don't need to load more
          emptyMessage={MESSAGES.EMPTY.NO_FAVORITES}
        />
      )}
    </PatientPageLayout>
  );
};

export default Favorites;
