import { Component } from '@angular/core';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { PriorityStringifier, StatusStringifier } from 'src/app/helpers/parsers';
import { CommonItem } from 'src/app/model/common-item';
import { Priority } from 'src/app/model/enums/priority';
import { Status } from 'src/app/model/enums/status';
import { Project } from 'src/app/model/project';
import { Task } from 'src/app/model/task';
import { AuthService } from 'src/app/services/auth.service';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class TasksTableComponent extends CommonTableComponent<Task> {
  constructor(
    navigator: NavigatorService<Task>,
    authService: AuthService
  ) {
    super(navigator, authService);

    this._detailsUrl = 'tasks';
    this._columnsDefinitions = [
      {
        defName: 'id',
        displayName: 'ID',
        propertyName: 'stringId'
      },
      {
        defName: 'projectStringId',
        displayName: 'ID projektu',
        propertyName: 'project',
        formatter: (project: Project): string => {
          return project ? project.stringId : 'N/A';
        }
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
      // {
      //   icon: 'pie_chart',
      //   action: (item: CommonItem) => {
      //     this.navigateToStatsWithData(item);
      //   },
      //   canDisplay: (): boolean => {
      //     return this.canShowStats();
      //   },
      //   color: 'primary',
      //   tooltip: 'Pokaż statystyki'
      // },
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
          this.emitDelete(item._id);
        },
        canDisplay: (): boolean => {
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
