import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonItemDetailsComponent } from 'src/app/components/common-item-details/common-item-details.component';
import { stringifyEmployee } from 'src/app/helpers/parsers';
import { Employee } from 'src/app/model/employee';
import { Filter } from 'src/app/model/filter';
import { Project } from 'src/app/model/project';
import { Query } from 'src/app/model/query';
import { SimpleEmployee } from 'src/app/model/simple-employee';
import { ProjectDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { ProjectRestService } from 'src/app/services/project-rest.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['../../components/common-item-details/common-item-details.component.scss', './project-details.component.scss']
})
export class ProjectDetailsComponent extends CommonItemDetailsComponent<Project> implements OnInit {
  //#region Getters and setters
  get stringId(): string {
    return this.itemId;
  }

  get project(): Project {
    return this._initialItem;
  }
  //#endregion

  constructor(
    router: Router,
    formBuilder: FormBuilder,
    itemDetailsBroker: ProjectDetailsBrokerService,
    restService: ProjectRestService,
  ) {
    super(router, itemDetailsBroker, restService, formBuilder);

    const projectFilter = { name: 'stringId', value: [`${this.stringId}`] } as Filter;
    this._query = { searchString: '', filters: [projectFilter] } as Query;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  //#region Initializers
  protected setEditables(): void {
    this._editables = new Map([
      ['title', false],
      ['manager', false],
      ['description', false],
    ]);
  }

  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      title: [this._initialItem.title, [Validators.required]],
      manager: [this._initialItem.manager, [Validators.required]],
      description: [this._initialItem.description]
    });
  }
  //#endregion

  //#region Saving changes
  public updateTempManager(employee: SimpleEmployee): void {
    const field = this._form.get('manager');
    field.patchValue(employee);
  }
  //#endregion

  //#region Helpers
  stringifyManager(manager: Employee | SimpleEmployee): string {
    return stringifyEmployee(manager);
  }
  //#endregion
}
