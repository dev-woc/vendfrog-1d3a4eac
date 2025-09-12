import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Clock, DollarSign, CheckSquare, ExternalLink } from "lucide-react";
import { getMapUrl } from "@/lib/utils";

interface Market {
  id: string;
  name: string;
  date: string;
  loadInTime: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
  fee: number;
  estimatedProfit: number;
  status: "upcoming" | "confirmed" | "pending";
  checklist: {
    insurance: boolean;
    permit: boolean;
    inventory: boolean;
    setup: boolean;
  };
  description?: string;
  organizerContact?: string;
  requirements?: string[];
}

interface MarketDetailsModalProps {
  market: Market | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateChecklist: (marketId: string, item: keyof Market['checklist']) => void;
}

export function MarketDetailsModal({ market, open, onOpenChange, onUpdateChecklist }: MarketDetailsModalProps) {
  if (!market) return null;

  const completedTasks = Object.values(market.checklist).filter(Boolean).length;
  const totalTasks = Object.keys(market.checklist).length;
  
  // Create full address string for display and mapping
  const fullAddress = `${market.address.street}, ${market.address.city}, ${market.address.state} ${market.address.zipCode}${market.address.country ? `, ${market.address.country}` : ''}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{market.name}</DialogTitle>
            <Badge variant={market.status === "confirmed" ? "default" : market.status === "pending" ? "secondary" : "outline"}>
              {market.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Load-in:</span>
                <span className="ml-2">{market.loadInTime}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Location:</span>
                <span className="ml-2">{fullAddress}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="font-medium">Fee:</span>
                <span className="ml-2">${market.fee}</span>
              </div>
              <div className="flex items-center text-sm text-success">
                <DollarSign className="h-4 w-4 mr-2" />
                <span className="font-medium">Est. Profit:</span>
                <span className="ml-2">${market.estimatedProfit}</span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">Event Date</p>
            <p className="text-lg">{new Date(market.date).toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}</p>
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" />
                Preparation Checklist
              </h3>
              <span className="text-sm text-muted-foreground">
                {completedTasks}/{totalTasks} completed
              </span>
            </div>
            
            <div className="space-y-2">
              {Object.entries(market.checklist).map(([item, completed]) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox 
                    checked={completed}
                    onCheckedChange={() => onUpdateChecklist(market.id, item as keyof Market['checklist'])}
                  />
                  <label className="text-sm capitalize">
                    {item === 'insurance' ? 'Insurance Documents' : 
                     item === 'permit' ? 'Business Permit' :
                     item === 'inventory' ? 'Inventory Prepared' :
                     'Setup Plan Ready'}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              />
            </div>
          </div>

          {/* Contact & Requirements */}
          <div className="space-y-4">
            {market.organizerContact && (
              <div>
                <h4 className="font-medium mb-1">Organizer Contact</h4>
                <p className="text-sm text-muted-foreground">{market.organizerContact}</p>
              </div>
            )}
            
            {market.requirements && (
              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {market.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open(getMapUrl(fullAddress), '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
            <Button variant="outline" className="flex-1">
              Contact Organizer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}