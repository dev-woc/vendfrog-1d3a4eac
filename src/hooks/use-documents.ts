import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found, skipping document fetch');
        setLoading(false);
        return;
      }

      console.log('User found, fetching documents for:', user.id);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found for upload');
        toast({
          title: "Error",
          description: "You must be logged in to upload files",
          variant: "destructive"
        });
        return;
      }

      console.log('User authenticated for upload:', user.id);

      const uploadPromises = Array.from(files).map(async (file, index) => {
        console.log(`Uploading file ${index + 1}:`, file.name, 'size:', file.size, 'type:', file.type);
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        
        console.log('Storage path:', fileName);
        
        // Upload to storage
        console.log('About to upload to storage...');
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        console.log('Storage upload result:', { uploadData, uploadError });
        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw uploadError;
        }

        console.log('File uploaded to storage successfully, saving to database...');

        // Save to database
        const documentData = {
          user_id: user.id,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type || 'application/octet-stream',
          document_type: documentType,
          storage_path: fileName
        };
        console.log('Inserting document data:', documentData);

        const { data: dbData, error: dbError } = await supabase
          .from('documents')
          .insert(documentData)
          .select();

        console.log('Database insert result:', { dbData, dbError });
        if (dbError) {
          console.error('Database insert error:', dbError);
          throw dbError;
        }

        console.log('File saved to database successfully:', dbData);
      });

      await Promise.all(uploadPromises);
      
      console.log('All files uploaded successfully');
      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`
      });

      // Refresh documents
      await fetchDocuments();
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
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.storage_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
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
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

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
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Documents hook - Auth state changed:', event, session?.user?.id);
        if (session?.user) {
          fetchDocuments();
        } else {
          setDocuments([]);
          setLoading(false);
        }
      }
    );

    // Also fetch on initial mount if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchDocuments();
      }
    });

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