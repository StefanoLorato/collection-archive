import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorFn } from './components/interceptor/AuthInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      CommonModule,
      FormsModule
    ),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptorFn])),
  ],
};
