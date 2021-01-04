import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ArrayResponse } from 'src/app/model/responses';
import { CommonArrayResponse } from '../../model/common-array-response';
import { CommonRestService } from './common-rest.service';


@Injectable({
  providedIn: 'root'
})
export class CommonListRestService<T> extends CommonRestService<ArrayResponse<T>> {
  constructor(
    http: HttpClient,
    @Inject('url') url: string,
    @Inject('deleteUrl') deleteUrl: string,
  ) {
    super(http, url, deleteUrl);
  }
}
