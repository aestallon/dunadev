import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FRONTEND_VERSION } from '../../environments/version.generated';

interface VersionResponse {
  version: string;
  buildTime: string;
}

@Injectable({ providedIn: 'root' })
export class VersionService {
  private readonly http = inject(HttpClient);

  readonly frontendVersion: string = FRONTEND_VERSION;
  readonly backendVersion = signal<string | null>(null);

  constructor() {
    this.http.get<VersionResponse>('/api/version').subscribe({
      next: ({ version }) => this.backendVersion.set(version),
      error: () => this.backendVersion.set(null),
    });
  }
}
