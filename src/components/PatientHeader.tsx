import { memo, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PatientHeaderProps {
  title: string;
  subtitle: string;
  showAddButton?: boolean;
  showFavoritesButton?: boolean;
  showBackButton?: boolean;
  onAddPatient?: () => void;
}

const PatientHeaderComponent = ({
  title,
  subtitle,
  showAddButton = false,
  showFavoritesButton = false,
  showBackButton = false,
  onAddPatient,
}: PatientHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleFavorites = useCallback(() => {
    navigate("/favorites");
  }, [navigate]);

  return (
    <header className="gradient-header text-white sticky top-0 z-10 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-white/90 mt-1">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {showFavoritesButton && (
              <Button
                variant="ghost"
                onClick={handleFavorites}
                className="text-white hover:bg-white/10"
              >
                <Heart className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Favorites</span>
              </Button>
            )}
            {showAddButton && onAddPatient && (
              <Button
                onClick={onAddPatient}
                className="bg-white text-primary hover:bg-white/90"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline text-sm">Add Patient</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Memoize to avoid re-renders when props don't change
export const PatientHeader = memo(PatientHeaderComponent);
