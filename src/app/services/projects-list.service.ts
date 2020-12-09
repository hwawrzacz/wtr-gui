import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockProjects } from '../model/mock-data';
import { Project } from '../model/project';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsListService extends CommonRestService<Project[]> {

  constructor(protected _http: HttpClient) {
    super(_http);
    this._mockData = mockProjects;
    this.url = 'http://someurladdress.com/projects'
  }
}
