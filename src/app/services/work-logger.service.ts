import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter } from '../model/filter';
import { mockWorkLogs } from '../model/mock-data';
import { Query } from '../model/query';
import { CreationResponse } from '../model/responses';
import { WorkLog, WorkLogType } from '../model/work-log';
import { CommonRestService } from './rest/common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class WorkLoggerService extends CommonRestService<WorkLog> {

  constructor(http: HttpClient) {
    super(http, 'workloger/add', mockWorkLogs[0]);
  }

  //#region Operators
  public startWork(taskId: string): Observable<CreationResponse> {
    const body = this.createWorkLogObject(taskId, WorkLogType.WORK);
    return this.create<WorkLog>(body);
  }

  public startBreak(taskId: string): Observable<CreationResponse> {
    const body = this.createWorkLogObject(taskId, WorkLogType.BREAK);
    return this.create<WorkLog>(body);
  }

  public closeTask(taskId: string): Observable<CreationResponse> {
    const body = this.createWorkLogObject(taskId, WorkLogType.CLOSE);
    return this.create<WorkLog>(body);
  }
  //#endregion

  //#region Helpers
  private createWorkLogObject(taskId: string, workLogType: WorkLogType): WorkLog {
    // TODO: Get userId from login service when available
    const userId = '5fe1ca5095fd3b00045a45e8';
    return {
      idUser: taskId,
      idTask: userId,
      logType: workLogType
    } as WorkLog
  }
  //#endregion
}
