import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, FileText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-primary mb-6">
            VendorHub
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Streamline your market vendor business with powerful tools for event management, 
            expense tracking, and document organization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
              <Link to="/dashboard">
                View Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 bg-card rounded-lg border border-border/50 shadow-sm">
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Event Management</h3>
              <p className="text-muted-foreground">
                Track upcoming markets, load-in times, and preparation checklists all in one place.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg border border-border/50 shadow-sm">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Revenue Analytics</h3>
              <p className="text-muted-foreground">
                Visualize your earnings with detailed charts and track your market performance.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg border border-border/50 shadow-sm">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Document Management</h3>
              <p className="text-muted-foreground">
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
