import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../model/project';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsListService extends CommonRestService<Project[]> {
  constructor(protected http: HttpClient) {
    super(http);
    this.url = 'http://someurladdress.com/projects'
  }
}
