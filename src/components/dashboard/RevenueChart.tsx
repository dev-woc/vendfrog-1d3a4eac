import { TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { useMarkets } from "@/contexts/MarketContext";
import { useMemo, useState } from "react";

export function RevenueChart() {
  const { markets } = useMarkets();
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "fees">("revenue");

  // Calculate monthly data from actual market data
  const monthlyData = useMemo(() => {
    const monthlyStats: { [key: string]: { revenue: number; fees: number; markets: number } } = {};

    // Group markets by month and calculate totals
    markets.forEach(market => {
      if (market.actualRevenue) {
        const date = new Date(market.date);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = { revenue: 0, fees: 0, markets: 0 };
        }

        monthlyStats[monthKey].revenue += market.actualRevenue;
        monthlyStats[monthKey].fees += market.fee || 0;
        monthlyStats[monthKey].markets += 1;
      }
    });

    // Convert to array and sort by date
    const sortedData = Object.entries(monthlyStats)
      .map(([month, stats]) => ({
        month,
        revenue: stats.revenue,
        fees: stats.fees,
        markets: stats.markets
      }))
      .sort((a, b) => {
        // Sort by date
        return new Date(a.month).getTime() - new Date(b.month).getTime();
      })
      .slice(-6); // Show last 6 months

    // If no data, return empty array
    return sortedData.length > 0 ? sortedData : [
      { month: "No Data", revenue: 0, fees: 0, markets: 0 }
    ];
  }, [markets]);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            {selectedMetric === "revenue" ? (
              <>
                <TrendingUp className="h-5 w-5 mr-2" />
                Revenue Trend
              </>
            ) : (
              <>
                <DollarSign className="h-5 w-5 mr-2" />
                Vendor Fees Trend
              </>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={selectedMetric === "revenue" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric("revenue")}
            >
              Revenue
            </Button>
            <Button
              variant={selectedMetric === "fees" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric("fees")}
            >
              Fees
            </Button>
          </div>
        </div>
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
              dataKey={selectedMetric}
              stroke={selectedMetric === "revenue" ? "#10b981" : "#f97316"}
              strokeWidth={3}
              dot={{ fill: selectedMetric === "revenue" ? "#10b981" : "#f97316" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}