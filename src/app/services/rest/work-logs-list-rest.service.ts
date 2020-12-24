import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Query } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonArrayResponse } from 'src/app/model/common-array-response';
import { Pagination } from 'src/app/model/pagination';
import { environment } from 'src/environments/environment';
import { mockWorkLogs } from '../../model/mock-data';
import { WorkLog } from '../../model/work-log';
import { CommonListRestService } from './common-list-rest.service';

@Injectable({
  providedIn: 'root'
})
export class WorkLogsListRestService extends CommonListRestService<WorkLog> {
  constructor(http: HttpClient) {
    super(http, 'workloger', mockWorkLogs);
  }
}
