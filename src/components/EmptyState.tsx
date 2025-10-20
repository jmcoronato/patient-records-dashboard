/**
 * Reusable component for displaying empty states
 * Shows an icon, title and description when there's no data
 */

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  iconClassName?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  iconClassName = "text-muted-foreground",
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Icon className={`h-16 w-16 mx-auto mb-4 ${iconClassName}`} />
      <p className="text-muted-foreground text-lg mb-2">{title}</p>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
};
