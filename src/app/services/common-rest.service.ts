import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pagination } from '../model/pagination';
import { Query } from '../model/query';
import { CommonArrayResponse } from './common-array-response';

@Injectable({
  providedIn: 'root'
})
export class CommonRestService<T> {
  protected url: string;
  protected _mockData: any;
  constructor(protected _http: HttpClient) {
    this.url = '';
    this._mockData = [];
  }

  // TODO (HW): Remove any type annotation - it is just for testing purposes. Target anotation is T.
  // TODO (HW): Add common request
  public get(id: string): Observable<T> {
    return this.getFromApi(id);
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
    const url = `${environment.apiUrl}/${this.url}`;
    console.log('API', url);
    return this._http.get<CommonArrayResponse<T>>(url, { params: params });
  }

  public getFromApi(itemId: string): Observable<T> {
    const url = `${environment.apiUrl}/${this.url}/${itemId}`;
    console.log('API', url);
    return this._http.get<T>(url);
  }

  public patch<T>(userId: string, name: string, value: T): Observable<any> {
    const url = `${environment.apiUrl}/${this.url}/${userId}`;
    return this._http.patch(url, { [name]: value });
  }
}
