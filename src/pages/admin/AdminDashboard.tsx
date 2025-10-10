import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

// Helper to get auth token
const getAuthToken = () => {
  const authToken = localStorage.getItem('sb-drlnhierscrldlijdhdo-auth-token');
  if (authToken) {
    try {
      const parsed = JSON.parse(authToken);
      return { userId: parsed.user?.id, accessToken: parsed.access_token };
    } catch (e) {
      console.error('Failed to parse auth token:', e);
    }
  }
  return { userId: null, accessToken: null };
};

const supabaseFetch = async (path: string, options: RequestInit = {}) => {
  const { accessToken } = getAuthToken();
  const response = await fetch(`https://drlnhierscrldlijdhdo.supabase.co/rest/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybG5oaWVyc2NybGRsaWpkaGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzcyMTYsImV4cCI6MjA3NTYxMzIxNn0.7AEGX00cJChyldsTw08wSmrjjI2Q1dH_lP_rS-5vbPg',
      'Authorization': `Bearer ${accessToken}`,
      'Prefer': options.headers?.['Prefer'] || 'return=representation',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || JSON.stringify(data));
  }

  return data;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMarkets: 0,
    totalDocuments: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    checkAdminAccess();
    loadStats();
  }, []);

  const checkAdminAccess = async () => {
    const { userId } = getAuthToken();

    if (!userId) {
      navigate('/auth');
      return;
    }

    const profiles = await supabaseFetch(`/profiles?user_id=eq.${userId}&select=is_admin`);
    const profile = profiles?.[0];

    if (!profile?.is_admin) {
      navigate('/dashboard');
      return;
    }

    setIsAdmin(true);
  };

  const loadStats = async () => {
    try {
      const { accessToken } = getAuthToken();

      // Get total users count
      const usersResponse = await fetch('https://drlnhierscrldlijdhdo.supabase.co/rest/v1/profiles?select=count', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybG5oaWVyc2NybGRsaWpkaGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzcyMTYsImV4cCI6MjA3NTYxMzIxNn0.7AEGX00cJChyldsTw08wSmrjjI2Q1dH_lP_rS-5vbPg',
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'count=exact'
        }
      });
      const usersCount = parseInt(usersResponse.headers.get('Content-Range')?.split('/')[1] || '0');

      // Get total markets count
      const marketsResponse = await fetch('https://drlnhierscrldlijdhdo.supabase.co/rest/v1/markets?select=count', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybG5oaWVyc2NybGRsaWpkaGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzcyMTYsImV4cCI6MjA3NTYxMzIxNn0.7AEGX00cJChyldsTw08wSmrjjI2Q1dH_lP_rS-5vbPg',
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'count=exact'
        }
      });
      const marketsCount = parseInt(marketsResponse.headers.get('Content-Range')?.split('/')[1] || '0');

      // Get total documents count
      const documentsResponse = await fetch('https://drlnhierscrldlijdhdo.supabase.co/rest/v1/documents?select=count', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybG5oaWVyc2NybGRsaWpkaGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzcyMTYsImV4cCI6MjA3NTYxMzIxNn0.7AEGX00cJChyldsTw08wSmrjjI2Q1dH_lP_rS-5vbPg',
          'Authorization': `Bearer ${accessToken}`,
          'Prefer': 'count=exact'
        }
      });
      const documentsCount = parseInt(documentsResponse.headers.get('Content-Range')?.split('/')[1] || '0');

      // Get total revenue
      const markets = await supabaseFetch('/markets?select=actual_revenue&actual_revenue=not.is.null');
      const totalRevenue = markets?.reduce((sum: number, m: any) => sum + (parseFloat(m.actual_revenue) || 0), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalMarkets: marketsCount || 0,
        totalDocuments: documentsCount || 0,
        totalRevenue
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = async () => {
    // Clear auth from localStorage
    localStorage.removeItem('sb-drlnhierscrldlijdhdo-auth-token');
    localStorage.removeItem('vendfrog_email');
    localStorage.removeItem('vendfrog_password');

    // Redirect to auth
    window.location.href = '/auth';
  };

  if (isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🐸 VendFrog Admin</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              User Dashboard
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            System overview and management
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Markets</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMarkets}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDocuments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Button
            variant="outline"
            className="h-24 text-lg"
            onClick={() => navigate('/admin/users')}
          >
            <Users className="mr-2 h-5 w-5" />
            Manage Users
          </Button>
          <Button
            variant="outline"
            className="h-24 text-lg"
            onClick={() => navigate('/admin/markets')}
          >
            <Calendar className="mr-2 h-5 w-5" />
            View All Markets
          </Button>
          <Button
            variant="outline"
            className="h-24 text-lg"
            onClick={() => navigate('/admin/documents')}
          >
            <FileText className="mr-2 h-5 w-5" />
            View All Documents
          </Button>
        </div>
      </main>
    </div>
  );
}
