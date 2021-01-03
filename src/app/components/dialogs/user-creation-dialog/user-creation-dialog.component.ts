import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter, take, tap } from 'rxjs/operators';
import { matchOtherControlValidator, passwordValidator, phoneNumberValidator } from 'src/app/helpers/custom-validators';
import { Encrypter } from 'src/app/helpers/encrypter';
import { PositionStringifier } from 'src/app/helpers/parsers';
import { Position } from 'src/app/model/enums/position';
import { User } from 'src/app/model/user';
import { SingleUserRestService } from 'src/app/services/rest/single-user-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ImageCaptureDialogComponent } from '../../image-capture-dialog/image-capture-dialog.component';
import { CommonCreationDialogComponent } from '../common-creation-dialog/common-creation-dialog.component';

@Component({
  selector: 'app-user-creation-dialog',
  templateUrl: './user-creation-dialog.component.html',
  styleUrls: ['../common-creation-dialog/common-creation-dialog.component.scss', './user-creation-dialog.component.scss']
})
export class UserCreationDialogComponent extends CommonCreationDialogComponent<User> implements OnInit {
  private _faceImageUrl: string;

  //#region Getters and setters
  get faceImageUrl(): string {
    return this._faceImageUrl;
  }

  public get positionsList(): Position[] {
    return PositionStringifier.positionList;
  }
  //#endregion

  constructor(
    dialogRef: MatDialogRef<CommonCreationDialogComponent<User>>,
    restService: SingleUserRestService,
    snackBarService: SnackBarService,
    private _formBuilder: FormBuilder,
    private _dialogService: MatDialog,
  ) {
    super(dialogRef, restService, snackBarService)
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, passwordValidator()]],
      repeatPassword: ['', [Validators.required, matchOtherControlValidator('password')]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, phoneNumberValidator()]],
      email: ['', [Validators.required, Validators.email]],
      role: [null, [Validators.required]],
    })
  }

  protected parseItemFromForm(): User {
    return {
      login: this._form.get('login').value,
      password: Encrypter.encrypt(this._form.get('password').value),
      facePhoto: this._faceImageUrl,
      firstName: this._form.get('firstName').value,
      lastName: this._form.get('lastName').value,
      email: this._form.get('email').value,
      phoneNumber: this._form.get('phoneNumber').value,
      role: this._form.get('role').value,
    } as User
  }

  public openImageCaptureDialog(): void {
    this._dialogService.open(ImageCaptureDialogComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter(result => !!result),
        tap(result => this.setImagePreview(result))
      ).subscribe();
  }

  public setImagePreview(imageUrl: string): void {
    this._faceImageUrl = imageUrl;
  }

  //#region Helpers

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    // Validators
    if (control.hasError('required')) return 'Pole jest wymagane.';
    if (control.hasError('email')) return 'Nieprawidłowy format adresu email.';
    if (control.hasError('phoneNumber')) return 'Pole może zawierać tylko cyfry.';
    if (control.hasError('minLength')) return 'Wartość jest za krótka.';
    if (control.hasError('maxLength')) return 'Wartość jest za długa.';
    if (control.hasError('invalidPasswordCharacter')) return 'Dozwolone znaki: a-Z 0-9 oraz !@#$%^&*()_+-=';
    if (control.hasError('passwordMatches')) return 'Hasła nie są takie same.';
    return null;
  }

  public getPositionString(position: Position): string {
    return PositionStringifier.getPositionString(position);
  }
  //#endregion
}
