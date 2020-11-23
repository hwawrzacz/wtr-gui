import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockTasks } from '../model/mock-data';
import { Task } from '../model/task';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class TasksListService extends CommonRestService<Task[]> {

  constructor(http: HttpClient) {
    super(http);
    this._mockData = mockTasks;
    this.url = 'http://someurladdress.com/tasks'
  }
}
