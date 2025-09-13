import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, FileText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-4 sm:mb-6">
            VendFrog
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-4">
            Leap into your next Market
          </p>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed px-2 max-w-2xl mx-auto">
            Streamline your market vendor business with powerful tools for event management, 
            expense tracking, and document organization.
          </p>
          
          <div className="flex justify-center mb-12 sm:mb-16 px-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80 min-h-[48px] text-base px-8">
              <Link to="/auth">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3 mt-16 sm:mt-20">
            <div className="group text-center p-8 bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/20 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Event Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track upcoming markets, load-in times, and preparation checklists all in one place.
              </p>
            </div>
            
            <div className="group text-center p-8 bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/20 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Revenue Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualize your earnings with detailed charts and track your market performance.
              </p>
            </div>
            
            <div className="group text-center p-8 bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/20 hover:-translate-y-1">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Document Management</h3>
              <p className="text-muted-foreground leading-relaxed">
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
