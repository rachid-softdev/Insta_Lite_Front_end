import { Component, EventEmitter, OnDestroy, OnInit, Output, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Image } from '../../../../core/models/image/image.model';
import { ImageService } from '../../../../core/services/image/image.service';
import { ImageCreateRequest } from '../../../../core/models/image/http/request/image-create-request.model';
import { BaseImageMapper } from '../../../../core/models/image/http/mapper/base-image-mapper.model';
import { EVisibility, visibilityFromValue } from '../../../../core/constants/EVisibility';
import { TokenStorageService } from '../../../../core/services/token-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-image-list-create',
  templateUrl: './image-list-create.component.html',
  styleUrls: ['./image-list-create.component.css'],
  providers: [BaseImageMapper, ImageService],
})
export class ImageListCreateComponent implements OnInit, OnDestroy {
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _createImageForm: FormGroup;
  private _imageCreatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitCreateImageButtonLoading: boolean = false;
  private _visibilities: EVisibility[] = Object.values(EVisibility);
  private _file!: File;
  private _fileInputId: string = 'image_create_file';

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _sanitizer: DomSanitizer,
    private readonly _imageService: ImageService,
    private readonly _tokenStorageService: TokenStorageService,
    private _toastrService: ToastrService,
    private readonly _imageMapper: BaseImageMapper,
  ) {
    this._createImageForm = this._fb.group({
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

  public get getCreateImageForm(): FormGroup {
    return this._createImageForm;
  }

  public get getFormControls() {
    return this.getCreateImageForm.controls;
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
  public get getImageCreatedEvent(): EventEmitter<boolean> {
    return this._imageCreatedEvent;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitCreateImageButtonLoading(): boolean {
    return this._isSubmitCreateImageButtonLoading;
  }

  public set setIsSubmitCreateImageButtonLoading(isSubmitCreateImageButtonLoading: boolean) {
    this._isSubmitCreateImageButtonLoading = isSubmitCreateImageButtonLoading;
  }

  public get getFile(): File {
    return this._file;
  }

  public set setFile(file: File) {
    this._file = file;
  }

  public get getFileInputId(): string {
    return this._fileInputId;
  }

  public set setFileInputId(fileInputId: string) {
    this._fileInputId = fileInputId;
  }

  public toggleDialog(): void {
    this.resetForm();
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public initializeForm(): void {
    this._createImageForm = this._fb.group({
      title: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
      description: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]),
      file: new FormControl(null, [Validators.required]),
      visibility: new FormControl(EVisibility.PRIVATE, [Validators.required]),
    });
  }

  public resetForm(): void {
    this._errorMessage = null;
    this._createImageForm.reset();
    this.initializeForm();
  }

  public onFileSelected(event: Event) {
    const file: File | null | undefined = (event.target as HTMLInputElement).files?.item(0);
    if (file) this.setFile = file;
  }

  public onCanvasFileChange(newFile: File): void {
    this.setFile = newFile;
  }

  public onSubmitCreateImage(): void {
    this._isSubmitCreateImageButtonLoading = true;
    if (this._createImageForm.invalid) {
      this._isSubmitCreateImageButtonLoading = false;
      return;
    }
    const createdAt: string = new Date().toISOString().toString(),
      updatedAt = createdAt,
      publishedAt = createdAt;
    const newImage: Image = new Image(
      '',
      createdAt,
      updatedAt,
      publishedAt,
      '',
      this.getFile,
      this._sanitizer.sanitize(SecurityContext.HTML, this._createImageForm.get('title')?.value) ?? '',
      this._sanitizer.sanitize(SecurityContext.HTML, this._createImageForm.get('description')?.value) ?? '',
      visibilityFromValue(
        this._sanitizer.sanitize(SecurityContext.HTML, this._createImageForm.get('visibility')?.value) ?? '',
      ) ?? EVisibility.PRIVATE,
      this._tokenStorageService.getUser(),
    );
    const newImageRequest: ImageCreateRequest = this._imageMapper.toImageCreateRequest(newImage);
    this._imageService.createImage(newImageRequest).subscribe({
      next: () => {
        this._createImageForm.reset();
        this._errorMessage = null;
        this._isSubmitCreateImageButtonLoading = false;
        this.toggleDialog();
        this._toastrService.success("L'image a été mis en ligne avec succès", "Mis en ligne de l'image");
        this._imageCreatedEvent.emit(true);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la création de l'image : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitCreateImageButtonLoading = false;
        this._toastrService.error(this._errorMessage, "Mis en ligne de l'image");
        this._imageCreatedEvent.emit(false);
      },
    });
  }
}
