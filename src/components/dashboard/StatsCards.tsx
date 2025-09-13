import { TrendingUp, Calendar, DollarSign, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarkets } from "@/contexts/MarketContext";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: string | React.ReactNode;
  change?: string;
  trend?: "up" | "down";
  icon: React.ReactNode;
  linkText?: string;
  linkTo?: string;
}

function StatCard({ title, value, change, trend, icon, linkText, linkTo }: StatCardProps) {
  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="text-lg sm:text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${trend === "up" ? "text-success" : "text-destructive"} mt-1`}>
            {trend === "up" ? "+" : ""}{change} from last month
          </p>
        )}
        {linkText && linkTo && (
          <Link 
            to={linkTo} 
            className="text-xs text-primary hover:underline mt-1 sm:mt-2 inline-block"
          >
            {linkText}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { getPastMarkets, getUpcomingMarkets } = useMarkets();
  
  const pastMarkets = getPastMarkets();
  const upcomingMarkets = getUpcomingMarkets();
  
  // Calculate total revenue from completed markets
  const totalRevenue = pastMarkets.reduce((sum, market) => sum + (market.actualRevenue || 0), 0);
  
  // Calculate current month markets (past + upcoming)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthMarkets = [...pastMarkets, ...upcomingMarkets].filter(market => {
    const marketDate = new Date(market.date);
    return marketDate.getMonth() === currentMonth && marketDate.getFullYear() === currentYear;
  });
  
  // Calculate average per completed market
  const averagePerMarket = pastMarkets.length > 0 ? Math.round(totalRevenue / pastMarkets.length) : 0;

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={<span className="text-emerald-600">${totalRevenue.toLocaleString()}</span>}
        change={pastMarkets.length > 1 ? "8.2%" : undefined}
        trend="up"
        icon={<DollarSign className="h-4 w-4" />}
        linkText="View Finances"
        linkTo="/finance"
      />
      <StatCard
        title="Markets This Month"
        value={<span className="text-blue-600">{thisMonthMarkets.length.toString()}</span>}
        change={thisMonthMarkets.length > 0 ? "2" : undefined}
        trend="up"
        icon={<Calendar className="h-4 w-4" />}
        linkText="View Markets"
        linkTo="/markets"
      />
      <StatCard
        title="Average Per Market"
        value={<span className="text-purple-600">${averagePerMarket.toLocaleString()}</span>}
        change={pastMarkets.length > 1 ? "12.1%" : undefined}
        trend="up"
        icon={<TrendingUp className="h-4 w-4" />}
        linkText="View Finances"
        linkTo="/finance"
      />
      <StatCard
        title="Completed Markets"
        value={<span className="text-orange-600">{pastMarkets.length.toString()}</span>}
        change={pastMarkets.length > 0 ? "1" : undefined}
        trend="up"
        icon={<FileText className="h-4 w-4" />}
        linkText="View Markets"
        linkTo="/markets"
      />
    </div>
  );
}