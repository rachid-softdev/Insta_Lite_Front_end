import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationInterceptor implements HttpInterceptor {
  
  private _isRefreshing = false;

  constructor(private tokenStorageService: TokenStorageService) {}

  // https://angular.io/guide/http-interceptor-use-cases
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service.
    const authToken = this.tokenStorageService.getToken();
    if (authToken == null) {
      return next.handle(req);
    }
    // console.log("AuthenticationInterceptor - token : ", authToken);
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authToken),
      //.set('Content-Type', 'application/json; charset=utf-8')
      //.set('Accept', 'application/json'),
    });
    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}

export const AuthenticationInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
];
