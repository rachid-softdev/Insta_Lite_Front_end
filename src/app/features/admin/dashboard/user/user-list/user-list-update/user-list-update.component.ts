import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SecurityContext } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../../../core/models/user/user.model';
import { UserService } from '../../../../../../core/services/user/user.service';
import { UserUpdateRequest } from '../../../../../../core/models/user/http/request/user-update-request.model';
import { BaseUserMapper } from '../../../../../../core/models/user/http/mapper/base-user-mapper.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Role, RoleManager } from 'src/app/core/constants/ERole';
import { HTMLEntityDecode } from '../../../../../../shared/pipes/html-entity-decode.pipe';

@Component({
  selector: 'app-user-list-update',
  templateUrl: './user-list-update.component.html',
  styleUrls: ['./user-list-update.component.css'],
  providers: [BaseUserMapper, UserService],
})
export class UserListUpdateComponent implements OnInit, OnDestroy {
  private _user: User | null = null;
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _updateUserForm: FormGroup;
  private _userUpdatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitUpdateUserButtonLoading: boolean = false;
  private _passwordTextType!: boolean;
  private _roles: string[] = Array.from(RoleManager.getRoles.keys());

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _sanitizer: DomSanitizer,
    private _toastrService: ToastrService,
    private readonly _userService: UserService,
    private readonly _userMapper: BaseUserMapper,
    private readonly _HTMLEntityDecode: HTMLEntityDecode,
  ) {
    this._updateUserForm = this._fb.group({
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]),
      firstname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // Minimum 8 caractères
          Validators.pattern(/(?=.*\d)/), // Au moins un chiffre
          Validators.pattern(/(?=.*[a-z])/), // Au moins une minuscule
          Validators.pattern(/(?=.*[A-Z])/), // Au moins une majuscule
          Validators.pattern(/(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/), // Au moins un caractère spécial
        ],
      ],
      role: [RoleManager.USER.getName, Validators.required],
    });
  }

  public get getFormBuilder(): FormBuilder {
    return this._fb;
  }

  public get getUserService(): UserService {
    return this._userService;
  }

  public get getToastrService(): ToastrService {
    return this._toastrService;
  }

  public get getUserMapper(): BaseUserMapper {
    return this._userMapper;
  }

  public get getUser(): User | null {
    return this._user;
  }

  @Input()
  public set setUser(user: User | null) {
    this._user = user;
    this._updateUserForm.get('name')?.setValue(this._HTMLEntityDecode.transform(this.getUser?.getLastname));
    this._updateUserForm.get('firstname')?.setValue(this._HTMLEntityDecode.transform(this.getUser?.getFirstname));
    this._updateUserForm.get('email')?.setValue(this.getUser?.getEmail);
    this._updateUserForm.get('password')?.setValue(this.getUser?.getPassword);
    this._updateUserForm.get('role')?.setValue(this.getUser?.getRole);
  }

  public get getRoles(): string[] {
    return this._roles;
  }

  public set setRoles(roles: string[]) {
    this._roles = roles;
  }

  public get getPasswordTextType(): boolean {
    return this._passwordTextType;
  }

  public togglePasswordTextType() {
    this._passwordTextType = !this.toggleDialog;
  }

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getUserUpdatedEvent(): EventEmitter<boolean> {
    return this._userUpdatedEvent;
  }

  public get getUpdateUserForm(): FormGroup {
    return this._updateUserForm;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitUpdateUserButtonLoading(): boolean {
    return this._isSubmitUpdateUserButtonLoading;
  }

  public set setIsSubmitUpdateUserButtonLoading(isSubmitUpdateUserButtonLoading: boolean) {
    this._isSubmitUpdateUserButtonLoading = isSubmitUpdateUserButtonLoading;
  }

  public toggleDialog(): void {
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public onSubmitUpdateUser(): void {
    if (this._updateUserForm.invalid) {
      return;
    }
    const createdAt: string = new Date().toISOString().toString(),
      updatedAt = createdAt;
    const updatedUser: User = new User(
      this._user?.getPublicId,
      createdAt,
      updatedAt,
      this._sanitizer.sanitize(SecurityContext.HTML, this._updateUserForm.get('name')?.value) ?? '',
      this._sanitizer.sanitize(SecurityContext.HTML, this._updateUserForm.get('firstname')?.value) ?? '',
      this._sanitizer.sanitize(SecurityContext.HTML, this._updateUserForm.get('email')?.value) ?? '',
      this._updateUserForm.get('password')?.value ?? '',
      RoleManager.fromValue(this._updateUserForm.get('role')?.value) ?? RoleManager.NONE,
    );
    const updatedUserRequest: UserUpdateRequest = this._userMapper.toUserUpdateRequest(updatedUser);
    this._userService.updateUser(this.getUser?.getPublicId ?? '', updatedUserRequest).subscribe({
      next: (user) => {
        /**
         * Dans la réponse de l'API, un update retourne le user updated
         * Il aurait pu aussi être envisagé de retourner un NO_CONTENT et donc pas recevoir d'user mais
         * le user aurait quand même était mis à jour
         */
        if (!user) {
          this._toastrService.error(
            `Une erreur est survenue lors de la mis à jour de l'utilisateur.`,
            "Mis à jour de l'utilisateur",
          );
          return;
        }
        this._errorMessage = null;
        this.toggleDialog();
        this._toastrService.success("L'utilisateur a été mis à jour avec succès", "Mis à jour de l'utilisateur");
        this._userUpdatedEvent.emit(true);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la mis à jour de l'utilisateur : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitUpdateUserButtonLoading = false;
        this._toastrService.error(
          `Une erreur est survenue lors de la mis à jour de l'utilisateur ${this._errorMessage}`,
          "Mis à jour de l'utilisateur",
        );
        this._userUpdatedEvent.emit(false);
      },
    });
  }
}
