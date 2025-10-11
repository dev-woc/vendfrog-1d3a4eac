import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMarkets } from "@/contexts/MarketContext";
import { AddMarketModal } from "@/components/dashboard/AddMarketModal";
import { MarketDetailsModal } from "@/components/dashboard/MarketDetailsModal";
import { DateDetailsModal } from "@/components/dashboard/DateDetailsModal";
import { CalendarSyncDropdown } from "@/components/dashboard/CalendarSyncDropdown";
import { cn } from "@/lib/utils";
import { format, parseISO, isSameDay } from "date-fns";
import { CalendarDays, Plus } from "lucide-react";

export const MarketCalendar = () => {
  const { getUpcomingMarkets, addMarket, updateMarket, updateMarketChecklist } = useMarkets();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDateDetailsModalOpen, setIsDateDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [editingMarket, setEditingMarket] = useState<any>(null);
  
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
      setIsDateDetailsModalOpen(true);
    }
  };

  const handleMarketClick = (market: any) => {
    setSelectedMarket(market);
    setIsDetailsModalOpen(true);
  };

  const handleAddMarket = async (market: any) => {
    try {
      console.log('Adding market:', market);
      // Set the date to the selected date if one was selected
      if (selectedDate) {
        market.date = format(selectedDate, 'yyyy-MM-dd');
      }
      await addMarket(market);
      console.log('Market added successfully');
    } catch (error) {
      console.error('Error adding market:', error);
    }
  };

  const handleEditMarket = (market: any) => {
    setEditingMarket(market);
    setIsEditModalOpen(true);
  };

  const handleEditComplete = (updatedMarket: any) => {
    updateMarket(updatedMarket);
    setIsEditModalOpen(false);
    setEditingMarket(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Market Calendar
            </CardTitle>
            <CardDescription>
              View your upcoming markets and click any date to see details or add new markets
            </CardDescription>
          </div>
          <CalendarSyncDropdown
            markets={upcomingMarkets}
            selectedMarket={selectedMarket}
            onEditMarket={handleEditMarket}
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex items-center gap-6 mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
            <span className="text-sm text-muted-foreground">Market Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-muted-foreground bg-background"></div>
            <span className="text-sm text-muted-foreground">Available Date</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-muted"></div>
            <span className="text-sm text-muted-foreground">Past Date</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          {/* Calendar - stretched to take more space */}
          <div className="lg:col-span-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className={cn("w-full h-full pointer-events-auto flex justify-center")}
              modifiers={{
                hasMarket: marketDates
              }}
              modifiersStyles={{
                hasMarket: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  border: '2px solid hsl(var(--primary))'
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
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {upcomingMarkets.slice(0, 8).map(market => (
                <div 
                  key={market.id} 
                  className="p-2 rounded-lg border bg-muted/50 cursor-pointer hover:bg-muted transition-colors group"
                  onClick={() => handleMarketClick(market)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{market.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(market.date), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {market.address.city}, {market.address.state}
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <CalendarSyncDropdown
                        markets={[market]}
                        selectedMarket={market}
                        onEditMarket={handleEditMarket}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingMarkets.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-4">
                  No upcoming markets scheduled
                </div>
              )}
              
              {upcomingMarkets.length > 8 && (
                <div className="text-center text-xs text-muted-foreground">
                  +{upcomingMarkets.length - 8} more markets
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground mt-4 p-2 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <Plus className="h-3 w-3" />
                <span className="font-medium">Tip:</span>
              </div>
              Click any date on the calendar to see scheduled markets or add a new one.
            </div>
          </div>
        </div>

        <AddMarketModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onAddMarket={handleAddMarket}
          onUpdateMarket={updateMarket}
        />

        <AddMarketModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onUpdateMarket={handleEditComplete}
          editingMarket={editingMarket}
        />

        <MarketDetailsModal
          market={selectedMarket}
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          onUpdateChecklist={updateMarketChecklist}
          onEditMarket={handleEditMarket}
        />

        <DateDetailsModal
          open={isDateDetailsModalOpen}
          onOpenChange={setIsDateDetailsModalOpen}
          selectedDate={selectedDate || null}
          markets={upcomingMarkets}
          onAddMarket={() => {
            setIsDateDetailsModalOpen(false);
            setIsAddModalOpen(true);
          }}
          onMarketClick={(market) => {
            setIsDateDetailsModalOpen(false);
            handleMarketClick(market);
          }}
        />
      </CardContent>
    </Card>
  );
};