import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../../model/task';
import { CommonListRestService } from './common-list-rest.service';

@Injectable({
  providedIn: 'root'
})
export class TasksListRestService extends CommonListRestService<Task> {
  constructor(http: HttpClient) {
    super(http, 'tasks', 'tasks/deactivate');
  }
}
