import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Model, Types } from 'mongoose';
import { Media, MediaDocument } from './schemas/media.schema';
import { compressImage } from '@/config/multer-config';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
    @Inject('Cloudinary') private cloudinaryInstance: typeof cloudinary,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    ownerId: Types.ObjectId,
  ): Promise<Media> {
    try {
      // Compress the image before uploading
      const compressedBuffer = await compressImage(file);

      return new Promise((resolve, reject) => {
        const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
          {
            folder: `BoBo/${ownerId}/images`, // Cloudinary folder
            format: 'jpg', // Convert to JPG
            transformation: [
              { quality: 'auto:good' }, // Let Cloudinary auto-optimize
              { fetch_format: 'auto' }, // Convert to WebP if possible
            ],
          },
          async (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) {
              reject(new InternalServerErrorException('Image upload failed'));
            } else {
              // Save to MongoDB
              const newMedia = new this.mediaModel({
                ownerId,
                publicId: result.public_id,
                secureUrl: result.secure_url,
              });
              await newMedia.save();
              resolve(newMedia);
            }
          },
        );

        // Convert compressed Buffer to Stream and upload
        const readableStream = new Readable();
        readableStream.push(compressedBuffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    } catch (error) {
      throw new InternalServerErrorException('Image compression failed');
    }
  }
}
