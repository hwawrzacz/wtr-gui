import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { Status } from 'src/app/model/enums/status';
import { Filter } from 'src/app/model/filter';
import { Pagination } from 'src/app/model/pagination';
import { ArrayResponse, PatchResponse } from 'src/app/model/responses';
import { WorkLog, WorkLogType } from 'src/app/model/work-log';
import { AuthService } from 'src/app/services/auth.service';
import { SingleTaskRestService } from 'src/app/services/rest/single-task-rest.service';
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
  private _taskStatus: Status;
  private _canLog: boolean;

  @Output('workLogged') private _workLogEmitter: EventEmitter<void>;
  @Output('statusChanged') private _statusChanged: EventEmitter<Status>;

  @Input('taskId')
  set taskId(value: string) {
    this._taskId = value;
  }
  get taskId(): string {
    return this._taskId;
  }

  @Input('canLog')
  set canLog(value: boolean) {
    this._canLog = value;
  }
  get canLog(): boolean {
    return this._canLog;
  }

  @Input('taskStatus')
  set taskStatus(value: Status) {
    this._taskStatus = value;
  }

  get isLoading(): boolean {
    return this._loadingCounter > 0 || !this._taskStatus;
  }

  get lastWorkLog(): WorkLog {
    return this._lastWorkLog;
  }

  get isWorking(): boolean {
    return this._lastWorkLog
      ? this._taskStatus === Status.IN_PROGRESS && this._lastWorkLog.logType === WorkLogType.WORK
      : false;
  }

  get isPaused(): boolean {
    return this._lastWorkLog
      ? this._taskStatus === Status.IN_PROGRESS && [WorkLogType.BREAK, WorkLogType.AUTOBREAK].includes(this._lastWorkLog.logType)
      : false;
  }

  get isNew(): boolean {
    return this._taskStatus === Status.NEW;
  }

  get isClosed(): boolean {
    return this._taskStatus === Status.DONE;
  }

  constructor(
    private _loggerService: WorkLoggerService,
    private _workLogsService: WorkLogsListRestService,
    private _taskService: SingleTaskRestService,
    private _snackBarService: SnackBarService,
    private _authService: AuthService,
  ) {
    this._workLogEmitter = new EventEmitter<void>();
    this._statusChanged = new EventEmitter<Status>();
  }

  ngOnInit(): void {
    this._loadingCounter = 0;
    this.loadLastWorkLog();
  }

  //#region Data loaders
  private loadLastWorkLog(): void {
    this._loadingCounter++;
    const userId = this._authService.user._id;
    const taskFilter = { name: 'idTask', values: [`${this._taskId}`] } as Filter;
    const userFilter = { name: 'idUser', values: [`${userId}`] } as Filter;
    const query = { searchString: '', filters: [taskFilter, userFilter] };
    const pagination = { currentPage: 1, itemsPerPage: 1 } as Pagination;

    this._workLogsService.find(query, pagination)
      .pipe(
        take(1),
        tap((res: ArrayResponse<WorkLog>) => {
          res.success
            ? this.handleResponseSuccess(res)
            : this.handleResponseError(res)
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
    this._snackBarService.openErrorSnackBar('Coś poszło nie tak', res.message)
  }
  //#endregion

  //#region Work loggers
  public startWork(): void {
    this._loadingCounter++;
    this._loggerService.startWork(this._taskId)
      .pipe(
        take(1),
        mergeMap((res: PatchResponse) =>
          // If task has status 'NEW'
          res.success && this.isNew
            ? this.markTask(Status.IN_PROGRESS)
            : of(res)
        ),
        tap((res: PatchResponse) => {
          if (res.success) {
            this.handlePatchResponseSuccess(res, 'Rozpoczęto pracę');
            this.emitStatusChanged(Status.IN_PROGRESS);
          } else this.handlePatchResponseError(res);

          this._loadingCounter--;
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
        tap((res: PatchResponse) =>
          res.success
            ? this.handlePatchResponseSuccess(res, 'Zakończono pracę')
            : this.handlePatchResponseError(res)
        ),
        catchError(err => this.handleRequestError(err))
      )
      .subscribe();
  }

  public closeTask(): void {
    this._loadingCounter++;
    this._loggerService.closeTask(this._taskId)
      .pipe(
        take(1),
        mergeMap(res => res.success
          ? this.markTask(Status.DONE)
          : of(res)
        ),
        tap((res: PatchResponse) => {
          if (res.success) {
            this.handlePatchResponseSuccess(res, 'Zamknięto zadanie');
            this.emitStatusChanged(Status.DONE);
          } else this.handlePatchResponseError(res)
        }),
        catchError(err => this.handleRequestError(err))
      )
      .subscribe();
  }

  public markTask(taskStatus: Status): Observable<PatchResponse> {
    return this._taskService.patch<Status>(this._taskId, 'status', taskStatus)
  }
  //#endregion

  //#region Response handlers
  private handlePatchResponseSuccess(res: PatchResponse, successMessage: string, errorMessage?: string): void {
    if (res.success) {
      if (!!res.details && res.details.logType === WorkLogType.AUTOBREAK) {
        this._snackBarService.openSuccessSnackBar('Rozpoczęto pracę. Poprzednio rozpoczęta praca została zakończona.');
      } else {
        this._snackBarService.openSuccessSnackBar(successMessage || 'Zapisano pomyślnie');
      }
      this.emitWorkLogged();
    } else this._snackBarService.openErrorSnackBar('Podczas zapisywania wystąpił błąd.', errorMessage);

    this.loadLastWorkLog();
    this._loadingCounter--;
  }

  private handlePatchResponseError(res: PatchResponse) {
    this._snackBarService.openErrorSnackBar('Podczas zapisywania wystąpił błąd.', res.message);
    this._loadingCounter--;
  }

  private handleRequestError(err: string): Observable<any> {
    this._loadingCounter--;
    this._snackBarService.openErrorSnackBar('Coś poszło nie tak.', err);
    return of();
  }
  //#endregion

  private emitWorkLogged(): void {
    this._workLogEmitter.emit();
  }

  private emitStatusChanged(status: Status): void {
    this._statusChanged.emit(status);
  }
}
