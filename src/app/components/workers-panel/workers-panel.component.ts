import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take, tap } from 'rxjs/operators';
import { stringifyUser } from 'src/app/helpers/parsers';
import { Pagination } from 'src/app/model/pagination';
import { Query } from 'src/app/model/query';
import { User } from 'src/app/model/user';
import { UsersListService } from 'src/app/services/users-list.service';

@Component({
  selector: 'app-workers-panel',
  templateUrl: './workers-panel.component.html',
  styleUrls: ['./workers-panel.component.scss']
})
export class WorkersPanelComponent implements OnInit {
  private _allWorkers: User[];
  private _selectedWorkers: User[];
  private _selectedWorkersIds: string[];
  private _workersLoading: boolean;

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
    private _userRestService: UsersListService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadWorkers();
  }

  //#region Data loader
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
    } else {
      this._snackBar.open('Worker is already added', null, { duration: 2000 });
    }
  }

  public removeWorker(id: string): void {
    this._selectedWorkers = this._selectedWorkers.filter(worker => worker._id !== id);
    this._selectedWorkers = this._selectedWorkers.filter(worker => worker._id !== id);
  }
  //#endregion

  //#region Helpers
  stringifyUser(user: User): string {
    return stringifyUser(user);
  }
  //#endregion
}
