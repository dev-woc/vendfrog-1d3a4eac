import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format, isSameDay, parseISO } from "date-fns";
import { Calendar, MapPin, DollarSign, Plus, Clock } from "lucide-react";

interface DateDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  markets: any[];
  onAddMarket: () => void;
  onMarketClick: (market: any) => void;
}

export function DateDetailsModal({ 
  open, 
  onOpenChange, 
  selectedDate, 
  markets, 
  onAddMarket, 
  onMarketClick 
}: DateDetailsModalProps) {
  if (!selectedDate) return null;

  const marketsOnDate = markets.filter(market => 
    isSameDay(parseISO(market.date), selectedDate)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {marketsOnDate.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Markets on this date</h3>
                <Badge variant="secondary">{marketsOnDate.length}</Badge>
              </div>
              
              <div className="space-y-3">
                {marketsOnDate.map(market => (
                  <Card key={market.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onMarketClick(market)}>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="font-medium">{market.name}</div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{market.marketStartTime} - {market.marketEndTime}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{market.address.city}, {market.address.state}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-3 w-3" />
                          <span>${market.estimatedProfit.toLocaleString()} projected</span>
                        </div>
                        
                        <Badge variant={market.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                          {market.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="font-medium mb-2">No markets scheduled</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This date is available for a new market
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
            <Button onClick={onAddMarket} className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Market
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}