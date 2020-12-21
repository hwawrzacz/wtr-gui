import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Status } from 'src/app/model/enums/status';
import { Task } from 'src/app/model/task';
import { TaskService } from 'src/app/services/task.service';
import { CommonCreationDialogComponent } from '../common-creation-dialog/common-creation-dialog.component';

@Component({
  selector: 'app-taks-creation-dialog',
  templateUrl: './taks-creation-dialog.component.html',
  styleUrls: ['../common-creation-dialog/common-creation-dialog.component.scss', './taks-creation-dialog.component.scss']
})
export class TaksCreationDialogComponent extends CommonCreationDialogComponent<Task> implements OnInit {
  get minDate(): Date {
    return new Date();
  }

  constructor(
    dialogRef: MatDialogRef<TaksCreationDialogComponent>,
    restService: TaskService,
    snackBar: MatSnackBar,
    private _formBuilder: FormBuilder
  ) {
    super(dialogRef, restService, snackBar)
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      title: ['', [Validators.required]],
      project: ['', [Validators.required]],
      dutyDate: ['', [Validators.required]],
      priority: [null, [Validators.required]],
      description: ['', [Validators.required]],
    })
  }

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('required')) return 'Value is required';
    if (control.hasError('matDatepickerParse')) return 'Invalid date format';
    return null;
  }

  protected parseItemFromForm(): Task {
    return {
      _id: null,
      creationDate: null,
      projectStringId: null,
      reporter: null,
      stringId: null,
      status: Status.NEW,
      title: this._form.get('title').value,
      idProject: this._form.get('title').value._id,
      dutyDate: this._form.get('dutyDate').value,
      description: this._form.get('description').value,
      priority: this._form.get('priority').value,

      idReporter: "5fca51ef55624130600cccfb",
      workers: [],
    } as Task;
  }

}
