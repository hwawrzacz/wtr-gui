import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockUsers } from '../../model/mock-data';
import { User } from '../../model/user';
import { CommonListRestService } from './common-list-rest.service';

@Injectable({
  providedIn: 'root'
})
export class UsersListRestService extends CommonListRestService<User> {
  constructor(http: HttpClient) {
    super(http, 'users', mockUsers);
  }
}
