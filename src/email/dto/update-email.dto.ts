import { PartialType } from '@nestjs/mapped-types';
import { SendEmailCodeDto } from './send-email-code.dto';

export class UpdateEmailDto extends PartialType(SendEmailCodeDto) {}
