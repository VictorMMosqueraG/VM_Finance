import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_PREFIX, type HealthResponse } from '@vm-finance/shared';
import type { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly http = inject(HttpClient);

  /** En desarrollo `/api` pasa por el proxy de `ng serve` hacia http://localhost:3000. */
  check(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`/${API_PREFIX}/health`);
  }
}
