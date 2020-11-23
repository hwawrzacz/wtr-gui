import { Component } from '@angular/core';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { Project } from 'src/app/model/project';

@Component({
  selector: 'app-projects-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class ProjectsTableComponent extends CommonTableComponent<Project> {
  constructor() {
    super();

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
        propertyName: 'manager',
      },
      {
        defName: 'employees',
        displayName: 'Employees',
        propertyName: 'workersCount',
      },
    ];

    this._actionsDefinitions = [
      {
        icon: 'pie_chart',
        action: (id: number) => {
          console.log(`statistics for ${id}`);
        },
        color: 'primary',
        tooltip: 'Show statistics'
      },
      {
        icon: 'edit',
        action: (id: number) => {
          console.log(`edit ${id}`);
        },
        tooltip: 'Edit item'
      },
      {
        icon: 'delete',
        action: (id: number) => {
          console.log(`delete ${id}`);
        },
        color: 'warn',
        tooltip: 'Delete item'
      }
    ]
  }
}