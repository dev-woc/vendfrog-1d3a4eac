
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { MarketCard } from "@/components/dashboard/MarketCard";

const FindMarkets = () => {
  const [markets, setMarkets] = useState<any[]>([]);

  useEffect(() => {
    const fetchMarkets = async () => {
      const { data, error } = await supabase
        .from("markets")
        .select("*");
      if (error) {
        console.error("Error fetching markets:", error);
      } else {
        setMarkets(data);
      }
    };

    fetchMarkets();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <BreadcrumbNav />
        <div className="flex flex-col space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Find Markets</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Browse and discover new markets.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default FindMarkets;
