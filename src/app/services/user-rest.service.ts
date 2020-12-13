import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserCredentials } from '../model/user-credentials';
import { mockUsers, mockCredentials } from '../model/mock-data';
import { SimpleUser } from '../model/simple-user';
import { CommonRestService } from './common-rest.service';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserRestService extends CommonRestService<SimpleUser> {
  private readonly _credentialsUrl = 'users/credentials';

  constructor(http: HttpClient) {
    super(http)
    this.url = 'users';
    this._mockData = mockUsers[0];
  }

  public getCredentials(userId: string): Observable<UserCredentials> {
    return this._http.get<UserCredentials>(`${environment.apiUrl}/${this._credentialsUrl}/${userId}`);
  }

  public updatePhoto(user: User): Observable<any> {
    return this._http.post(this.url, user);
  }
}
