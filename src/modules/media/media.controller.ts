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
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Media')
@ApiBearerAuth()
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images/upload')
  @HttpCode(200)
  @ResponseMessage('Image uploaded successfully')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Upload an image',
    description: 'Uploads an image file and returns the URL',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to be uploaded',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const userId = req.user._id;
    return await this.mediaService.uploadImage(file, userId);
  }
}
