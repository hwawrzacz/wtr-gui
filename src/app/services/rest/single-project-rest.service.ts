import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockProjects } from '../../model/mock-data';
import { Project } from '../../model/project';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class SingleProjectRestService extends CommonRestService<Project> {

  constructor(http: HttpClient) {
    super(http, 'projects', mockProjects[0]);
  }
}
