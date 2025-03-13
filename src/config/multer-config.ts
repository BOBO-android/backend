import multer from 'multer';
import sharp from 'sharp';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
  storage: multer.memoryStorage(), // Store in memory for processing
  fileFilter: (req: Request, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new BadRequestException('Only images are allowed!'), false);
    }
    cb(null, true);
  },
};

// Function to compress image before upload
export const compressImage = async (
  file: Express.Multer.File,
): Promise<Buffer> => {
  return await sharp(file.buffer)
    .resize({ width: 800 }) // Resize to max width 800px
    .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
    .toBuffer();
};
