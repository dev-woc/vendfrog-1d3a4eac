import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

// Helper for database operations
const supabaseFetch = async (path: string, options: RequestInit = {}) => {
  const accessToken = getAuthToken();
  const response = await fetch(`https://drlnhierscrldlijdhdo.supabase.co/rest/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybG5oaWVyc2NybGRsaWpkaGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzcyMTYsImV4cCI6MjA3NTYxMzIxNn0.7AEGX00cJChyldsTw08wSmrjjI2Q1dH_lP_rS-5vbPg',
      'Authorization': `Bearer ${accessToken}`,
      'Prefer': 'return=representation',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || JSON.stringify(data));
  }

  return data;
};

// Helper for storage operations
const supabaseStorageFetch = async (path: string, options: RequestInit = {}) => {
  const accessToken = getAuthToken();
  const response = await fetch(`https://drlnhierscrldlijdhdo.supabase.co/storage/v1${path}`, {
    ...options,
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybG5oaWVyc2NybGRsaWpkaGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzcyMTYsImV4cCI6MjA3NTYxMzIxNn0.7AEGX00cJChyldsTw08wSmrjjI2Q1dH_lP_rS-5vbPg',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || JSON.stringify(error));
  }

  return response;
};

export interface Document {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  document_type: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    try {
      console.log('Fetching documents...');

      // Get user ID from localStorage
      const authToken = localStorage.getItem('sb-drlnhierscrldlijdhdo-auth-token');
      let userId = null;
      if (authToken) {
        try {
          const parsed = JSON.parse(authToken);
          userId = parsed.user?.id;
        } catch (e) {
          console.error('Failed to parse auth token:', e);
        }
      }

      if (!userId) {
        console.log('No user found, skipping document fetch');
        setLoading(false);
        return;
      }

      console.log('User found, fetching documents for:', userId);
      const data = await supabaseFetch(`/documents?user_id=eq.${userId}&order=created_at.desc`, {
        method: 'GET'
      });

      console.log('Documents fetched:', data);
      setDocuments(data || []);
    } catch (error) {
      console.error('Error in fetchDocuments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (files: FileList, documentType: string = 'other') => {
    try {
      console.log('Starting file upload for:', files.length, 'files');

      // Get user ID from localStorage
      const authToken = localStorage.getItem('sb-drlnhierscrldlijdhdo-auth-token');
      let userId = null;
      if (authToken) {
        try {
          const parsed = JSON.parse(authToken);
          userId = parsed.user?.id;
        } catch (e) {
          console.error('Failed to parse auth token:', e);
        }
      }

      if (!userId) {
        console.error('No user found for upload');
        toast({
          title: "Error",
          description: "You must be logged in to upload files",
          variant: "destructive"
        });
        return;
      }

      console.log('User authenticated for upload:', userId);

      const uploadPromises = Array.from(files).map(async (file, index) => {
        console.log(`Uploading file ${index + 1}:`, file.name, 'size:', file.size, 'type:', file.type);
        const fileName = `${userId}/${Date.now()}-${file.name}`;

        console.log('Storage path:', fileName);

        // Upload to storage using fetch
        console.log('About to upload to storage...');
        await supabaseStorageFetch(`/object/documents/${fileName}`, {
          method: 'POST',
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
          body: file
        });

        console.log('File uploaded to storage successfully, saving to database...');

        // Save to database
        const documentData = {
          user_id: userId,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type || 'application/octet-stream',
          document_type: documentType,
          storage_path: fileName
        };
        console.log('Inserting document data:', documentData);

        const dbData = await supabaseFetch('/documents', {
          method: 'POST',
          body: JSON.stringify(documentData)
        });

        console.log('File saved to database successfully:', dbData);
      });

      await Promise.all(uploadPromises);

      console.log('All files uploaded successfully');

      // Refresh documents with a small delay to ensure DB is updated
      setTimeout(async () => {
        await fetchDocuments();
        toast({
          title: "Success",
          description: `${files.length} file(s) uploaded successfully`
        });
      }, 500);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive"
      });
    }
  };

  const downloadDocument = async (document: Document) => {
    try {
      const response = await supabaseStorageFetch(`/object/documents/${document.storage_path}`, {
        method: 'GET'
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive"
      });
    }
  };

  const deleteDocument = async (documentId: string, storagePath: string) => {
    try {
      // Delete from storage
      await supabaseStorageFetch(`/object/documents/${storagePath}`, {
        method: 'DELETE'
      });

      // Delete from database
      await supabaseFetch(`/documents?id=eq.${documentId}`, {
        method: 'DELETE'
      });

      toast({
        title: "Success",
        description: "Document deleted successfully"
      });

      // Refresh documents
      await fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    let hasFetched = false;

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Documents hook - Auth state changed:', event, session?.user?.id);
        if (session?.user && !hasFetched) {
          hasFetched = true;
          fetchDocuments();
        } else if (!session?.user) {
          hasFetched = false;
          setDocuments([]);
          setLoading(false);
        }
      }
    );

    // Also fetch on initial mount if user is already logged in
    const authToken = localStorage.getItem('sb-drlnhierscrldlijdhdo-auth-token');
    if (authToken && !hasFetched) {
      try {
        const parsed = JSON.parse(authToken);
        if (parsed.user?.id) {
          hasFetched = true;
          fetchDocuments();
        }
      } catch (e) {
        console.error('Failed to parse auth token on mount:', e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  return {
    documents,
    loading,
    uploadFiles,
    downloadDocument,
    deleteDocument,
    refetch: fetchDocuments
  };
}