import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface RuntimeConfig {
  apiUrl: string;
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RuntimeConfigService {
  private config: RuntimeConfig | null = null;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<RuntimeConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      // Fetch configuration from server endpoint
      this.config = await firstValueFrom(
        this.http.get<RuntimeConfig>('/api/config')
      );
      console.log('Runtime configuration loaded:', this.config);
      return this.config;
    } catch (error) {
      console.error('Failed to load runtime config, using defaults:', error);
      // Fallback to default configuration
      this.config = {
        apiUrl: 'http://localhost:8082/api',
        keycloak: {
          url: 'http://localhost:8082',
          realm: 'bazafirm-customer',
          clientId: 'customer-app-web'
        }
      };
      return this.config;
    }
  }

  getConfig(): RuntimeConfig {
    if (!this.config) {
      throw new Error('Config not loaded. Call loadConfig() first.');
    }
    return this.config;
  }
}
