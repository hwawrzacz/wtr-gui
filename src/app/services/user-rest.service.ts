import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockEmployees } from '../model/mock-data';
import { SimpleEmployee } from '../model/simple-employee';
import { CommonRestService } from './common-rest.service';
import { CommonSingleItemRestService } from './common-single-item-rest.service';

@Injectable({
  providedIn: 'root'
})
export class UserRestService extends CommonRestService<SimpleEmployee> {

  constructor(http: HttpClient) {
    super(http)
    this._mockData = mockEmployees[0];
  }
}
