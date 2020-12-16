import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockProjects } from '../model/mock-data';
import { Project } from '../model/project';
import { CommonArrayRestService } from './common-array-rest.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsListService extends CommonArrayRestService<Project> {

  constructor(protected _http: HttpClient) {
    super(_http, 'projects', mockProjects);
  }
}
