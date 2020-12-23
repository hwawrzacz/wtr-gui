import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { mockWorkLogs } from '../../model/mock-data';
import { WorkLog, WorkLogType } from '../../model/work-log';
import { CommonListRestService } from './common-list-rest.service';

@Injectable({
  providedIn: 'root'
})
export class WorkLogsListRestService extends CommonListRestService<WorkLog> {

  constructor(http: HttpClient) {
    super(http, 'work-logs', mockWorkLogs);
  }

  public startWork(): Observable<boolean> {
    mockWorkLogs.items[mockWorkLogs.items.length - 1].type = WorkLogType.WORK;
    return of(true).pipe(delay(1000));
  }

  public startBreak(): Observable<boolean> {
    mockWorkLogs.items[mockWorkLogs.items.length - 1].type = WorkLogType.BREAK;
    return of(true).pipe(delay(1000));
  }

  public closeTask(): Observable<boolean> {
    mockWorkLogs.items[mockWorkLogs.items.length - 1].type = WorkLogType.CLOSE;
    return of(true).pipe(delay(1000));
  }
}
