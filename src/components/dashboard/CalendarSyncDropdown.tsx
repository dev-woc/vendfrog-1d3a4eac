import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarDays, Download, Smartphone, Globe, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Market } from "@/types/market";
import { 
  marketToCalendarEvent, 
  syncToAppleCalendar, 
  syncToGoogleCalendar, 
  downloadICSFile,
  bulkSyncMarkets 
} from "@/lib/calendar-sync";

interface CalendarSyncDropdownProps {
  markets: Market[];
  selectedMarket?: Market | null;
  onSyncComplete?: () => void;
}

export const CalendarSyncDropdown = ({ 
  markets, 
  selectedMarket, 
  onSyncComplete 
}: CalendarSyncDropdownProps) => {
  const { toast } = useToast();
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(
    localStorage.getItem('lastCalendarSync')
  );

  const handleSync = (platform: 'apple' | 'google' | 'ics', bulkSync = false) => {
    try {
      if (bulkSync && markets.length > 0) {
        bulkSyncMarkets(markets, platform);
        toast({
          title: "Bulk Sync Started",
          description: `Syncing ${markets.length} markets to ${platform === 'apple' ? 'Apple Calendar' : platform === 'google' ? 'Google Calendar' : 'ICS files'}.`,
        });
      } else if (selectedMarket) {
        const event = marketToCalendarEvent(selectedMarket);
        
        switch (platform) {
          case 'apple':
            syncToAppleCalendar(event);
            break;
          case 'google':
            syncToGoogleCalendar(event);
            break;
          case 'ics':
            downloadICSFile(event);
            break;
        }
        
        toast({
          title: "Calendar Sync",
          description: `Market "${selectedMarket.name}" synced to ${platform === 'apple' ? 'Apple Calendar' : platform === 'google' ? 'Google Calendar' : 'calendar file'}.`,
        });
      }
      
      const syncTime = new Date().toLocaleString();
      setLastSyncTime(syncTime);
      localStorage.setItem('lastCalendarSync', syncTime);
      onSyncComplete?.();
      
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Unable to sync to calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const upcomingMarkets = markets.filter(m => m.status === 'upcoming' || m.status === 'confirmed');

  return (
    <div className="flex items-center gap-2">
      {lastSyncTime && (
        <Badge variant="secondary" className="text-xs flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Calendar Synced
        </Badge>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Sync Calendar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {selectedMarket && (
            <>
              <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                Sync "{selectedMarket.name}"
              </div>
              <DropdownMenuItem onClick={() => handleSync('apple')}>
                <Smartphone className="mr-2 h-4 w-4" />
                Add to Apple Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSync('google')}>
                <Globe className="mr-2 h-4 w-4" />
                Add to Google Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSync('ics')}>
                <Download className="mr-2 h-4 w-4" />
                Download ICS File
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          {upcomingMarkets.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                Bulk Sync ({upcomingMarkets.length} markets)
              </div>
              <DropdownMenuItem onClick={() => handleSync('apple', true)}>
                <Smartphone className="mr-2 h-4 w-4" />
                Sync All to Apple Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSync('google', true)}>
                <Globe className="mr-2 h-4 w-4" />
                Sync All to Google Calendar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSync('ics', true)}>
                <Download className="mr-2 h-4 w-4" />
                Download All as ICS
              </DropdownMenuItem>
              
              {lastSyncTime && (
                <>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    Last sync: {lastSyncTime}
                  </div>
                </>
              )}
            </>
          )}
          
          {upcomingMarkets.length === 0 && !selectedMarket && (
            <DropdownMenuItem disabled>
              <CalendarDays className="mr-2 h-4 w-4" />
              No markets to sync
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};