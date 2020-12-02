import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { Employee } from 'src/app/model/employee';
import { Project } from 'src/app/model/project';
import { ItemDetailsBrokerService, ProjectDetailsBrokerService } from 'src/app/services/item-details-broker.service';

@Component({
  selector: 'app-projects-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class ProjectsTableComponent extends CommonTableComponent<Project> {
  constructor(router: Router, itemDetailsBroker: ProjectDetailsBrokerService) {
    super(router, itemDetailsBroker);

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
        propertyName: 'manager',
        formatter: (employee: Employee) => `${employee.firstName} ${employee.lastName}`,
      },
      {
        defName: 'employees',
        displayName: 'People working on',
        propertyName: 'workers',
        formatter: (arr: number[]) => `${arr.length}`,
      },
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