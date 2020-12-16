import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockTasks } from '../model/mock-data';
import { Task } from '../model/task';
import { CommonArrayRestService } from './common-array-rest.service';

@Injectable({
  providedIn: 'root'
})
export class TasksListService extends CommonArrayRestService<Task> {
  constructor(http: HttpClient) {
    super(http, 'tasks', mockTasks);
  }
}
