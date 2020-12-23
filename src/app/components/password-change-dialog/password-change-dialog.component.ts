import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take, tap } from 'rxjs/operators';
import { matchOtherControlValidator } from 'src/app/helpers/custom-validators';
import { SingleUserRestService } from 'src/app/services/rest/single-user-rest.service';

@Component({
  selector: 'app-password-change-dialog',
  templateUrl: './password-change-dialog.component.html',
  styleUrls: ['./password-change-dialog.component.scss']
})
export class PasswordChangeDialogComponent implements OnInit {
  private _form: FormGroup;
  private _userId: string;
  private _isLoading: boolean;

  public get form(): FormGroup {
    return this._form;
  }

  public get hasUserId(): boolean {
    return !!this._userId;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _restService: SingleUserRestService,
    private _dialog: MatDialogRef<PasswordChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) userId: string
  ) {
    this._isLoading = false;
    this._userId = userId;
    this._form = this.buildPasswordForm();
  }

  ngOnInit(): void {
  }

  private buildPasswordForm(): FormGroup {
    return this._formBuilder.group({
      password: [{ value: null, disabled: !this._userId }, [Validators.required]],
      repeatPassword: [{ value: null, disabled: !this._userId }, [Validators.required, matchOtherControlValidator('password')]]
    })
  }

  //#region Data savers 
  public changePassword(): void {
    const newPassword = this._form.get('password').value;
    this._isLoading = true;
    this._restService.patch<string>(this._userId, 'password', newPassword)
      .pipe(
        take(1),
        tap(res => this._dialog.close(res))
      ).subscribe();
  }

  public discard(): void {
    this._dialog.close(null);
  }
  //#endregion

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('required')) return 'Password is required';
    if (control.hasError('passwordMatches')) return 'Passwords are not the same';
  }

  public getPasswordErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('passwordMatches')) return 'Passwords are not the same';
  }
}
