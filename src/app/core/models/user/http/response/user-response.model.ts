import { Role, RoleManager } from '../../../../constants/ERole';
import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { BaseUserResponse } from './base-user-response.model';

export class UserResponse extends BaseUserResponse {
  constructor(
    createdAt: string = '',
    updatedAt: string = '',
    publicId: string = '',
    lastname: string = '',
    firstname: string = '',
    email: string = '',
    password: string = '',
    role: Role | null = RoleManager.NONE,
  ) {
    super(createdAt, updatedAt, publicId, lastname, firstname, email, password, role);
  }

  override destructor() {}

  override toString(): string {
    return `UserResponse [publicId=${this.getPublicId}, createdAt=${this.getCreatedAt}, updatedAt=${this.getUpdatedAt} lastname=${this.getLastname}, firstname=${this.getFirstname}, email=${this.getEmail}, role=${this.getRole}]`;
  }
}
