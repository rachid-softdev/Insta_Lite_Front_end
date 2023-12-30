import { Injectable } from '@angular/core';
import { BaseUserMapper } from './base-user-mapper.model';
import { UserResponseAPI } from '../response/user-response-api.model';
import { UserResponse } from '../response/user-response.model';

@Injectable()
export class UserMapper extends BaseUserMapper {
  override deserialize(input: UserResponseAPI): UserResponse {
    const baseUserResponse = super.deserialize(input);
    const userResponse = new UserResponse(
      baseUserResponse.getCreatedAt,
      baseUserResponse.getUpdatedAt,
      baseUserResponse.getPublicId,
      baseUserResponse.getLastname,
      baseUserResponse.getFirstname,
      baseUserResponse.getEmail,
      '',
      baseUserResponse.getRole,
    );
    return userResponse;
  }
}
