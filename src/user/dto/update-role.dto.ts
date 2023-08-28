import { ArrayNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @ArrayNotEmpty()
  roleIds: number[];
}
