import {
  Controller,
  HttpCode,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseMessage } from '@/decorator/customize';
import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images/upload')
  @HttpCode(200)
  @ResponseMessage('Image uploaded successfully')
  @UseInterceptors(FileInterceptor('image/upload'))
  async uploadImage(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user._id;
    return await this.mediaService.uploadImage(file, userId);
  }
}
