import { BaseImageResponse } from './base-image-response.model';
import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { BaseUserResponse } from '../../../user/http/response/base-user-response.model';

export class ImageResponse extends BaseImageResponse implements Deserialize<string> {
  private _visibility: string;
  private _author: BaseUserResponse | null;

  constructor(
    publicId: string = '',
    createdAt: string = '',
    updatedAt: string = '',
    publishedAt: string = '',
    fileUrl: string = '',
    title: string = '',
    description: string = '',
    visibility: string = '',
    author: BaseUserResponse | null = null,
  ) {
    super(publicId, createdAt, updatedAt, publishedAt, fileUrl, title, description);
    this._visibility = visibility;
    this._author = author;
  }

  public get getVisibility(): string {
    return this._visibility;
  }

  public set setVisibility(visibility: string) {
    this._visibility = visibility;
  }

  public get getAuthor(): BaseUserResponse | null {
    return this._author;
  }

  public set setAuthor(author: BaseUserResponse | null) {
    this._author = author;
  }

  override deserialize(input: any): string {
    return Object.assign(this, input);
  }

  override toString(): string {
    return `ImageResponse {
      publicId: ${this.getPublicId},
      createdAt: ${this.getCreatedAt},
      updatedAt: ${this.getUpdatedAt},
      publishedAt: ${this.getPublishedAt},
      imageFile: ${this.getFileUrl},
      title: ${this.getTitle},
      description: ${this.getDescription},
      visibility: ${this.getVisibility},
      author: ${this.getVisibility ? this.getAuthor?.toString() : 'null'}
    }`;
  }
}
