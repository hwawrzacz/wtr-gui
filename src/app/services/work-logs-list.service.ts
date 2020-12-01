import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { mockWorkLogs } from '../model/mock-data';
import { WorkLog, WorkLogType } from '../model/work-log';
import { CommonRestService } from './common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class WorkLogsListService extends CommonRestService<WorkLog[]> {

  constructor(http: HttpClient) {
    super(http);
    this._mockData = mockWorkLogs;
  }

  public startWork(): Observable<boolean> {
    mockWorkLogs[mockWorkLogs.length - 1].type = WorkLogType.WORK;
    return of(true).pipe(delay(1000));
  }

  public startBreak(): Observable<boolean> {
    mockWorkLogs[mockWorkLogs.length - 1].type = WorkLogType.BREAK;
    return of(true).pipe(delay(1000));
  }

  public closeTask(): Observable<boolean> {
    mockWorkLogs[mockWorkLogs.length - 1].type = WorkLogType.CLOSE;
    return of(true).pipe(delay(1000));
  }
}
