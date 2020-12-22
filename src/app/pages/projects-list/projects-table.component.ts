import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { CommonItem } from 'src/app/model/common-item';
import { Project } from 'src/app/model/project';
import { User } from 'src/app/model/user';
import { NavigatorService } from 'src/app/services/navigator.service';
import { ProjectRestService } from 'src/app/services/project-rest.service';

@Component({
  selector: 'app-projects-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class ProjectsTableComponent extends CommonTableComponent<Project> {
  constructor(navigator: NavigatorService<Project>) {
    super(navigator);

    this._detailsUrl = 'projects';
    this._columnsDefinitions = [
      {
        defName: 'id',
        displayName: 'ID',
        propertyName: 'stringId',
      },
      {
        defName: 'title',
        displayName: 'Title',
        propertyName: 'title',
      },
      {
        defName: 'manager',
        displayName: 'Manager',
        // TODO: Change to manager, when supported by backend
        propertyName: 'idManager',
        formatter: (user: User) => `${user.firstName} ${user.lastName}`,
      },
      // TODO: Handle workers
      // {
      //   defName: 'workers',
      //   displayName: 'People working on',
      //   propertyName: 'workers',
      //   formatter: (arr: number[]) => {
      //     return `${arr.length}`;
      //   }
      // },
    ];

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
        },
        color: 'warn',
        tooltip: 'Delete item'
      }
    ]
  }
}