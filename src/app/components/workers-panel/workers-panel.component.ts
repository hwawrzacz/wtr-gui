import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, tap } from 'rxjs/operators';
import { stringifyUser } from 'src/app/helpers/parsers';
import { INFO_SNACKBAR_DURATION, SUCCESS_SNACKBAR_DURATION } from 'src/app/model/constants';
import { Pagination } from 'src/app/model/pagination';
import { Query } from 'src/app/model/query';
import { User } from 'src/app/model/user';
import { UsersListRestService } from 'src/app/services/rest/users-list-rest.service';

@Component({
  selector: 'app-workers-panel',
  templateUrl: './workers-panel.component.html',
  styleUrls: ['./workers-panel.component.scss']
})
export class WorkersPanelComponent implements OnInit {
  private _selectedWorkers: User[];
  private _selectedWorkersIds: string[];
  private _workersLoading: boolean;
  @Output('workersChange') private _workersChangeEmitter: EventEmitter<User[]>;

  //#region Getters and setters
  get selectedWorkers(): User[] {
    return this._selectedWorkers;
  }
  @Input('selectedWorkers')
  set selectedWorkers(value: User[]) {
    this._selectedWorkers = value;
    this._selectedWorkersIds = value.map(worker => worker._id);
  }

  @Input('selectedWorkersIds')
  set selectedWorkersIds(value: string[]) {
    this._selectedWorkersIds = value;
  }

  get workersLoading(): boolean {
    return this._workersLoading;
  }
  //#endregion

  constructor(
    private _userRestService: UsersListRestService,
    private _snackBar: MatSnackBar
  ) {
    this._workersChangeEmitter = new EventEmitter<User[]>();
  }

  ngOnInit(): void {
    this.loadWorkers();
  }

  //#region Data loader
  /**This function will only be used if workers are stored as
   * array of id's. I users are stored as objects, there is 
   * no need to run this function. */
  private loadWorkers(): void {
    this._workersLoading = true;
    const query = { searchString: '', filters: [] } as Query;
    const pagination = { currentPage: 1, itemsPerPage: 100 } as Pagination;
    this._userRestService.find(query, pagination)
      .pipe(
        take(1),
        tap(results => {
          this._workersLoading = false;

          if (!!this._selectedWorkersIds && this._selectedWorkersIds.length > 0) {
            this._selectedWorkers = results.filter(worker => this._selectedWorkersIds.includes(worker._id));
          } else if (!!this._selectedWorkers && this._selectedWorkers.length > 0) {
            this._selectedWorkers = results.filter(worker => this._selectedWorkers.map(selWork => selWork._id).includes(worker._id));
          }
        })
      ).subscribe();
  }
  //#endregion

  //#region Worker list manipulation
  public addWorker(worker: User) {
    if (!this._selectedWorkersIds.includes(worker._id)) {
      this._selectedWorkers.push(worker);
      this._selectedWorkersIds.push(worker._id);
      this._workersChangeEmitter.emit(this._selectedWorkers);
    } else {
      this.openInfoSnackBar('Worker is already added');
    }
  }

  public removeWorker(id: string): void {
    this._selectedWorkers = this._selectedWorkers.filter(worker => worker._id !== id);
    this._selectedWorkers = this._selectedWorkers.filter(worker => worker._id !== id);
    this._workersChangeEmitter.emit(this._selectedWorkers);
  }
  //#endregion

  //#region Snackbar
  private openSuccessSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', { duration: SUCCESS_SNACKBAR_DURATION });
  }

  private openInfoSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', { duration: INFO_SNACKBAR_DURATION });
  }

  private openErrorSnackBar(message: string) {
    this._snackBar.open(message, 'Ok');
  }
  //#endregion

  //#region Helpers
  stringifyUser(user: User): string {
    return stringifyUser(user);
  }
  //#endregion
}
