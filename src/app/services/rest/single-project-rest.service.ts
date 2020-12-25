import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../../model/project';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class SingleProjectRestService extends CommonRestService<Project> {

  constructor(http: HttpClient) {
    super(http, 'projects');
  }
}
