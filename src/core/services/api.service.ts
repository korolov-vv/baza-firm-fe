import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Performs a GET request
   */
  get<T>(endpoint: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { params });
  }

  /**
   * Performs a POST request
   */
  post<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body, options);
  }

  /**
   * Performs a PUT request
   */
  put<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, body, options);
  }

  /**
   * Performs a PATCH request
   */
  patch<T>(endpoint: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, body, options);
  }

  /**
   * Performs a DELETE request
   */
  delete<T>(endpoint: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, { params });
  }

  /**
   * Gets the full API URL for a given endpoint
   */
  getFullUrl(endpoint: string): string {
    return `${this.apiUrl}/${endpoint}`;
  }
}
