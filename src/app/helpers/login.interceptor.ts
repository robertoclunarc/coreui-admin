import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
//import { TokenStorageService } from '../_services/token-storage.service';
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor() {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return next.handle(req);
      }
  
      const request = req.clone({
        headers: req.headers.set('auth_token', `${token}`)
      });
  //console.log('*'+token+'*');
      return next.handle(request);
    }
  }

  /*  export class AuthInterceptor implements HttpInterceptor {
    constructor(private token: TokenStorageService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let authReq = req;
        const token = this.token.getToken();
        if (token != null) {
        authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
        }
        return next.handle(authReq);
    }
    }
    */
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
