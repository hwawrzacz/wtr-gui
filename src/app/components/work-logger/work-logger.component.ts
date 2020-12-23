import { Component, OnInit } from '@angular/core';
import { WorkLog } from 'src/app/model/work-log';
import { WorkLoggerService } from 'src/app/services/work-logger.service';

@Component({
  selector: 'app-work-logger',
  templateUrl: './work-logger.component.html',
  styleUrls: ['./work-logger.component.scss']
})
export class WorkLoggerComponent implements OnInit {
  get isLoading(): boolean {
    return this._loggerService.isLoading;
  }

  get anyWorkLogExists(): boolean {
    return !!this.lastWorkLog;
  }

  get lastWorkLog(): WorkLog {
    return this._loggerService.lastWorkLog;
  }

  get isWorking(): boolean {
    return this._loggerService.isWorking;
  }

  get isPaused(): boolean {
    return this._loggerService.isPaused;
  }

  get isClosed(): boolean {
    return this._loggerService.isClosed;
  }

  constructor(private _loggerService: WorkLoggerService) { }

  ngOnInit(): void {
  }

  public startWork(): void {
    this._loggerService.startWork();
  }

  public startBreak(): void {
    this._loggerService.startBreak();
  }

  public closeTask(): void {
    this._loggerService.closeTask();
  }

}
