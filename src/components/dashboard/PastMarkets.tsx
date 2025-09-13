import { MapPin, Clock, DollarSign, TrendingUp, Calendar, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Market } from "@/types/market";
import { useMarkets } from "@/contexts/MarketContext";

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
            Revenue: ${market.actualRevenue || 0}
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
  const { getPastMarkets } = useMarkets();
  const markets = getPastMarkets();

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