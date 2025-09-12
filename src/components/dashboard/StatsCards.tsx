import { TrendingUp, Calendar, DollarSign, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: React.ReactNode;
}

function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={`text-xs ${trend === "up" ? "text-success" : "text-destructive"}`}>
            {trend === "up" ? "+" : ""}{change} from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value="$12,430"
        change="8.2%"
        trend="up"
        icon={<DollarSign className="h-4 w-4" />}
      />
      <StatCard
        title="Markets This Month"
        value="8"
        change="2"
        trend="up"
        icon={<Calendar className="h-4 w-4" />}
      />
      <StatCard
        title="Average Per Market"
        value="$1,554"
        change="12.1%"
        trend="up"
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <StatCard
        title="Documents Uploaded"
        value="12"
        change="3"
        trend="up"
        icon={<FileText className="h-4 w-4" />}
      />
    </div>
  );
}