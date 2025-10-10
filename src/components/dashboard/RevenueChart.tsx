import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { useMarkets } from "@/contexts/MarketContext";
import { useMemo } from "react";

export function RevenueChart() {
  const { markets } = useMarkets();

  // Calculate monthly revenue from actual market data
  const monthlyData = useMemo(() => {
    const monthlyStats: { [key: string]: { revenue: number; markets: number } } = {};

    // Group markets by month and calculate totals
    markets.forEach(market => {
      if (market.actualRevenue) {
        const date = new Date(market.date);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = { revenue: 0, markets: 0 };
        }

        monthlyStats[monthKey].revenue += market.actualRevenue;
        monthlyStats[monthKey].markets += 1;
      }
    });

    // Convert to array and sort by date
    const sortedData = Object.entries(monthlyStats)
      .map(([month, stats]) => ({
        month,
        revenue: stats.revenue,
        markets: stats.markets
      }))
      .sort((a, b) => {
        // Sort by date
        return new Date(a.month).getTime() - new Date(b.month).getTime();
      })
      .slice(-6); // Show last 6 months

    // If no data, return empty array
    return sortedData.length > 0 ? sortedData : [
      { month: "No Data", revenue: 0, markets: 0 }
    ];
  }, [markets]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Revenue Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}