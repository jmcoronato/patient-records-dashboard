import { memo, useState, useCallback } from "react";
import { Patient, InfiniteScrollState } from "@/types/patient";
import { PatientCard } from "@/components/PatientCard";
import { PatientSkeleton } from "@/components/PatientSkeleton";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { UI_CONFIG } from "@/constants/app";

export interface PatientListProps {
  state: InfiniteScrollState;
  favorites: string[];
  onToggleFavorite: (patientId: string) => void;
  onEditPatient: (patient: Patient) => void;
  onLoadMore: () => void;
  emptyMessage: string;
}

const PatientListComponent = ({
  state,
  favorites,
  onToggleFavorite,
  onEditPatient,
  onLoadMore,
  emptyMessage,
}: PatientListProps) => {
  // Centralized state to control which card is expanded
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(
    null
  );

  // Handler to expand/collapse cards
  const handleToggleExpand = useCallback((patientId: string) => {
    setExpandedPatientId((prevId) => {
      // If clicked on the same card, collapse it
      if (prevId === patientId) {
        return null;
      }
      // If clicked on another card, first close the previous one and then open the new one
      return patientId;
    });
  }, []);

  // Hook for IntersectionObserver for infinite scroll
  const sentinelRef = useIntersectionObserver<HTMLDivElement>({
    onIntersect: onLoadMore,
    enabled: state.hasMore && !state.isLoading,
    rootMargin: "200px 0px",
  });

  if (state.isLoading && state.patients.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
        {[...Array(UI_CONFIG.SKELETON_COUNT)].map((_, i) => (
          <PatientSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (state.patients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start animate-in">
        {state.patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            isFavorite={favorites.includes(patient.id)}
            isExpanded={expandedPatientId === patient.id}
            onToggleFavorite={onToggleFavorite}
            onEdit={onEditPatient}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>

      {/* Loading skeleton for more patients */}
      {state.isLoading && state.patients.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
          {[...Array(UI_CONFIG.LOADING_SKELETON_COUNT)].map((_, i) => (
            <PatientSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      <div className="flex flex-col items-center mt-6">
        <div ref={sentinelRef} className="h-1 w-full" />
        {!state.hasMore && state.patients.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4">
            There are no more patients to show
          </p>
        )}
      </div>
    </>
  );
};

/**
 * Custom comparison function for memo
 * Prevents unnecessary re-renders by deeply comparing state
 */
const arePropsEqual = (
  prevProps: PatientListProps,
  nextProps: PatientListProps
): boolean => {
  // Compare loading and error states
  if (
    prevProps.state.isLoading !== nextProps.state.isLoading ||
    prevProps.state.hasMore !== nextProps.state.hasMore ||
    prevProps.state.error !== nextProps.state.error ||
    prevProps.state.currentPage !== nextProps.state.currentPage
  ) {
    return false;
  }

  // Compare patient arrays by length and IDs
  const prevPatients = prevProps.state.patients;
  const nextPatients = nextProps.state.patients;

  if (prevPatients.length !== nextPatients.length) {
    return false;
  }

  // Compare each patient by ID and their properties
  // This detects if any patient was updated
  for (let i = 0; i < prevPatients.length; i++) {
    const prev = prevPatients[i];
    const next = nextPatients[i];

    if (
      prev.id !== next.id ||
      prev.name !== next.name ||
      prev.description !== next.description ||
      prev.avatar !== next.avatar ||
      prev.website !== next.website ||
      prev.createdAt !== next.createdAt
    ) {
      return false;
    }
  }

  // Compare favorite array
  const prevFavs = prevProps.favorites;
  const nextFavs = nextProps.favorites;

  if (prevFavs.length !== nextFavs.length) {
    return false;
  }

  // Since it's an array of strings, compare if all elements are equal
  for (let i = 0; i < prevFavs.length; i++) {
    if (prevFavs[i] !== nextFavs[i]) {
      return false;
    }
  }

  // Compare handlers (should be stable)
  if (
    prevProps.onToggleFavorite !== nextProps.onToggleFavorite ||
    prevProps.onEditPatient !== nextProps.onEditPatient ||
    prevProps.onLoadMore !== nextProps.onLoadMore
  ) {
    return false;
  }

  // Compare empty message
  if (prevProps.emptyMessage !== nextProps.emptyMessage) {
    return false;
  }

  // If nothing changed, don't re-render
  return true;
};

// Memoize the component with custom comparison
// Only re-renders when data actually changes
export const PatientList = memo(PatientListComponent, arePropsEqual);
