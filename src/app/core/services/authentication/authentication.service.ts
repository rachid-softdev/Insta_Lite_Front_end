import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginUserRequest } from '../../models/authentication/request/login-user-request.model';
import { RegisterUserRequest } from '../../models/authentication/request/register-user-request.model';
import { TokenStorageService } from '../token-storage.service';
import { User } from '../../models/user/user.model';
import { BaseUserResponse } from '../../models/user/http/response/base-user-response.model';
import { UserMapper } from '../../models/user/http/mapper/user-mapper.model';

interface AuthenticationResponse {
  access_token: string;
  refresh_token: string;
  user: any;
}
@Injectable()
export class AuthenticationService {
  private static _headers = {
    'Content-Type': 'application/json',
  };
  private apiUrl = environment.apiUrl + '/authentication';

  constructor(
    private readonly _http: HttpClient,
    private readonly _tokenStorageService: TokenStorageService,
    private readonly _userMapper: UserMapper,
  ) {}

  public static get getHeaders(): object {
    return AuthenticationService._headers;
  }

  public get getUser(): User | null {
    return this._tokenStorageService.getUser();
  }

  public login(request: LoginUserRequest): Observable<User | null> {
    return this._http
      .post<AuthenticationResponse>(
        `${this.apiUrl}/authenticate`,
        request.serialize(),
        AuthenticationService.getHeaders,
      )
      .pipe(
        map((data) => {
          // user = payload
          const { access_token, refresh_token, user } = data;
          this._tokenStorageService.saveToken(access_token);
          const userResponse: BaseUserResponse = this._userMapper.deserialize(user);
          const userModel: User = this._userMapper.toUser(userResponse);
          this._tokenStorageService.saveUser(userModel);
          return userModel;
        }),
        catchError((error) => {
          console.log(error);
          return of(null);
        }),
      );
  }

  public register(registerUserRequest: RegisterUserRequest): Observable<User | null> {
    return this._http
      .post<AuthenticationResponse>(
        `${this.apiUrl}/register`,
        registerUserRequest.serialize(),
        AuthenticationService.getHeaders,
      )
      .pipe(
        map((data) => {
          const { access_token, refresh_token, user } = data;
          this._tokenStorageService.saveToken(access_token);
          const userResponse: BaseUserResponse = this._userMapper.deserialize(user);
          const userModel: User = this._userMapper.toUser(userResponse);
          this._tokenStorageService.saveUser(userModel);
          return userModel;
        }),
        catchError((error) => {
          console.log(error);
          return of(null);
        }),
      );
  }

  public logout(): void {
    this._tokenStorageService.clearToken();
    this._http.post(`${this.apiUrl}/logout`, null, AuthenticationService.getHeaders);
  }

  public isAuthenticated(): Observable<boolean> {
    return this._http.get<any>(`${this.apiUrl}/check-authentication`).pipe(
      map((response) => {
        return response?.is_authenticated ? true : false ?? false;
      }),
      catchError(() => of(false)),
    );
  }

  /*
  public hasPermission(permission: string): boolean {
    const user = this._tokenStorageService.getUser;
    if (!user || !user.roles || !user.roles.permissions) {
      return false;
    }
    return user.roles.permissions.includes(permission);
  }
  */
}
