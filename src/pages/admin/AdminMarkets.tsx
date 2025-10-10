import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface Market {
  id: string;
  name: string;
  date: string;
  city: string;
  state: string;
  fee: number;
  actual_revenue: number | null;
  status: string;
  user_email?: string;
}

export default function AdminMarkets() {
  const navigate = useNavigate();
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    const { data } = await supabase
      .from('markets')
      .select('*')
      .order('date', { ascending: false });

    if (data) {
      // Get user emails
      const marketsWithUsers = await Promise.all(
        data.map(async (market) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('user_id', market.user_id)
            .single();

          if (profile) {
            const { data: user } = await supabase.auth.admin.getUserById(profile.user_id);
            return {
              ...market,
              user_email: user.user?.email
            };
          }
          return market;
        })
      );
      setMarkets(marketsWithUsers as Market[]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">All Markets</h2>
          <p className="text-muted-foreground">View all markets across users</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Market Name</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {markets.map((market) => (
              <TableRow key={market.id}>
                <TableCell className="font-medium">{market.name}</TableCell>
                <TableCell>{market.user_email}</TableCell>
                <TableCell>
                  {new Date(market.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {market.city}, {market.state}
                </TableCell>
                <TableCell>${market.fee}</TableCell>
                <TableCell>
                  {market.actual_revenue ? `$${market.actual_revenue}` : '-'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      market.status === 'completed'
                        ? 'outline'
                        : market.status === 'confirmed'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {market.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
