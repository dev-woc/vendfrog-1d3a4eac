import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UpcomingMarkets } from "@/components/dashboard/UpcomingMarkets";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { MarketCalendar } from "@/components/dashboard/MarketCalendar";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <BreadcrumbNav />
        <div className="flex flex-col space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Track your market performance and manage your vendor business.
          </p>
        </div>
        
        <StatsCards />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <UpcomingMarkets />
          </div>
          <div>
            <FileUpload />
          </div>
        </div>
        
        <MarketCalendar />
        
        <RevenueChart />
      </main>
    </div>
  );
};

export default Dashboard;