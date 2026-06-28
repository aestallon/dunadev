import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthenticationService } from '../../api/dunadev';
import { catchError, switchMap, throwError } from 'rxjs';

let refreshInProgress: ReturnType<typeof import('rxjs')['Observable']['prototype']['subscribe']> | null = null;
let refreshResult: import('rxjs').Observable<any> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authApi = inject(AuthenticationService);

  // Don't attach tokens to auth endpoints
  if (req.url.includes('/api/auth/')) {
    return next(req);
  }

  const token = authService.accessToken;
  if (!token) {
    return next(req);
  }

  // If access token is not expired, attach it directly
  if (!authService.isAccessTokenExpired()) {
    return next(addToken(req, token)).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return handleRefresh(req, next, authService, authApi);
        }
        return throwError(() => error);
      }),
    );
  }

  // Token expired — try refresh before sending
  return handleRefresh(req, next, authService, authApi);
};

function addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function handleRefresh(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService,
  authApi: AuthenticationService,
): import('rxjs').Observable<any> {
  const refreshToken = authService.refreshToken;
  if (!refreshToken) {
    authService.logout();
    return throwError(() => new Error('No refresh token'));
  }

  return authApi.refreshToken({ refreshToken }).pipe(
    switchMap((response) => {
      authService.storeTokens(response);
      return next(addToken(req, response.accessToken));
    }),
    catchError((error) => {
      authService.logout();
      return throwError(() => error);
    }),
  );
}
