import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { CommonItemDetailsComponent } from 'src/app/components/common-item-details/common-item-details.component';
import { stringifyEmployee } from 'src/app/helpers/parsers';
import { Employee } from 'src/app/model/employee';
import { Filter } from 'src/app/model/filter';
import { Project } from 'src/app/model/project';
import { Query } from 'src/app/model/query';
import { SimpleEmployee } from 'src/app/model/simple-employee';
import { ProjectRestService } from 'src/app/services/project-rest.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['../../components/common-item-details/common-item-details.component.scss', './project-details.component.scss']
})
export class ProjectDetailsComponent extends CommonItemDetailsComponent<Project> implements OnInit {
  private _form: FormGroup;
  private _editables: Map<string, boolean>;

  //#region Getters and setters
  get stringId(): number | string {
    return this.itemId;
  }

  get form(): FormGroup {
    return this._form;
  }

  get project(): Project {
    return this._initialItem;
  }
  //#endregion

  constructor(router: Router, private _formBuilder: FormBuilder, private _restService: ProjectRestService) {
    super(router);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this._error = false;
    this._form = this.buildEmptyForm();
    this.reinitializeEditables();
    this.loadData();
  }

  //#region Data loaders
  public reloadData(): void {
    this.loadData();
  }

  private loadData() {
    this._loadingCounter++;
    this._error = false;
    const projectFilter = { name: 'stringId', value: [`${this.stringId}`] } as Filter;
    const projectQuery = { searchString: '', filters: [projectFilter] } as Query;
    this._restService.get(projectQuery)
      .pipe(
        take(1),
        tap(proj => {
          this._loadingCounter--;
          if (!!proj) {
            this._initialItem = proj;
            this.reinitializeForm();
            this._error = false;
          }
        }),
        catchError(() => of(this._error = true))
      ).subscribe();
  }
  //#endregion

  //#region Initializers
  private reinitializeEditables(): void {
    this._editables = new Map([
      ['title', false],
      ['manager', false],
      ['description', false],
    ]);
  }

  private reinitializeForm(): void {
    this._form = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this._formBuilder.group({
      title: [this._initialItem.title, [Validators.required]],
      manager: [this._initialItem.manager, [Validators.required]],
      description: [this._initialItem.description]
    });
  }

  private buildEmptyForm(): FormGroup {
    return this._formBuilder.group({
      title: ['', [Validators.required]],
      manager: [null, [Validators.required]],
      description: ['']
    });
  }
  //#endregion

  //#region Editable handling
  isEditable(controlName: string): boolean {
    return this._editables.get(controlName);
  }

  enableEdition(controlName: string): void {
    this.setEditionStatus(controlName, true);
  }

  disableEdition(controlName: string): void {
    this.setEditionStatus(controlName, false);
  }

  private setEditionStatus(controlName: string, value: boolean): void {
    this._editables.set(controlName, value);
  }
  //#endregion

  //#region Saving changes
  public updateTempManager(employee: SimpleEmployee): void {
    const field = this._form.get('manager');
    field.patchValue(employee);
  }

  public onSaveField(name: string) {
    const field = this._form.get(name);
    this._initialItem[name] = field.value;
    this.disableEdition(name);
    console.log(this._initialItem[name]);
    // TODO (HW): Sent update request to API
  }

  public onDiscardFieldChange(name: string) {
    const field = this._form.get(name);
    field.patchValue(this._initialItem[name]);
    this.disableEdition(name);
  }
  //#endregion

  //#region Helpers
  stringifyManager(manager: Employee | SimpleEmployee): string {
    return stringifyEmployee(manager);
  }
  //#endregion
}
