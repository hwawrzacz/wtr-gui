import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CreationResponse } from 'src/app/model/responses';
import { CreationResponseMessage } from 'src/app/model/enums/response-messages';
import { CommonRestService } from 'src/app/services/rest/common-rest.service';
import { INFO_SNACKBAR_DURATION, SUCCESS_SNACKBAR_DURATION } from 'src/app/model/constants';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-common-creation-dialog',
  template: '',
  styleUrls: ['./common-creation-dialog.component.scss']
})
export abstract class CommonCreationDialogComponent<T> implements OnInit {
  protected _form: FormGroup
  protected _isLoading: boolean;

  //#region Getters and setters
  public get form(): FormGroup {
    return this._form;
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }
  //#endregion

  constructor(
    private _dialogRef: MatDialogRef<CommonCreationDialogComponent<T>>,
    private _restService: CommonRestService<T>,
    private _snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
    this._form = this.buildForm();
  }

  protected abstract buildForm(): FormGroup;

  protected abstract parseItemFromForm(): T;

  public onSave(): void {
    this._isLoading = true;
    const item = this.parseItemFromForm();
    this._restService.create<T>(item).pipe(
      map(res => {
        const success = res === true;
        const message = res.toString();
        return { success: success, message: message } as CreationResponse;
      }),
      tap(res => {
        this._isLoading = false;

        if (res.success) {
          /** Success message unlike errors messages should be handled in component which 
           * opens this dialog, so there is no need to handle this message from here */
          this.closeDialog(true);
        }
        else
          this.handleCreationFailed(res.message);
      }),
      catchError(err => {
        this._isLoading = false;
        this.handleItemNotAdded(err);
        return of()
      })
    ).subscribe();
  }

  //#region Response handlers
  private handleItemNotAdded(error: string): void {
    this.openErrorSnackBar('Podczas tworzenia elementu wystąpił błąd.');
    console.error(error);
  }

  private handleCreationFailed(message: string) {
    switch (message) {
      case CreationResponseMessage.LOGIN_IS_TAKEN: {
        this.openErrorSnackBar('Login jest już zajęty');
        break;
      }
      case CreationResponseMessage.INVALID_DUTY_DATE: {
        this.openErrorSnackBar('Data jest nieprawidłowa');
        break;
      }
      case CreationResponseMessage.PROJECT_VALIDATION_FAILED: {
        this.openErrorSnackBar('Pola nie są poprawne');
        break;
      }
      default: {
        this.openErrorSnackBar('Podczas tworzenia elementu wystąpił błąd.');
        console.error(message)
      };
    }
  }
  //#endregion

  public abstract getErrorMessage(controlName: string): string;

  //#region Snackbar 
  private openErrorSnackBar(message: string) {
    this._snackBarService.openErrorSnackBar(message)
  }
  //#endregion

  //#region Helpers
  public closeDialog(success = false): void {
    this._dialogRef.close(success);
  }
  //#endregion
}
