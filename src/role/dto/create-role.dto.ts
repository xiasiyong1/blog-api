import { IsNotEmpty, Length } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({
    message: '$property不能为空',
  })
  @Length(2, 20, { message: '$property长度为6-20以内' })
  name: string;
}
