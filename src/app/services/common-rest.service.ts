import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf, of } from 'rxjs';
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
  public get(query: Query, pagination?: Pagination): Observable<any> {
    try {
      return this.getFromApi(query, pagination);
    } catch {
      return this.getMock(query, pagination);
    }
  }

  public getMock(query: Query, pagination?: Pagination): Observable<any> {
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

  public getFromApi(query: Query, pagination?: Pagination): Observable<CommonArrayResponse<T>> {
    const params = new HttpParams().append('query', JSON.stringify(query)).append('pagination', JSON.stringify(pagination));
    return this._http.get<CommonArrayResponse<T>>(`${environment.apiUrl}/${this.url}`, { params: params });
  }

  public patch<T>(userId: string, name: string, value: T): Observable<any> {
    const url = `${environment.apiUrl}/${this.url}/${userId}`;
    return this._http.patch(url, { [name]: value });
  }
}
