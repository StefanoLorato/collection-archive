// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
// import { AuthService } from '../../service/authService';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor(private authService: AuthService) {}
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log('AuthInterceptor intercept chiamato');
//     const token = this.authService.getToken();
//     console.log('TOKEN NELL\'INTERCEPTOR:', token);
//     if (token) {
//       const authReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       console.log('RICHIESTA CON TOKEN:', authReq);
//       return next.handle(authReq);
//     }
//     console.log('NESSUN TOKEN - richiesta originale');
//     return next.handle(req);
//   }
// }

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../service/authService';
import { Router } from '@angular/router';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const router = inject(Router)

  if (req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register')) {
    return next(req);
  }

  const authReq = token ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    }) : req;

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.status);
        console.log(error.status === 401);

        if(error.status === 401 || error.status === 403){
          authService.logout();
          router.navigate(['/login']);
          return throwError(() => "errore nell'autenticazione. Ruolo invalido o sessione scaduta")
        };
        return throwError(() => error);
      })
    );
};
