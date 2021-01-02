import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { matchOtherControlValidator, passwordValidator } from 'src/app/helpers/custom-validators';
import { Encrypter } from 'src/app/helpers/encrypter';
import { PatchResponse } from 'src/app/model/responses';
import { SingleUserRestService } from 'src/app/services/rest/single-user-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

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
    @Inject(MAT_DIALOG_DATA) userId: string,
    private _formBuilder: FormBuilder,
    private _restService: SingleUserRestService,
    private _dialog: MatDialogRef<PasswordChangeDialogComponent>,
    private _snackBarService: SnackBarService,
  ) {
    this._isLoading = false;
    this._userId = userId;
    this._form = this.buildPasswordForm();
  }

  ngOnInit(): void {
  }

  private buildPasswordForm(): FormGroup {
    return this._formBuilder.group({
      password: [{ value: null, disabled: !this._userId }, [Validators.required, passwordValidator()]],
      repeatPassword: [{ value: null, disabled: !this._userId }, [Validators.required, matchOtherControlValidator('password')]]
    })
  }

  //#region Data savers 
  public changePassword(): void {
    const newPassword = Encrypter.encrypt(this._form.get('password').value);
    this._isLoading = true;
    this._restService.patch<string>(this._userId, 'password', newPassword)
      .pipe(
        take(1),
        tap((res: PatchResponse) => {
          this._isLoading = false;
          if (res.success) {
            this._dialog.close(true);
          } else {
            this.handleResponseError(res);
          }
          this._dialog.close(res)
        }),
        catchError(() => this.handleRequestError())
      ).subscribe();
  }

  private handleResponseError(res: PatchResponse): void {
    this._snackBarService.openErrorSnackBar('Podczas zmiany hasła wystąpił błąd.', res.message);
  }

  private handleRequestError(): Observable<any> {
    return of(this._snackBarService.openErrorSnackBar('Podczas wysyłania zapytania wystąpił błąd.'));
  }

  public discard(): void {
    this._dialog.close(null);
  }
  //#endregion

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('required')) return 'Hasło jest wymagane.';
    if (control.hasError('invalidPasswordCharacter')) return 'Dozwolone znaki: a-Z 0-9 oraz !@#$%^&*()_+-=';
    if (control.hasError('passwordMatches')) return 'Hasła nie są takie same.';
  }
}
