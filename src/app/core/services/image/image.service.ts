import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ImageCreateRequest } from '../../models/image/http/request/image-create-request.model';
import { ImageUpdateRequest } from '../../models/image/http/request/image-update-request.model';
import { ImagePageResponse } from '../../models/image/http/response/image-page-response.model';
import { ImageResponseAPI } from '../../models/image/http/response/image-response-api.model';

@Injectable()
export class ImageService {
  private static _headers = { 'Content-Type': 'application/json' };
  private apiUrl = environment.apiUrl + '/images';

  public static get getHeaders(): object {
    return ImageService._headers;
  }

  constructor(private _http: HttpClient) {}

  public get getHttpClient(): HttpClient {
    return this._http;
  }

  public getAllImagesPaginated(
    page: number = 0,
    size: number = 10,
    sortBy: string = '',
    sortOrder: string = 'asc',
  ): Observable<ImagePageResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);
    return this.getHttpClient.get<ImagePageResponse>(this.apiUrl, { params });
  }

  public getAllImages(): Observable<ImageResponseAPI> {
    return this.getHttpClient.get<ImageResponseAPI>(this.apiUrl + '/all');
  }

  public createImage(imageCreateRequest: ImageCreateRequest): Observable<ImageResponseAPI> {
    const formData = new FormData();
    const file = imageCreateRequest.getFile;
    if (file) formData.append('file', file, file.name);
    const imageCreateRequestJson: string = JSON.stringify({
      title: imageCreateRequest.getTitle,
      description: imageCreateRequest.getDescription,
      visibility: imageCreateRequest.getVisibility,
      author: {
        public_id: imageCreateRequest?.getAuthor?.getPublicId,
        lastname: imageCreateRequest?.getAuthor?.getLastname,
        firstname: imageCreateRequest?.getAuthor?.getFirstname,
        email: imageCreateRequest?.getAuthor?.getEmail,
        role: imageCreateRequest?.getAuthor?.getRole?.getName,
      },
    });
    const imageCreateRequestBlob = new Blob([imageCreateRequestJson], {
      type: 'application/json',
    });
    formData.append('imageCreateRequest', imageCreateRequestBlob);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    return this.getHttpClient.post<ImageResponseAPI>(this.apiUrl, formData, {
      headers: headers,
    });
  }

  public updateImage(publicId: string, imageUpdateRequest: ImageUpdateRequest): Observable<ImageResponseAPI> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    const imageUpdateRequestJson: string = JSON.stringify({
      title: imageUpdateRequest.getTitle,
      description: imageUpdateRequest.getDescription,
      visibility: imageUpdateRequest.getVisibility,
      author: {
        public_id: imageUpdateRequest?.getAuthor?.getPublicId,
        lastname: imageUpdateRequest?.getAuthor?.getLastname,
        firstname: imageUpdateRequest?.getAuthor?.getFirstname,
        email: imageUpdateRequest?.getAuthor?.getEmail,
        role: imageUpdateRequest?.getAuthor?.getRole?.getName,
      },
    });
    const imageUpdateRequestBlob = new Blob([imageUpdateRequestJson], {
      type: 'application/json',
    });
    const formData = new FormData();
    const file = imageUpdateRequest.getFile;
    if (file) formData.append('file', file, file.name);
    formData.append('imageUpdateRequest', imageUpdateRequestBlob);
    return this.getHttpClient.put<ImageResponseAPI>(`${this.apiUrl}/${publicId}`, formData, {
      headers: headers,
    });
  }

  public deleteImage(publicId: string): Observable<void> {
    return this.getHttpClient.delete<void>(`${this.apiUrl}/${publicId}`);
  }
}
