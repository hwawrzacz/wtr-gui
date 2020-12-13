import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError, filter, take, tap } from 'rxjs/operators';
import { PositionStringifier } from 'src/app/helpers/parsers';
import { Position } from 'src/app/model/enums/position';
import { SimpleUser } from 'src/app/model/simple-user';
import { UserCredentials } from 'src/app/model/user-credentials';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { UserRestService } from 'src/app/services/user-rest.service';
import { CommonItemDetailsComponent } from '../common-item-details/common-item-details.component';
import { ImageCaptureDialogComponent } from '../image-capture-dialog/image-capture-dialog.component';
import { PasswordChangeDialogComponent } from '../password-change-dialog/password-change-dialog.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['../common-item-details/common-item-details.component.scss', './user-details.component.scss']
})
export class UserDetailsComponent extends CommonItemDetailsComponent<SimpleUser> implements OnInit {
  private _qrCodeUrl: string;
  private _faceImageUrl: string;

  //#region Getters and setters
  public get positionsList(): Position[] {
    return PositionStringifier.positionList;
  }

  public get qrCodeUrl(): string {
    return this._qrCodeUrl;
  }

  public get faceImageUrl(): string {
    return this._faceImageUrl;
  }

  public get login(): string {
    return this._initialItem.login;
  }
  //#endregion

  constructor(
    navigator: NavigatorService<SimpleUser>,
    broker: ItemDetailsBrokerService<SimpleUser>,
    restService: UserRestService,
    formBuilder: FormBuilder,
    private _dialogService: MatDialog
  ) {
    super(navigator, broker, restService, formBuilder);
  }

  //#region Initializers
  protected setEditables(): void {
    this._editables = new Map([]);
  }

  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      login: [{ value: this._initialItem.login, disabled: true }, [Validators.required]],
      firstName: [{ value: this._initialItem.firstName, disabled: true }, [Validators.required, Validators.minLength(2)]],
      lastName: [{ value: this._initialItem.lastName, disabled: true }, [Validators.required]],
      phoneNumber: [{ value: this._initialItem.phoneNumber, disabled: true }, [Validators.required, this.phoneNumberValidator()]],
      email: [{ value: this._initialItem.email, disabled: true }, [Validators.required, Validators.email]],
      position: [{ value: this._initialItem.role, disabled: true }, [Validators.required]],
    })
  }

  private loadCredentials() {
    this._loadingCounter++;
    this._error = false;
    (this._restService as UserRestService).getCredentials(this._itemId)
      .pipe(
        take(1),
        tap((credentials: UserCredentials) => {
          this._loadingCounter--;
          console.log(credentials);
          if (!!credentials) {
            this._faceImageUrl = credentials.facePhoto;
            this._qrCodeUrl = credentials.qrCode;
          } else {
            console.log('error');
            this._error = true;
          }
        })
      )
      .subscribe()
  }

  //#region Custom validators
  private phoneNumberValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any | null } => control.value.toString().match(/[0-9]{9}/) == control.value ? { phoneNumber: true } : null;
  }
  //#endregion
  //#endregion

  ngOnInit(): void {
    super.ngOnInit();
    this.loadCredentials();
  }

  public openImageCaptureDialog(): void {
    this._dialogService.open(ImageCaptureDialogComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter(result => !!result),
        tap(result => this.setPreviewAndUpdateImage(result))
      ).subscribe();
  }

  public openPasswordChangeDialog(): void {
    this._dialogService.open(PasswordChangeDialogComponent, {
      data: this._itemId
    }).afterClosed().pipe(
      take(1),
      tap(res => console.log(`Password ${res ? '' : 'not '}changed`))
    ).subscribe();
  }

  public setPreviewAndUpdateImage(imageUrl: string): void {
    this._faceImageUrl = imageUrl;
    this.updatePhoto(this._faceImageUrl);
  }


  //#region Updaters
  public updatePhoto(imageUrl: string): void {
    this.patch<string>('facePhoto', imageUrl)
  }

  private patch<T>(name: string, value: T): void {
    (this._restService as UserRestService)
      .patch<T>(this._itemId, name, value)
      .pipe(
        // TODO: Handle success and error SnackBar
        tap(response => console.log(response)),
        catchError(e => of(console.error(e)))
      ).subscribe();
  }
  //#endregion

  //#region Helpers
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
