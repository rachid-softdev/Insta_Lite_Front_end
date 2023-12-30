import { Component, OnDestroy, OnInit } from '@angular/core';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Image } from '../../../core/models/image/image.model';
import { ImageService } from '../../../core/services/image/image.service';
import { ImagePageResponse } from '../../../core/models/image/http/response/image-page-response.model';
import { BaseImageMapper } from '../../../core/models/image/http/mapper/base-image-mapper.model';
import { EVisibility } from '../../../core/constants/EVisibility';
import { ImageResponseAPI } from '../../../core/models/image/http/response/image-response-api.model';
import { ImageMapper } from '../../../core/models/image/http/mapper/image-mapper.model';
import { extractFileNameFromUrl, fetchFile, generateRandomFileName } from '../../../core/utils/file-utils';

enum DialogType {
  AddImage,
  ImageUpdate,
  ImageDetail,
  ImageDelete,
}

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css'],
  providers: [BaseImageMapper, ImageService],
})
export class ImageListComponent implements OnInit, OnDestroy {
  public DialogType = DialogType;
  private _dialogState: Record<DialogType, boolean> = {
    [DialogType.AddImage]: false,
    [DialogType.ImageUpdate]: false,
    [DialogType.ImageDetail]: false,
    [DialogType.ImageDelete]: false,
  };

  private _imagePageResponse: ImagePageResponse = new ImagePageResponse();

  private images: Image[] = [
    new Image(
      'id-1',
      new Date().toISOString(),
      new Date().toISOString(),
      new Date().toISOString(),
      '',
      null,
      'title-1',
      'description-1',
      EVisibility.PUBLIC,
      null,
    ),
    new Image(
      'id-2',
      new Date().toISOString(),
      new Date().toISOString(),
      new Date().toISOString(),
      '',
      null,
      'title-2',
      'description-2',
      EVisibility.PRIVATE,
      null,
    ),
    new Image(
      'id-3',
      new Date().toISOString(),
      new Date().toISOString(),
      new Date().toISOString(),
      '',
      null,
      'title-3',
      'description-3',
      EVisibility.PUBLIC,
      null,
    ),
  ];

  private _selectedImage: Image | null = null;

  private _newImage: Image = new Image();

  private _currentPage: number = 0;

  public EVisibility = EVisibility;
  public visibilityClasses = {
    [EVisibility.PUBLIC]:
      'text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [EVisibility.PRIVATE]:
      'text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [EVisibility.UNLISTED]:
      'text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };

  ngOnInit(): void {
    this.loadImages();
  }

  ngOnDestroy(): void {
    this.images = [];
  }

  constructor(private _imageService: ImageService, private _imageMapper: ImageMapper) {}

  public get getDialogState(): Record<DialogType, boolean> {
    return this._dialogState;
  }

  public set setDialogState(dialogState: Record<DialogType, boolean>) {
    this._dialogState = dialogState;
  }

  public get getImagePageResponse(): ImagePageResponse {
    return this._imagePageResponse;
  }

  public set setImagePageResponse(value: ImagePageResponse) {
    this._imagePageResponse = value;
  }

  public get getImages(): Image[] {
    return this.images;
  }

  public set setImages(images: Image[]) {
    this.images = images;
  }

  public get getNewImage(): Image {
    return this._newImage;
  }

  public set setNewImage(newImage: Image) {
    this._newImage = newImage;
  }

  public get getSelectedImage(): Image | null {
    return this._selectedImage;
  }

  public set setSelectedImage(image: Image | null) {
    this._selectedImage = image;
  }

  public get getCurrentPage(): number {
    return this._currentPage;
  }

  public set setCurrentPage(currentPage: number) {
    this._currentPage = currentPage;
  }

  searchByName: string = '';
  onSearch(event: Event): void {
    if (event.target as HTMLInputElement) {
      const value = (event.target as HTMLInputElement).value.trim();
      if (!value || value.length === 0) {
        this.loadImages();
        return;
      }
      this.searchByName = value;
      this.setImages = this.images.filter((image) => {
        return (
          image.getTitle.toLowerCase().includes(this.searchByName.toLowerCase()) ||
          image.getDescription.toLowerCase().includes(this.searchByName.toLowerCase())
        );
      });
    }
  }

  public loadImages(): void {
    const page: number = this.getCurrentPage;
    const size: number = this.getImagePageResponse?.size ?? 10;
    const sortBy: string = 'createdAt';
    const sortOrder: string = 'asc';
    this._imageService.getAllImagesPaginated(page, size, sortBy, sortOrder).subscribe((response: ImagePageResponse) => {
      this.setImagePageResponse = response;
      this.setImages =
        this._imagePageResponse?.content?.map((apiData: ImageResponseAPI) => {
          return this._imageMapper.toImage(this._imageMapper.deserialize(apiData));
        }) || [];
      this.setCurrentPage = page;
    });
  }

  public toggleDialog(dialogType: DialogType): void {
    this._dialogState[dialogType] = !this._dialogState[dialogType];
  }

  public pageChanged(event: number): void {
    this.setCurrentPage = event - 1;
    this.loadImages();
  }

  public onImageCreated(): void {
    this.loadImages();
  }

  public onImageDetailClick(image: Image): void {
    this.setSelectedImage = image;
    this.toggleDialog(DialogType.ImageDetail);
  }

  public onClickDownloadImage(url: string): void {
    window.open(url, '_blank');
    fetchFile(url).then((arrayBuffer: ArrayBuffer) => {
      const blob = new Blob([arrayBuffer]);
      const fileName = extractFileNameFromUrl(url);
      saveAs(blob, fileName);
    });
  }

  public onClickDownloadAllImages(): void {
    const zip = new JSZip();
    this.getImages.forEach((image, index) => {
      const fileName = image.getFile?.name ?? `image_${index + 1}.png`;
      const imageUrl = image.getFileUrl;
      // Ajoute le fichier à l'archive zip
      zip.file(fileName, fetchFile(imageUrl), { binary: true });
    });
    // Génère le fichier zip
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      // Télécharge l'archive zip
      const fileName = generateRandomFileName('images');
      saveAs(blob, fileName + '.zip');
    });
  }
}
