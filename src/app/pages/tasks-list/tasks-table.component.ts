import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { Task } from 'src/app/model/task';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class TasksTableComponent extends CommonTableComponent<Task> {

  constructor(router: Router, itemDetailsBroker: ItemDetailsBrokerService<Task>) {
    super(router, itemDetailsBroker);

    this._detailsUrl = 'tasks';
    this._columnsDefinitions = [
      {
        defName: 'title',
        displayName: 'Title',
        propertyName: 'title'
      },
      {
        defName: 'description',
        displayName: 'Description',
        propertyName: 'description'
      },
      {
        defName: 'status',
        displayName: 'Status',
        propertyName: 'status'
      },
      {
        defName: 'priority',
        displayName: 'Priority',
        propertyName: 'priority'
      },
    ]

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

  public getClassForProperty(propName: string, value: string): string {
    return `${propName}-label ${propName}-label--${value}`;
  }

  public isFormattableProperty(propName: string): boolean {
    return ['status', 'priority'].includes(propName);
  }

}
