import { Controller, Post, Req, Res } from '@nestjs/common';
import { FileUploadService } from './file_upload.service';

@Controller('filename')
export class FileUploadController {
  constructor(private readonly imageUploadService: FileUploadService) {}
  @Post()
  async create(@Req() request, @Res() response) {
    try {
      await this.imageUploadService.fileupload(request, response);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload  file: ${error.message}`);
    }
  }
}
