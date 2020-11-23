import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { Project } from 'src/app/model/project';
import { ProjectsListService } from 'src/app/services/projects-list.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss']
})
export class ProjectsListComponent extends CommonListViewComponent<Project> {
  constructor(http: HttpClient) {
    super();

    this._pageTitle = "Projects";
    this._themeItemNameSingle = "project";
    this._restService = new ProjectsListService(http);
  }
}
