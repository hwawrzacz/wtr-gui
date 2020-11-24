import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../model/employee';
import { mockEmployees } from '../model/mock-data';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeesRestService extends CommonRestService<Employee[]> {

  constructor(http: HttpClient) {
    super(http);
    this._mockData = mockEmployees;
    this.url = 'http://someurladdress.com/projects'
  }
}
