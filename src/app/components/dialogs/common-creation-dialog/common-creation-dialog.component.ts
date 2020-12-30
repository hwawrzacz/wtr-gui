import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CreationResponseParser } from 'src/app/helpers/parsers';
import { CreationResponseMessage } from 'src/app/model/enums/response-messages';
import { PatchResponse } from 'src/app/model/responses';
import { CommonRestService } from 'src/app/services/rest/common-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-common-creation-dialog',
  template: '',
  styleUrls: ['./common-creation-dialog.component.scss']
})
export abstract class CommonCreationDialogComponent<T> implements OnInit, OnDestroy {
  protected _form: FormGroup
  protected _isLoading: boolean;
  protected _destroyed$: Subject<void>;

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
    this._destroyed$ = new Subject();
    this._form = this.buildForm();
  }

  protected abstract buildForm(): FormGroup;

  protected abstract parseItemFromForm(): T;

  public onSave(): void {
    this._isLoading = true;
    const item = this.parseItemFromForm();
    this._restService.create<T>(item)
      .pipe(
        tap((res: PatchResponse) => {
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

  private handleCreationFailed(message: CreationResponseMessage) {
    const messageStr = CreationResponseParser.parseCreationResponseMessage(message);
    this.openErrorSnackBar(messageStr);
  }
  //#endregion

  public abstract getErrorMessage(controlName: string): string;

  //#region Snackbar 
  private openErrorSnackBar(message: string, details?: string) {
    this._snackBarService.openErrorSnackBar(message, details);
  }
  //#endregion

  //#region Helpers
  public closeDialog(success = false): void {
    this._dialogRef.close(success);
  }
  //#endregion

  ngOnDestroy(): void {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
