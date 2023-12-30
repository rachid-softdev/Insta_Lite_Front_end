import { Injectable } from '@angular/core';
import { User } from '../../user.model';
import { UserCreateRequest } from '../request/user-create-request.model';
import { BaseUserResponse } from '../response/base-user-response.model';
import { UserUpdateRequest } from '../request/user-update-request.model';
import { RoleManager } from '../../../../constants/ERole';
import { BaseUserResponseAPI } from '../response/base-user-response-api.model';

@Injectable()
export class BaseUserMapper {
  deserialize(input: BaseUserResponseAPI): BaseUserResponse {
    const {
      created_at = '',
      updated_at = '',
      public_id = '',
      firstname = '',
      lastname = '',
      email = '',
      role = '',
    } = input || {};
    const baseUserResponse = new BaseUserResponse(
      created_at,
      updated_at,
      public_id,
      lastname,
      firstname,
      email,
      '',
      RoleManager.fromValue(role) ?? RoleManager.NONE,
    );
    return baseUserResponse;
  }

  /*
  toUserFromBaseUserResponseApi(data: BaseUserResponseAPI = {}): User {
    const user = new User();
    user.setCreatedAt = data.created_at ?? '';
    user.setUpdatedAt = data.updated_at ?? '';
    user.setPublicId = data.public_id ?? '';
    user.setFirstname = data.firstname ?? '';
    user.setLastname = data.lastname ?? '';
    user.setEmail = data.email ?? '';
    return user;
  }
  
  toUserFromUserResponseApi(data: UserResponseAPI = {}): User {
    const baseUser: User = this.toUserFromBaseUserResponseApi(data);
    baseUser.setRole = RoleManager.fromValue(data.role ?? '') ?? RoleManager.NONE;
    return baseUser;
  }
  */

  toUserCreateRequest(user: User): UserCreateRequest {
    if (!user) {
      user = new User();
    }
    const userCreateRequest = new UserCreateRequest();
    userCreateRequest.setPublicId = user.getPublicId;
    userCreateRequest.setCreatedAt = user.getCreatedAt;
    userCreateRequest.setUpdatedAt = user.getUpdatedAt;
    userCreateRequest.setLastname = user.getLastname;
    userCreateRequest.setFirstname = user.getFirstname;
    userCreateRequest.setEmail = user.getEmail;
    userCreateRequest.setPassword = user.getPassword;
    userCreateRequest.setRole = user.getRole;
    return userCreateRequest;
  }

  toUserUpdateRequest(user: User): UserUpdateRequest {
    if (!user) {
      user = new User();
    }
    const userUpdateRequest = new UserUpdateRequest();
    userUpdateRequest.setPublicId = user.getPublicId;
    userUpdateRequest.setUpdatedAt = user.getUpdatedAt;
    userUpdateRequest.setUpdatedAt = user.getUpdatedAt;
    userUpdateRequest.setLastname = user.getLastname;
    userUpdateRequest.setFirstname = user.getFirstname;
    userUpdateRequest.setEmail = user.getEmail;
    userUpdateRequest.setPassword = user.getPassword;
    userUpdateRequest.setRole = user.getRole;
    return userUpdateRequest;
  }

  UserCreateRequestToUser(userCreateRequest: UserCreateRequest): User {
    if (!userCreateRequest) {
      userCreateRequest = new UserCreateRequest();
    }
    const user = new User();
    user.setPublicId = userCreateRequest.getPublicId;
    user.setCreatedAt = userCreateRequest.getCreatedAt;
    user.setUpdatedAt = userCreateRequest.getUpdatedAt;
    user.setLastname = userCreateRequest.getLastname;
    user.setFirstname = userCreateRequest.getFirstname;
    user.setEmail = userCreateRequest.getEmail;
    user.setRole = userCreateRequest.getRole;
    return user;
  }

  UserUpdateRequestToUser(userUpdateRequest: UserUpdateRequest): User {
    if (!userUpdateRequest) {
      userUpdateRequest = new UserUpdateRequest();
    }
    const user = new User();
    user.setPublicId = userUpdateRequest.getPublicId;
    user.setCreatedAt = userUpdateRequest.getCreatedAt;
    user.setUpdatedAt = userUpdateRequest.getUpdatedAt;
    user.setLastname = userUpdateRequest.getLastname;
    user.setFirstname = userUpdateRequest.getFirstname;
    user.setEmail = userUpdateRequest.getEmail;
    user.setRole = userUpdateRequest.getRole;
    return user;
  }

  toUserResponse(user: User): BaseUserResponse {
    if (!user) {
      user = new User();
    }
    const userResponse = new BaseUserResponse();
    userResponse.setPublicId = user.getPublicId;
    userResponse.setCreatedAt = user.getCreatedAt;
    userResponse.setUpdatedAt = user.getUpdatedAt;
    userResponse.setLastname = user.getLastname;
    userResponse.setFirstname = user.getFirstname;
    userResponse.setEmail = user.getEmail;
    userResponse.setRole = user.getRole;
    return userResponse;
  }

  toUser(userResponse: BaseUserResponse): User {
    if (!userResponse) {
      userResponse = new BaseUserResponse();
    }
    const user = new User();
    user.setPublicId = userResponse.getPublicId;
    user.setCreatedAt = userResponse.getCreatedAt;
    user.setUpdatedAt = userResponse.getUpdatedAt;
    user.setLastname = userResponse.getLastname;
    user.setFirstname = userResponse.getFirstname;
    user.setEmail = userResponse.getEmail;
    user.setRole = userResponse.getRole;
    return user;
  }

  toUserResponseList(user: User[]): BaseUserResponse[] {
    if (user == null) {
      user = [];
    }
    let userResponses = [];
    for (let i = 0; i < user.length; i++) {
      userResponses.push(this.toUserResponse(user[i]));
    }
    return userResponses;
  }
}
