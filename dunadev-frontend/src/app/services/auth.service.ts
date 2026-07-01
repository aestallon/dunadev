import { Injectable, computed, signal } from '@angular/core';
import { AuthResponse } from '../../api/dunadev';

const ACCESS_TOKEN_KEY = 'dunadev_access_token';
const REFRESH_TOKEN_KEY = 'dunadev_refresh_token';
const ROLE_KEY = 'dunadev_role';
const EXPIRES_AT_KEY = 'dunadev_expires_at';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _accessToken = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));
  private readonly _role = signal<string | null>(localStorage.getItem(ROLE_KEY));

  readonly isLoggedIn = computed(() => !!this._accessToken());
  readonly role = this._role.asReadonly();
  readonly isAdmin = computed(() => this._role() === 'ADMIN');
  readonly isOrganiser = computed(() => this._role() === 'ORGANISER');

  get accessToken(): string | null {
    return this._accessToken();
  }

  get refreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  isAccessTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
    if (!expiresAt) return true;
    // consider expired 30s early to avoid edge cases
    return Date.now() >= Number(expiresAt) - 30_000;
  }

  storeTokens(response: AuthResponse): void {
    const expiresAt = Date.now() + response.expiresIn * 1000;
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(ROLE_KEY, response.role);
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
    this._accessToken.set(response.accessToken);
    this._role.set(response.role);
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
    this._accessToken.set(null);
    this._role.set(null);
  }
}
