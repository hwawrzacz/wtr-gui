import { Component } from '@angular/core';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';

@Component({
  selector: 'app-projects',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class ProjectsComponent extends CommonTableComponent {
  constructor() {
    super();

    this._pageTitle = "Projects";
    this._themeItemNameSingle = "project";

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

    this._dataSource = [
      {
        id: 1,
        stringId: 'PROJ_1',
        title: 'Jeden projekt',
        description: 'Taki niezwykły projekt, że to to prostu szok i niedowierzanie',
        manager: 'John Wick',
        workersCount: 4,
      },
      {
        id: 2,
        stringId: 'PROJ_2',
        title: 'Dwa projekt',
        description: 'Taki drugi projekt z trochę mniejszym szokiem, ale jednak nadal trochę',
        manager: 'Steven Spielberg',
        workersCount: 7,
      }
    ]
  }
}
