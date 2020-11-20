import { Component } from '@angular/core';
import { Project } from 'src/app/model/project';

export interface ColumnDefinition {
  defName: string;
  displayName: string;
  propertyName: string;
}

export interface ActionDefinition {
  icon: string;
  action: (id: number) => void;
  color?: string;
  tooltip?: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
  private _pageTitle: string;
  private _columnsDefinitions: ColumnDefinition[] = [
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

  private _actionsDefinitions: ActionDefinition[] = [
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

  private _dataSource: Project[] = [
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

  constructor() {
    this._pageTitle = 'Projects';
  }

  get pageTitle(): string {
    return this._pageTitle;
  }

  get dataSource(): Project[] {
    return this._dataSource;
  }

  get columnsToDisplay(): string[] {
    return this._columnsDefinitions.map(item => item.defName).concat(this.actionsDefined ? 'actions' : null).filter(col => !!col);
  }

  get columnsDefinitions(): ColumnDefinition[] {
    return this._columnsDefinitions;
  }

  get actionsDefinitions(): ActionDefinition[] {
    return this._actionsDefinitions;
  }

  get actionsDefined(): boolean {
    return this._actionsDefinitions.length > 0;
  }
}
