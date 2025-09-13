import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMarkets } from "@/contexts/MarketContext";
import { MarketDetailsModal } from "@/components/dashboard/MarketDetailsModal";
import { AddMarketModal } from "@/components/dashboard/AddMarketModal";
import { format, parseISO } from "date-fns";
import { Calendar, TrendingUp, DollarSign } from "lucide-react";

export const UpcomingProjections = () => {
  const { getUpcomingMarkets, updateMarketChecklist, updateMarket } = useMarkets();
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const upcomingMarkets = getUpcomingMarkets();
  
  const totalEstimatedRevenue = upcomingMarkets.reduce((sum, market) => sum + market.estimatedProfit, 0);
  const totalUpcomingFees = upcomingMarkets.reduce((sum, market) => sum + market.fee, 0);
  const projectedProfit = totalEstimatedRevenue - totalUpcomingFees;

  const handleMarketClick = (market: any) => {
    setSelectedMarket(market);
    setIsEditModalOpen(true);
  };

  const handleEditComplete = (updatedMarket: any) => {
    updateMarket(updatedMarket);
    setIsEditModalOpen(false);
    setSelectedMarket(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Market Projections
        </CardTitle>
        <CardDescription>
          Estimated revenue and expenses for scheduled markets
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Estimated Revenue</div>
            <div className="text-2xl font-bold text-blue-600">
              ${totalEstimatedRevenue.toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Expected Fees</div>
            <div className="text-2xl font-bold text-orange-600">
              -${totalUpcomingFees.toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Projected Profit</div>
            <div className={`text-2xl font-bold ${projectedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${projectedProfit.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Upcoming Markets</h4>
          {upcomingMarkets.length === 0 ? (
            <p className="text-muted-foreground text-sm">No upcoming markets scheduled.</p>
          ) : (
            <div className="space-y-2">
              {upcomingMarkets.map(market => {
                const projectedMarketProfit = market.estimatedProfit - market.fee;
                return (
                  <div 
                    key={market.id} 
                    className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleMarketClick(market)}
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{market.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(parseISO(market.date), "MMM dd, yyyy")}
                      </div>
                      <Badge variant={
                        market.status === "confirmed" ? "default" :
                        market.status === "pending" ? "secondary" : "outline"
                      }>
                        {market.status}
                      </Badge>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm">
                        Est. Revenue: <span className="font-medium text-blue-600">${market.estimatedProfit.toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        Fee: <span className="text-orange-600">-${market.fee.toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        Est. Profit: <span className={`font-medium ${projectedMarketProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${projectedMarketProfit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <AddMarketModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onAddMarket={() => {}}
          onUpdateMarket={handleEditComplete}
          editingMarket={selectedMarket}
        />
      </CardContent>
    </Card>
  );
};