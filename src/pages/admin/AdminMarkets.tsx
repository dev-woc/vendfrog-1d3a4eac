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

// Helper to get auth token
const getAuthToken = () => {
  const authToken = localStorage.getItem('sb-drlnhierscrldlijdhdo-auth-token');
  if (authToken) {
    try {
      const parsed = JSON.parse(authToken);
      return parsed.access_token;
    } catch (e) {
      console.error('Failed to parse auth token:', e);
    }
  }
  return null;
};

const supabaseFetch = async (path: string) => {
  const accessToken = getAuthToken();
  const response = await fetch(`https://drlnhierscrldlijdhdo.supabase.co/rest/v1${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybG5oaWVyc2NybGRsaWpkaGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzcyMTYsImV4cCI6MjA3NTYxMzIxNn0.7AEGX00cJChyldsTw08wSmrjjI2Q1dH_lP_rS-5vbPg',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

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
    try {
      console.log('Loading markets...');
      const markets = await supabaseFetch('/markets?select=*&order=date.desc');
      console.log('Markets loaded:', markets);
      if (markets) {
        setMarkets(markets as Market[]);
      }
    } catch (error) {
      console.error('Error loading markets:', error);
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
