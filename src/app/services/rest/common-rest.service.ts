import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pagination } from '../../model/pagination';
import { Query } from '../../model/query';
import { CommonResponse, PatchResponse, SingleItemResponse } from '../../model/responses';

@Injectable({
  providedIn: 'root'
})
export class CommonRestService<T> {
  protected _url: string;
  protected _deleteUrl: string;

  constructor(
    protected _http: HttpClient,
    @Inject('url') url: string,
    @Inject('deleteUrl') deleteUrl: string,
  ) {
    this._url = url;
    this._deleteUrl = deleteUrl;
  }

  public get(itemId: string): Observable<SingleItemResponse<T>> {
    const url = `${environment.apiUrl}/${this._url}/${itemId}`;
    return this._http.get<SingleItemResponse<T>>(url);
  }

  public find(query?: Query, pagination?: Pagination): Observable<T> {
    const params = !!query
      ? new HttpParams().append('query', JSON.stringify(query)).append('pagination', JSON.stringify(pagination))
      : new HttpParams().append('pagination', JSON.stringify(pagination));
    const url = `${environment.apiUrl}/${this._url}`;
    return this._http.get<T>(url, { params: params });
  }

  public create<T>(item: T): Observable<PatchResponse> {
    const url = `${environment.apiUrl}/${this._url}`;
    return this._http.post<PatchResponse>(url, item);
  }

  public patch<T>(itemId: string, name: string, value: T): Observable<any> {
    const url = `${environment.apiUrl}/${this._url}/${itemId}`;
    return this._http.patch(url, { [name]: value });
  }

  public patchObject<T>(itemId: string, object: T): Observable<any> {
    const url = `${environment.apiUrl}/${this._url}/${itemId}`;
    return this._http.patch(url, object);
  }

  public delete(itemId: string): Observable<CommonResponse<any, any>> {
    return this._http.patch<CommonResponse<any, any>>(`${environment.apiUrl}/${this._deleteUrl}/${itemId}`, null);
  }
}
