import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storage } from './storage';

@Controller('upload')
export class UploadController {
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 200 }),
          new FileTypeValidator({ fileType: /image\/jpeg|jpg|png|webp/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return file.filename;
  }

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 9, {
      storage,
    }),
  )
  uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 200 }),
          new FileTypeValidator({ fileType: /image\/jpeg|jpg|png|webp/ }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return files;
  }
}
