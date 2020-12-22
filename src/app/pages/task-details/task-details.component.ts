import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, tap } from 'rxjs/operators';
import { CommonItemDetailsComponent } from 'src/app/components/common-item-details/common-item-details.component';
import { stringifyUser } from 'src/app/helpers/parsers';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { SimpleUser } from 'src/app/model/simple-user';
import { Task } from 'src/app/model/task';
import { UsersListService as UsersListService } from 'src/app/services/users-list.service';
import { TaskDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { TaskService } from 'src/app/services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['../../components/common-item-details/common-item-details.component.scss', './task-details.component.scss']
})
export class TaskDetailsComponent extends CommonItemDetailsComponent<Task> implements OnInit {
  private _workers: SimpleUser[];
  private _workersLoading: boolean;

  //#region Getters and setters
  get stringId(): string {
    return this.itemId;
  }

  get project(): Task {
    return this._initialItem;
  }

  get workersLoading(): boolean {
    return this._workersLoading;
  }

  get workers(): SimpleUser[] {
    return this._workers;
  }
  //#endregion

  constructor(
    navigator: NavigatorService<Task>,
    itemBrokerService: TaskDetailsBrokerService,
    taskRestService: TaskService,
    formBuilder: FormBuilder,
    private _userRestService: UsersListService,
    private _snackBar: MatSnackBar,
  ) {
    super(navigator, itemBrokerService, taskRestService, formBuilder);

    const projectFilter = { name: 'stringId', values: [`${this.stringId}`] } as Filter;
    this._query = { searchString: '', filters: [projectFilter] } as Query;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadWorkers();
  }

  //#region Initializers
  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      title: [this._initialItem.title, [Validators.required]],
      priority: [this._initialItem.priority, [Validators.required]],
      status: [this._initialItem.status, [Validators.required]],
      description: [this._initialItem.description],
      workers: [this._initialItem.workers],
    });
  }
  //#endregion

  //#region Data loader
  private loadWorkers(): void {
    this._workersLoading = true;
    const filter = { name: 'taskId', values: [`${this._itemId}`] } as Filter;
    const query = { searchString: '', filters: [filter] } as Query;
    this._userRestService.find(query)
      .pipe(
        take(1),
        tap(results => {
          this._workersLoading = false;
          this._workers = results.filter(worker => this._initialItem.workers.includes(worker.id));
        })
      ).subscribe();
  }
  //#endregion

  public removeWorker(id: string): void {
    this._workers = this._workers.filter(worker => worker._id !== id);
    this._initialItem.workers = this._initialItem.workers.filter(workerId => workerId !== id);
  }

  public addWorker(worker: SimpleUser) {
    if (!this._initialItem.workers.includes(worker._id)) {
      this._workers.push(worker);
      this._initialItem.workers.push(worker._id);
    } else {
      this._snackBar.open('Worker is already added');
    }
  }

  //#region Helpers
  stringifyUser(user: SimpleUser): string {
    return stringifyUser(user);
  }
  //#endregion
}
