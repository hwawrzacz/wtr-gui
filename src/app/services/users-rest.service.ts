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

  public getFromApi(query: Query, pagination?: Pagination): Observable<CommonArrayResponse<SimpleUser[]>> {
    const params = new HttpParams().append('query', JSON.stringify(query)).append('pagination', JSON.stringify(pagination));
    const headers = new HttpHeaders().append

    console.log(JSON.stringify(query))
    console.log(params);
    console.log(params.get('query'));
    console.log(params.get('pagination'));

    return this._http.get<CommonArrayResponse<SimpleUser[]>>(`${environment.apiUrl}/${this.url}`, { params: params });
  }
}
