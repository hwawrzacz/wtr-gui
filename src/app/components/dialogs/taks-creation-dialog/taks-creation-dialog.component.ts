import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PriorityStringifier } from 'src/app/helpers/parsers';
import { Priority } from 'src/app/model/enums/priority';
import { Status } from 'src/app/model/enums/status';
import { Project } from 'src/app/model/project';
import { Task } from 'src/app/model/task';
import { User } from 'src/app/model/user';
import { SingleTaskRestService } from 'src/app/services/rest/single-task-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CommonCreationDialogComponent } from '../common-creation-dialog/common-creation-dialog.component';

@Component({
  selector: 'app-taks-creation-dialog',
  templateUrl: './taks-creation-dialog.component.html',
  styleUrls: ['../common-creation-dialog/common-creation-dialog.component.scss', './taks-creation-dialog.component.scss']
})
export class TaksCreationDialogComponent extends CommonCreationDialogComponent<Task> implements OnInit {
  //#region Getters and setters
  get initialProject(): Project {
    return this._initialProject;
  }

  get minDate(): Date {
    return new Date();
  }

  get maxDate(): Date {
    return new Date(this._initialProject.dutyDate);
  }

  get projectFormControl(): AbstractControl {
    return this._form.get('project');
  }

  get priorities(): Priority[] {
    return PriorityStringifier.prioritiesList;
  }
  //#endregion

  constructor(
    @Inject(MAT_DIALOG_DATA) private _initialProject: Project,
    dialogRef: MatDialogRef<TaksCreationDialogComponent>,
    restService: SingleTaskRestService,
    snackBarService: SnackBarService,
    private _formBuilder: FormBuilder
  ) {
    super(dialogRef, restService, snackBarService)
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      title: ['', [Validators.required]],
      project: [{ value: this._initialProject || null, disabled: !!this._initialProject }, [Validators.required]],
      dutyDate: ['', [Validators.required]],
      priority: [null, [Validators.required]],
      description: ['', [Validators.required]],
      workers: [[]],
    })
  }

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    // Validators
    if (control.hasError('required')) return 'Wartośc jest wymagana.';
    if (control.hasError('matDatepickerParse')) return 'Nieprawidłowy format daty.';
    return null;
  }

  protected parseItemFromForm(): Task {
    const value = {
      _id: null,
      creationDate: null,
      projectStringId: null,
      reporter: null,
      stringId: null,
      project: null,
      status: Status.NEW,
      title: this._form.get('title').value,
      idProject: this._form.get('project').value._id,
      dutyDate: this._form.get('dutyDate').value,
      description: this._form.get('description').value,
      workers: this._form.get('workers').value
        ? this._form.get('workers').value.map(worker => worker._id)
        : [],
      priority: this._form.get('priority').value,
      // TODO: Pass currently logged user id
      idReporter: "5fca51ef55624130600cccfb",
    } as Task;

    console.log(value);
    return value;
  }

  public updateWorkers(workers: User[]): void {
    this._form.get('workers').patchValue(workers || []);
  }

  //#region Helpers
  public getPriorityString(value: Priority): string {
    return PriorityStringifier.getPriorityString(value);
  }
  //#endregion
}
