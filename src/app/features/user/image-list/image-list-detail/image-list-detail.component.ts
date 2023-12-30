import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Image } from '../../../../core/models/image/image.model';
import { EVisibility } from '../../../../core/constants/EVisibility';
import {
  FileInformation,
  extractFileNameFromUrl,
  fetchFile,
  formatFileSize,
  getFileExtension,
} from '../../../../core/utils/file-utils';

@Component({
  selector: 'app-image-list-detail',
  templateUrl: './image-list-detail.component.html',
  styleUrls: ['./image-list-detail.component.css'],
})
export class ImageListDetailComponent {
  private _image: Image | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  public EVisibility = EVisibility;
  public visibilityClasses = {
    [EVisibility.PUBLIC]:
      'text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [EVisibility.PRIVATE]:
      'text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [EVisibility.UNLISTED]:
      'text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };

  public get getImage(): Image | null {
    return this._image;
  }

  @Input()
  public set setImage(image: Image | null) {
    this._image = image;
    this.getFileData(image?.getFileUrl ?? '');
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public onClickVisualizeImage(url: string): void {
    window.open(url);
  }

  public fileInfoMap: Map<string, FileInformation> = new Map();

  public getFileData(url: string) {
    fetchFile(url).then((arrayBuffer: ArrayBuffer) => {
      const blob = new Blob([arrayBuffer]);
      const fileName = extractFileNameFromUrl(url);
      const fileLength = blob.size;
      const fileInfo: FileInformation = {
        fileName: fileName,
        fileSize: fileLength,
        fileExtension: getFileExtension(url),
      };
      this.fileInfoMap.set(url, fileInfo);
    });
  }

  public formatFileSize(size: number) {
    return formatFileSize(size);
  }
}
