import { Component } from '@angular/core';
import { PriorityStringifier, StatusStringifier } from 'src/app/helpers/parsers';
import { CommonItem } from 'src/app/model/common-item';
import { Priority } from 'src/app/model/enums/priority';
import { Status } from 'src/app/model/enums/status';
import { Task } from 'src/app/model/task';
import { LoginService } from 'src/app/services/login.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { CommonTableComponent } from '../common-table/common-table.component';

@Component({
  selector: 'app-project-tasks-table',
  templateUrl: '../../pages/tasks-list/tasks-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class ProjectTasksTableComponent extends CommonTableComponent<Task> {
  constructor(
    navigator: NavigatorService<Task>,
    loginService: LoginService,
  ) {
    super(navigator, loginService);

    this._detailsUrl = 'tasks';
    this._columnsDefinitions = [
      {
        defName: 'id',
        displayName: 'ID',
        propertyName: 'stringId'
      },
      {
        defName: 'title',
        displayName: 'Tytuł',
        propertyName: 'title'
      },
      {
        defName: 'date',
        displayName: 'Termin',
        propertyName: 'dutyDate',
        formatter: (dateStr: string): string => {
          return new Date(dateStr).toLocaleDateString('pl-PL');
        }
      },
      {
        defName: 'status',
        displayName: 'Status',
        propertyName: 'status',
        formatter: (status: Status): string => {
          return StatusStringifier.getStatusString(status);
        }
      },
      {
        defName: 'priority',
        displayName: 'Priorytet',
        propertyName: 'priority',
        formatter: (priority: Priority): string => {
          return PriorityStringifier.getPriorityString(priority);
        }
      },
    ]

    this._actionsDefinitions = [
      {
        icon: 'pie_chart',
        action: (item: CommonItem) => {
          this.navigateToStatsWithData(item);
        },
        canDisplay: () => {
          return this.canShowStats();
        },
        color: 'primary',
        tooltip: 'Pokaż statystyki'
      },
      // {
      //   icon: 'edit',
      //   action: (item: CommonItem) => {
      //     this.navigateToDetailsWithData(item, true);
      //   },
      //   tooltip: 'Edytuj element'
      // },
      {
        icon: 'delete',
        action: (item: CommonItem) => {
          this.delete(item._id);
        },
        canDisplay: () => {
          return this.canDelete();
        },
        color: 'warn',
        tooltip: 'Usuń element'
      }
    ]
  }

  public getClassForProperty(propName: string, value: string): string {
    return `${propName}-label ${propName}-label--${value}`;
  }

  public isFormattableProperty(propName: string): boolean {
    return ['status', 'priority'].includes(propName);
  }
}
