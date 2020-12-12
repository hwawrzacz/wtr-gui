import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Pagination } from '../model/pagination';
import { Query } from '../model/query';

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
    const searchString = query.searchString
    return this._mockData.hasOwnProperty('length') ?
      of(
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
      ).pipe(delay(2000))
      : of(this._mockData).pipe(delay(2000));
  }
}
