import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { FinancialOverview } from "@/components/finance/FinancialOverview";
import { MonthlyBreakdown } from "@/components/finance/MonthlyBreakdown";
import { UpcomingProjections } from "@/components/finance/UpcomingProjections";

const Finance = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <BreadcrumbNav />
        
        <div className="flex flex-col space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Finance</h2>
          <p className="text-muted-foreground">
            Track your financial performance, expenses, and revenue across all markets.
          </p>
        </div>
        
        <FinancialOverview />
        
        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlyBreakdown />
          <UpcomingProjections />
        </div>
      </main>
    </div>
  );
};

export default Finance;