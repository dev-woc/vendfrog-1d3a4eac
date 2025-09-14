import { useState, useEffect } from "react";
import { Bell, X, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useMarkets } from "@/contexts/MarketContext";

interface Alert {
  id: string;
  marketId: string;
  marketName: string;
  type: "checklist_incomplete" | "upcoming_market";
  message: string;
  urgency: "high" | "medium" | "low";
}

export function AlertsDropdown() {
  const { getUpcomingMarkets } = useMarkets();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  useEffect(() => {
    const upcomingMarkets = getUpcomingMarkets();
    const newAlerts: Alert[] = [];
    const dismissed = JSON.parse(localStorage.getItem('dismissedAlerts') || '[]');
    setDismissedAlerts(dismissed);

    upcomingMarkets.forEach(market => {
      const marketDate = new Date(market.date);
      const today = new Date();
      const timeDiff = marketDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Check if market is within 2 weeks and checklist is incomplete
      if (daysDiff <= 14 && daysDiff > 0) {
        const completedTasks = market.checklist.filter(item => item.completed).length;
        const totalTasks = market.checklist.length;
        
        if (completedTasks < totalTasks) {
          const alertId = `checklist_${market.id}`;
          if (!dismissed.includes(alertId)) {
            newAlerts.push({
              id: alertId,
              marketId: market.id,
              marketName: market.name,
              type: "checklist_incomplete",
              message: `${market.name} checklist incomplete (${completedTasks}/${totalTasks} completed) - ${daysDiff} days remaining`,
              urgency: daysDiff <= 7 ? "high" : daysDiff <= 10 ? "medium" : "low"
            });
          }
        }

        // Add upcoming market alert
        const upcomingAlertId = `upcoming_${market.id}`;
        if (!dismissed.includes(upcomingAlertId)) {
          newAlerts.push({
            id: upcomingAlertId,
            marketId: market.id,
            marketName: market.name,
            type: "upcoming_market",
            message: `${market.name} is coming up in ${daysDiff} days`,
            urgency: daysDiff <= 3 ? "high" : daysDiff <= 7 ? "medium" : "low"
          });
        }
      }
    });

    setAlerts(newAlerts);
  }, [getUpcomingMarkets]);

  const dismissAlert = (alertId: string) => {
    const newDismissed = [...dismissedAlerts, alertId];
    setDismissedAlerts(newDismissed);
    localStorage.setItem('dismissedAlerts', JSON.stringify(newDismissed));
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "checklist_incomplete": return <AlertTriangle className="h-4 w-4" />;
      case "upcoming_market": return <Clock className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 relative">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          {alerts.length > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-[8px] text-destructive-foreground font-bold">
                {alerts.length > 9 ? '9+' : alerts.length}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="p-2 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-xs text-muted-foreground">Market alerts and reminders</p>
        </div>
        
        {alerts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No new alerts</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 border-b last:border-b-0 hover:bg-muted/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">{alert.message}</p>
                      <Badge variant={getUrgencyColor(alert.urgency) as any} className="text-xs">
                        {alert.urgency.toUpperCase()} PRIORITY
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="h-6 w-6 p-0 hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}