import { Deserialize } from '../../../shared/transformation/deserialize';
import { EVisibility } from '../../constants/EVisibility';
import { User } from '../user/user.model';

export class Image implements Deserialize<string> {
  private _publicId: string;
  private _createdAt: string;
  private _updatedAt: string;
  private _publishedAt: string;
  private _fileUrl: string;
  private _file: File | null;
  private _title: string;
  private _description: string;
  private _visibility: EVisibility | null;
  private _author: User | null;

  constructor(
    publicId: string = '',
    createdAt: string = '',
    updatedAt: string = '',
    publishedAt: string = '',
    fileUrl: string = '',
    file: File | null = null,
    title: string = '',
    description: string = '',
    visibility: EVisibility = EVisibility.PRIVATE,
    author: User | null = null,
  ) {
    this._publicId = publicId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._publishedAt = publishedAt;
    this._fileUrl = fileUrl;
    this._file = file;
    this._title = title;
    this._description = description;
    this._visibility = visibility;
    this._author = author;
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

  public get getVisibility(): EVisibility | null {
    return this._visibility;
  }

  public set setVisibility(visibility: EVisibility | null) {
    this._visibility = visibility;
  }

  public get getAuthor(): User | null {
    return this._author;
  }

  public set setAuthor(author: User | null) {
    this._author = author;
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `Image [publicId=${this._publicId}, createdAt=${this._createdAt}, updatedAt=${this._updatedAt}, publicId=${this._publicId}, publishedAt=${this._publishedAt}, fileUrl=${this._fileUrl}, title=${this._title}, description=${this._description}, visibility=${this._visibility}]`;
  }
}
