import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { StatusStringifier } from 'src/app/helpers/parsers';
import { CommonItem } from 'src/app/model/common-item';
import { Status } from 'src/app/model/enums/status';
import { Task } from 'src/app/model/task';
import { NavigatorService } from 'src/app/services/navigator.service';
import { SingleTaskRestService } from 'src/app/services/rest/single-task-rest.service';

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
        displayName: 'Tytuł',
        propertyName: 'title'
      },
      {
        defName: 'description',
        displayName: 'Opis',
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
        displayName: 'Priorytet',
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
        tooltip: 'Pokaż statystyki'
      },
      {
        icon: 'edit',
        action: (item: CommonItem) => {
          this.navigateToDetailsWithData(item, true);
        },
        tooltip: 'Edytuj element'
      },
      {
        icon: 'delete',
        action: (item: CommonItem) => {
          this.delete(item._id);
        },
        color: 'warn',
        tooltip: 'Usuń element'
      }
    ]
  }

  public getClassForProperty(propName: string, value: string): string {
    // TODO: Remove, when 'progressStatus' is changed to 'status' in API
    if (propName == 'progressStatus') propName = 'status';
    return `${propName}-label ${propName}-label--${value}`;
  }

  public isFormattableProperty(propName: string): boolean {
    // TODO: Change, when 'progressStatus' is changed to 'status' in API
    return ['progressStatus', 'priority'].includes(propName);
  }

}
