import { memo, useCallback } from "react";
import { Patient } from "@/types/patient";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChevronDown, ChevronUp, Star, ExternalLink, Edit } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { getInitials, formatDate } from "@/utils/formatters";

interface PatientCardProps {
  patient: Patient;
  isFavorite: boolean;
  isExpanded: boolean;
  onToggleFavorite: (patientId: string) => void;
  onEdit: (patient: Patient) => void;
  onToggleExpand: (patientId: string) => void;
}

const PatientCardComponent = ({
  patient,
  isFavorite,
  isExpanded,
  onToggleFavorite,
  onEdit,
  onToggleExpand,
}: PatientCardProps) => {
  // Memoize handlers to avoid recreating functions
  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(patient.id);
  }, [onToggleFavorite, patient.id]);

  const handleEdit = useCallback(() => {
    onEdit(patient);
  }, [onEdit, patient]);

  const handleToggleExpand = useCallback(() => {
    onToggleExpand(patient.id);
  }, [onToggleExpand, patient.id]);

  return (
    <Card className="overflow-hidden gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 border-border">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src={patient.avatar} alt={patient.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {patient.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ID: {patient.id}
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleFavorite}
                  className="h-8 w-8 p-0 group"
                >
                  <Star
                    className={`h-4 w-4 ${
                      isFavorite
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground group-hover:text-white group-hover:fill-white"
                    }`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="h-8 w-8 p-0 group"
                >
                  <Edit className="h-4 w-4 text-muted-foreground group-hover:text-white" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-foreground/80 line-clamp-2 mb-3 min-h-[2.5rem]">
              {patient.description}
            </p>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleExpand}
                className="h-8 text-sm"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show More
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-4 border-t border-border space-y-3">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Full Description
              </h4>
              <div className="max-h-48 overflow-y-auto pr-2">
                <p className="text-sm text-foreground leading-relaxed">
                  {patient.description}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Website
              </h4>
              <a
                href={patient.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                {patient.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {patient.createdAt && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  Created At
                </h4>
                <p className="text-sm text-foreground">
                  {formatDate(patient.createdAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * Custom comparison function for memo
 * Only re-renders if patient data, favorite status or expansion status change
 * Handlers are stable, so they won't cause re-renders
 */
const arePropsEqual = (
  prevProps: PatientCardProps,
  nextProps: PatientCardProps
): boolean => {
  // If the patient ID changed, it's a different patient
  if (prevProps.patient.id !== nextProps.patient.id) {
    return false;
  }

  // If the favorite status changed
  if (prevProps.isFavorite !== nextProps.isFavorite) {
    return false;
  }

  // If the expansion status changed
  if (prevProps.isExpanded !== nextProps.isExpanded) {
    return false;
  }

  // Compare patient properties that are displayed
  const prevPatient = prevProps.patient;
  const nextPatient = nextProps.patient;

  if (
    prevPatient.name !== nextPatient.name ||
    prevPatient.description !== nextPatient.description ||
    prevPatient.avatar !== nextPatient.avatar ||
    prevPatient.website !== nextPatient.website ||
    prevPatient.createdAt !== nextPatient.createdAt
  ) {
    return false;
  }

  // Handlers should be stable now, but just in case
  // we check if they are the same references
  if (
    prevProps.onToggleFavorite !== nextProps.onToggleFavorite ||
    prevProps.onEdit !== nextProps.onEdit ||
    prevProps.onToggleExpand !== nextProps.onToggleExpand
  ) {
    return false;
  }

  // If nothing changed, don't re-render
  return true;
};

// Memoize the component with custom comparison function
// Only re-renders if patient data or favorite status changes
export const PatientCard = memo(PatientCardComponent, arePropsEqual);
