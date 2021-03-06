import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd } from '@angular/router';
import { filter, take, takeUntil, tap } from 'rxjs/operators';
import { phoneNumberValidator } from 'src/app/helpers/custom-validators';
import { PositionStringifier } from 'src/app/helpers/parsers';
import { Position } from 'src/app/model/enums/position';
import { SingleItemResponse } from 'src/app/model/responses';
import { SimpleUser } from 'src/app/model/simple-user';
import { UserCredentials } from 'src/app/model/user-credentials';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { SingleUserRestService } from 'src/app/services/rest/single-user-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CommonItemDetailsComponent } from '../../components/common-item-details/common-item-details.component';
import { ImageCaptureDialogComponent } from '../../components/image-capture-dialog/image-capture-dialog.component';
import { PasswordChangeDialogComponent } from '../../components/password-change-dialog/password-change-dialog.component';
import { MobileDetectorService } from 'src/app/services/mobile-detector.service';

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
    return this._initialItem ? this._initialItem.login : '';
  }
  //#endregion

  constructor(
    navigator: NavigatorService<SimpleUser>,
    broker: ItemDetailsBrokerService<SimpleUser>,
    restService: SingleUserRestService,
    formBuilder: FormBuilder,
    changeDetector: ChangeDetectorRef,
    snackBarService: SnackBarService,
    dialogService: MatDialog,
    authService: AuthService,
    mobileDetector: MobileDetectorService,
  ) {
    super(navigator, broker, restService, formBuilder, changeDetector, snackBarService, dialogService, authService, mobileDetector)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.subscribeToUrlChange();
    this.loadCredentials();
  }

  //#region Initializers

  private subscribeToUrlChange(): void {
    this._navigator.urlChanges$.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._destroyed),
      tap(() => {
        console.log('change');
        if (!!this.itemId) {
          this.reloadData();
          this.loadCredentials();
        }
      })
    ).subscribe();
  }

  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      firstName: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      lastName: [{ value: '', disabled: true }, [Validators.required]],
      phoneNumber: [{ value: '', disabled: true }, [Validators.required, phoneNumberValidator()]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      role: [{ value: '', disabled: true }, [Validators.required]],
    })
  }

  protected updateForm(user: SimpleUser): void {
    this._form.patchValue({
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
    (this._restService as SingleUserRestService).getCredentials(this.itemId)
      .pipe(
        take(1),
        tap((res: SingleItemResponse<UserCredentials>) => {
          if (res.success) {
            this._faceImageUrl = res.details.facePhoto;
            this._qrCodeUrl = res.details.qrCode;
          } else {
            this._error = true;
            this.openErrorSnackBar('Podczas pobierania danych logowania wystąpił błąd.');
          }
          this._loadingCounter--;
        })
      )
      .subscribe()
  }
  //#endregion

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
      data: this.itemId,
      maxWidth: '90vw',
      minWidth: '300px',
      width: '50%'
    }).afterClosed()
      .pipe(
        take(1),
        tap(res => res
          ? this.openSuccessSnackBar("Hasło zostało zmienione.")
          : this.openInfoSnackBar("Anulowano zmianę hasła"))
      )
      .subscribe();
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

  //#region Permission
  public canEdit(): boolean {
    return (
      // !this.isMobile
      // && (
      // If is admin
      this._authService.isAdmin
      // If users is viewing ites own profile
      || this._navigator.getIdFromUrl() === this._authService.user._id
      // )
    );
  }
  public canDelete(): boolean {
    return this._authService.isAdmin;
  }
  //#endregion

  //#region Helpers
  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('required')) return 'Pole jest wymagane.';
    if (control.hasError('email')) return 'Nieprawidłowy format adresu email.';
    if (control.hasError('phoneNumber')) return 'Pole może zawierać tylko cyfry.';
    if (control.hasError('minLength')) return 'Wartość jest za krótka.';
    if (control.hasError('maxLength')) return 'Wartość jest za długa.';
    if (control.hasError('passwordMatches')) return 'Hasła nie są takie same.';
  }

  public getPositionString(position: Position): string {
    return PositionStringifier.getPositionString(position);
  }
  //#endregion
}
