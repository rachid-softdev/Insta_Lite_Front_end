import { Component, EventEmitter, OnDestroy, OnInit, Output, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../../../core/models/user/user.model';
import { UserService } from '../../../../../../core/services/user/user.service';
import { UserCreateRequest } from '../../../../../../core/models/user/http/request/user-create-request.model';
import { BaseUserMapper } from '../../../../../../core/models/user/http/mapper/base-user-mapper.model';
import { Role, RoleManager } from '../../../../../../core/constants/ERole';

@Component({
  selector: 'app-user-list-create',
  templateUrl: './user-list-create.component.html',
  styleUrls: ['./user-list-create.component.css'],
  providers: [BaseUserMapper, UserService],
})
export class UserListCreateComponent implements OnInit, OnDestroy {
  private _isDialogOpen: boolean = false;
  private _dialogToggled = new EventEmitter<boolean>();
  private _createUserForm: FormGroup;
  private _userCreatedEvent = new EventEmitter<boolean>();
  private _errorMessage: string | null = null;
  private _isSubmitCreateUserButtonLoading: boolean = false;
  private _passwordTextType!: boolean;
  roles = Array.from(RoleManager.getRoles.keys());

  UserRole = RoleManager.USER.getName;

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _sanitizer: DomSanitizer,
    private _toastrService: ToastrService,
    private readonly _userService: UserService,
    private readonly _userMapper: BaseUserMapper,
  ) {
    this._createUserForm = this._fb.group({
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

  public get getCreateUserForm(): FormGroup {
    return this._createUserForm;
  }

  get getFormControls() {
    return this.getCreateUserForm.controls;
  }

  public get getPasswordTextType(): boolean {
    return this._passwordTextType;
  }

  public togglePasswordTextType() {
    this._passwordTextType = !this._passwordTextType;
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

  public get isDialogOpen(): boolean {
    return this._isDialogOpen;
  }

  @Output()
  public get getDialogToggled(): EventEmitter<boolean> {
    return this._dialogToggled;
  }

  @Output()
  public get getUserCreatedEvent(): EventEmitter<boolean> {
    return this._userCreatedEvent;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  public set setErrorMessage(errorMessage: string | null) {
    this._errorMessage = errorMessage;
  }

  public get isSubmitCreateUserButtonLoading(): boolean {
    return this._isSubmitCreateUserButtonLoading;
  }

  public set setIsSubmitCreateUserButtonLoading(isSubmitCreateUserButtonLoading: boolean) {
    this._isSubmitCreateUserButtonLoading = isSubmitCreateUserButtonLoading;
  }

  public toggleDialog(): void {
    this.resetForm();
    this._isDialogOpen = !this._isDialogOpen;
    this._dialogToggled.emit(this._isDialogOpen);
  }

  public initializeForm(): void {
    this._createUserForm = this._fb.group({
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

  public resetForm(): void {
    this._errorMessage = null;
    this._createUserForm.reset();
    this.initializeForm();
  }

  public onSubmitCreateUser(): void {
    this._isSubmitCreateUserButtonLoading = true;
    if (this._createUserForm.invalid) {
      this._isSubmitCreateUserButtonLoading = false;
      return;
    }
    const createdAt: string = new Date().toISOString().toString(),
      updatedAt = createdAt;
    const newUser: User = new User(
      '',
      createdAt,
      updatedAt,
      this._sanitizer.sanitize(SecurityContext.HTML, this._createUserForm.get('name')?.value) ?? '',
      this._sanitizer.sanitize(SecurityContext.HTML, this._createUserForm.get('firstname')?.value) ?? '',
      this._sanitizer.sanitize(SecurityContext.HTML, this._createUserForm.get('email')?.value) ?? '',
      this._sanitizer.sanitize(SecurityContext.HTML, this._createUserForm.get('password')?.value) ?? '',
      RoleManager.fromValue(this._createUserForm.get('role')?.value) ?? RoleManager.NONE,
    );
    const newUserRequest: UserCreateRequest = this._userMapper.toUserCreateRequest(newUser);
    this._userService.createUser(newUserRequest).subscribe({
      next: () => {
        this._createUserForm.reset();
        this._errorMessage = null;
        this._isSubmitCreateUserButtonLoading = false;
        this.toggleDialog();
        this._toastrService.success("L'utilisateur a été crée avec succès", "Création de l'utilisateur");
        this._userCreatedEvent.emit(true);
      },
      error: (error) => {
        console.log(error);
        if (error.status === 404) {
          this._errorMessage = 'Erreur : Ressource non trouvée (' + error?.status + ') - ' + error?.error?.message;
        } else {
          this._errorMessage =
            "Une erreur s'est produite lors de la création de l'utilisateur : (" +
            error?.status +
            ') - ' +
            error?.error?.message;
        }
        this._isSubmitCreateUserButtonLoading = false;
        this._toastrService.error(
          `Une erreur est survenue lors de la création de l'utilisateur ${this._errorMessage}`,
          "Création de l'utilisateur",
        );
        this._userCreatedEvent.emit(false);
      },
    });
  }
}
