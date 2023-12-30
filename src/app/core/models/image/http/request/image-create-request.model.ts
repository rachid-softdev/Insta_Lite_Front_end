import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';
import { BaseUserResponse } from '../../../user/http/response/base-user-response.model';

export class ImageCreateRequest implements Serialize<object>, Deserialize<string> {
  private _file: File | null;
  private _title: string;
  private _description: string;
  private _visibility: string;
  private _author: BaseUserResponse | null;

  constructor(
    file: File | null = null,
    title: string = '',
    description: string = '',
    visibility: string = '',
    author: BaseUserResponse | null = null,
  ) {
    this._file = file;
    this._title = title;
    this._description = description;
    this._visibility = visibility;
    this._author = author;
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
      title: this.getTitle,
      description: this.getDescription,
      visibility: this.getVisibility,
      file: this.getFile,
      author: this.getAuthor,
    };
  }

  toString(): string {
    return `Image [title=${this._title}, description=${this._description}, visibility=${this._visibility}]`;
  }
}
