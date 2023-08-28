import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (value.size > 100 * 1024) {
      throw new HttpException('文件大于 100k', HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
