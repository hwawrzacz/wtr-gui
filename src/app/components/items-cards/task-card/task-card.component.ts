import { Component, Input, OnInit } from '@angular/core';
import { PriorityStringifier, StatusStringifier, stringifyUser } from 'src/app/helpers/parsers';
import { Task } from 'src/app/model/task';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent implements OnInit {
  private _dutyDate: Date;
  private _task: Task;

  @Input('task')
  set task(value: Task) {
    this._task = value;
    this._dutyDate = new Date(value.dutyDate)
  }
  get task(): Task {
    return this._task;
  }

  get statusString(): string {
    return StatusStringifier.getStatusString(this._task.status);
  }

  get priorityString(): string {
    return PriorityStringifier.getPriorityString(this._task.priority);
  }

  get dutyDate(): string {
    return this._dutyDate.toLocaleDateString('pl-PL');
  }
  constructor() { }

  ngOnInit(): void { }
}
