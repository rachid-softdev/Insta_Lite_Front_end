import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Image } from '../../../../../../core/models/image/image.model';
import { ImageService } from '../../../../../../core/services/image/image.service';
import { ImageUpdateRequest } from '../../../../../../core/models/image/http/request/image-update-request.model';
import { BaseImageMapper } from '../../../../../../core/models/image/http/mapper/base-image-mapper.model';
import { EVisibility, visibilityFromValue } from '../../../../../../core/constants/EVisibility';
import { TokenStorageService } from '../../../../../../core/services/token-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-image-list-update',
  templateUrl: './image-list-update.component.html',
  styleUrls: ['./image-list-update.component.css'],
  providers: [BaseImageMapper, ImageService],
})
export class ImageListUpdateComponent implements OnInit, OnDestroy {
  private _image: Image | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _updateImageForm: FormGroup;
  private _imageUpdatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitUpdateImageButtonLoading: boolean = false;
  private _visibilities: EVisibility[] = Object.values(EVisibility);
  private _file!: File;

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _sanitizer: DomSanitizer,
    private readonly _toastrService: ToastrService,
    private readonly _imageService: ImageService,
    private readonly _tokenStorageService: TokenStorageService,
    private readonly _imageMapper: BaseImageMapper,
  ) {
    this._updateImageForm = this._fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
      description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
      file: new FormControl(null, [Validators.required]),
      visibility: new FormControl(EVisibility.PRIVATE, [Validators.required]),
    });
    this._visibilities = Object.values(EVisibility);
  }

  public get getVisibilities(): EVisibility[] {
    return this._visibilities;
  }

  public set setVisibilities(visibilities: EVisibility[]) {
    this._visibilities = visibilities;
  }

  public get getUpdateImageForm(): FormGroup {
    return this._updateImageForm;
  }

  public get getFormControls() {
    return this.getUpdateImageForm.controls;
  }

  public get getFormBuilder(): FormBuilder {
    return this._fb;
  }

  public get getImageService(): ImageService {
    return this._imageService;
  }

  public get getToastrService(): ToastrService {
    return this._toastrService;
  }

  public get getImageMapper(): BaseImageMapper {
    return this._imageMapper;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getImageUpdatedEvent(): EventEmitter<boolean> {
    return this._imageUpdatedEvent;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitUpdateImageButtonLoading(): boolean {
    return this._isSubmitUpdateImageButtonLoading;
  }

  public set setIsSubmitUpdateImageButtonLoading(isSubmitUpdateImageButtonLoading: boolean) {
    this._isSubmitUpdateImageButtonLoading = isSubmitUpdateImageButtonLoading;
  }

  public get getFile(): File {
    return this._file;
  }

  public set setFile(file: File) {
    this._file = file;
  }

  public get getImage(): Image | null {
    return this._image;
  }

  @Input()
  public set setImage(image: Image | null) {
    this._image = image;
    this._updateImageForm.get('title')?.setValue(this.getImage?.getTitle);
    this._updateImageForm.get('description')?.setValue(this.getImage?.getDescription);
    this._updateImageForm.get('visibility')?.setValue(this.getImage?.getVisibility);
  }

  public toggleDialog(): void {
    this.resetForm();
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public initializeForm(): void {
    this._updateImageForm = this._fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
      description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
      file: new FormControl(null, [Validators.required]),
      visibility: new FormControl(EVisibility.PRIVATE, [Validators.required]),
    });
  }

  public resetForm(): void {
    this._errorMessage = null;
    this._updateImageForm.reset();
    this.initializeForm();
  }

  public onFileSelected(event: Event) {
    const element = (event.target as HTMLInputElement).files?.item(0);
    if (element) this.setFile = element;
  }

  public onSubmitUpdateImage(): void {
    this._isSubmitUpdateImageButtonLoading = true;
    if (this._updateImageForm.invalid) {
      this._isSubmitUpdateImageButtonLoading = false;
      return;
    }
    const updatedAt: string = new Date().toISOString().toString();
    const updatedImage: Image = new Image(
      this.getImage?.getPublicId ?? '',
      this.getImage?.getCreatedAt ?? '',
      updatedAt,
      this.getImage?.getPublishedAt ?? '',
      this.getImage?.getFileUrl ?? '',
      this.getFile,
      this._sanitizer.sanitize(SecurityContext.HTML, this._updateImageForm.get('title')?.value) ?? '',
      this._sanitizer.sanitize(SecurityContext.HTML, this._updateImageForm.get('description')?.value) ?? '',
      visibilityFromValue(
        this._sanitizer.sanitize(SecurityContext.HTML, this._updateImageForm.get('visibility')?.value) ?? '',
      ) ?? EVisibility.PRIVATE,
      this._tokenStorageService.getUser(),
    );
    const updatedImageRequest: ImageUpdateRequest = this._imageMapper.toImageUpdateRequest(updatedImage);
    this._imageService.updateImage(this.getImage?.getPublicId ?? '', updatedImageRequest).subscribe({
      next: (image) => {
        if (!image) {
          /**
           * Dans la réponse de l'API, un update retourne l'image updated
           * Il aurait pu aussi être envisagé de retourner un NO_CONTENT et donc pas recevoir d'image mais
           * l'image aurait quand même était mis à jour
           */
          this._toastrService.error(
            "Une erreur est survenue lors de la la mis à jour de l'image",
            "Mis à jour de l'image",
          );
          return;
        }
        this._updateImageForm.reset();
        this._errorMessage = null;
        this._isSubmitUpdateImageButtonLoading = false;
        this.toggleDialog();
        this._toastrService.success("L'image a été mis à jour avec succès", "Mis à jour de l'image");
        this._imageUpdatedEvent.emit(true);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la mis à jour de l'image : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitUpdateImageButtonLoading = false;
        this._toastrService.error(this._errorMessage, "Mis à jour de l'image");
        this._imageUpdatedEvent.emit(false);
      },
    });
  }
}
