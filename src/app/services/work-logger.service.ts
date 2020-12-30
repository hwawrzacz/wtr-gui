import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatchResponse } from '../model/responses';
import { WorkLog, WorkLogType } from '../model/work-log';
import { AuthService } from './auth.service';
import { CommonRestService } from './rest/common-rest.service';

@Injectable({
  providedIn: 'root'
})
export class WorkLoggerService extends CommonRestService<WorkLog> {

  constructor(http: HttpClient, private _authService: AuthService) {
    super(http, 'workloger/add');
  }

  //#region Operators
  public startWork(taskId: string): Observable<PatchResponse> {
    const body = this.createWorkLogObject(taskId, WorkLogType.WORK);
    return this.create<WorkLog>(body);
  }

  public startBreak(taskId: string): Observable<PatchResponse> {
    const body = this.createWorkLogObject(taskId, WorkLogType.BREAK);
    return this.create<WorkLog>(body);
  }

  public closeTask(taskId: string): Observable<PatchResponse> {
    const body = this.createWorkLogObject(taskId, WorkLogType.CLOSE);
    return this.create<WorkLog>(body);
  }
  //#endregion

  //#region Helpers
  private createWorkLogObject(taskId: string, workLogType: WorkLogType): WorkLog {
    // TODO: Get userId from login service when available
    const userId = this._authService.user._id;
    return {
      idTask: taskId,
      idUser: userId,
      logType: workLogType,
    } as WorkLog
  }
  //#endregion
}
