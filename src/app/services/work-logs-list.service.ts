import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mockWorkLogs } from '../model/mock-data';
import { WorkLog } from '../model/work-log';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class WorkLogsListService extends CommonRestService<WorkLog[]> {

  constructor(http: HttpClient) {
    super(http);
    this._mockData = mockWorkLogs;
  }
}
