import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/model/project';
import { User } from 'src/app/model/user';
import { ProjectsListRestService } from 'src/app/services/rest/projects-list-rest.service';
import { CommonAutocompleteComponent } from '../common-autocomplete/common-autocomplete.component';

@Component({
  selector: 'app-project-autocomplete',
  templateUrl: '../common-autocomplete/common-autocomplete.component.html',
  styleUrls: ['../common-autocomplete/common-autocomplete.component.scss']
})
export class ProjectAutocompleteComponent extends CommonAutocompleteComponent<Project> implements OnInit {
  private _idManager: string;

  constructor(restService: ProjectsListRestService) {
    super(restService);
  }

  @Input('idManager')
  set idManager(value: string) {
    this._idManager = value;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public filterData(query: string): Project[] {
    return this._items.filter(item => (
      `${item.stringId} ${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase())
      && (!this._idManager || (item.idManager as User)._id === this._idManager)
    )
    );
  }

  public transformItem = (project: Project): string => {
    return project ? project.stringId : '';
  }

}
