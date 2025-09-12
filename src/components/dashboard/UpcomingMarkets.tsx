import { MapPin, Clock, CheckSquare, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Market {
  id: string;
  name: string;
  date: string;
  loadInTime: string;
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
}

const mockMarkets: Market[] = [
  {
    id: "1",
    name: "Downtown Farmers Market",
    date: "2024-01-15",
    loadInTime: "6:00 AM",
    location: "Main Street Plaza",
    fee: 85,
    estimatedProfit: 400,
    status: "confirmed",
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
    location: "City Park Pavilion",
    fee: 120,
    estimatedProfit: 650,
    status: "upcoming",
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
    location: "Harbor District",
    fee: 150,
    estimatedProfit: 800,
    status: "pending",
    checklist: {
      insurance: false,
      permit: false,
      inventory: false,
      setup: false,
    },
  },
];

function MarketCard({ market }: { market: Market }) {
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
            {market.loadInTime}
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
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <CheckSquare className="h-4 w-4 mr-2" />
            Checklist: {completedTasks}/{totalTasks}
          </div>
          <Button variant="outline" size="sm">
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

export function UpcomingMarkets() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Upcoming Markets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}