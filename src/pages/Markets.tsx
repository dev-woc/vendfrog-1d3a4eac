import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpcomingMarkets } from "@/components/dashboard/UpcomingMarkets";

const Markets = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">All Markets</h2>
          <p className="text-muted-foreground">
            Manage all your upcoming markets and applications.
          </p>
        </div>
        
        <UpcomingMarkets showAll={true} />
      </main>
    </div>
  );
};

export default Markets;