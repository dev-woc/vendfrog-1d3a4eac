import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = "https://drlnhierscrldlijdhdo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRybG5oaWVyc2NybGRsaWpkaGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMzcyMTYsImV4cCI6MjA3NTYxMzIxNn0.7AEGX00cJChyldsTw08wSmrjjI2Q1dH_lP_rS-5vbPg";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function setupStorage() {
  console.log('Setting up Supabase storage...\n');

  try {
    // Create storage bucket for market documents
    console.log('Creating market-documents storage bucket...');

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'market-documents');

    if (bucketExists) {
      console.log('✓ Bucket "market-documents" already exists');
    } else {
      const { data, error } = await supabase.storage.createBucket('market-documents', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      });

      if (error) {
        console.error('❌ Error creating bucket:', error);
        console.log('\nYou may need to create this bucket manually in the Supabase dashboard:');
        console.log('https://supabase.com/dashboard/project/drlnhierscrldlijdhdo/storage/buckets');
        console.log('\nBucket settings:');
        console.log('- Name: market-documents');
        console.log('- Public: Yes');
        console.log('- File size limit: 10MB');
        console.log('- Allowed MIME types: application/pdf, image/jpeg, image/jpg, image/png');
      } else {
        console.log('✓ Successfully created market-documents bucket');
      }
    }

    // Show migration SQL
    console.log('\n' + '='.repeat(60));
    console.log('DATABASE MIGRATION');
    console.log('='.repeat(60));
    console.log('\nPlease run the following SQL in your Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/drlnhierscrldlijdhdo/sql/new\n');

    const migrationSQL = readFileSync('./supabase/migrations/20251011000000_add_documents_to_markets.sql', 'utf-8');
    console.log(migrationSQL);
    console.log('\n' + '='.repeat(60));

    console.log('\n✓ Setup script completed!');
    console.log('\nNext steps:');
    console.log('1. Copy the SQL above');
    console.log('2. Paste it into the Supabase SQL Editor');
    console.log('3. Click "Run" to apply the migration');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

setupStorage();
