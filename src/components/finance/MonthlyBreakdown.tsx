import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMarkets } from "@/contexts/MarketContext";
import { format, parseISO, isSameMonth, isSameYear } from "date-fns";

export const MonthlyBreakdown = () => {
  const { getPastMarkets } = useMarkets();
  const [selectedPeriod, setSelectedPeriod] = useState<"total" | "month">("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const pastMarkets = getPastMarkets();
  
  // Get unique months from past markets
  const availableMonths = Array.from(
    new Set(
      pastMarkets.map(market => 
        format(parseISO(market.date), "yyyy-MM")
      )
    )
  ).sort().reverse();

  // Filter markets based on selected period
  const filteredMarkets = selectedPeriod === "total" 
    ? pastMarkets 
    : pastMarkets.filter(market => {
        const marketDate = parseISO(market.date);
        return isSameMonth(marketDate, selectedDate) && isSameYear(marketDate, selectedDate);
      });

  const revenue = filteredMarkets.reduce((sum, market) => sum + (market.actualRevenue || 0), 0);
  const fees = filteredMarkets.reduce((sum, market) => sum + market.fee, 0);
  const profit = revenue - fees;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Financial Breakdown</CardTitle>
            <CardDescription>
              Detailed expense and revenue analysis
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === "total" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("total")}
            >
              Total
            </Button>
            <Button
              variant={selectedPeriod === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("month")}
            >
              Monthly
            </Button>
          </div>
        </div>
        
        {selectedPeriod === "month" && (
          <div className="flex gap-2 flex-wrap">
            {availableMonths.map(month => (
              <Button
                key={month}
                variant={format(selectedDate, "yyyy-MM") === month ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDate(parseISO(month + "-01"))}
              >
                {format(parseISO(month + "-01"), "MMM yyyy")}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">
              ${revenue.toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Vendor Fees</div>
            <div className="text-2xl font-bold text-red-600">
              -${fees.toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Net Profit</div>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profit.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Market Details</h4>
          {filteredMarkets.length === 0 ? (
            <p className="text-muted-foreground text-sm">No markets found for selected period.</p>
          ) : (
            <div className="space-y-2">
              {filteredMarkets.map(market => {
                const marketProfit = (market.actualRevenue || 0) - market.fee;
                return (
                  <div key={market.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{market.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(parseISO(market.date), "MMM dd, yyyy")}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm">
                        Revenue: <span className="font-medium">${market.actualRevenue?.toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        Fee: <span className="text-red-600">-${market.fee.toLocaleString()}</span>
                      </div>
                      <div className="text-sm">
                        Profit: <span className={`font-medium ${marketProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${marketProfit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};