import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { CommonItemDetailsComponent } from 'src/app/components/common-item-details/common-item-details.component';
import { TaksCreationDialogComponent } from 'src/app/components/dialogs/taks-creation-dialog/taks-creation-dialog.component';
import { PriorityStringifier, stringifyUser } from 'src/app/helpers/parsers';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from 'src/app/model/constants';
import { Priority } from 'src/app/model/enums/priority';
import { Filter } from 'src/app/model/filter';
import { Project } from 'src/app/model/project';
import { Query } from 'src/app/model/query';
import { SimpleUser } from 'src/app/model/simple-user';
import { User } from 'src/app/model/user';
import { ProjectDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { SingleProjectRestService } from 'src/app/services/rest/single-project-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { TasksListComponent } from '../tasks-list/tasks-list.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['../../components/common-item-details/common-item-details.component.scss', './project-details.component.scss']
})
export class ProjectDetailsComponent extends CommonItemDetailsComponent<Project> implements OnInit {
  @ViewChild('taskList') private _taskListComponent: TasksListComponent;

  //#region Getters and setters
  get stringId(): string {
    return this._initialItem ? this._initialItem.stringId : '';
  }

  get managerFormControl(): AbstractControl {
    return this._form.get('manager');
  }

  get project(): Project {
    return this._initialItem;
  }

  get priorities(): Priority[] {
    return PriorityStringifier.prioritiesList;
  }

  // Form constraints
  get minDate(): Date {
    return new Date();
  }

  get titleMaxLength(): number {
    return TITLE_MAX_LENGTH;
  }

  get descriptionMaxLength(): number {
    return DESCRIPTION_MAX_LENGTH;
  }
  //#endregion

  constructor(
    navigator: NavigatorService<Project>,
    formBuilder: FormBuilder,
    broker: ProjectDetailsBrokerService,
    restService: SingleProjectRestService,
    changeDetector: ChangeDetectorRef,
    snackBarService: SnackBarService,
    dialogService: MatDialog,
    loginService: AuthService,
  ) {
    super(navigator, broker, restService, formBuilder, changeDetector, snackBarService, dialogService, loginService);

    const projectFilter = { name: 'stringId', values: [`${this.stringId}`] } as Filter;
    this._query = { searchString: '', filters: [projectFilter] } as Query;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  //#region Initializers
  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      title: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(this.titleMaxLength)]],
      manager: [{ value: null, disabled: true }, [Validators.required]],
      dutyDate: [{ value: '', disabled: true }, [Validators.required]],
      description: [{ value: '', disabled: true }, [Validators.maxLength(this.descriptionMaxLength)]]
    });
  }

  protected updateForm(project: Project): void {
    this._form.patchValue({
      title: project.title,
      // TODO: Replace idManager with manager when ready in the API
      manager: project.idManager,
      dutyDate: project.dutyDate,
      description: project.description,
    });
  }
  //#endregion

  //#region Saving changes
  public updateTempManager(user: SimpleUser): void {
    const field = this._form.get('manager');
    field.patchValue(user);
  }

  protected parseItemFromForm(): Project {
    return {
      title: this._form.get('title').value,
      idManager: this._form.get('manager').value._id,
      dutyDate: this._form.get('dutyDate').value,
      description: this._form.get('description').value,
    } as Project;
  }
  //#endregion

  public openTaskCreationDialog() {
    this._dialogService.open(TaksCreationDialogComponent, { data: this._initialItem })
      .afterClosed()
      .pipe(
        tap(res => {
          if (!!res) {
            this.openSuccessSnackBar('Dodano element.');
            this.reloadData();
          }
          else this.openInfoSnackBar('Anulowano dodawanie elementu.');
        })
      )
      .subscribe()
  }

  public reloadTasksList(): void {
    this._taskListComponent.loadData();
  }

  //#region Helpers
  stringifyManager(manager: User | SimpleUser): string {
    return stringifyUser(manager);
  }

  public getPriorityString(value: Priority): string {
    return PriorityStringifier.getPriorityString(value);
  }

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('required')) return 'Pole jest wymagane.';
    else if (!control.valid) return 'Pole jest nieprawidłowe 🤐';

    return null;
  }
  //#endregion
}
