import multer from 'multer';
import { ApiError } from '../utils/ApiError';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Keeps the file in memory just long enough to stream it to Cloudinary. */
export const productImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(new ApiError(400, 'Please upload a JPG, PNG or WebP image.'));
      return;
    }
    cb(null, true);
  },
}).single('image');
