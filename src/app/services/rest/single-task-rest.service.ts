import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../../model/task';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class SingleTaskRestService extends CommonRestService<Task> {

  constructor(http: HttpClient) {
    super(http, 'tasks', 'tasks/deactivate');
  }
}
