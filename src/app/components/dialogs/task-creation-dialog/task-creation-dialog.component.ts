import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { PriorityStringifier } from 'src/app/helpers/parsers';
import { Priority } from 'src/app/model/enums/priority';
import { Status } from 'src/app/model/enums/status';
import { Project } from 'src/app/model/project';
import { Task } from 'src/app/model/task';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';
import { SingleTaskRestService } from 'src/app/services/rest/single-task-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CommonCreationDialogComponent } from '../common-creation-dialog/common-creation-dialog.component';

@Component({
  selector: 'app-task-creation-dialog',
  templateUrl: './task-creation-dialog.component.html',
  styleUrls: ['../common-creation-dialog/common-creation-dialog.component.scss', './task-creation-dialog.component.scss']
})
export class TaskCreationDialogComponent extends CommonCreationDialogComponent<Task> implements OnInit {
  //#region Getters and setters
  get currentUserId(): string {
    return this._authService.userId;
  }

  get rootProject(): Project {
    return this._rootProject || this.projectFormControl.value;
  }

  get minDate(): Date {
    return new Date();
  }

  get maxDate(): Date {
    return this._rootProject ? new Date(this._rootProject.dutyDate) : null;
  }

  get projectFormControl(): AbstractControl {
    return this._form.get('project');
  }

  get priorities(): Priority[] {
    return PriorityStringifier.prioritiesList;
  }
  //#endregion

  constructor(
    @Inject(MAT_DIALOG_DATA) private _rootProject: Project,
    dialogRef: MatDialogRef<TaskCreationDialogComponent>,
    restService: SingleTaskRestService,
    snackBarService: SnackBarService,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
  ) {
    super(dialogRef, restService, snackBarService)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.addProjectChangeListener();
  }

  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      title: ['', [Validators.required]],
      project: [{ value: this._rootProject || null, disabled: !!this._rootProject }, [Validators.required]],
      dutyDate: ['', [Validators.required]],
      priority: [null, [Validators.required]],
      description: ['', [Validators.required]],
      workers: [[]],
    })
  }

  private addProjectChangeListener(): void {
    this._form.get('project').valueChanges
      .pipe(
        takeUntil(this._destroyed$),
        filter(value => typeof value === 'object'),
        tap((value) => {
          console.log(value);
          this._rootProject = value;
        })
      ).subscribe();
  }

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    // Validators
    if (control.hasError('required')) return 'Pole jest wymagane.';
    if (control.hasError('matdatepickerparse')) return 'Nieprawidłowy format daty.';
    if (control.hasError('min')) return 'Wartość jest za mała.';
    if (control.hasError('max')) return 'Wartość jest za duża.';
    if (!control.valid) return 'Pole jest nieprawidłowe 🤐';

    return null;
  }

  protected parseItemFromForm(): Task {
    return {
      _id: null,
      creationDate: null,
      projectStringId: null,
      reporter: this._authService.user,
      stringId: null,
      project: null,
      status: Status.NEW,
      title: this._form.get('title').value,
      idProject: this._form.get('project').value._id,
      dutyDate: new Date(this._form.get('dutyDate').value).toISOString(),
      description: this._form.get('description').value,
      workers: this._form.get('workers').value.map(worker => worker._id),
      priority: this._form.get('priority').value,
      idReporter: this._authService.userId,
    } as Task;
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
