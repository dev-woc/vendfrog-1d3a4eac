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

interface User {
  id: string;
  user_id: string;
  full_name: string;
  company_name: string | null;
  phone_number: string | null;
  is_admin: boolean;
  created_at: string;
  email?: string;
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profiles) {
      // Get emails from auth.users
      const usersWithEmails = await Promise.all(
        profiles.map(async (profile) => {
          const { data } = await supabase.auth.admin.getUserById(profile.user_id);
          return {
            ...profile,
            email: data.user?.email
          };
        })
      );
      setUsers(usersWithEmails as User[]);
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
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">View and manage all users</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company_name || '-'}</TableCell>
                <TableCell>{user.phone_number || '-'}</TableCell>
                <TableCell>
                  {user.is_admin ? (
                    <Badge variant="default">Admin</Badge>
                  ) : (
                    <Badge variant="secondary">User</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
