export type PrepareUploadResult = {
  file: File;
  wasCompressed: boolean;
  originalSize: number;
};

type ImageCompressionOptions = {
  maxWidth: number;
  maxHeight: number;
  quality: number; // 0..1
  minSizeBytesToCompress: number;
};

const DEFAULT_IMAGE_OPTIONS: ImageCompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.82,
  minSizeBytesToCompress: 700 * 1024, // 700KB
};

function getBaseName(fileName: string) {
  const dotIdx = fileName.lastIndexOf('.');
  if (dotIdx <= 0) return fileName;
  return fileName.slice(0, dotIdx);
}

async function compressImageToJpeg(file: File, opts: ImageCompressionOptions): Promise<PrepareUploadResult> {
  const originalSize = file.size;

  // Skip tiny images (avoid quality loss).
  if (file.size < opts.minSizeBytesToCompress) {
    return { file, wasCompressed: false, originalSize };
  }

  // Decode
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(opts.maxWidth / bitmap.width, opts.maxHeight / bitmap.height, 1);
  const targetW = Math.max(1, Math.round(bitmap.width * ratio));
  const targetH = Math.max(1, Math.round(bitmap.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { file, wasCompressed: false, originalSize };

  ctx.drawImage(bitmap, 0, 0, targetW, targetH);

  const blob: Blob | null = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', opts.quality);
  });

  if (!blob) return { file, wasCompressed: false, originalSize };

  // If compression didn’t help, keep original.
  if (blob.size >= file.size) {
    return { file, wasCompressed: false, originalSize };
  }

  const base = getBaseName(file.name);
  const compressed = new File([blob], `${base}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  return { file: compressed, wasCompressed: true, originalSize };
}

/**
 * Prepare a file for upload by compressing images on the client.
 * - Images are resized to a max dimension and encoded to JPEG for size reduction.
 * - Videos & documents are returned as-is (no client-side transcoding here).
 */
export async function prepareFileForUpload(file: File, options?: Partial<ImageCompressionOptions>): Promise<PrepareUploadResult> {
  const opts: ImageCompressionOptions = { ...DEFAULT_IMAGE_OPTIONS, ...(options || {}) };

  if (file.type.startsWith('image/')) {
    // Note: encoding to JPEG may remove transparency, but drastically reduces size.
    return await compressImageToJpeg(file, opts);
  }

  return { file, wasCompressed: false, originalSize: file.size };
}

