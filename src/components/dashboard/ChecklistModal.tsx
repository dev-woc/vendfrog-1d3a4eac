import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CheckSquare, Edit, Plus, X } from "lucide-react";
import { Market } from "@/types/market";
import { useToast } from "@/hooks/use-toast";

interface ChecklistModalProps {
  market: Market | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateChecklist: (marketId: string, checklistItemId: string) => void;
  onEditMarket?: (market: Market) => void;
  onAddChecklistItem?: (marketId: string, newItem: { id: string; label: string; completed: boolean }) => void;
}

export function ChecklistModal({ market, open, onOpenChange, onUpdateChecklist, onEditMarket, onAddChecklistItem }: ChecklistModalProps) {
  const { toast } = useToast();
  const [newItemText, setNewItemText] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [localMarket, setLocalMarket] = useState<Market | null>(null);
  
  // Update local market when prop changes
  useEffect(() => {
    if (market) {
      setLocalMarket({ ...market });
    } else {
      setLocalMarket(null);
    }
  }, [market]);

  // Early return if no market data
  if (!market || !localMarket) return null;

  const completedTasks = localMarket.checklist.filter(item => item.completed).length;
  const totalTasks = localMarket.checklist.length;
  
  
  const handleChecklistUpdate = (checklistItemId: string) => {
    // Update local state immediately for instant UI feedback
    setLocalMarket(prev => {
      if (!prev) return prev;
      const updatedChecklist = prev.checklist.map(item => 
        item.id === checklistItemId ? { ...item, completed: !item.completed } : item
      );
      return { ...prev, checklist: updatedChecklist };
    });

    // Then update the context
    onUpdateChecklist(market.id, checklistItemId);
    
    // Find the item to determine if it's being checked or unchecked
    const item = localMarket.checklist.find(item => item.id === checklistItemId);
    const isCompleting = !item?.completed;
    
    toast({
      title: isCompleting ? "Task completed!" : "Task marked incomplete",
      description: isCompleting 
        ? `"${item?.label}" has been marked as complete.`
        : `"${item?.label}" has been marked as incomplete.`,
    });
  };

  const handleAddItem = () => {
    if (newItemText.trim() && onAddChecklistItem) {
      const newItem = {
        id: Date.now().toString(),
        label: newItemText.trim(),
        completed: false
      };
      
      // Update local state immediately
      setLocalMarket(prev => {
        if (!prev) return prev;
        return { ...prev, checklist: [...prev.checklist, newItem] };
      });

      // Then update the context
      onAddChecklistItem(market.id, newItem);
      setNewItemText("");
      setIsAddingItem(false);
      
      toast({
        title: "Item added!",
        description: `"${newItem.label}" has been added to the checklist.`,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    } else if (e.key === 'Escape') {
      setIsAddingItem(false);
      setNewItemText("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <CheckSquare className="h-5 w-5 mr-2" />
              {localMarket.name} - Checklist
            </DialogTitle>
            <div className="text-sm text-muted-foreground">
              {completedTasks}/{totalTasks} ({Math.round((completedTasks / totalTasks) * 100)}%)
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2" 
              style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
            >
              {completedTasks > 0 && (
                <span className="text-xs text-primary-foreground font-medium">
                  {Math.round((completedTasks / totalTasks) * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-3">
            {localMarket.checklist.map((item) => (
              <div key={item.id} className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-all duration-200 ${
                item.completed ? 'bg-muted/30 border-primary/20' : ''
              }`}>
                <Checkbox 
                  checked={item.completed}
                  onCheckedChange={() => handleChecklistUpdate(item.id)}
                  className="transition-all duration-200"
                />
                <label 
                  className={`text-sm cursor-pointer flex-1 transition-all duration-300 ease-in-out relative ${
                    item.completed 
                      ? 'text-muted-foreground opacity-60' 
                      : 'text-foreground'
                  }`}
                  onClick={() => handleChecklistUpdate(item.id)}
                  style={{
                    textDecoration: item.completed ? 'line-through' : 'none',
                    textDecorationThickness: '2px',
                    textDecorationColor: 'hsl(var(--primary))',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  {item.completed ? '✓ ' : ''}{item.label}
                </label>
              </div>
            ))}
            
            {/* Add New Item Section */}
            {isAddingItem ? (
              <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/20">
                <Input
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter new checklist item..."
                  className="flex-1"
                  autoFocus
                />
                <Button 
                  size="sm" 
                  onClick={handleAddItem}
                  disabled={!newItemText.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setIsAddingItem(false);
                    setNewItemText("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsAddingItem(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Item
              </Button>
            )}
          </div>
          
          {localMarket.checklist.length === 0 && !isAddingItem && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No checklist items for this market.</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingItem(true)}
                className="mt-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter className="border-t pt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              onEditMarket?.(localMarket);
              onOpenChange(false);
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Market
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}