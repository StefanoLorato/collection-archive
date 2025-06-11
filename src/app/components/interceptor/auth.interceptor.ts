// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/authService';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor intercept chiamato');
    const token = this.authService.getToken();
    console.log('TOKEN NELL\'INTERCEPTOR:', token);
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('RICHIESTA CON TOKEN:', authReq);
      return next.handle(authReq);
    }
    console.log('NESSUN TOKEN - richiesta originale');
    return next.handle(req);
  }
}
