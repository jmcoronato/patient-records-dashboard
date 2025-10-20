/**
 * Shared layout for patient pages
 * Encapsulates the common structure between Patients and Favorites
 */

import { ReactNode } from "react";
import { PatientHeader } from "@/components/PatientHeader";
import { PatientModal } from "@/components/PatientModal";
import { BackToTopButton } from "@/components/BackToTopButton";
import { ErrorState } from "@/components/ErrorState";
import { Patient, PatientFormData } from "@/types/patient";

export interface PatientPageLayoutProps {
  // Header props
  title: string;
  subtitle: string;
  showAddButton?: boolean;
  showFavoritesButton?: boolean;
  showBackButton?: boolean;
  onAddPatient: () => void;

  // Modal props
  isModalOpen: boolean;
  onModalClose: () => void;
  onModalSave: (data: PatientFormData) => void;
  editingPatient: Patient | null;

  // Back to top
  showBackToTop: boolean;
  onScrollToTop: () => void;

  // Error state
  error?: string | null;
  onRetryError?: () => void;

  // Content
  children: ReactNode;
}

export const PatientPageLayout = ({
  title,
  subtitle,
  showAddButton = false,
  showFavoritesButton = false,
  showBackButton = false,
  onAddPatient,
  isModalOpen,
  onModalClose,
  onModalSave,
  editingPatient,
  showBackToTop,
  onScrollToTop,
  error,
  onRetryError,
  children,
}: PatientPageLayoutProps) => {
  // If there's an error, show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <PatientHeader
          title={title}
          subtitle={subtitle}
          showAddButton={showAddButton}
          showFavoritesButton={showFavoritesButton}
          showBackButton={showBackButton}
          onAddPatient={onAddPatient}
        />
        <main className="container mx-auto px-4 py-8">
          <ErrorState message={error} onRetry={onRetryError} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PatientHeader
        title={title}
        subtitle={subtitle}
        showAddButton={showAddButton}
        showFavoritesButton={showFavoritesButton}
        showBackButton={showBackButton}
        onAddPatient={onAddPatient}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Modal */}
      <PatientModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        onSave={onModalSave}
        patient={editingPatient}
      />

      {/* Floating "Back to top" button */}
      <BackToTopButton show={showBackToTop} onClick={onScrollToTop} />
    </div>
  );
};
