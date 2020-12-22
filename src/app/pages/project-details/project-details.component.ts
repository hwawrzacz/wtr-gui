import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonItemDetailsComponent } from 'src/app/components/common-item-details/common-item-details.component';
import { stringifyUser } from 'src/app/helpers/parsers';
import { User } from 'src/app/model/user';
import { Filter } from 'src/app/model/filter';
import { Project } from 'src/app/model/project';
import { Query } from 'src/app/model/query';
import { SimpleUser } from 'src/app/model/simple-user';
import { ProjectDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { ProjectRestService } from 'src/app/services/project-rest.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['../../components/common-item-details/common-item-details.component.scss', './project-details.component.scss']
})
export class ProjectDetailsComponent extends CommonItemDetailsComponent<Project> implements OnInit {
  //#region Getters and setters
  get stringId(): string {
    return this._initialItem ? this._initialItem.stringId : '';
    // return this.itemId;
  }

  get managerFormControl(): AbstractControl {
    return this._form.get('manager');
  }

  get project(): Project {
    return this._initialItem;
  }
  //#endregion

  constructor(
    navigator: NavigatorService<Project>,
    formBuilder: FormBuilder,
    broker: ProjectDetailsBrokerService,
    restService: ProjectRestService,
    changeDetector: ChangeDetectorRef,
  ) {
    super(navigator, broker, restService, formBuilder, changeDetector);

    const projectFilter = { name: 'stringId', values: [`${this.stringId}`] } as Filter;
    this._query = { searchString: '', filters: [projectFilter] } as Query;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  //#region Initializers
  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      title: [{ value: '', disabled: true }, [Validators.required]],
      manager: [{ value: null, disabled: true }, [Validators.required]],
      description: [{ value: '', disabled: true }]
    });
  }

  protected updateForm(project: Project): void {
    this._form.patchValue({
      title: project.title,
      manager: project.manager,
      description: project.description,
    });
  }
  //#endregion

  //#region Saving changes
  public updateTempManager(user: SimpleUser): void {
    const field = this._form.get('manager');
    field.patchValue(user);
  }
  //#endregion

  //#region Helpers
  stringifyManager(manager: User | SimpleUser): string {
    return stringifyUser(manager);
  }
  //#endregion
}
