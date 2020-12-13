import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';
import { mockUsers } from '../model/mock-data';
import { Query } from '../model/query';
import { SimpleUser } from '../model/simple-user';
import { CommonArrayResponse } from './common-array-response';
import { CommonRestService } from './common-rest.service';
import { Pagination } from '../model/pagination';
import { CommonArrayRestService } from './common-array-rest.service';

@Injectable({
  providedIn: 'root'
})
export class UsersRestService extends CommonArrayRestService<User> {
  constructor(http: HttpClient) {
    super(http);
    this._mockData = mockUsers;
    this.url = 'users'
  }
}
