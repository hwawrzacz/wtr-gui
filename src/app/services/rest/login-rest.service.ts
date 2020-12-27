import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonResponse } from 'src/app/model/responses';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRestService extends CommonRestService<User> {

  constructor(http: HttpClient) {
    super(http, 'authentication');
  }

  public logIn(login: string, password: string): Observable<CommonResponse<any, User>> {
    const credentials = {
      login: login,
      password: password
    };

    return this._http.post<CommonResponse<any, User>>(`${environment.apiUrl}/${this._url}`, credentials);
  }

  public logOut(): Observable<CommonResponse<any, any>> {
    return this._http.get<CommonResponse<any, User>>(`${environment.apiUrl}/${this._url}/logout`);
  }
}
