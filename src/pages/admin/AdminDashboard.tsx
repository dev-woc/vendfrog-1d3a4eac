import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (!profile?.is_admin) {
      navigate('/dashboard');
      return;
    }

    setIsAdmin(true);
  };

  const loadStats = async () => {
    // Get total users
    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get total markets
    const { count: marketsCount } = await supabase
      .from('markets')
      .select('*', { count: 'exact', head: true });

    // Get total documents
    const { count: documentsCount } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });

    // Get total revenue
    const { data: markets } = await supabase
      .from('markets')
      .select('actual_revenue')
      .not('actual_revenue', 'is', null);

    const totalRevenue = markets?.reduce((sum, m) => sum + (parseFloat(m.actual_revenue) || 0), 0) || 0;

    setStats({
      totalUsers: usersCount || 0,
      totalMarkets: marketsCount || 0,
      totalDocuments: documentsCount || 0,
      totalRevenue
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
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
