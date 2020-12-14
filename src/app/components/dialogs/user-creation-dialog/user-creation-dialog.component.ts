import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { phoneNumberValidator } from 'src/app/helpers/custom-validators';
import { PositionStringifier } from 'src/app/helpers/parsers';
import { Position } from 'src/app/model/enums/position';

@Component({
  selector: 'app-user-creation-dialog',
  templateUrl: './user-creation-dialog.component.html',
  styleUrls: ['./user-creation-dialog.component.scss']
})
export class UserCreationDialogComponent implements OnInit {
  private _form: FormGroup;

  //#region Getters and setters
  get form(): FormGroup {
    return this._form;
  }

  public get positionsList(): Position[] {
    return PositionStringifier.positionList;
  }
  //#endregion

  constructor(
    private _dialogRef: MatDialogRef<UserCreationDialogComponent>,
    private _formBuilder: FormBuilder,
  ) {
    this._form = this.buildForm();
  }

  ngOnInit(): void { }

  /** Common abstract */
  private buildForm(): FormGroup {
    return this._formBuilder.group({
      login: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, phoneNumberValidator()]],
      email: ['', [Validators.required, Validators.email]],
      role: [null, [Validators.required]],
    })
  }

  /** Common */
  public onSave(): void {
    // TODO: Call user create method 
    of(true).pipe(
      tap(res => {
        if (res) this._dialogRef.close(true);
        else this.handleUserNotAdded();
      })
    ).subscribe();
  }

  /** Common */
  private handleUserNotAdded(): void {
    console.error('User not added');
  }

  /** Common */
  public closeDialog(): void {
    this._dialogRef.close(null);
  }

  //#region Helpers
  /** Common */
  public hasError(controlName: string): boolean {
    return this._form.get(controlName).valid;
  };

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('required')) return 'Value is required';
    if (control.hasError('email')) return 'Value must be a valid email';
    if (control.hasError('phoneNumber')) return 'Value must contain only digits';
    if (control.hasError('minLength')) return 'Value is too short';
    if (control.hasError('maxLength')) return 'Value is too long';
  }

  public getPositionString(position: Position): string {
    return PositionStringifier.getPositionString(position);
  }
  //#endregion
}
