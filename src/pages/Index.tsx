import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, FileText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6">
            VendorHub
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-2">
            Streamline your market vendor business with powerful tools for event management, 
            expense tracking, and document organization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 min-h-[48px] text-base">
              <Link to="/dashboard">
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-h-[48px] text-base">
              <Link to="/auth">
                Login / Sign Up
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 mt-12 sm:mt-16">
            <div className="text-center p-4 sm:p-6 bg-card rounded-lg border border-border/50 shadow-sm">
              <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">Event Management</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Track upcoming markets, load-in times, and preparation checklists all in one place.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-card rounded-lg border border-border/50 shadow-sm">
              <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">Revenue Analytics</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Visualize your earnings with detailed charts and track your market performance.
              </p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-card rounded-lg border border-border/50 shadow-sm md:col-span-3 md:col-span-1">
              <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-2">Document Management</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Upload and share insurance files, permits, and certifications with event organizers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
