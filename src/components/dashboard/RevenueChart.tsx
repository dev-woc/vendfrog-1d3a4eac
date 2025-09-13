import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

const monthlyData = [
  { month: "Aug", revenue: 2800, markets: 6 },
  { month: "Sep", revenue: 3200, markets: 7 },
  { month: "Oct", revenue: 2900, markets: 6 },
  { month: "Nov", revenue: 3800, markets: 8 },
  { month: "Dec", revenue: 4200, markets: 9 },
  { month: "Jan", revenue: 3600, markets: 7 },
];

const marketData = [
  { name: "Farmers Market", count: 15, revenue: 4800 },
  { name: "Art Fair", count: 8, revenue: 3200 },
  { name: "Night Market", count: 6, revenue: 2400 },
  { name: "Holiday Market", count: 4, revenue: 2800 },
];

export function RevenueChart() {
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