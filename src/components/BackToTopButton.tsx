import { memo } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronUp } from "lucide-react";

interface BackToTopButtonProps {
  show: boolean;
  onClick: () => void;
}

const BackToTopButtonComponent = ({ show, onClick }: BackToTopButtonProps) => {
  if (!show) return null;

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 p-0"
      aria-label="Back to top"
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  );
};

// Memoize to avoid unnecessary re-renders
export const BackToTopButton = memo(BackToTopButtonComponent);
