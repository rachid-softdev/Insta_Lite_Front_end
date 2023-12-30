import { Component, OnDestroy, OnInit, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../../core/services/authentication/authentication.service';
import { LoginUserRequest } from '../../../../core/models/authentication/request/login-user-request.model';
import { BaseUserMapper } from '../../../../core/models/user/http/mapper/base-user-mapper.model';
import { RoleManager } from '../../../../core/constants/ERole';
import { User } from '../../../../core/models/user/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [BaseUserMapper],
})
export class LoginComponent implements OnInit, OnDestroy {
  private _formGroup!: FormGroup;
  private _passwordTextType!: boolean;
  private _isSubmitted = false;
  private _errorMessage: string | null = null;
  private _isSubmitLoginUserButtonLoading: boolean = false;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _sanitizer: DomSanitizer,
    private readonly _router: Router,
    private readonly _toastrService: ToastrService,
    private readonly _authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this._formGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
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
    });
  }

  ngOnDestroy(): void {}

  public get getFormBuilder(): FormBuilder {
    return this._formBuilder;
  }

  public get getRouter(): Router {
    return this._router;
  }

  public get getAuthenticationService(): AuthenticationService {
    return this._authenticationService;
  }

  public get getPasswordTextType(): boolean {
    return this._passwordTextType;
  }

  public get getIsSubmitLoginUserButtonLoading(): boolean {
    return this._isSubmitLoginUserButtonLoading;
  }

  public get getForm(): FormGroup {
    return this._formGroup;
  }

  get getFormControls() {
    return this.getForm.controls;
  }

  get getIsSubmitted(): boolean {
    return this._isSubmitted;
  }

  get getErrorMessage(): string | null {
    return this._errorMessage;
  }

  togglePasswordTextType() {
    this._passwordTextType = !this._passwordTextType;
  }

  onSubmit() {
    this._isSubmitted = true;
    this._isSubmitLoginUserButtonLoading = true;
    if (this._formGroup.invalid) {
      this._isSubmitLoginUserButtonLoading = false;
      this._toastrService.error(
        'Veuillez vérifier le formulaire de connexion. Certains champs sont invalides.',
        'Erreur de connexion',
      );
      return;
    }
    const email: string = this._sanitizer.sanitize(SecurityContext.HTML, this._formGroup.get('email')?.value) ?? '';
    const password: string =
      this._sanitizer.sanitize(SecurityContext.HTML, this._formGroup.get('password')?.value) ?? '';
    const loginUserRequest: LoginUserRequest = new LoginUserRequest(email, password);
    this.getAuthenticationService.login(loginUserRequest).subscribe({
      next: (user) => {
        if (user) {
          this._errorMessage = null;
          this._formGroup.reset();
          this._isSubmitted = false;
          this._isSubmitLoginUserButtonLoading = false;
          this._toastrService.success(`Connecté sur le compte ${user.getEmail}`, 'Connexion réussie');
          const roleToRouteMap = new Map([
            [RoleManager.ADMIN, '/admin'],
            [RoleManager.USER, '/user'],
            [RoleManager.NONE, ''],
          ]);
          const route = roleToRouteMap.get(user.getRole ?? RoleManager.NONE) || '';
          this._router.navigate([route]);
        } else {
          this._errorMessage = 'Adresse e-mail ou mot de passe invalide';
          this._isSubmitted = false;
          this._isSubmitLoginUserButtonLoading = false;
        }
      },
      error: (error) => {
        this._errorMessage = 'Adresse e-mail ou mot de passe invalide';
        this._isSubmitted = false;
        this._isSubmitLoginUserButtonLoading = false;
        this._toastrService.error(`${this._errorMessage}`, 'Connexion échouée');
      },
      complete: () => {},
    });
  }
}
