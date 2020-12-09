import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';
import { mockUsers } from '../model/mock-data';
import { Query } from '../model/query';
import { SimpleUser } from '../model/simple-user';
import { CommonArrayResponse } from './common-array-response';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class UsersRestService extends CommonRestService<User[]> {

  constructor(http: HttpClient) {
    super(http);
    this._mockData = mockUsers;
    this.url = 'users'
  }

  // TODO: Add this function to generic service, when other endpoints are ready

  public getFromApi(query: Query): Observable<CommonArrayResponse<SimpleUser[]>> {
    return this.http.get<CommonArrayResponse<SimpleUser[]>>(`${environment.apiUrl}/${this.url}`);
  }
}
