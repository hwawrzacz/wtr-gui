import { Component } from '@angular/core';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { StatusStringifier } from 'src/app/helpers/parsers';
import { Status } from 'src/app/model/enums/status';
import { Task } from 'src/app/model/task';
import { TaskDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class TasksTableComponent extends CommonTableComponent<Task> {

  constructor(navigator: NavigatorService<Task>, itemDetailsBroker: TaskDetailsBrokerService) {
    super(navigator, itemDetailsBroker);

    this._detailsUrl = 'tasks';
    this._columnsDefinitions = [
      {
        defName: 'title',
        displayName: 'Title',
        propertyName: 'title'
      },
      {
        defName: 'description',
        displayName: 'Description',
        propertyName: 'description'
      },
      {
        defName: 'status',
        displayName: 'Status',
        propertyName: 'progressStatus',
        formatter: (status: Status) => {
          return StatusStringifier.getStatusString(status);
        }
      },
      {
        defName: 'priority',
        displayName: 'Priority',
        propertyName: 'priority'
      },
    ]

    this._actionsDefinitions = [
      {
        icon: 'pie_chart',
        action: (id: string) => {
          console.log(`statistics for ${id}`);
        },
        color: 'primary',
        tooltip: 'Show statistics'
      },
      {
        icon: 'edit',
        action: (id: string) => {
          console.log(`edit ${id}`);
        },
        tooltip: 'Edit item'
      },
      {
        icon: 'delete',
        action: (id: string) => {
          console.log(`delete ${id}`);
        },
        color: 'warn',
        tooltip: 'Delete item'
      }
    ]
  }

  public getClassForProperty(propName: string, value: string): string {
    // TODO: Remove, when 'progressStatus' is changed to 'status' in API
    if (propName == 'progressStatus') propName = 'status';
    return `${propName}-label ${propName}-label--${value}`;
  }

  public isFormattableProperty(propName: string): boolean {
    console.log(propName);
    // TODO: Change, when 'progressStatus' is changed to 'status' in API
    return ['progressStatus', 'priority'].includes(propName);
  }

}
