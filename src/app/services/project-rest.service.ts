import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockProjects } from '../model/mock-data';
import { Project } from '../model/project';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectRestService extends CommonRestService<Project> {

  constructor(http: HttpClient) {
    super(http);
    this._mockData = mockProjects[0];
  }

  //TODO (HW): Will tasks be got from project endpoint, or filtered from task endpoint
}
