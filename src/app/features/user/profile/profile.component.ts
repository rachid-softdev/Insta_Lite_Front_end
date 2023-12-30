import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { User } from '../../../core/models/user/user.model';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserProfileUpdateRequest } from '../../../core/models/user/http/request/user-profile-update-request.model';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../../core/services/user/user.service';
import { UserChangePasswordRequest } from '../../../core/models/user/http/request/user-change-password-request.model';
import { BaseUserResponse } from '../../../core/models/user/http/response/base-user-response.model';
import { UserMapper } from '../../../core/models/user/http/mapper/user-mapper.model';
import { HTMLEntityDecode } from '../../../shared/pipes/html-entity-decode.pipe';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private _user: User | null;
  private _userFormInformation!: FormGroup;
  private _userFormChangePassword!: FormGroup;

  constructor(
    private readonly _tokenStorageService: TokenStorageService,
    private readonly _userService: UserService,
    private readonly _userMapper: UserMapper,
    private readonly _router: Router,
    private readonly _fb: FormBuilder,
    private readonly _sanitizer: DomSanitizer,
    private readonly _toastrService: ToastrService,
    private readonly _HTMLEntityDecode: HTMLEntityDecode,
  ) {
    this._user = _tokenStorageService.getUser();
  }

  ngOnInit(): void {
    this._userService.getUser(this.getUser?.getPublicId ?? '').subscribe({
      next: (user) => {
        if (!user) {
          // this._router.navigate(['/']);
        }
      },
      error: (error) => {
        // this._router.navigate(['/']);
      },
    });
    this._userFormInformation = this.createUserFormInformation();
    this._userFormChangePassword = this.createUserFormChangePassword();
  }

  ngOnDestroy(): void {
    this._user = null;
  }

  public get getUserService(): UserService {
    return this._userService;
  }

  public get getUserFormInformation(): FormGroup {
    return this._userFormInformation;
  }

  public get getUserFormInformationControls(): { [key: string]: AbstractControl } {
    return this.getUserFormInformation.controls;
  }

  public get getUserFormChangePassword(): FormGroup {
    return this._userFormChangePassword;
  }

  public get getUserFormChangePasswordControls(): { [key: string]: AbstractControl } {
    return this.getUserFormChangePassword.controls;
  }

  private createUserFormInformation(): FormGroup {
    return this._fb.group({
      lastname: [
        this._HTMLEntityDecode.transform(this.getUser?.getLastname ?? ''),
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ '-]+$/),
        ],
      ],
      firstname: [
        this._HTMLEntityDecode.transform(this.getUser?.getFirstname ?? ''),
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ '-]+$/),
        ],
      ],
      email: [this.getUser?.getEmail ?? '', [Validators.required, Validators.email]],
    });
  }

  private _passwordTextTypes: boolean[] = [false, false, false]; // Un élément par champ de mot de passe

  public get getPasswordTextTypes(): boolean[] {
    return this._passwordTextTypes;
  }

  togglePasswordTextType(index: number): void {
    this._passwordTextTypes[index] = !this._passwordTextTypes[index];
  }

  private createUserFormChangePassword(): FormGroup {
    return this._fb.group({
      currentPassword: ['', this.createPasswordValidators()],
      newPassword: ['', this.createPasswordValidators()],
      confirmPassword: ['', this.createPasswordValidators()],
    });
  }

  public get getUser(): User | null {
    return this._user;
  }

  public set setUser(user: User | null) {
    this._user = user;
  }

  public onSubmitUserInformation(): void {
    if (this._userFormInformation.invalid) {
      this._toastrService.error(
        'Veuillez vérifier le formulaire de votre profil. Certains champs sont invalides.',
        'Mis à jour du profil',
      );
      return;
    }
    const firstname: string =
      this._sanitizer.sanitize(SecurityContext.HTML, this.getUserFormInformation.get('firstname')?.value) ?? '';
    const lastname: string =
      this._sanitizer.sanitize(SecurityContext.HTML, this.getUserFormInformation.get('lastname')?.value) ?? '';
    const email: string =
      this._sanitizer.sanitize(SecurityContext.HTML, this.getUserFormInformation.get('email')?.value) ?? '';
    const userProfile: UserProfileUpdateRequest = new UserProfileUpdateRequest(
      this.getUser?.getPublicId,
      '',
      '',
      lastname,
      firstname,
      email,
    );

    this.getUserService.updateUserProfile(this.getUser?.getPublicId ?? '', userProfile).subscribe({
      next: (user) => {
        if (!user) {
          this._toastrService.error(
            `Une erreur est survenue lors de la mis à jour de votre profil.`,
            'Mis à jour du profil',
          );
          return;
        }
        const userResponse: BaseUserResponse = this._userMapper.deserialize(user);
        const userModel: User = this._userMapper.toUser(userResponse);
        this._tokenStorageService.saveUser(userModel);
        this._user = userModel;
        this._toastrService.success(`Votre profil a été mis à jour`, 'Mis à jour du profil');
      },
      error: (error) => {
        console.log(error);
        this._toastrService.error(
          `Une erreur est survenue lors de la mis à jour de votre profil. `,
          'Mis à jour du profil',
        );
      },
    });
  }

  public onSubmitChangePassword(): void {
    if (this._userFormChangePassword.invalid) {
      this._toastrService.error(
        'Veuillez vérifier le formulaire de changement de mot de passe. Certains champs sont invalides.',
        'Erreur de changement de mot de passe',
      );
      return;
    }
    /** En ce qui concerne les mots de passe, aucun processus de sanitization n'est appliqué, car l'utilisateur doit être en mesure d'insérer des caractères de tout type. */
    const currentPassword: string = this.getUserFormChangePassword.get('currentPassword')?.value ?? '';
    const newPassword: string = this.getUserFormChangePassword.get('newPassword')?.value ?? '';
    const confirmPassword: string = this.getUserFormChangePassword.get('confirmPassword')?.value ?? '';
    const userChangePasswordRequest = new UserChangePasswordRequest(
      this.getUser?.getPublicId,
      currentPassword,
      newPassword,
      confirmPassword,
    );
    this.getUserService.changeUserPassword(this.getUser?.getPublicId ?? '', userChangePasswordRequest).subscribe({
      next: (user) => {
        if (!user) {
          this._toastrService.error(
            `Une erreur est survenue lors de la mis à jour de votre mot de passe.`,
            'Mis à jour du mot de passe',
          );
          return;
        }
        this._toastrService.success(`Votre mot de passe a été mis à jour`, 'Mis à jour du mot de passe');
      },
      error: (error) => {
        this._toastrService.error(
          `Une erreur est survenue lors de la mis à jour de votre mot de passe. `,
          'Mis à jour du mot de passe',
        );
      },
    });
    // this.resetUserFormChangePassword();
  }

  private createPasswordValidators(): ValidatorFn[] {
    return [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/(?=.*\d)/),
      Validators.pattern(/(?=.*[a-z])/),
      Validators.pattern(/(?=.*[A-Z])/),
      Validators.pattern(/(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])/),
    ];
  }

  private resetUserFormChangePassword(): void {
    this.getUserFormChangePassword.get('currentPassword')?.setValue('');
    this.getUserFormChangePassword.get('newPassword')?.setValue('');
    this.getUserFormChangePassword.get('confirmPassword')?.setValue('');
  }
}
