import { useState } from "react";
import { MapPin, Clock, CheckSquare, DollarSign, TrendingUp, Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketDetailsModal } from "./MarketDetailsModal";
import { AddMarketModal } from "./AddMarketModal";
import { Link } from "react-router-dom";

interface Market {
  id: string;
  name: string;
  date: string;
  loadInTime: string;
  marketStartTime: string;
  marketEndTime: string;
  location: string;
  fee: number;
  estimatedProfit: number;
  status: "upcoming" | "confirmed" | "pending";
  checklist: {
    insurance: boolean;
    permit: boolean;
    inventory: boolean;
    setup: boolean;
  };
  description?: string;
  organizerContact?: string;
  requirements?: string[];
}

const initialMarkets: Market[] = [
  {
    id: "1",
    name: "Downtown Farmers Market",
    date: "2024-01-15",
    loadInTime: "6:00 AM",
    marketStartTime: "8:00 AM",
    marketEndTime: "2:00 PM",
    location: "Main Street Plaza",
    fee: 85,
    estimatedProfit: 400,
    status: "confirmed",
    organizerContact: "sarah@downtownmarket.com",
    requirements: ["Valid business license", "Liability insurance", "Setup by 7:30 AM"],
    checklist: {
      insurance: true,
      permit: true,
      inventory: false,
      setup: false,
    },
  },
  {
    id: "2",
    name: "Weekend Artisan Fair",
    date: "2024-01-20",
    loadInTime: "8:00 AM",
    marketStartTime: "10:00 AM",
    marketEndTime: "5:00 PM",
    location: "City Park Pavilion",
    fee: 120,
    estimatedProfit: 650,
    status: "upcoming",
    organizerContact: "info@artisanfair.org",
    requirements: ["Handmade items only", "Tent required", "Insurance certificate"],
    checklist: {
      insurance: true,
      permit: false,
      inventory: false,
      setup: false,
    },
  },
  {
    id: "3",
    name: "Holiday Night Market",
    date: "2024-01-25",
    loadInTime: "4:00 PM",
    marketStartTime: "6:00 PM",
    marketEndTime: "10:00 PM",
    location: "Harbor District",
    fee: 150,
    estimatedProfit: 800,
    status: "pending",
    organizerContact: "events@harbordistrict.com",
    requirements: ["Holiday themed products", "Lighting setup", "Extended hours"],
    checklist: {
      insurance: false,
      permit: false,
      inventory: false,
      setup: false,
    },
  },
];

function MarketCard({ market, onViewDetails }: { market: Market; onViewDetails: (market: Market) => void }) {
  const completedTasks = Object.values(market.checklist).filter(Boolean).length;
  const totalTasks = Object.keys(market.checklist).length;

  return (
    <Card className="border border-border/50 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{market.name}</CardTitle>
          <Badge 
            variant={market.status === "confirmed" ? "default" : market.status === "pending" ? "secondary" : "outline"}
          >
            {market.status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(market.date).toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            Load: {market.loadInTime}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {market.location}
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            Fee: ${market.fee}
          </div>
          <div className="flex items-center text-success">
            <TrendingUp className="h-4 w-4 mr-2" />
            Est. ${market.estimatedProfit}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground border-t pt-3">
          <Clock className="h-4 w-4 mr-2" />
          <span className="font-medium">Market Hours:</span>
          <span className="ml-2">{market.marketStartTime} - {market.marketEndTime}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckSquare className="h-4 w-4 mr-2" />
            Checklist: {completedTasks}/{totalTasks}
          </div>
          <Button variant="outline" size="sm" onClick={() => onViewDetails(market)}>
            View Details
          </Button>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export function UpcomingMarkets({ showAll = false }: { showAll?: boolean }) {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleViewDetails = (market: Market) => {
    setSelectedMarket(market);
    setShowDetails(true);
  };

  const handleUpdateChecklist = (marketId: string, item: keyof Market['checklist']) => {
    setMarkets(prev => prev.map(market => 
      market.id === marketId 
        ? { ...market, checklist: { ...market.checklist, [item]: !market.checklist[item] } }
        : market
    ));
    
    // Update selected market if it's the one being modified
    if (selectedMarket?.id === marketId) {
      setSelectedMarket(prev => prev ? {
        ...prev,
        checklist: { ...prev.checklist, [item]: !prev.checklist[item] }
      } : null);
    }
  };

  const handleAddMarket = (newMarket: Market) => {
    setMarkets(prev => [newMarket, ...prev]);
  };

  const displayedMarkets = showAll ? markets : markets.slice(0, 2);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {showAll ? "All Markets" : "Upcoming Markets"}
          </CardTitle>
          <Button onClick={() => setShowAddModal(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Market
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedMarkets.map((market) => (
            <MarketCard key={market.id} market={market} onViewDetails={handleViewDetails} />
          ))}
          {!showAll && markets.length > 2 && (
            <div className="pt-4 border-t">
              <Link to="/markets">
                <Button variant="outline" className="w-full">
                  Show More Markets ({markets.length - 2} more)
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>

      <MarketDetailsModal
        market={selectedMarket}
        open={showDetails}
        onOpenChange={setShowDetails}
        onUpdateChecklist={handleUpdateChecklist}
      />

      <AddMarketModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddMarket={handleAddMarket}
      />
    </Card>
  );
}