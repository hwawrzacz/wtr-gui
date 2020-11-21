import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
import { Filter } from '../model/filter';
import { Pagination } from '../model/pagination';
import { Project } from '../model/project';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectsListService extends CommonRestService<Project> {

  constructor(protected http: HttpClient) {
    super(http);
  }

  public getProjects(query: string, pagination?: Pagination, filters?: Filter[]): Observable<Project> {
    return this.get(query, pagination, filters);
  }
}
