import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockUsers } from '../model/mock-data';
import { User } from '../model/user';
import { CommonArrayRestService } from './common-array-rest.service';

@Injectable({
  providedIn: 'root'
})
export class UsersListService extends CommonArrayRestService<User> {
  constructor(http: HttpClient) {
    super(http, 'users', mockUsers);
  }
}
