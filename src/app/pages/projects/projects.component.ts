import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/model/project';

export interface ColumnDefinition {
  displayName: string;
  propertyName: string;
}

export interface ActionDefinition {
  icon: string;
  action: () => void;
  color?: string;
  toolip?: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  private _pageTitle: string;
  private _columnsDefinitions = [
    {
      displayName: 'ID',
      propertyName: 'stringId',
    },
    {
      displayName: 'Title',
      propertyName: 'title',
    },
    {
      displayName: 'Manager',
      propertyName: 'manager',
    },
    {
      displayName: 'Employees',
      propertyName: 'workersCount',
    },
  ];

  private _actionsDefinitions = []

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

  constructor() { }

  get pageTitle(): string {
    return this._pageTitle;
  }

  get dataSource(): Project[] {
    return this._dataSource;
  }

  get columnsToDisplay(): string[] {
    return this._columnsDefinitions.map(item => item.displayName);
  }

  get columnsDefinitions(): any[] {
    return this._columnsDefinitions;
  }

  ngOnInit(): void {
    this._pageTitle = 'Projects';
  }

}
