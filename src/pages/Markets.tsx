import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UpcomingMarkets } from "@/components/dashboard/UpcomingMarkets";
import { PastMarkets } from "@/components/dashboard/PastMarkets";
import { MarketsOverviewCard } from "@/components/dashboard/MarketsOverviewCard";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Markets = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <BreadcrumbNav />
        <div className="flex flex-col space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Markets</h2>
          <p className="text-muted-foreground">
            Manage your upcoming markets and view past performance.
          </p>
        </div>
        
        <MarketsOverviewCard />
        
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Markets</TabsTrigger>
            <TabsTrigger value="past">Past Markets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <UpcomingMarkets showAll={true} />
          </TabsContent>
          
          <TabsContent value="past">
            <PastMarkets />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Markets;