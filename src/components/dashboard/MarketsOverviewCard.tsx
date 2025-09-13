import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMarkets } from "@/contexts/MarketContext";
import { Calendar, Clock, TrendingUp } from "lucide-react";
import { differenceInDays, parseISO, format } from "date-fns";

export const MarketsOverviewCard = () => {
  const { getPastMarkets, getUpcomingMarkets } = useMarkets();
  
  const pastMarkets = getPastMarkets();
  const upcomingMarkets = getUpcomingMarkets();
  
  // Find the next upcoming market
  const nextMarket = upcomingMarkets.length > 0 ? upcomingMarkets[0] : null;
  
  // Calculate days until next market
  const daysUntilNext = nextMarket 
    ? differenceInDays(parseISO(nextMarket.date), new Date())
    : null;

  // Calculate status counts for upcoming markets
  const statusCounts = upcomingMarkets.reduce((counts, market) => {
    counts[market.status] = (counts[market.status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Markets Overview
        </CardTitle>
        <CardDescription>
          Your market schedule and performance summary
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Next Market Details */}
          {nextMarket ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Next Market</span>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-sm truncate">{nextMarket.name}</div>
                <div className="text-xs text-muted-foreground">{nextMarket.address.city}, {nextMarket.address.state}</div>
                <Badge variant="default" className="text-xs">
                  ${nextMarket.estimatedProfit.toLocaleString()} projected
                </Badge>
                {daysUntilNext !== null && (
                  <div className="mt-2">
                    <div className="text-lg font-bold text-primary">
                      {daysUntilNext === 0 
                        ? "Today!" 
                        : daysUntilNext === 1 
                        ? "Tomorrow"
                        : `${daysUntilNext} days away`
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(parseISO(nextMarket.date), 'EEEE, MMM d')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Next Market</span>
              </div>
              <div className="text-sm text-muted-foreground">No upcoming markets scheduled</div>
            </div>
          )}

          {/* Upcoming Markets */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Upcoming Markets</span>
            </div>
            <div className="text-2xl font-bold">{upcomingMarkets.length}</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {statusCounts.confirmed && (
                <Badge variant="default" className="text-xs">
                  {statusCounts.confirmed} Confirmed
                </Badge>
              )}
              {statusCounts.pending && (
                <Badge variant="secondary" className="text-xs">
                  {statusCounts.pending} Pending
                </Badge>
              )}
              {statusCounts.upcoming && (
                <Badge variant="outline" className="text-xs">
                  {statusCounts.upcoming} Upcoming
                </Badge>
              )}
            </div>
          </div>

          {/* Past Markets */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Completed Markets</span>
            </div>
            <div className="text-2xl font-bold">{pastMarkets.length}</div>
            <Badge variant="outline" className="text-xs">
              Total completed
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};