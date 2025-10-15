
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BreadcrumbNav } from "@/components/navigation/BreadcrumbNav";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { MarketCard } from "@/components/dashboard/MarketCard";
import MarketMap from "@/components/dashboard/MarketMap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Map, List } from "lucide-react";

// Placeholder for geocoding function
const geocodeAddress = async (address: string) => {
  // In a real application, you would use a geocoding service like Positionstack or Google Maps API
  // For now, we'll return some dummy coordinates.
  console.log(`Geocoding address: ${address}`);
  // Dummy coordinates (Portland, OR)
  return { lat: 45.523064, lng: -122.676483 };
};

const FindMarkets = () => {
  const [markets, setMarkets] = useState<any[]>([]);
  const [view, setView] = useState('list'); // 'list' or 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMarkets, setFilteredMarkets] = useState<any[]>([]);

  useEffect(() => {
    const fetchMarkets = async () => {
      const { data, error } = await supabase
        .from("markets")
        .select("*");
      if (error) {
        console.error("Error fetching markets:", error);
      } else {
        // Geocode addresses and add lat/lng to market objects
        const marketsWithCoords = await Promise.all(
          data.map(async (market) => {
            const fullAddress = `${market.address.street}, ${market.address.city}, ${market.address.state} ${market.address.zipCode}`;
            const { lat, lng } = await geocodeAddress(fullAddress);
            return { ...market, lat, lng };
          })
        );
        setMarkets(marketsWithCoords);
        setFilteredMarkets(marketsWithCoords);
      }
    };

    fetchMarkets();
  }, []);

  useEffect(() => {
    const filtered = markets.filter(market =>
      market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.address.state.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMarkets(filtered);
  }, [searchQuery, markets]);

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

        <div className="flex justify-between items-center">
          <div className="w-full max-w-sm">
            <Input
              placeholder="Search by name, city, or state"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Button variant="outline" onClick={() => setView(view === 'list' ? 'map' : 'list')}>
              {view === 'list' ? <Map className="mr-2 h-4 w-4" /> : <List className="mr-2 h-4 w-4" />}
              {view === 'list' ? 'Map View' : 'List View'}
            </Button>
          </div>
        </div>

        {view === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        ) : (
          <div style={{ height: '600px', width: '100%' }}>
            <MarketMap markets={filteredMarkets} />
          </div>
        )}
      </main>
    </div>
  );
};

export default FindMarkets;
