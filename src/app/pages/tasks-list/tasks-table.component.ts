import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { StatusStringifier } from 'src/app/helpers/parsers';
import { CommonItem } from 'src/app/model/common-item';
import { Status } from 'src/app/model/enums/status';
import { Task } from 'src/app/model/task';
import { NavigatorService } from 'src/app/services/navigator.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class TasksTableComponent extends CommonTableComponent<Task> {

  constructor(navigator: NavigatorService<Task>) {
    super(navigator);

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
        action: (item: CommonItem) => {
          this.navigateToStatsWithData(item);
        },
        color: 'primary',
        tooltip: 'Show statistics'
      },
      {
        icon: 'edit',
        action: (item: CommonItem) => {
          this.navigateToDetailsWithData(item, true);
        },
        tooltip: 'Edit item'
      },
      {
        icon: 'delete',
        action: (item: CommonItem) => {
          this.delete(item._id);
          console.log(`delete ${item._id}`);
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
