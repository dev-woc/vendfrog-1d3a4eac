import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UpcomingMarkets } from "@/components/dashboard/UpcomingMarkets";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { MarketCalendar } from "@/components/dashboard/MarketCalendar";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { TourOverlay } from "@/components/dashboard/TourOverlay";
import { useDashboardTour } from "@/hooks/use-dashboard-tour";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const Dashboard = () => {
  const {
    isActive,
    currentStepData,
    currentStep,
    totalSteps,
    startTour,
    endTour,
    nextStep,
    prevStep
  } = useDashboardTour();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <BreadcrumbNav />
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Track your market performance and manage your vendor business.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={startTour}
              className="flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Show me around
            </Button>
          </div>
        </div>
        
        <div data-tour="stats-cards">
          <StatsCards />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2" data-tour="upcoming-markets">
            <UpcomingMarkets />
          </div>
          <div data-tour="file-upload">
            <FileUpload />
          </div>
        </div>
        
        <div data-tour="market-calendar">
          <MarketCalendar />
        </div>
        
        <div data-tour="revenue-chart">
          <RevenueChart />
        </div>

        {/* Tour Overlay */}
        {isActive && currentStepData && (
          <TourOverlay
            step={currentStepData}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={nextStep}
            onPrev={prevStep}
            onClose={endTour}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;