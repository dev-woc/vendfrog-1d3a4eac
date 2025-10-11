import { supabase } from './src/integrations/supabase/client';
import { readFileSync } from 'fs';
import { join } from 'path';

async function setupStorage() {
  console.log('Setting up Supabase storage and running migrations...\n');

  try {
    // 1. Create storage bucket for market documents
    console.log('1. Creating market-documents storage bucket...');

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'market-documents');

    if (bucketExists) {
      console.log('✓ Bucket already exists');
    } else {
      const { data, error } = await supabase.storage.createBucket('market-documents', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      });

      if (error) {
        console.error('Error creating bucket:', error);
        throw error;
      }

      console.log('✓ Successfully created market-documents bucket');
    }

    // 2. Run the migration SQL
    console.log('\n2. Running database migration...');
    console.log('Note: This requires service role access. You may need to run this manually in Supabase SQL Editor.');

    const migrationPath = join(__dirname, 'supabase/migrations/20251011000000_add_documents_to_markets.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    console.log('\nMigration SQL to run:');
    console.log('---');
    console.log(migrationSQL);
    console.log('---');
    console.log('\nPlease run this SQL in your Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/drlnhierscrldlijdhdo/editor');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

setupStorage();
