import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employee } from '../model/employee';
import { mockEmployees } from '../model/mock-data';
import { Query } from '../model/query';
import { SimpleEmployee } from '../model/simple-employee';
import { CommonArrayResponse } from './common-array-response';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeesRestService extends CommonRestService<Employee[]> {

  constructor(http: HttpClient) {
    super(http);
    this._mockData = mockEmployees;
    this.url = 'users'
  }

  // TODO: Add this function to generic service, when other endpoints are ready

  public getFromApi(query: Query): Observable<CommonArrayResponse<SimpleEmployee[]>> {
    return this.http.get<CommonArrayResponse<SimpleEmployee[]>>(`${environment.apiUrl}/${this.url}`);
  }
}
