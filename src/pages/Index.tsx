import { Button } from "@/components/ui/Button";
import { Users, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/app";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-header text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Patient Dashboard
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
              Manage and track your patients' information efficiently
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Welcome to the Patient Management System!
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Explore all available features to manage your patients
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid gap-8 md:grid-cols-2">
            {/* All Patients Card */}
            <div className="bg-card border rounded-lg p-8 text-center hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">All Patients</h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                View and manage all patients registered in the system
              </p>
              <Button
                onClick={() => navigate(ROUTES.PATIENTS)}
                className="w-full"
              >
                View Patients
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Favorites Card */}
            <div className="bg-card border rounded-lg p-8 text-center hover:shadow-lg transition-shadow flex flex-col h-full">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Favorite Patients</h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                Quick access to your patients marked as favorites
              </p>
              <Button
                onClick={() => navigate(ROUTES.FAVORITES)}
                variant="outline"
                className="w-full"
              >
                View Favorites
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
