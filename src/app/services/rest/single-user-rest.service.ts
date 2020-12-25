import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../model/user';
import { UserCredentials } from '../../model/user-credentials';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class SingleUserRestService extends CommonRestService<User> {
  private readonly _credentialsUrl = 'users/credentials';

  constructor(http: HttpClient) {
    super(http, 'users');
  }

  public getCredentials(userId: string): Observable<UserCredentials> {
    return this._http.get<UserCredentials>(`${environment.apiUrl}/${this._credentialsUrl}/${userId}`);
  }

  public updatePhoto(user: User): Observable<any> {
    return this._http.post(this._url, user);
  }
}
