import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CreationResponse } from 'src/app/model/responses';
import { CreationResponseMessage } from 'src/app/model/enums/response-messages';
import { CommonRestService } from 'src/app/services/common-rest.service';
import { INFO_SNACKBAR_DURATION, SUCCESS_SNACKBAR_DURATION } from 'src/app/model/constants';

@Component({
  selector: 'app-common-creation-dialog',
  templateUrl: './common-creation-dialog.component.html',
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
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this._form = this.buildForm();
  }

  /** Common abstract */
  protected abstract buildForm(): FormGroup;

  protected abstract parseItemFromForm(): T;

  /** Common */
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

        if (res.success)
          this.closeDialog(true);
        else
          this.handleCreationFailed(res.message);
      }),
      catchError(err => {
        this._isLoading = false;
        this.handleItemNotAdded();
        return of()
      })
    ).subscribe();
  }

  //#region Response handlers
  /** Common */
  private handleItemNotAdded(): void {
    this.openSuccessSnackBar('Error while adding user');
  }

  private handleCreationFailed(message: string) {
    switch (message) {
      case CreationResponseMessage.LOGIN_IS_TAKEN: {
        this.openSuccessSnackBar('This login is already taken');
        break;
      }
      default: {
        this.openSuccessSnackBar(message);
      };
    }
  }
  //#endregion

  public hasError(controlName: string): boolean {
    return !this._form.get(controlName).valid;
  };

  public abstract getErrorMessage(controlName: string): string;

  //#region Snackbar 
  private openSuccessSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', { duration: SUCCESS_SNACKBAR_DURATION });
  }

  private openInfoSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', { duration: INFO_SNACKBAR_DURATION });
  }

  private openErrorSnackBar(message: string) {
    this._snackBar.open(message, 'Ok');
  }
  //#endregion

  //#region Helpers
  public closeDialog(success = false): void {
    this._dialogRef.close(success);
  }
  //#endregion
}
