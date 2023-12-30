import { Injectable } from '@angular/core';
import { Image } from '../../image.model';
import { ImageCreateRequest } from '../request/image-create-request.model';
import { ImageResponse } from '../response/image-response.model';
import { BaseUserMapper } from '../../../user/http/mapper/base-user-mapper.model';
import { User } from '../../../user/user.model';
import { BaseUserResponse } from '../../../user/http/response/base-user-response.model';
import { visibilityFromValue } from '../../../../constants/EVisibility';
import { BaseImageResponse } from '../response/base-image-response.model';
import { BaseImageResponseAPI } from '../response/base-image-response-api.model';
import { ImageResponseAPI } from '../response/image-response-api.model';
import { BaseImageMapper } from './base-image-mapper.model';

@Injectable()
export class ImageMapper extends BaseImageMapper {

  constructor(baseUserMapper: BaseUserMapper) {
    super(baseUserMapper);
  }

  override destructor() {}

  override deserialize(input: ImageResponseAPI): ImageResponse {
    const baseImageResponse = super.deserialize(input);
        const {
      visibility = '',
      author = null,
    } = input || {};
    const imageResponse = new ImageResponse(
      baseImageResponse.getPublicId,
      baseImageResponse.getCreatedAt,
      baseImageResponse.getUpdatedAt,
      baseImageResponse.getPublishedAt,
      baseImageResponse.getFileUrl,
      baseImageResponse.getTitle,
      baseImageResponse.getDescription,
      visibility,
      this._baseUserMapper.deserialize({ created_at: author?.created_at, updated_at: author?.updated_at, public_id: author?.public_id, firstname: author?.firstname, lastname: author?.firstname, email: author?.email, role: author?.role ?? '' }),
    );
    return imageResponse;
  }
}
