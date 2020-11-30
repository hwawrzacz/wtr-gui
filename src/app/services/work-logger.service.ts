import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { Filter } from '../model/filter';
import { Query } from '../model/query';
import { WorkLog } from '../model/work-log';
import { WorkLogsListService } from './work-logs-list.service';

@Injectable({
  providedIn: 'root'
})
export class WorkLoggerService {
  private readonly USER_ID = 2;
  private _lastWorkLog: WorkLog;
  private _isLoading: boolean;

  get isLoading(): boolean {
    return this._isLoading;
  }

  get lastWorkLog(): WorkLog {
    return this._lastWorkLog;
  }

  constructor(private _restService: WorkLogsListService) {
    this.getLastWorkLog();
  }

  private getLastWorkLog(): void {
    const filter = { name: 'userId', value: [`${this.USER_ID}`] } as Filter;
    const query = { searchString: '', filters: [] } as Query;
    this._restService.get(query)
      .pipe(
        take(1),
        tap(result => {
          if (result) {
            this._lastWorkLog = result.sort().reverse()[0];
          }
        })
      ).subscribe();
  }
}
