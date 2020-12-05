import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EmployeeCredentials } from '../model/employee-credentials';
import { mockEmployees, mockCredentials } from '../model/mock-data';
import { SimpleEmployee } from '../model/simple-employee';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class UserRestService extends CommonRestService<SimpleEmployee> {

  constructor(http: HttpClient) {
    super(http)
    this._mockData = mockEmployees[0];
  }

  public getCredentials(userId: string): Observable<EmployeeCredentials> {
    return of(mockCredentials).pipe(delay(1000))
  }
}
