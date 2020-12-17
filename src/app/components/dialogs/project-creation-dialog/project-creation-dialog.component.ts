import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from 'src/app/model/project';
import { SimpleUser } from 'src/app/model/simple-user';
import { User } from 'src/app/model/user';
import { ProjectRestService } from 'src/app/services/project-rest.service';
import { CommonCreationDialogComponent } from '../common-creation-dialog/common-creation-dialog.component';

@Component({
  selector: 'app-project-creation-dialog',
  templateUrl: './project-creation-dialog.component.html',
  styleUrls: ['./project-creation-dialog.component.scss']
})
export class ProjectCreationDialogComponent extends CommonCreationDialogComponent<Project> implements OnInit {
  private _manager: SimpleUser | User;

  get hasManager(): boolean {
    return !!this._manager;
  }

  constructor(
    dialogRef: MatDialogRef<ProjectCreationDialogComponent>,
    restService: ProjectRestService,
    snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
  ) {
    super(dialogRef, restService, snackBar);
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
      id: null,
      stringId: null,
      title: this._form.get('title').value,
      description: this._form.get('description').value,
      manager: this._form.get('manager').value,
      creationDate: null,
      dutyDate: this._form.get('dutyDate').value,
      workers: [],
    } as Project
  }

  public reassignManager(manager: User | SimpleUser): void {
    console.log(manager);
    this._manager = manager;
  }
}
