import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

if (env.cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadedImage {
  url: string;
  publicId: string;
}

export async function uploadProductImage(buffer: Buffer): Promise<UploadedImage> {
  if (!env.cloudinaryEnabled) {
    throw new ApiError(503, 'Image uploads are not configured yet. Add Cloudinary credentials to the server.');
  }
  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: env.CLOUDINARY_FOLDER,
          resource_type: 'image',
          // Normalise large uploads once, at upload time
          transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
        (error, res) => (error || !res ? reject(error) : resolve(res)),
      );
      stream.end(buffer);
    });
    return { url: result.secure_url, publicId: result.public_id };
  } catch (err) {
    console.error('[cloudinary] upload failed', err);
    throw new ApiError(502, 'The image could not be uploaded. Please try again.');
  }
}

/** Best-effort cleanup; failures are logged but never break the request. */
export async function deleteProductImage(publicId?: string | null): Promise<void> {
  if (!publicId || !env.cloudinaryEnabled) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    console.error('[cloudinary] delete failed', publicId, err);
  }
}
