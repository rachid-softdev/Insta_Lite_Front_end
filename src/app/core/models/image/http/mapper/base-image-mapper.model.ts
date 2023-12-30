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
import { ImageUpdateRequest } from '../request/image-update-request.model';

@Injectable()
export class BaseImageMapper {

  protected _baseUserMapper: BaseUserMapper;

  constructor(baseUserMapper: BaseUserMapper) {
    this._baseUserMapper = baseUserMapper;
  }
  destructor() {}

  deserialize(input: BaseImageResponseAPI): BaseImageResponse {
    const {
      public_id = '',
      created_at = '',
      updated_at = '',
      published_at = '',
      file_url = '',
      title = '',
      description = '',
    } = input || {};
    const imageResponse = new BaseImageResponse(
      public_id,
      created_at,
      updated_at,
      published_at,
      file_url,
      title,
      description,
    );
    return imageResponse;
  }

  /*----------*/
  /* API DATA */
  /*----------*/
  /*
  toImageFromBaseImageResponseApi(data: BaseImageResponseAPI = {}): Image {
    const image = new Image();
    image.setCreatedAt = data.created_at ?? '';
    image.setUpdatedAt = data.updated_at ?? '';
    image.setPublicId = data.public_id ?? '';
    image.setPublishedAt = data.published_at ?? '';
    image.setTitle = data.title ?? '';
    image.setDescription = data.description ?? '';
    image.setFileUrl = data.file_url ?? '';
    return image;
  }

  toImageFromImageResponseApi(data: ImageResponseAPI = {}): Image {
    const baseImage: Image = this.toImageFromBaseImageResponseApi(data);
    baseImage.setVisibility = visibilityFromValue(data.visibility ?? '');
    baseImage.setAuthor = this._userMapper.toUserFromBaseUserResponseApi(data.author);
    return baseImage;
  }
  */

  toImageCreateRequest(image: Image): ImageCreateRequest {
    if (!image) {
      image = new Image();
    }
    const imageCreateRequest = new ImageCreateRequest();
    imageCreateRequest.setTitle = image.getTitle;
    imageCreateRequest.setDescription = image.getDescription;
    imageCreateRequest.setVisibility = image.getVisibility ?? '';
    imageCreateRequest.setFile = image.getFile;
    imageCreateRequest.setAuthor = image.getAuthor ? this._baseUserMapper.toUserResponse(image.getAuthor) : null;
    return imageCreateRequest;
  }

  toImageUpdateRequest(image: Image): ImageUpdateRequest {
    if (!image) {
      image = new Image();
    }
    const imageUpdateRequest = new ImageUpdateRequest();
    imageUpdateRequest.setTitle = image.getTitle;
    imageUpdateRequest.setDescription = image.getDescription;
    imageUpdateRequest.setVisibility = image.getVisibility ?? '';
    imageUpdateRequest.setFile = image.getFile;
    imageUpdateRequest.setAuthor = image.getAuthor ? this._baseUserMapper.toUserResponse(image.getAuthor) : null;
    return imageUpdateRequest;
  }

  toImage(imageResponse: ImageResponse = new ImageResponse()): Image {
    if (!imageResponse) {
      imageResponse = new ImageResponse();
    }
    const image = new Image();
    image.setPublicId = imageResponse.getPublicId;
    image.setCreatedAt = imageResponse.getCreatedAt;
    image.setUpdatedAt = imageResponse.getUpdatedAt;
    image.setPublishedAt = imageResponse.getPublishedAt;
    image.setFileUrl = imageResponse.getFileUrl;
    image.setTitle = imageResponse.getTitle;
    image.setDescription = imageResponse.getDescription;
    image.setVisibility = visibilityFromValue(imageResponse.getVisibility);
    image.setAuthor = imageResponse.getAuthor ? this._baseUserMapper.toUser(imageResponse.getAuthor) : null;
    return image;
  }


}
