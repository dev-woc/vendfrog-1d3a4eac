import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AllDocuments } from "@/components/dashboard/AllDocuments";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";

const Documents = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <BreadcrumbNav />
        
        <div className="flex flex-col space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
          <p className="text-muted-foreground">
            Manage all your business documents, permits, and certifications.
          </p>
        </div>
        
        <AllDocuments />
      </main>
    </div>
  );
};

export default Documents;