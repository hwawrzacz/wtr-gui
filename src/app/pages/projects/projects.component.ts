import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { Project } from 'src/app/model/project';
import { ProjectsListService } from 'src/app/services/projects-list.service';

@Component({
  selector: 'app-projects',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class ProjectsComponent extends CommonTableComponent<Project> implements OnInit {
  constructor(http: HttpClient) {
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

    this.restService = new ProjectsListService(http);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }
}
