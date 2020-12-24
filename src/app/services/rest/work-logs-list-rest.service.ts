import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
