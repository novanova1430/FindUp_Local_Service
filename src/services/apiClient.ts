import { storageService, PlatformSettings } from './storageService';

/**
 * FindUp API Client
 * Seamlessly switches between Client-Side Demo Engine (LocalStorage)
 * and Live Django REST Framework API (http://localhost:8000/api/v1).
 */
class ApiClient {
  public getSettings(): PlatformSettings {
    return storageService.getSettings();
  }

  public isDemoMode(): boolean {
    return this.getSettings().demoMode;
  }

  public getBaseUrl(): string {
    return this.getSettings().djangoApiUrl;
  }

  public async get<T>(endpoint: string): Promise<T> {
    if (this.isDemoMode()) {
      // Simulate minor network latency for realistic feel
      await new Promise((r) => setTimeout(r, 60));
      return this.handleDemoRoute('GET', endpoint);
    }

    const token = localStorage.getItem('fixflow_jwt_access');
    const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  public async post<T>(endpoint: string, body?: any): Promise<T> {
    if (this.isDemoMode()) {
      await new Promise((r) => setTimeout(r, 100));
      return this.handleDemoRoute('POST', endpoint, body);
    }

    const token = localStorage.getItem('fixflow_jwt_access');
    const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  public async patch<T>(endpoint: string, body?: any): Promise<T> {
    if (this.isDemoMode()) {
      await new Promise((r) => setTimeout(r, 80));
      return this.handleDemoRoute('PATCH', endpoint, body);
    }

    const token = localStorage.getItem('fixflow_jwt_access');
    const response = await fetch(`${this.getBaseUrl()}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  }

  // Internal Router for Demo Mode mapped to Django REST API structure
  private handleDemoRoute(method: string, endpoint: string, body?: any): any {
    const cleanPath = endpoint.replace(/^\/api\/v1/, '').replace(/\/$/, '');

    // Categories
    if (cleanPath === '/categories') {
      return storageService.getCategories();
    }

    // Services
    if (cleanPath === '/services') {
      return storageService.getServices();
    }
    if (cleanPath.startsWith('/services/')) {
      const id = cleanPath.split('/')[2];
      return storageService.getServiceById(id);
    }

    // Providers
    if (cleanPath === '/providers') {
      return storageService.getProviders();
    }
    if (cleanPath.startsWith('/providers/')) {
      const id = cleanPath.split('/')[2];
      return storageService.getProviderById(id);
    }

    // Bookings
    if (cleanPath === '/customer/bookings' && method === 'GET') {
      return storageService.getBookings();
    }
    if (cleanPath === '/customer/bookings' && method === 'POST') {
      return storageService.createBooking(body);
    }

    // Fallback directly returns storageService data
    return { status: 'mock_response', message: 'Handled by Local Demo Storage' };
  }
}

export const apiClient = new ApiClient();
