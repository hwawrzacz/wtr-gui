import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockProjects } from '../../model/mock-data';
import { Project } from '../../model/project';
import { CommonListRestService } from './common-list-rest.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsListRestService extends CommonListRestService<Project> {

  constructor(protected _http: HttpClient) {
    super(_http, 'projects', mockProjects);
  }
}
