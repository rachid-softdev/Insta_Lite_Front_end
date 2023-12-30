import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';
import { BaseUserResponse } from '../../../user/http/response/base-user-response.model';

export class ImageUpdateRequest implements Serialize<object>, Deserialize<string> {
  private _createdAt: string;
  private _updatedAt: string;
  private _publicId: string;
  private _publishedAt: string;
  private _file: File | null;
  private _title: string;
  private _description: string;
  private _visibility: string;
  private _author: BaseUserResponse | null;

  constructor(
    createdAt: string = '',
    updatedAt: string = '',
    publicId: string = '',
    publishedAt: string = '',
    file: File | null = null,
    title: string = '',
    description: string = '',
    visibility: string = '',
    author: BaseUserResponse | null = null,
  ) {
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._publicId = publicId;
    this._publishedAt = publishedAt;
    this._file = file;
    this._title = title;
    this._description = description;
    this._visibility = visibility;
    this._author = author;
  }

  public get getCreatedAt(): string {
    return this._createdAt;
  }

  public set setCreatedAt(createdAt: string) {
    this._createdAt = createdAt;
  }

  public get getUpdatedAt(): string {
    return this._createdAt;
  }

  public set setUpdatedAt(updatedAt: string) {
    this._updatedAt = updatedAt;
  }

  public get getPublicId(): string {
    return this._publicId;
  }

  public set setPublicId(publicId: string) {
    this._publicId = publicId;
  }

  public get getPublishedAt(): string {
    return this._publishedAt;
  }

  public set setPublishedAt(publishedAt: string) {
    this._publishedAt = publishedAt;
  }

  public get getFile(): File | null {
    return this._file;
  }

  public set setFile(file: File | null) {
    this._file = file;
  }

  public get getTitle(): string {
    return this._title;
  }

  public set setTitle(title: string) {
    this._title = title;
  }

  public get getDescription(): string {
    return this._description;
  }

  public set setDescription(description: string) {
    this._description = description;
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

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  public serialize(): object {
    return {
      created_at: this.getCreatedAt,
      updated_at: this.getUpdatedAt,
      public_id: this.getPublicId,
      published_at: this.getPublishedAt,
      title: this.getTitle,
      description: this.getDescription,
      file: this.getFile,
      visibility: this.getVisibility,
      author: this.getAuthor,
    };
  }

  toString(): string {
    return `Image [createdAt=${this._createdAt}, updatedAt=${this._updatedAt}, publicId=${this._publicId}, publishedAt=${this._publishedAt}, title=${this._title}, description=${this._description}, visibility=${this._visibility}]`;
  }
}
