import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonItemDetailsComponent } from 'src/app/components/common-item-details/common-item-details.component';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { Task } from 'src/app/model/task';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['../../components/common-item-details/common-item-details.component.scss', './task-details.component.scss']
})
export class TaskDetailsComponent extends CommonItemDetailsComponent<Task> implements OnInit {

  //#region Getters and setters
  get stringId(): string {
    return this.itemId;
  }

  get project(): Task {
    return this._initialItem;
  }
  //#endregion

  constructor(
    router: Router,
    itemBrokerService: ItemDetailsBrokerService<Task>,
    taskRestService: TaskService,
    formBuilder: FormBuilder
  ) {
    super(router, itemBrokerService, taskRestService, formBuilder);

    const projectFilter = { name: 'stringId', value: [`${this.stringId}`] } as Filter;
    this._query = { searchString: '', filters: [projectFilter] } as Query;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  //#region Initializers
  protected setEditables(): void {
    this._editables = new Map([
      ['title', false],
      ['priority', false],
      ['status', false],
      ['description', false],
    ]);
  }

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
}
