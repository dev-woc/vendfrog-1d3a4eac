import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Market } from "@/types/market";

interface CloseMarketModalProps {
  market: Market | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseMarket: (marketId: string, actualRevenue: number) => void;
}

export function CloseMarketModal({ market, open, onOpenChange, onCloseMarket }: CloseMarketModalProps) {
  const [actualRevenue, setActualRevenue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!market) return null;

  const revenueNumber = parseFloat(actualRevenue) || 0;
  const actualProfit = revenueNumber - market.fee;
  const profitDifference = actualProfit - market.estimatedProfit;
  const isProfitable = actualProfit > 0;
  const metEstimate = profitDifference >= 0;

  const handleSubmit = async () => {
    if (!actualRevenue || revenueNumber < 0) return;
    
    setIsSubmitting(true);
    try {
      onCloseMarket(market.id, revenueNumber);
      setActualRevenue("");
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setActualRevenue("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Close Market</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <h3 className="font-medium">{market.name}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(market.date).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Market Fee:</span>
              <p className="font-medium">${market.fee}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Est. Profit:</span>
              <p className="font-medium">${market.estimatedProfit}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenue">Total Revenue Earned</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="revenue"
                type="number"
                placeholder="0.00"
                value={actualRevenue}
                onChange={(e) => setActualRevenue(e.target.value)}
                className="pl-9"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {actualRevenue && revenueNumber >= 0 && (
            <div className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Actual Profit:</span>
                <span className={`font-medium ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                  ${actualProfit.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>vs. Estimate:</span>
                <div className={`flex items-center ${metEstimate ? 'text-green-600' : 'text-red-600'}`}>
                  {metEstimate ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {metEstimate ? '+' : ''}${profitDifference.toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!actualRevenue || revenueNumber < 0 || isSubmitting}
          >
            {isSubmitting ? "Closing..." : "Close Market"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}