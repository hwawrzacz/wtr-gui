import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { Project } from 'src/app/model/project';
import { NavigatorService } from 'src/app/services/navigator.service';
import { ProjectRestService } from 'src/app/services/project-rest.service';

@Component({
  selector: 'app-projects-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class ProjectsTableComponent extends CommonTableComponent<Project> {
  constructor(
    navigator: NavigatorService<Project>,
    restService: ProjectRestService,
    snackBar: MatSnackBar,
  ) {
    super(navigator, restService, snackBar);

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
      // {
      //   defName: 'manager',
      //   displayName: 'Manager',
      //   propertyName: 'manager',
      //   formatter: (user: User) => `${user.firstName} ${user.lastName}`,
      // },
      // TODO: Handle workers
      // {
      //   defName: 'workers',
      //   displayName: 'People working on',
      //   propertyName: 'workers',
      //   formatter: (arr: number[]) => {
      //     console.log(arr);
      //     return `${arr.length}`;
      //   }
      // },
    ];

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
}