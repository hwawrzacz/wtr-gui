import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pagination } from '../model/pagination';
import { Query } from '../model/query';
import { CommonArrayResponse } from './common-array-response';
import { CommonRestService } from './common-rest.service';


@Injectable({
  providedIn: 'root'
})
export class CommonArrayRestService<T> extends CommonRestService<CommonArrayResponse<T[]>> {
  @Injectable({
    providedIn: 'root'
  })
  protected url: string;
  protected _mockData: any;
  constructor(protected _http: HttpClient) {
    super(_http);
  }
}
