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
        .filter(project => {
          return (
            (project.stringId && project.stringId.includes(searchString)) ||
            (project.title && project.title.includes(searchString)) ||
            (project.description && project.description.includes(searchString))
          );
        })
    ).pipe(delay(2000));
  }
}
