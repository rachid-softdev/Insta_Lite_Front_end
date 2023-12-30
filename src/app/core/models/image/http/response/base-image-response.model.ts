import { Deserialize } from '../../../../../shared/transformation/deserialize';

export class BaseImageResponse implements Deserialize<string> {
  private _publicId: string;
  private _createdAt: string;
  private _updatedAt: string;
  private _publishedAt: string;
  private _fileUrl: string;
  private _title: string;
  private _description: string;

  constructor(
    publicId: string = '',
    createdAt: string = '',
    updatedAt: string = '',
    publishedAt: string = '',
    fileUrl: string = '',
    title: string = '',
    description: string = '',
  ) {
    this._publicId = publicId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._publishedAt = publishedAt;
    this._fileUrl = fileUrl;
    this._title = title;
    this._description = description;
  }

  public get getPublicId(): string {
    return this._publicId;
  }

  public set setPublicId(publicId: string) {
    this._publicId = publicId;
  }

  public get getCreatedAt(): string {
    return this._createdAt;
  }

  public set setCreatedAt(createdAt: string) {
    this._createdAt = createdAt;
  }

  public get getUpdatedAt(): string {
    return this._updatedAt;
  }

  public set setUpdatedAt(updatedAt: string) {
    this._updatedAt = updatedAt;
  }

  public get getPublishedAt(): string {
    return this._publishedAt;
  }

  public set setPublishedAt(publishedAt: string) {
    this._publishedAt = publishedAt;
  }

  public get getFileUrl(): string {
    return this._fileUrl;
  }

  public set setFileUrl(fileUrl: string) {
    this._fileUrl = fileUrl;
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

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `BaseImageResponse {
      publicId: ${this.getPublicId},
      createdAt: ${this.getCreatedAt},
      updatedAt: ${this.getUpdatedAt},
      publishedAt: ${this.getPublishedAt},
      imageFile: ${this.getFileUrl},
      title: ${this.getTitle},
      description: ${this.getDescription}
    }`;
  }
}
