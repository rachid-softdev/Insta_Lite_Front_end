import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Image } from '../../../../../../core/models/image/image.model';
import { ImageService } from '../../../../../../core/services/image/image.service';

@Component({
  selector: 'app-image-list-delete',
  templateUrl: './image-list-delete.component.html',
  styleUrls: ['./image-list-delete.component.css'],
  providers: [ImageService],
})
export class ImageListDeleteComponent {
  private _image: Image | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _imageDeletedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitDeleteImageButtonLoading: boolean = false;

  constructor(private _imageService: ImageService, private _toastrService: ToastrService) {}

  public get getImage(): Image | null {
    return this._image;
  }

  @Input()
  public set setImage(image: Image | null) {
    this._image = image;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getImageDeletedEvent(): EventEmitter<boolean> {
    return this._imageDeletedEvent;
  }

  public get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitDeleteImageButtonLoading(): boolean {
    return this._isSubmitDeleteImageButtonLoading;
  }

  public set setIsSubmitDeleteImageButtonLoading(isSubmitDeleteImageButtonLoading: boolean) {
    this._isSubmitDeleteImageButtonLoading = isSubmitDeleteImageButtonLoading;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public confirmDelete(): void {
    if (this._image) {
      this._isSubmitDeleteImageButtonLoading = true;
      this._imageService.deleteImage(this._image.getPublicId).subscribe({
        next: () => {
          this._errorMessage = null;
          this._isSubmitDeleteImageButtonLoading = false;
          this.toggleDialog();
          this._toastrService.success("L'image a été supprimé avec succès", "Suppression de l'image");
          this._imageDeletedEvent.emit(true);
        },
        error: (error) => {
          if (error.status === 404) {
            this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
          } else {
            this._errorMessage =
              "Une erreur s'est produite lors de la suppression de l'image : (" +
              error?.status +
              ') - ' +
              error?.error?.message;
          }
          this._isSubmitDeleteImageButtonLoading = false;
          this._toastrService.error(this._errorMessage, "Suppression de l'image");
          this._imageDeletedEvent.emit(false);
        },
      });
    }
  }

  public cancelDelete(): void {
    this.toggleDialog();
  }
}
