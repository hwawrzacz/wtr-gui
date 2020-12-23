import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, take, tap } from 'rxjs/operators';
import { phoneNumberValidator } from 'src/app/helpers/custom-validators';
import { PositionStringifier } from 'src/app/helpers/parsers';
import { Position } from 'src/app/model/enums/position';
import { SimpleUser } from 'src/app/model/simple-user';
import { UserCredentials } from 'src/app/model/user-credentials';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { SingleUserRestService } from 'src/app/services/rest/single-user-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CommonItemDetailsComponent } from '../../components/common-item-details/common-item-details.component';
import { ImageCaptureDialogComponent } from '../../components/image-capture-dialog/image-capture-dialog.component';
import { PasswordChangeDialogComponent } from '../../components/password-change-dialog/password-change-dialog.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['../../components/common-item-details/common-item-details.component.scss', './user-details.component.scss']
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
    restService: SingleUserRestService,
    formBuilder: FormBuilder,
    changeDetector: ChangeDetectorRef,
    snackBarService: SnackBarService,
    private _dialogService: MatDialog,
  ) {
    super(navigator, broker, restService, formBuilder, changeDetector, snackBarService);
  }

  //#region Initializers
  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      login: [{ value: '', disabled: true }, [Validators.required]],
      firstName: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      lastName: [{ value: '', disabled: true }, [Validators.required]],
      phoneNumber: [{ value: '', disabled: true }, [Validators.required, phoneNumberValidator()]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      role: [{ value: '', disabled: true }, [Validators.required]],
    })
  }

  protected updateForm(user: SimpleUser): void {
    this._form.patchValue({
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
    })
  }

  private loadCredentials() {
    this._loadingCounter++;
    this._error = false;
    (this._restService as SingleUserRestService).getCredentials(this._itemId)
      .pipe(
        take(1),
        tap((credentials: UserCredentials) => {
          this._loadingCounter--;
          if (!!credentials) {
            this._faceImageUrl = credentials.facePhoto;
            this._qrCodeUrl = credentials.qrCode;
          } else {
            console.error('error while getting credentials');
            this._error = true;
          }
        })
      )
      .subscribe()
  }
  //#endregion

  ngOnInit(): void {
    super.ngOnInit();
    this.loadCredentials();
  }

  //#region Dialogs
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
  //#endregion

  //#region Updaters
  public setPreviewAndUpdateImage(imageUrl: string): void {
    this._faceImageUrl = imageUrl;
    this.updatePhoto(this._faceImageUrl);
  }

  public updatePhoto(imageUrl: string): void {
    this.patch('facePhoto', imageUrl);
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
