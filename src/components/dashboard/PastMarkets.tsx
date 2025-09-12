import { useState } from "react";
import { MapPin, Clock, DollarSign, TrendingUp, Calendar, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Market } from "@/types/market";

const pastMarkets: Market[] = [
  {
    id: "past-1",
    name: "Winter Holiday Market",
    date: "2023-12-15",
    loadInTime: "7:00 AM",
    marketStartTime: "9:00 AM",
    marketEndTime: "4:00 PM",
    address: {
      street: "456 Festival Square",
      city: "Portland",
      state: "OR",
      zipCode: "97204",
      country: "US"
    },
    fee: 100,
    estimatedProfit: 500,
    actualRevenue: 580,
    status: "completed" as const,
    organizerContact: "events@festivalsquare.com",
    requirements: ["Holiday-themed products", "Festive decorations"],
    checklist: {
      insurance: true,
      permit: true,
      inventory: true,
      setup: true,
    },
    completedDate: "2023-12-15",
  },
  {
    id: "past-2",
    name: "Autumn Craft Fair",
    date: "2023-10-28",
    loadInTime: "6:30 AM",
    marketStartTime: "8:00 AM",
    marketEndTime: "3:00 PM",
    address: {
      street: "789 Community Center",
      city: "Portland",
      state: "OR",
      zipCode: "97205",
      country: "US"
    },
    fee: 75,
    estimatedProfit: 350,
    actualRevenue: 320,
    status: "completed" as const,
    organizerContact: "info@communitycenter.org",
    requirements: ["Handmade crafts only", "Setup by 7:30 AM"],
    checklist: {
      insurance: true,
      permit: true,
      inventory: true,
      setup: true,
    },
    completedDate: "2023-10-28",
  }
];

function PastMarketCard({ market }: { market: Market }) {
  const actualProfit = (market.actualRevenue || 0) - market.fee;
  const profitDifference = actualProfit - market.estimatedProfit;
  const isProfit = profitDifference >= 0;
  
  return (
    <Card className="border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{market.name}</CardTitle>
          <Badge variant="outline">Completed</Badge>
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
            {market.marketStartTime} - {market.marketEndTime}
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {market.address.city}, {market.address.state}
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            Fee: ${market.fee}
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            Revenue: ${market.actualRevenue}
          </div>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated Profit:</span>
            <span>${market.estimatedProfit}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Actual Profit:</span>
            <span className="font-medium">${actualProfit}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Difference:</span>
            <div className={`flex items-center ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {isProfit ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {isProfit ? '+' : ''}${profitDifference}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PastMarkets() {
  const [markets] = useState<Market[]>(pastMarkets);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Past Markets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {markets.length > 0 ? (
            markets.map((market) => (
              <PastMarketCard key={market.id} market={market} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No completed markets yet.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Markets will appear here once you close them out with actual revenue data.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}