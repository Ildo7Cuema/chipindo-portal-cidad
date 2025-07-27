-- Fix storage policies for transparency documents
-- Allow public upload and download for transparency documents

-- Create storage bucket if it doesn't exist (this needs to be done manually in the dashboard)
-- The bucket should be named 'transparency-documents' with public access

-- Create policy to allow public upload to transparency-documents bucket
CREATE POLICY "Public can upload transparency documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'transparency-documents' 
  AND (storage.foldername(name))[1] = 'transparency-documents'
);

-- Create policy to allow public download from transparency-documents bucket
CREATE POLICY "Public can download transparency documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'transparency-documents' 
  AND (storage.foldername(name))[1] = 'transparency-documents'
);

-- Create policy to allow public update of transparency documents
CREATE POLICY "Public can update transparency documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'transparency-documents' 
  AND (storage.foldername(name))[1] = 'transparency-documents'
);

-- Create policy to allow public delete of transparency documents
CREATE POLICY "Public can delete transparency documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'transparency-documents' 
  AND (storage.foldername(name))[1] = 'transparency-documents'
);

-- Alternative: Allow all operations on transparency-documents bucket
CREATE POLICY "Allow all operations on transparency-documents" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'transparency-documents')
WITH CHECK (bucket_id = 'transparency-documents'); 