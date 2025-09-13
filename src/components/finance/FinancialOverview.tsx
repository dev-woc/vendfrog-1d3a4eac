import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { useMarkets } from "@/contexts/MarketContext";

export const FinancialOverview = () => {
  const { getPastMarkets, getUpcomingMarkets } = useMarkets();
  
  const pastMarkets = getPastMarkets();
  const upcomingMarkets = getUpcomingMarkets();
  
  const totalRevenue = pastMarkets.reduce((sum, market) => sum + (market.actualRevenue || 0), 0);
  const totalFeesPaid = pastMarkets.reduce((sum, market) => sum + market.fee, 0);
  const totalProfit = totalRevenue - totalFeesPaid;
  
  const estimatedUpcomingRevenue = upcomingMarkets.reduce((sum, market) => sum + market.estimatedProfit, 0);
  const upcomingFees = upcomingMarkets.reduce((sum, market) => sum + market.fee, 0);
  const estimatedUpcomingProfit = estimatedUpcomingRevenue - upcomingFees;

  const cards = [
    {
      title: "Total Revenue",
      subtitle: "From completed markets",
      value: totalRevenue,
      icon: DollarSign,
      trend: totalProfit > 0 ? "up" : "down",
      change: `$${Math.abs(totalProfit)} ${totalProfit > 0 ? 'profit' : 'loss'}`
    },
    {
      title: "Vendor Fees Paid",
      subtitle: "Total fees to market organizers",
      value: totalFeesPaid,
      icon: TrendingDown,
      trend: "neutral",
      change: `${pastMarkets.length} markets`
    },
    {
      title: "Net Profit",
      subtitle: "Revenue minus fees",
      value: totalProfit,
      icon: totalProfit > 0 ? TrendingUp : TrendingDown,
      trend: totalProfit > 0 ? "up" : "down",
      change: `${((totalProfit / totalRevenue) * 100).toFixed(1)}% margin`
    },
    {
      title: "Estimated Upcoming",
      subtitle: "Projected profit from upcoming markets",
      value: estimatedUpcomingProfit,
      icon: Calendar,
      trend: "up",
      change: `${upcomingMarkets.length} markets`
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${card.value.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{card.subtitle}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              {card.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
              {card.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
              <span className={`text-xs ${
                card.trend === "up" ? "text-green-500" : 
                card.trend === "down" ? "text-red-500" : 
                "text-muted-foreground"
              }`}>
                {card.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};