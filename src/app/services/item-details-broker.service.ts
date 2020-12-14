import { Injectable } from '@angular/core';
import { Project } from '../model/project';
import { SimpleUser } from '../model/simple-user';
import { Task } from '../model/task';

@Injectable({
  providedIn: 'root'
})
export class ItemDetailsBrokerService<T> {
  private _item: T;

  get item(): T {
    return this._item;
  }

  set item(value: T) {
    this._item = value;
  }

  get hasItem(): boolean {
    return !!this._item;
  }

  constructor() { }
}

@Injectable({ providedIn: 'root' })
export class ProjectDetailsBrokerService extends ItemDetailsBrokerService<Project> { }

@Injectable({ providedIn: 'root' })
export class TaskDetailsBrokerService extends ItemDetailsBrokerService<Task> { }

@Injectable({ providedIn: 'root' })
export class UserDetailsBrokerService extends ItemDetailsBrokerService<SimpleUser> { }