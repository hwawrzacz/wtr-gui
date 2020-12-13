import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { Filter } from '../model/filter';
import { Query } from '../model/query';
import { WorkLog, WorkLogType } from '../model/work-log';
import { WorkLogsListService } from './work-logs-list.service';

@Injectable({
  providedIn: 'root'
})
export class WorkLoggerService {
  private readonly USER_ID = 2;
  private _lastWorkLog: WorkLog;
  private _loadingCounter: number;

  //#region Getters and setters
  get isLoading(): boolean {
    return this._loadingCounter > 0;
  }

  get lastWorkLog(): WorkLog {
    return this._lastWorkLog;
  }

  get isWorking(): boolean {
    return this._lastWorkLog.type === WorkLogType.WORK;
  }

  get isPaused(): boolean {
    return [WorkLogType.BREAK, WorkLogType.AUTOBREAK].includes(this._lastWorkLog.type);
  }

  get isClosed(): boolean {
    return this._lastWorkLog.type === WorkLogType.CLOSE;
  }
  //#endregion

  constructor(private _restService: WorkLogsListService) {
    this._loadingCounter = 0;
    this.getLastWorkLog();
  }

  private getLastWorkLog(): void {
    this._loadingCounter++;
    const filter = { name: 'userId', values: [`${this.USER_ID}`] } as Filter;
    const query = { searchString: '', filters: [] } as Query;
    this._restService.find(query)
      .pipe(
        take(1),
        tap((result: WorkLog[]) => {
          console.log(result);
          this._loadingCounter--;
          if (result) {
            this._lastWorkLog = result[result.length - 1];
          }
        })
      ).subscribe();
  }

  //#region Operators
  public startWork(): void {
    console.log('start work');

    this._loadingCounter++;
    console.log(this.isLoading)
    this._restService.startWork().pipe(
      take(1),
      tap(() => {
        this._loadingCounter--;
        this.getLastWorkLog()
      })
    ).subscribe();
  }

  public startBreak(): void {
    this._loadingCounter++;
    this._restService.startBreak().pipe(
      take(1),
      tap(() => {
        this._loadingCounter--;
        this.getLastWorkLog()
      })
    ).subscribe();
  }

  public closeTask(): void {
    this._loadingCounter++;
    this._restService.closeTask().pipe(
      take(1),
      tap(() => {
        this._loadingCounter--;
        this.getLastWorkLog()
      })
    ).subscribe();
  }
  //#endregion
}
