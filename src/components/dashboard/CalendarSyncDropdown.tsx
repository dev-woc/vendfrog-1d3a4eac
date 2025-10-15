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
  onEditMarket?: (market: Market) => void;
  onMarketSynced?: (marketId: string) => void;
}

export const CalendarSyncDropdown = ({
  markets,
  selectedMarket,
  onSyncComplete,
  onEditMarket,
  onMarketSynced
}: CalendarSyncDropdownProps) => {
  const { toast } = useToast();
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(
    localStorage.getItem('lastCalendarSync')
  );

  const validateMarketForSync = (market: Market): string | null => {
    const startTime = market.loadInTime || market.marketStartTime;
    const endTime = market.marketEndTime;

    // Check if times are missing or set to placeholder values
    const isInvalidTime = (time: string | undefined) => {
      return !time || time === 'TBA' || time.trim() === '';
    };

    if (isInvalidTime(startTime)) {
      return "Market start time is missing or set to TBA. Please edit the market to add specific times.";
    }
    if (isInvalidTime(endTime)) {
      return "Market end time is missing or set to TBA. Please edit the market to add specific times.";
    }
    return null;
  };

  const handleSync = (platform: 'apple' | 'google' | 'ics', bulkSync = false) => {
    try {
      console.log('[CalendarSync] Starting sync for platform:', platform, 'bulkSync:', bulkSync);

      if (bulkSync && markets.length > 0) {
        // Validate all markets before bulk sync
        const invalidMarkets = markets.filter(m => validateMarketForSync(m) !== null);
        if (invalidMarkets.length > 0) {
          toast({
            title: "Cannot Sync",
            description: `${invalidMarkets.length} market(s) are missing time information. Please edit them to add start and end times.`,
            variant: "destructive",
          });
          return;
        }

        console.log('Bulk syncing markets:', markets.length);
        bulkSyncMarkets(markets, platform);

        // Mark all markets as synced
        markets.forEach(market => {
          onMarketSynced?.(market.id);
        });

        toast({
          title: "Bulk Sync Started",
          description: `Syncing ${markets.length} markets to ${platform === 'apple' ? 'Apple Calendar' : platform === 'google' ? 'Google Calendar' : 'ICS files'}.`,
        });
      } else if (selectedMarket) {
        // Validate single market before sync
        const validationError = validateMarketForSync(selectedMarket);
        if (validationError) {
          toast({
            title: "Cannot Sync Market",
            description: validationError + (onEditMarket ? " Click Edit to update the market times." : ""),
            variant: "destructive",
          });
          return;
        }

        console.log('Syncing single market:', selectedMarket.name);
        const event = marketToCalendarEvent(selectedMarket);
        console.log('Generated calendar event:', event);

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

        // Mark this market as synced
        onMarketSynced?.(selectedMarket.id);

        toast({
          title: "Calendar Sync",
          description: `Market "${selectedMarket.name}" synced to ${platform === 'apple' ? 'Apple Calendar' : platform === 'google' ? 'Google Calendar' : 'calendar file'}.`,
        });
      } else {
        throw new Error('No market selected for sync');
      }

      const syncTime = new Date().toLocaleString();
      setLastSyncTime(syncTime);
      localStorage.setItem('lastCalendarSync', syncTime);
      onSyncComplete?.();

    } catch (error) {
      console.error('Calendar sync error:', error);
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Unable to sync to calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const upcomingMarkets = markets.filter(m => m.status === 'upcoming' || m.status === 'confirmed');

  return (
    <div className="flex items-center gap-2">
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
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSync('apple');
                }}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Add to Apple Calendar
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSync('google');
                }}
              >
                <Globe className="mr-2 h-4 w-4" />
                Add to Google Calendar
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSync('ics');
                }}
              >
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
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSync('apple', true);
                }}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Sync All to Apple Calendar
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSync('google', true);
                }}
              >
                <Globe className="mr-2 h-4 w-4" />
                Sync All to Google Calendar
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSync('ics', true);
                }}
              >
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