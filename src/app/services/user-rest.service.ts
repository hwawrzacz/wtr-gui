import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mockUsers } from '../model/mock-data';
import { SimpleUser } from '../model/simple-user';
import { User } from '../model/user';
import { UserCredentials } from '../model/user-credentials';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class UserRestService extends CommonRestService<User> {
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
