import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CommonArrayResponse } from '../../model/common-array-response';
import { CommonRestService } from './common-rest.service';


@Injectable({
  providedIn: 'root'
})
export class CommonListRestService<T> extends CommonRestService<CommonArrayResponse<T>> {
  constructor(
    http: HttpClient,
    @Inject('url') url: string,
    @Inject('mockData') mockData: CommonArrayResponse<T>
  ) {
    super(http, url, mockData);
  }
}
