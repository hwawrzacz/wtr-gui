import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { UserCredentials } from '../model/user-credentials';
import { mockUsers, mockCredentials } from '../model/mock-data';
import { SimpleUser } from '../model/simple-user';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class UserRestService extends CommonRestService<SimpleUser> {

  constructor(http: HttpClient) {
    super(http)
    this._mockData = mockUsers[0];
  }

  public getCredentials(userId: string): Observable<UserCredentials> {
    return of(mockCredentials).pipe(delay(1000))
  }
}
