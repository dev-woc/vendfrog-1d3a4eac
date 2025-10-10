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
import { formatFileSize } from "@/lib/utils";

interface Document {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  document_type: string;
  created_at: string;
  user_email?: string;
}

export default function AdminDocuments() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      // Get user emails
      const docsWithUsers = await Promise.all(
        data.map(async (doc) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('user_id', doc.user_id)
            .single();

          if (profile) {
            const { data: user } = await supabase.auth.admin.getUserById(profile.user_id);
            return {
              ...doc,
              user_email: user.user?.email
            };
          }
          return doc;
        })
      );
      setDocuments(docsWithUsers as Document[]);
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
          <h2 className="text-3xl font-bold tracking-tight">All Documents</h2>
          <p className="text-muted-foreground">View all uploaded documents</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.file_name}</TableCell>
                <TableCell>{doc.user_email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{doc.document_type}</Badge>
                </TableCell>
                <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                <TableCell>
                  {new Date(doc.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
