import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockTasks } from '../model/mock-data';
import { Task } from '../model/task';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends CommonRestService<Task> {

  constructor(http: HttpClient) {
    super(http);
    this.url = 'tasks'
    this._mockData = mockTasks[0];
  }
}
