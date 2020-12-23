import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { mockWorkLogs } from '../../model/mock-data';
import { WorkLog, WorkLogType } from '../../model/work-log';
import { CommonListRestService } from './common-list-rest.service';

@Injectable({
  providedIn: 'root'
})
export class WorkLogsListRestService extends CommonListRestService<WorkLog> {

  constructor(http: HttpClient) {
    super(http, 'workloger', mockWorkLogs);
  }

  public startWork(userId: string, taskId: string): Observable<boolean> {
    const body = {
      taskId: taskId,
      userId: userId,
      type: WorkLogType.WORK
    } as WorkLog;
    const url = `${environment.apiUrl}/${this._url}`;
    return this._http.post<any>(url, body);
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
