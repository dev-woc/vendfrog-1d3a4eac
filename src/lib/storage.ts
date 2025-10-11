import { supabase } from '@/integrations/supabase/client';

const BUCKET_NAME = 'market-documents';

/**
 * Upload a file to Supabase Storage
 * @param file The file to upload
 * @param userId The user ID for organizing files
 * @param marketId The market ID for organizing files
 * @param documentType The type of document (businessLicense, liabilityInsurance, foodHandlersPermit)
 * @returns The public URL of the uploaded file
 */
export async function uploadMarketDocument(
  file: File,
  userId: string,
  marketId: string,
  documentType: string
): Promise<string> {
  try {
    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${marketId}/${documentType}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true, // Replace if file already exists
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadMarketDocument:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 * @param fileUrl The URL of the file to delete
 */
export async function deleteMarketDocument(fileUrl: string): Promise<void> {
  try {
    // Extract the file path from the URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf(BUCKET_NAME) + 1).join('/');

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteMarketDocument:', error);
    throw error;
  }
}

/**
 * Initialize the storage bucket (run once to set up)
 */
export async function initializeStorageBucket(): Promise<void> {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      });

      if (error) {
        console.error('Error creating bucket:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error in initializeStorageBucket:', error);
    throw error;
  }
}
