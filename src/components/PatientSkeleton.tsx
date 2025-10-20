import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export const PatientSkeleton = () => {
  return (
    <Card className="overflow-hidden gradient-card shadow-card">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />

          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>

            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />

            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </div>
    </Card>
  );
};
