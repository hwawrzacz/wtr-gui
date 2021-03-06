import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { stringifyUser } from 'src/app/helpers/parsers';
import { Pagination } from 'src/app/model/pagination';
import { Query } from 'src/app/model/query';
import { ArrayResponse } from 'src/app/model/responses';
import { User } from 'src/app/model/user';
import { UsersListRestService } from 'src/app/services/rest/users-list-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-workers-panel',
  templateUrl: './workers-panel.component.html',
  styleUrls: ['./workers-panel.component.scss']
})
export class WorkersPanelComponent implements OnInit {
  private _selectedWorkers: User[];
  private _selectedWorkersIds: string[];
  private _workersLoading: boolean;
  private _editMode: boolean;
  private _canEdit: boolean;
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

  @Input('canEdit')
  set canEdit(value: boolean) {
    if (value === undefined) value = true;
    this._canEdit = value;
  }
  get canEdit(): boolean {
    return this._canEdit;
  }

  @Input('editMode')
  set editMode(value: boolean) {
    if (value === undefined) value = true;
    this._editMode = value;
  }
  get editMode(): boolean {
    return this._editMode;
  }

  get workersLoading(): boolean {
    return this._workersLoading;
  }
  //#endregion

  constructor(
    private _userRestService: UsersListRestService,
    private _snackBarService: SnackBarService
  ) {
    this._workersChangeEmitter = new EventEmitter<User[]>();
  }

  ngOnInit(): void {
    if (!this._selectedWorkers && !!this._selectedWorkersIds) {
      this.loadWorkers();
    }
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
        tap((res: ArrayResponse<User>) => {
          this._workersLoading = false;
          if (res.success) {
            this.handleResponseSuccess(res);
          } else {
            this.handleResponseError(res);
          }
        })
      ).subscribe();
  }

  private handleResponseSuccess(res: ArrayResponse<User>) {
    if (!!this._selectedWorkersIds && this._selectedWorkersIds.length > 0) {
      this._selectedWorkers = res.details.items.filter(worker => this._selectedWorkersIds.includes(worker._id));
    } else if (!!this._selectedWorkers && this._selectedWorkers.length > 0) {
      this._selectedWorkers = res.details.items.filter(worker => this._selectedWorkers.map(selWork => selWork._id).includes(worker._id));
    }
  }

  private handleResponseError(res: ArrayResponse<User>) {
    this.openErrorSnackBar('Coś poszło nie tak.', res.message);
  }
  //#endregion

  //#region Worker list manipulation
  public addWorker(worker: User) {
    if (worker) {
      if (!this._selectedWorkersIds.includes(worker._id)) {
        this._selectedWorkers.push(worker);
        this._selectedWorkersIds.push(worker._id);
        this._workersChangeEmitter.emit(this._selectedWorkers);
        this.openInfoSnackBar('Pracownik został dodany. Pamiętaj o zapisaniu zmian.');
      } else {
        this.openInfoSnackBar('Pracownik jest już dodany.');
      }
    }
  }

  public removeWorker(id: string): void {
    this._selectedWorkers = this._selectedWorkers.filter(worker => worker._id !== id);
    this._selectedWorkers = this._selectedWorkers.filter(worker => worker._id !== id);
    this._workersChangeEmitter.emit(this._selectedWorkers);
    this.openInfoSnackBar('Pracownik został usunięty. Pamiętaj o zapisaniu zmian.');
  }
  //#endregion

  //#region Snackbar
  private openInfoSnackBar(message: string) {
    this._snackBarService.openInfoSnackBar(message);
  }

  private openErrorSnackBar(message: string, details?: string) {
    this._snackBarService.openErrorSnackBar(message, details);
  }
  //#endregion

  //#region Helpers
  stringifyUser(user: User): string {
    return stringifyUser(user);
  }
  //#endregion
}
