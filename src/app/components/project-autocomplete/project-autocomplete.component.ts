import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/model/project';
import { ProjectsListService } from 'src/app/services/projects-list.service';
import { CommonAutocompleteComponent } from '../common-autocomplete/common-autocomplete.component';

@Component({
  selector: 'app-project-autocomplete',
  templateUrl: '../common-autocomplete/common-autocomplete.component.html',
  styleUrls: ['../common-autocomplete/common-autocomplete.component.html']
})
export class ProjectAutocompleteComponent extends CommonAutocompleteComponent<Project> implements OnInit {

  constructor(restService: ProjectsListService) {
    super(restService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public filterData(query: string): Project[] {
    return this._items.filter(item => `${item.stringId} ${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
  }

  public transformItem = (project: Project): string => {
    return project ? `${project.stringId} ${project.title}` : '';
  }

}