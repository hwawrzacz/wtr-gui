import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Filter } from '../model/filter';
import { Pagination } from '../model/pagination';

export enum Method {
  GET = 'get',
  DELETE = 'delete',
  PUT = 'put',
  POST = 'post',
  PATCH = 'patch'
}

@Injectable({
  providedIn: 'root'
})
export class CommonRestService<T> {
  protected url: string;
  constructor(protected http: HttpClient) { }

  protected get(query: string, pagination?: Pagination, filters?: Filter[]): Observable<T> {
    return of({} as T);
  }
}
