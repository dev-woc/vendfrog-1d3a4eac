import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare } from "lucide-react";
import { Market } from "@/types/market";
import { useToast } from "@/hooks/use-toast";

interface ChecklistModalProps {
  market: Market | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateChecklist: (marketId: string, checklistItemId: string) => void;
}

export function ChecklistModal({ market, open, onOpenChange, onUpdateChecklist }: ChecklistModalProps) {
  const { toast } = useToast();
  
  if (!market) return null;

  const completedTasks = market.checklist.filter(item => item.completed).length;
  const totalTasks = market.checklist.length;
  
  const handleChecklistUpdate = (checklistItemId: string) => {
    onUpdateChecklist(market.id, checklistItemId);
    
    // Find the item to determine if it's being checked or unchecked
    const item = market.checklist.find(item => item.id === checklistItemId);
    const isCompleting = !item?.completed;
    
    toast({
      title: isCompleting ? "Task completed!" : "Task marked incomplete",
      description: isCompleting 
        ? `"${item?.label}" has been marked as complete.`
        : `"${item?.label}" has been marked as incomplete.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <CheckSquare className="h-5 w-5 mr-2" />
              {market.name} - Checklist
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
            {market.checklist.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox 
                  checked={item.completed}
                  onCheckedChange={() => handleChecklistUpdate(item.id)}
                />
                <label 
                  className={`text-sm cursor-pointer flex-1 ${
                    item.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                  onClick={() => handleChecklistUpdate(item.id)}
                >
                  {item.label}
                </label>
              </div>
            ))}
          </div>
          
          {market.checklist.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No checklist items for this market.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}