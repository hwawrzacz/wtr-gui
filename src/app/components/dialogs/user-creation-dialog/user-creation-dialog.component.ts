import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { catchError, filter, take, tap } from 'rxjs/operators';
import { matchOtherControlValidator, phoneNumberValidator } from 'src/app/helpers/custom-validators';
import { PositionStringifier } from 'src/app/helpers/parsers';
import { CreationResponse } from 'src/app/model/creation-response';
import { Position } from 'src/app/model/enums/position';
import { User } from 'src/app/model/user';
import { UserRestService } from 'src/app/services/user-rest.service';
import { ImageCaptureDialogComponent } from '../../image-capture-dialog/image-capture-dialog.component';

@Component({
  selector: 'app-user-creation-dialog',
  templateUrl: './user-creation-dialog.component.html',
  styleUrls: ['./user-creation-dialog.component.scss']
})
export class UserCreationDialogComponent implements OnInit {
  /** Common */
  private _form: FormGroup;
  private _faceImageUrl: string;
  /** Common */
  private _isLoading: boolean;

  //#region Getters and setters
  get form(): FormGroup {
    return this._form;
  }

  get faceImageUrl(): string {
    return this._faceImageUrl;
  }

  /** Common */
  get isLoading(): boolean {
    return this._isLoading;
  }

  public get positionsList(): Position[] {
    return PositionStringifier.positionList;
  }
  //#endregion

  constructor(
    private _dialogRef: MatDialogRef<UserCreationDialogComponent>,
    private _formBuilder: FormBuilder,
    private _dialogService: MatDialog,
    private _restService: UserRestService,
  ) {
    this._form = this.buildForm();
  }

  ngOnInit(): void { }

  /** Common abstract */
  private buildForm(): FormGroup {
    return this._formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required, matchOtherControlValidator('password')]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, phoneNumberValidator()]],
      email: ['', [Validators.required, Validators.email]],
      role: [null, [Validators.required]],
    })
  }

  /** Common */
  public onSave(): void {
    this._isLoading = true;
    // TODO: Call user create method
    const user = this.parseUserFromForm();
    console.log(user);
    this._restService.create<User>(user).pipe(
      tap(res => {
        this._isLoading = false;
        if (res === CreationResponse.LOGIN_IS_TAKEN) {
          this.handleLoginTaken(res);
        }
        else if (!!res) this._dialogRef.close(res);
      }),
      catchError(err => {
        this._isLoading = false;
        this.handleItemNotAdded(err);
        return of()
      })
    ).subscribe();
  }

  private parseUserFromForm(): User {
    return {
      _id: null,
      login: this._form.get('login').value,
      password: this._form.get('password').value,
      facePhoto: this._faceImageUrl,
      firstName: this._form.get('firstName').value,
      lastName: this._form.get('lastName').value,
      email: this._form.get('email').value,
      phoneNumber: this._form.get('phoneNumber').value,
      role: this._form.get('role').value,
    } as User
  }

  //#region Response handlers
  /** Common */
  private handleItemNotAdded(error: any): void {
    // TODO: display proper message
    console.error('User not added', error);
  }

  private handleLoginTaken(error: any): void {
    // TODO: display proper message
    console.error('This login is already taken', error);
  }
  //#endregion

  /** Common */
  public closeDialog(): void {
    this._dialogRef.close(null);
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
  /** Common */
  public hasError(controlName: string): boolean {
    return !this._form.get(controlName).valid;
  };

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('required')) return 'Value is required';
    if (control.hasError('email')) return 'Value must be a valid email';
    if (control.hasError('phoneNumber')) return 'Value must contain only digits';
    if (control.hasError('minLength')) return 'Value is too short';
    if (control.hasError('maxLength')) return 'Value is too long';
    if (control.hasError('passwordMatches')) return 'Passwords are not the same';
  }

  public getPositionString(position: Position): string {
    return PositionStringifier.getPositionString(position);
  }
  //#endregion
}
