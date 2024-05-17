import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {
  URLBASE: string = environment.URLAPI;
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  get headers() {
    return { Authorization: `Bearer ${this.storageService.getToken()}` };
  }

  get(url: string, params?: any): Observable<any> {
    return this.http.get<any>(`${this.URLBASE}/${url}`, {
      params: params,
    });
  }

  getWithHeaders(url: string, params?: any, headers?: any, otherOptions?: any): Observable<any> {
    return this.http.get<any>(`${this.URLBASE}/${url}`, {
      ...(otherOptions ?? {}),
      params: params,
      headers: new HttpHeaders({
        ...headers,
        Authorization: `Bearer ${this.storageService.getToken()}`,
      }),
    });
  }

  getObserve(url: string, params?: any): Observable<any> {
    return this.http.get<any>(`${this.URLBASE}/${url}`, {
      params: params,
      observe: "response",
    });
  }

  post(url: string, payload: any, params?: any): Observable<any> {
    return this.http.post<any>(`${this.URLBASE}/${url}`, payload, {
      params: params,
    });
  }

  postWithHeaders(
    url: string,
    payload: any,
    params?: any,
    headers?: any
  ): Observable<any> {
    return this.http.post<any>(`${this.URLBASE}/${url}`, payload, {
      params: params,
      headers: new HttpHeaders({
        ...headers,
        Authorization: `Bearer ${this.storageService.getToken()}`,
      }),
    });
  }

  postWithoutToken(url: string, payload: any, headers?: any): Observable<any> {
    return this.http.post<any>(`${this.URLBASE}/${url}`, payload, {
      headers: new HttpHeaders({
        ...headers,
      }),
    });
  }

  postObserve(url: string, payload: any, params?: any): Observable<any> {
    return this.http.post<any>(`${this.URLBASE}/${url}`, payload, {
      params: params,
      observe: "response",
    });
  }

  patch(url: string, payload: any, params?: any): Observable<any> {
    return this.http.patch<any>(`${this.URLBASE}/${url}`, payload, {
      params: params,
    });
  }

  put(url: string, payload: any, params?: any): Observable<any> {
    return this.http.put<any>(`${this.URLBASE}/${url}`, payload, {
      params: params,
    });
  }

  putWithHeaders(
    url: string,
    payload: any,
    params?: any,
    headers?: any
  ): Observable<any> {
    return this.http.put<any>(`${this.URLBASE}/${url}`, payload, {
      params: params,
      headers: new HttpHeaders({
        ...headers,
        Authorization: `Bearer ${this.storageService.getToken()}`,
      }),
    });
  }

  delete(url: string, params?: any, body?: any): Observable<any> {
    return this.http.delete<any>(`${this.URLBASE}/${url}`, {
      params: params,
    });
  }

  deleteWithHeaders(
    url: string,
    params?: any,
    body?: any,
    headers?: any
  ): Observable<any> {
    return this.http.delete<any>(`${this.URLBASE}/${url}`, {
      params: params,
      body: body,
      headers: new HttpHeaders({
        ...headers,
        Authorization: `Bearer ${this.storageService.getToken()}`,
      }),
    });
  }
}
