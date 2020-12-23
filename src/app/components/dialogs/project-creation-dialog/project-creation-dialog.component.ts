import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Project } from 'src/app/model/project';
import { SimpleUser } from 'src/app/model/simple-user';
import { User } from 'src/app/model/user';
import { SingleProjectRestService } from 'src/app/services/rest/single-project-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CommonCreationDialogComponent } from '../common-creation-dialog/common-creation-dialog.component';

@Component({
  selector: 'app-project-creation-dialog',
  templateUrl: './project-creation-dialog.component.html',
  styleUrls: ['../common-creation-dialog/common-creation-dialog.component.scss', './project-creation-dialog.component.scss']
})
export class ProjectCreationDialogComponent extends CommonCreationDialogComponent<Project> implements OnInit {
  private _manager: SimpleUser | User;

  get hasManager(): boolean {
    return !!this._manager;
  }

  get minDate(): Date {
    return new Date();
  }

  get managerFormControl(): AbstractControl {
    return this._form.get('manager');
  }

  constructor(
    dialogRef: MatDialogRef<ProjectCreationDialogComponent>,
    restService: SingleProjectRestService,
    snackBarService: SnackBarService,
    private _formBuilder: FormBuilder,
  ) {
    super(dialogRef, restService, snackBarService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      title: [null, [Validators.required]],
      manager: [null, [Validators.required]],
      dutyDate: [null, [Validators.required]],
      description: [null, [Validators.required]],
    })
  }

  protected parseItemFromForm(): Project {
    return {
      _id: null,
      stringId: null,
      title: this._form.get('title').value,
      description: this._form.get('description').value,
      manager: this._form.get('manager').value,
      idManager: this._form.get('manager').value._id,
      creationDate: null,
      dutyDate: this.parseDateToISOFormat(this._form.get('dutyDate').value),
      workers: [],
    } as Project
  }

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    // Validators
    if (control.hasError('required')) return 'Wartośc jest wymagana.';
    if (control.hasError('matDatepickerParse')) return 'Nieprawidłowy format daty.';
    return null;
  }

  public reassignManager(manager: User | SimpleUser): void {
    this._manager = manager;
    this._form.get('manager').patchValue(this._manager);
  }

  private parseDateToISOFormat(date: Date): string {
    return date.toISOString();
  }
}
