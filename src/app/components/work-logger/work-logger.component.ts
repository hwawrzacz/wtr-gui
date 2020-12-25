import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { USER_ID_MOCK } from 'src/app/model/constants';
import { Filter } from 'src/app/model/filter';
import { Pagination } from 'src/app/model/pagination';
import { ArrayResponse, PatchResponse } from 'src/app/model/responses';
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
  @Output('workLogged') private _workLogEmitter: EventEmitter<void>;

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
  ) {
    this._workLogEmitter = new EventEmitter<void>();
  }

  ngOnInit(): void {
    this._loadingCounter = 0;
    this.loadLastWorkLog();
  }

  //#region Data loaders
  private loadLastWorkLog(): void {
    this._loadingCounter++;
    const userId = USER_ID_MOCK
    const taskFilter = { name: 'idTask', values: [`${this._taskId}`] } as Filter;
    const userFilter = { name: 'idUser', values: [`${userId}`] } as Filter;
    const query = { searchString: '', filters: [taskFilter, userFilter] };
    const pagination = { currentPage: 1, itemsPerPage: 1 } as Pagination;

    this._workLogsService.find(query, pagination)
      .pipe(
        take(1),
        tap((res: ArrayResponse<WorkLog>) => {
          if (res.success) {
            this.handleResponseSuccess(res);
          } else {
            this.handleResponseError(res);
          }
          this._loadingCounter--;
        })
      )
      .subscribe()
  }

  private handleResponseSuccess(res: ArrayResponse<WorkLog>) {
    if (res.details.items && res.details.items.length > 0) {
      this._lastWorkLog = res.details.items[0];
    }
  }

  private handleResponseError(res: ArrayResponse<WorkLog>) {
    this._snackBarService.openErrorSnackBar(res.message)
    console.error(res);
  }
  //#endregion

  //#region Work loggers
  public startWork(): void {
    this._loadingCounter++;
    this._loggerService.startWork(this._taskId)
      .pipe(
        take(1),
        tap((res: PatchResponse) => {
          if (res.success) {
            this.handleResponse(res, 'Rozpoczęto pracę')
          } else {
            this.handleCreationResponseError(res);
          }
        }),
        catchError(err => this.handleRequestError(err))
      )
      .subscribe();
  }

  public startBreak(): void {
    this._loadingCounter++;
    this._loggerService.startBreak(this._taskId)
      .pipe(
        take(1),
        tap((res: PatchResponse) => {
          if (res.success) {
            this.handleResponse(res, 'Zakończono pracę')
          } else {
            this.handleCreationResponseError(res);
          }
        }),
        catchError(err => this.handleRequestError(err))
      )
      .subscribe();
  }

  public closeTask(): void {
    this._loadingCounter++;
    this._loggerService.closeTask(this._taskId)
      .pipe(
        take(1),
        tap((res: PatchResponse) => {
          if (res.success) {
            this.handleResponse(res, 'Zamknięto zadanie')
          } else {
            this.handleCreationResponseError(res);
          }
        }),
        catchError(err => this.handleRequestError(err))
      )
      .subscribe();
  }

  private handleCreationResponseError(res: PatchResponse) {
    this._snackBarService.openErrorSnackBar(res.message)
    console.error(res);
  }
  //#endregion

  private handleResponse(res: PatchResponse, successMessage: string, errorMessage?: string): void {
    // TODO: Handle proper response
    if (!!res || res.success) {
      if (res['message'] === WorkLogType.AUTOBREAK.toString()) {
        this._snackBarService.openSuccessSnackBar('Rozpoczęto pracę. Poprzednio rozpoczęta praca została zakończona.');
      } else {
        this._snackBarService.openSuccessSnackBar(successMessage || 'Zapisano pomyślnie');
      }
      this.emitWorkLogged();
    } else this._snackBarService.openErrorSnackBar(errorMessage || 'Podczas zapisywania wystąpił błąd');
    this.loadLastWorkLog();
    this._loadingCounter--;
  }

  private handleRequestError(err: string): Observable<any> {
    this._loadingCounter--;
    this._snackBarService.openErrorSnackBar(err);

    return of();
  }

  private emitWorkLogged(): void {
    this._workLogEmitter.emit();
  }

}
