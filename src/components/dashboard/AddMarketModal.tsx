import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddMarketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMarket?: (market: any) => void;
  onUpdateMarket?: (market: any) => void;
  editingMarket?: any;
}

export function AddMarketModal({ open, onOpenChange, onAddMarket, onUpdateMarket, editingMarket }: AddMarketModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    date: undefined as Date | undefined,
    loadInTime: "",
    marketStartTime: "",
    marketEndTime: "",
    location: "",
    fee: "",
    estimatedProfit: "",
    status: "pending" as "pending" | "confirmed" | "upcoming",
    organizerContact: "",
    requirements: "",
  });

  // Reset form when modal opens/closes or when editingMarket changes
  React.useEffect(() => {
    if (open && editingMarket) {
      // Populate form with existing market data for editing
      setFormData({
        name: editingMarket.name || "",
        date: editingMarket.date ? new Date(editingMarket.date) : undefined,
        loadInTime: editingMarket.loadInTime || "",
        marketStartTime: editingMarket.marketStartTime || "",
        marketEndTime: editingMarket.marketEndTime || "",
        location: editingMarket.location || "",
        fee: editingMarket.fee?.toString() || "",
        estimatedProfit: editingMarket.estimatedProfit?.toString() || "",
        status: editingMarket.status || "pending",
        organizerContact: editingMarket.organizerContact || "",
        requirements: editingMarket.requirements?.join('\n') || "",
      });
    } else if (open && !editingMarket) {
      // Reset form for new market
      setFormData({
        name: "",
        date: undefined,
        loadInTime: "",
        marketStartTime: "",
        marketEndTime: "",
        location: "",
        fee: "",
        estimatedProfit: "",
        status: "pending",
        organizerContact: "",
        requirements: "",
      });
    }
  }, [open, editingMarket]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const marketData = {
      ...formData,
      fee: parseFloat(formData.fee) || 0,
      estimatedProfit: parseFloat(formData.estimatedProfit) || 0,
      date: formData.date?.toISOString().split('T')[0] || "",
      requirements: formData.requirements ? formData.requirements.split('\n').filter(req => req.trim()) : [],
    };

    if (editingMarket) {
      // Update existing market
      const updatedMarket = {
        ...editingMarket,
        ...marketData,
      };
      onUpdateMarket?.(updatedMarket);
    } else {
      // Add new market
      const newMarket = {
        id: Date.now().toString(),
        ...marketData,
        checklist: {
          insurance: false,
          permit: false,
          inventory: false,
          setup: false,
        },
      };
      onAddMarket?.(newMarket);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingMarket ? "Edit Market" : "Add New Market"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Market Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Downtown Farmers Market"
              required
            />
          </div>

          <div>
            <Label>Event Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="loadInTime">Load-in Time</Label>
              <Input
                id="loadInTime"
                value={formData.loadInTime}
                onChange={(e) => setFormData(prev => ({ ...prev, loadInTime: e.target.value }))}
                placeholder="e.g., 6:00 AM"
                required
              />
            </div>
            <div>
              <Label htmlFor="marketStartTime">Start Time</Label>
              <Input
                id="marketStartTime"
                value={formData.marketStartTime}
                onChange={(e) => setFormData(prev => ({ ...prev, marketStartTime: e.target.value }))}
                placeholder="e.g., 8:00 AM"
                required
              />
            </div>
            <div>
              <Label htmlFor="marketEndTime">End Time</Label>
              <Input
                id="marketEndTime"
                value={formData.marketEndTime}
                onChange={(e) => setFormData(prev => ({ ...prev, marketEndTime: e.target.value }))}
                placeholder="e.g., 2:00 PM"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Main Street Plaza"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="fee">Market Fee ($)</Label>
              <Input
                id="fee"
                type="number"
                value={formData.fee}
                onChange={(e) => setFormData(prev => ({ ...prev, fee: e.target.value }))}
                placeholder="85"
              />
            </div>
            <div>
              <Label htmlFor="estimatedProfit">Est. Profit ($)</Label>
              <Input
                id="estimatedProfit"
                type="number"
                value={formData.estimatedProfit}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedProfit: e.target.value }))}
                placeholder="400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="organizerContact">Organizer Contact</Label>
            <Input
              id="organizerContact"
              value={formData.organizerContact}
              onChange={(e) => setFormData(prev => ({ ...prev, organizerContact: e.target.value }))}
              placeholder="contact@market.com or (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="requirements">Requirements (one per line)</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
              placeholder="Valid business license&#10;Liability insurance&#10;Food handler's permit"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingMarket ? "Update Market" : "Add Market"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}