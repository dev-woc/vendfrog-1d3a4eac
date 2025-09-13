import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMarkets } from "@/contexts/MarketContext";
import { AddMarketModal } from "@/components/dashboard/AddMarketModal";
import { cn } from "@/lib/utils";
import { format, parseISO, isSameDay } from "date-fns";
import { CalendarDays, Plus } from "lucide-react";

export const MarketCalendar = () => {
  const { getUpcomingMarkets, addMarket, updateMarket } = useMarkets();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const upcomingMarkets = getUpcomingMarkets();
  
  // Get market dates for highlighting
  const marketDates = upcomingMarkets.map(market => parseISO(market.date));
  
  // Get markets for selected date
  const marketsOnSelectedDate = selectedDate 
    ? upcomingMarkets.filter(market => isSameDay(parseISO(market.date), selectedDate))
    : [];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setIsModalOpen(true);
    }
  };

  const handleAddMarket = (market: any) => {
    // Set the date to the selected date if one was selected
    if (selectedDate) {
      market.date = format(selectedDate, 'yyyy-MM-dd');
    }
    addMarket(market);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Market Calendar
        </CardTitle>
        <CardDescription>
          View your upcoming markets and click any date to add a new market
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className={cn("w-full pointer-events-auto")}
              modifiers={{
                hasMarket: marketDates
              }}
              modifiersStyles={{
                hasMarket: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 'bold'
                }
              }}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </div>
          
          {/* Upcoming Markets List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Upcoming Markets</h3>
              <Badge variant="secondary">{upcomingMarkets.length}</Badge>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {upcomingMarkets.slice(0, 6).map(market => (
                <div key={market.id} className="p-2 rounded-lg border bg-muted/50">
                  <div className="font-medium text-sm truncate">{market.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(parseISO(market.date), 'MMM d, yyyy')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {market.address.city}, {market.address.state}
                  </div>
                </div>
              ))}
              
              {upcomingMarkets.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-4">
                  No upcoming markets scheduled
                </div>
              )}
              
              {upcomingMarkets.length > 6 && (
                <div className="text-center text-xs text-muted-foreground">
                  +{upcomingMarkets.length - 6} more markets
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground mt-4 p-2 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <Plus className="h-3 w-3" />
                <span className="font-medium">Tip:</span>
              </div>
              Click any date on the calendar to add a new market for that day.
            </div>
          </div>
        </div>

        <AddMarketModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onAddMarket={handleAddMarket}
          onUpdateMarket={updateMarket}
        />
      </CardContent>
    </Card>
  );
};