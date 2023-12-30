import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { UserPageResponse } from '../../models/user/http/response/user-page-response.model';
import { UserCreateRequest } from '../../models/user/http/request/user-create-request.model';
import { UserUpdateRequest } from '../../models/user/http/request/user-update-request.model';
import { UserChangePasswordRequest } from '../../models/user/http/request/user-change-password-request.model';
import { UserProfileUpdateRequest } from '../../models/user/http/request/user-profile-update-request.model';
import { UserResponseAPI } from '../../models/user/http/response/user-response-api.model';

/*
Pas d'injection dans le root level, l'injection se fait dans le providers afin 
de mieux comprendre les injections,
car si elles sont fait depuis le root level, elles sont alors disponible dans toutes
l'application et donc c'est pas très utile dans certains cas
@Injectable({
  providedIn: 'root',
})
*/

@Injectable()
export class UserService {
  private static _headers = { 'Content-Type': 'application/json' };
  private apiUrl = environment.apiUrl + '/users';

  constructor(private _http: HttpClient) {}

  public static get getHeaders(): object {
    return UserService._headers;
  }

  public get getHttpClient(): HttpClient {
    return this._http;
  }

  getAllUsersPaginated(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: string = 'asc',
  ): Observable<UserPageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);
    return this.getHttpClient.get<UserPageResponse>(this.apiUrl, { params });
  }

  getUser(publicId: string): Observable<UserResponseAPI> {
    return this.getHttpClient.get<UserResponseAPI>(`${this.apiUrl}/${publicId}`);
  }

  createUser(userCreateRequest: UserCreateRequest): Observable<UserResponseAPI> {
    return this.getHttpClient.post<UserResponseAPI>(
      this.apiUrl,
      userCreateRequest.serialize(),
      UserService.getHeaders,
    );
  }

  updateUser(publicId: string, userUpdateRequest: UserUpdateRequest): Observable<UserResponseAPI> {
    return this.getHttpClient.put<UserResponseAPI>(
      `${this.apiUrl}/${publicId}`,
      userUpdateRequest.serialize(),
      UserService.getHeaders,
    );
  }

  updateUserProfile(
    publicId: string,
    userUpdateProfileRequest: UserProfileUpdateRequest,
  ): Observable<UserResponseAPI> {
    return this.getHttpClient.patch<UserResponseAPI>(
      `${this.apiUrl}/${publicId}/profile`,
      userUpdateProfileRequest.serialize(),
      UserService.getHeaders,
    );
  }

  changeUserPassword(
    publicId: string,
    userChangePasswordRequest: UserChangePasswordRequest,
  ): Observable<UserResponseAPI> {
    return this.getHttpClient.post<UserResponseAPI>(
      `${this.apiUrl}/${publicId}/change-password`,
      userChangePasswordRequest.serialize(),
      UserService.getHeaders,
    );
  }

  deleteUser(publicId: string): Observable<void> {
    return this.getHttpClient.delete<void>(`${this.apiUrl}/${publicId}`);
  }
}
