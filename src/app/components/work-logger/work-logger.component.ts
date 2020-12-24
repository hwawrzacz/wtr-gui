import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { USER_ID_MOCK } from 'src/app/model/constants';
import { Filter } from 'src/app/model/filter';
import { Pagination } from 'src/app/model/pagination';
import { CommonResponse, CreationResponse } from 'src/app/model/responses';
import { WorkLog, WorkLogType } from 'src/app/model/work-log';
import { WorkLogsListRestService } from 'src/app/services/rest/work-logs-list-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { WorkLoggerService } from 'src/app/services/work-logger.service';

@Component({
  selector: 'app-work-logger',
  templateUrl: './work-logger.component.html',
  styleUrls: ['./work-logger.component.scss']
})
export class WorkLoggerComponent implements OnInit {
  private _taskId: string;
  private _lastWorkLog: WorkLog;
  private _loadingCounter: number;

  @Input('taskId')
  set taskId(value: string) {
    this._taskId = value;
  }
  get taskId(): string {
    return this._taskId;
  }

  get isLoading(): boolean {
    return this._loadingCounter > 0;
  }

  get anyWorkLogExists(): boolean {
    return !!this.lastWorkLog;
  }

  get lastWorkLog(): WorkLog {
    return this._lastWorkLog;
  }

  get isWorking(): boolean {
    return this._lastWorkLog ? this._lastWorkLog.logType === WorkLogType.WORK : false;
  }

  get isPaused(): boolean {
    return this._lastWorkLog ? [WorkLogType.BREAK, WorkLogType.AUTOBREAK].includes(this._lastWorkLog.logType) : false;
  }

  get isClosed(): boolean {
    return this._lastWorkLog ? this._lastWorkLog.logType === WorkLogType.CLOSE : false;
  }

  constructor(
    private _loggerService: WorkLoggerService,
    private _workLogsService: WorkLogsListRestService,
    private _snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this._loadingCounter = 0;
    this.loadLastWorkLog();
  }

  //#region Data loaders
  private loadLastWorkLog(): void {
    this._loadingCounter++;
    const userId = USER_ID_MOCK
    const filter = { name: 'userId', values: [`${userId}`] } as Filter;
    const pagination = { currentPage: 1, itemsPerPage: 100 } as Pagination;

    this._workLogsService.find(null, pagination)
      .pipe(
        take(1),
        tap(res => {
          this._loadingCounter--;
          if (res.items && res.items.length > 0) {
            this._lastWorkLog = res.items[res.items.length - 1];
          }
        })
      )
      .subscribe()
  }
  //#endregion

  //#region Work loggers
  public startWork(): void {
    this._loadingCounter++;
    this._loggerService.startWork(this._taskId)
      .pipe(
        map(res => {
          const success = !!res
          const message = !!res['logType'] ? WorkLogType.AUTOBREAK : '';
          const details = {
            idTask: res['idTask'],
            idUser: res['idUser'],
            logDate: res['logDate'],
            logType: res['logType'],
          };
          return {
            success: success,
            message: message,
            details: details
          } as CommonResponse<any>
        }),
        take(1),
        tap(res => this.handleResponse(res, 'Rozpoczęto pracę')),
        catchError(err => this.handleRequestError(err))
      )
      .subscribe();
  }

  public startBreak(): void {
    this._loadingCounter++;
    this._loggerService.startBreak(this._taskId)
      .pipe(
        take(1),
        tap(res => this.handleResponse(res, 'Zakończono pracę')),
        catchError(err => this.handleRequestError(err))
      )
      .subscribe();
  }

  public closeTask(): void {
    this._loadingCounter++;
    this._loggerService.closeTask(this._taskId)
      .pipe(
        take(1),
        tap(res => this.handleResponse(res, 'Zamknięto zadanie')),
        catchError(err => this.handleRequestError(err))
      )
      .subscribe();
  }
  //#endregion

  private handleResponse(res: CreationResponse, successMessage: string, errorMessage?: string): void {
    this._loadingCounter--;
    console.log(res);
    // TODO: Handle proper response
    if (!!res || res.success) {
      if (res['message'] === WorkLogType.AUTOBREAK.toString()) {
        this._snackBarService.openSuccessSnackBar('Rozpoczęto pracę. Poprzednio rozpoczęta praca została zakończona.');
      } else {
        this._snackBarService.openSuccessSnackBar(successMessage || 'Zapisano pomyślnie');
      }
    } else this._snackBarService.openErrorSnackBar(errorMessage || 'Podczas zapisywania wystąpił błąd');
    this.loadLastWorkLog();
  }

  private handleRequestError(err: string): Observable<any> {
    this._loadingCounter--;
    this._snackBarService.openErrorSnackBar(err);

    return of();
  }

}
