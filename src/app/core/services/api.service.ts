import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from '../../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';

export interface HttpRequestOptions {
  headers?: HttpHeaders
  context?: HttpContext | undefined
  observe?: 'body' | undefined
  params?: HttpParams | undefined
  reportProgress?: boolean | undefined
  responseType: 'arraybuffer'
  withCredentials?: boolean | undefined
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly baseUrl: string = environment.api.baseUrl;

  constructor (private http: HttpClient) {
  }

  doGetRequest<T> (url: string, options: HttpRequestOptions): Promise<T> {
    const request: Observable<Object> = this.http.get(this.baseUrl + url, options)
    return firstValueFrom(request) as Promise<T>
  }

  doPostRequest<T> (url: string, body: object | FormData, headers?: HttpHeaders, params?: HttpParams): Promise<T> {
    const request: Observable<Object> = this.http.post(this.baseUrl + url, body, {
      params,
      headers,
      withCredentials: true
    })
    return firstValueFrom(request) as Promise<T>
  }

  doPatchRequest<T> (url: string, body: object | FormData, headers?: HttpHeaders, params?: HttpParams): Promise<T> {
    const request: Observable<Object> = this.http.patch(this.baseUrl + url, body, {
      params,
      headers,
      withCredentials: true
    })
    return firstValueFrom(request) as Promise<T>
  }

  doDeleteRequest (url: string, body: object, headers?: HttpHeaders, params?: HttpParams): Promise<Object> {
    const request: Observable<Object> = this.http.delete(this.baseUrl + url, {
      params,
      body,
      headers,
      withCredentials: true
    })
    return firstValueFrom(request)
  }
}
