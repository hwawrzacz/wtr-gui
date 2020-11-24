import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Query } from '../model/query';

@Injectable({
  providedIn: 'root'
})
export class CommonRestService<T> {
  protected url: string;
  protected _mockData: any;
  constructor(protected http: HttpClient) { }

  // TODO (HW): Remove any type annotation - it is just for testing purposes. Target anotation is T.
  // TODO (HW): Add common request
  public get(query: Query): Observable<any> {
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
            (item.lastName && item.lastName.includes(searchString))
          );
        })
    ).pipe(delay(2000));
  }
}
