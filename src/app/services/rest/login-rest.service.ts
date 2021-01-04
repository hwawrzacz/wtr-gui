import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonResponse } from 'src/app/model/responses';
import { User } from 'src/app/model/user';
import { UserCredentials } from 'src/app/model/user-credentials';
import { environment } from 'src/environments/environment';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRestService extends CommonRestService<User> {

  constructor(http: HttpClient) {
    super(http, 'authentication', '');
  }

  public logIn(login: string, password: string): Observable<HttpResponse<CommonResponse<any, User>>> {
    const credentials = {
      login: login,
      password: password
    };

    return this._http.post<CommonResponse<any, User>>(`${environment.apiUrl}/${this._url}/credentialsAuth`, credentials, { observe: 'response' });
  }

  public faceLogIn(imageUrl: string): Observable<HttpResponse<CommonResponse<any, User>>> {
    const credentials = {
      facePhoto: imageUrl
    } as UserCredentials;

    return this._http.post<CommonResponse<any, User>>(`${environment.apiUrl}/${this._url}/faceAuth`, credentials, { observe: 'response' });
  }

  public logOut(): Observable<CommonResponse<any, any>> {
    return this._http.get<CommonResponse<any, User>>(`${environment.apiUrl}/${this._url}/logout`);
  }
}
