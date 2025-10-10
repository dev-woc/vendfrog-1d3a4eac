import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimeSelector } from "@/components/ui/TimeSelector";
import { Progress } from "@/components/ui/progress";
import { CalendarIcon, Save, ArrowLeft, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AddMarketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMarket?: (market: any) => void;
  onUpdateMarket?: (market: any) => void;
  editingMarket?: any;
}

export function AddMarketModal({ open, onOpenChange, onAddMarket, onUpdateMarket, editingMarket }: AddMarketModalProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: undefined as Date | undefined,
    loadInTime: "",
    marketStartTime: "",
    marketEndTime: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US"
    },
    fee: "",
    estimatedProfit: "",
    status: "pending" as "pending" | "confirmed" | "upcoming",
    organizerContact: "",
    requirements: "",
    checklistItems: [] as { id: string; label: string }[],
  });

  // Auto-save functionality
  useEffect(() => {
    if (!editingMarket || !hasUnsavedChanges) return;

    const autoSaveTimer = setTimeout(async () => {
      await handleAutoSave();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [formData, hasUnsavedChanges]);

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
        address: editingMarket.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "US"
        },
        fee: editingMarket.fee?.toString() || "",
        estimatedProfit: editingMarket.estimatedProfit?.toString() || "",
        status: editingMarket.status || "pending",
        organizerContact: editingMarket.organizerContact || "",
        requirements: editingMarket.requirements?.join('\n') || "",
        checklistItems: editingMarket.checklist?.map((item: any) => ({ id: item.id, label: item.label })) || [],
      });
    } else if (open && !editingMarket) {
      // Reset form for new market
      setFormData({
        name: "",
        date: undefined,
        loadInTime: "",
        marketStartTime: "",
        marketEndTime: "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "US"
        },
        fee: "",
        estimatedProfit: "",
        status: "pending",
        organizerContact: "",
        requirements: "",
        checklistItems: [],
      });
      setHasUnsavedChanges(false);
    }
  }, [open, editingMarket]);

  const handleAutoSave = async () => {
    if (!editingMarket || !hasUnsavedChanges) return;
    
    setIsSaving(true);
    try {

      const marketData = {
        ...formData,
        fee: parseFloat(formData.fee) || 0,
        estimatedProfit: parseFloat(formData.estimatedProfit) || 0,
        date: formData.date?.toISOString().split('T')[0] || "",
        requirements: formData.requirements ? formData.requirements.split('\n').filter(req => req.trim()) : [],
        checklist: formData.checklistItems.map(item => ({ ...item, completed: false })),
      };

      const updatedMarket = {
        ...editingMarket,
        ...marketData,
      };

      onUpdateMarket?.(updatedMarket);
      setHasUnsavedChanges(false);
      
      toast({
        title: "Changes saved",
        description: "Market details have been automatically saved.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange = (newData: any) => {
    setFormData(newData);
    if (editingMarket) {
      setHasUnsavedChanges(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);

    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Market name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.date) {
      toast({
        title: "Validation Error",
        description: "Market date is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    const marketData = {
      ...formData,
      fee: parseFloat(formData.fee) || 0,
      estimatedProfit: parseFloat(formData.estimatedProfit) || 0,
      date: formData.date?.toISOString().split('T')[0] || "",
      requirements: formData.requirements ? formData.requirements.split('\n').filter(req => req.trim()) : [],
      checklist: formData.checklistItems.map(item => ({ ...item, completed: false })),
    };

    console.log('Processed market data:', marketData);

    try {
      if (editingMarket) {
        // Update existing market
        console.log('Updating market:', editingMarket.id);
        const updatedMarket = {
          ...editingMarket,
          ...marketData,
        };
        await onUpdateMarket?.(updatedMarket);
        console.log('Market update completed');
      } else {
        // Add new market
        console.log('Adding new market');
        const newMarket = {
          // Remove id - let database auto-generate UUID
          ...marketData,
        };
        console.log('New market object:', newMarket);
        console.log('Calling onAddMarket...');

        if (!onAddMarket) {
          throw new Error('onAddMarket handler not provided');
        }

        await onAddMarket(newMarket);
        console.log('onAddMarket completed successfully');
      }

      setHasUnsavedChanges(false);

      toast({
        title: editingMarket ? "Market Updated" : "Market Added",
        description: editingMarket ? "Market details have been updated successfully." : "New market has been added successfully.",
      });

      // Only close modal for new markets, keep open for editing
      if (!editingMarket) {
        console.log('Closing modal...');
        onOpenChange(false);
        console.log('Modal closed');
      }
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      toast({
        title: "Error",
        description: error?.message || "Failed to save market. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {editingMarket && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <DialogTitle>{editingMarket ? "Edit Market" : "Add New Market"}</DialogTitle>
            </div>
            {editingMarket && (
              <div className="flex items-center gap-2">
                {isSaving && <Progress value={100} className="w-16 h-2" />}
                {hasUnsavedChanges && !isSaving && (
                  <span className="text-xs text-amber-600 flex items-center gap-1">
                    <Save className="h-3 w-3" />
                    Auto-saving...
                  </span>
                )}
                {!hasUnsavedChanges && !isSaving && (
                  <span className="text-xs text-green-600">Saved</span>
                )}
              </div>
            )}
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Market Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleFormChange({ ...formData, name: e.target.value })}
              placeholder="e.g., Downtown Farmers Market"
              required
            />
          </div>

          <div>
            <Label>Event Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                  onSelect={(date) => {
                    handleFormChange({ ...formData, date });
                    setIsCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Load-in Time</Label>
              <TimeSelector
                value={formData.loadInTime}
                onChange={(time) => handleFormChange({ ...formData, loadInTime: time })}
                placeholder="Select load-in time"
              />
            </div>
            <div>
              <Label>Market Start Time</Label>
              <TimeSelector
                value={formData.marketStartTime}
                onChange={(time) => handleFormChange({ ...formData, marketStartTime: time })}
                placeholder="Select start time"
              />
            </div>
            <div>
              <Label>Market End Time</Label>
              <TimeSelector
                value={formData.marketEndTime}
                onChange={(time) => handleFormChange({ ...formData, marketEndTime: time })}
                placeholder="Select end time"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => handleFormChange({ ...formData, status: value })}>
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

          <div className="space-y-4">
            <div>
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) => handleFormChange({ 
                  ...formData, 
                  address: { ...formData.address, street: e.target.value }
                })}
                placeholder="e.g., 123 Main Street Plaza"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleFormChange({ 
                    ...formData, 
                    address: { ...formData.address, city: e.target.value }
                  })}
                  placeholder="e.g., Portland"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleFormChange({ 
                    ...formData, 
                    address: { ...formData.address, state: e.target.value }
                  })}
                  placeholder="e.g., OR"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => handleFormChange({ 
                    ...formData, 
                    address: { ...formData.address, zipCode: e.target.value }
                  })}
                  placeholder="e.g., 97201"
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.address.country || "US"}
                  onChange={(e) => handleFormChange({ 
                    ...formData, 
                    address: { ...formData.address, country: e.target.value }
                  })}
                  placeholder="e.g., US"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="fee">Market Fee ($)</Label>
              <Input
                id="fee"
                type="number"
                value={formData.fee}
                onChange={(e) => handleFormChange({ ...formData, fee: e.target.value })}
                placeholder="85"
              />
            </div>
            <div>
              <Label htmlFor="estimatedProfit">Est. Profit ($)</Label>
              <Input
                id="estimatedProfit"
                type="number"
                value={formData.estimatedProfit}
                onChange={(e) => handleFormChange({ ...formData, estimatedProfit: e.target.value })}
                placeholder="400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="organizerContact">Organizer Contact</Label>
            <Input
              id="organizerContact"
              value={formData.organizerContact}
              onChange={(e) => handleFormChange({ ...formData, organizerContact: e.target.value })}
              placeholder="contact@market.com or (555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="requirements">Requirements (one per line)</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleFormChange({ ...formData, requirements: e.target.value })}
              placeholder="Valid business license&#10;Liability insurance&#10;Food handler's permit"
              rows={3}
            />
          </div>

          {/* Checklist Items */}
          <div>
            <Label>Preparation Checklist</Label>
            <div className="space-y-2 mt-2">
              {formData.checklistItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={item.label}
                    onChange={(e) => {
                      const newItems = [...formData.checklistItems];
                      newItems[index] = { ...item, label: e.target.value };
                      handleFormChange({ ...formData, checklistItems: newItems });
                    }}
                    placeholder="Enter checklist item"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = formData.checklistItems.filter((_, i) => i !== index);
                      handleFormChange({ ...formData, checklistItems: newItems });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const newItem = { id: Date.now().toString(), label: "" };
                  handleFormChange({ ...formData, checklistItems: [...formData.checklistItems, newItem] });
                }}
                className="w-full"
              >
                Add Checklist Item
              </Button>
              
              {formData.checklistItems.length === 0 && (
                <div className="flex gap-2 flex-wrap">
                  {[
                    "Insurance Documents",
                    "Business Permit", 
                    "Inventory Prepared",
                    "Setup Plan Ready",
                    "Payment Confirmed",
                    "Transportation Arranged"
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newItem = { id: Date.now().toString(), label: suggestion };
                        handleFormChange({ ...formData, checklistItems: [...formData.checklistItems, newItem] });
                      }}
                    >
                      + {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {editingMarket ? (
            <div className="space-y-2 pt-4">
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Close
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Add Market
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}