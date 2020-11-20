import { Component, Inject } from '@angular/core';
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
  selector: 'app-common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent {
  // Labels
  protected _pageTitle: string;
  protected _themeItemNameSingle: string;

  // Table
  protected _columnsDefinitions: ColumnDefinition[];
  protected _actionsDefinitions: ActionDefinition[];
  protected _dataSource: Project[];

  constructor() { }

  get pageTitle(): string {
    return this._pageTitle;
  }

  get themeItemNameSingle(): string {
    return this._themeItemNameSingle;
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
