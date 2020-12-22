import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonResponse, CreationResponse } from '../model/responses';
import { Pagination } from '../model/pagination';
import { Query } from '../model/query';
import { CommonArrayResponse } from './common-array-response';

@Injectable({
  providedIn: 'root'
})
export class CommonRestService<T> {
  protected _url: string;
  protected _mockData: any;

  constructor(
    protected _http: HttpClient,
    @Inject('url') url: string,
    @Inject('mockData') mockData: T
  ) {
    this._url = url;
    this._mockData = mockData;
  }

  public get(itemId: string): Observable<T> {
    return this.getFromApi(itemId);
  }

  public getFromApi(itemId: string): Observable<T> {
    const url = `${environment.apiUrl}/${this._url}/${itemId}`;
    return this._http.get<T>(url);
  }

  public find(query: Query, pagination?: Pagination): Observable<any> {
    try {
      return this.findInApi(query, pagination);
    } catch {
      return this.findMock(query, pagination);
    }
  }

  public findMock(query: Query, pagination?: Pagination): Observable<any> {
    const searchString = query.searchString
    return of(
      this._mockData
        .filter(item => {
          return (
            // In case of Project or Task object
            (item.stringId && item.stringId.includes(searchString)) ||
            (item.title && item.title.includes(searchString)) ||
            (item.description && item.description.includes(searchString)) ||

            // In case of Empoyee object
            (item.login && item.login.includes(searchString)) ||
            (item.firstName && item.firstName.includes(searchString)) ||
            (item.lastName && item.lastName.includes(searchString)) ||

            // In casae of WorkLog object
            (item.taskId)
          );
        })
    ).pipe(delay(500));
  }

  public findInApi(query: Query, pagination?: Pagination): Observable<CommonArrayResponse<T>> {
    const params = new HttpParams().append('query', JSON.stringify(query)).append('pagination', JSON.stringify(pagination));
    const url = `${environment.apiUrl}/${this._url}`;
    return this._http.get<CommonArrayResponse<T>>(url, { params: params });
  }

  public create<T>(item: T): Observable<CreationResponse | boolean> {
    const url = `${environment.apiUrl}/${this._url}`;
    return this._http.post<CreationResponse | boolean>(url, item);
  }

  public patch<T>(userId: string, name: string, value: T): Observable<any> {
    const url = `${environment.apiUrl}/${this._url}/${userId}`;
    return this._http.patch(url, { [name]: value });
  }

  public delete(userId: string): Observable<CommonResponse<any>> {
    return this.patch(userId, 'active', false);
  }
}
