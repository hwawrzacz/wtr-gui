import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, take, tap } from 'rxjs/operators';
import { PositionStringifier } from 'src/app/helpers/parsers';
import { EmployeeCredentials } from 'src/app/model/employee-credentials';
import { Position } from 'src/app/model/enums/position';
import { SimpleEmployee } from 'src/app/model/simple-employee';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { UserRestService } from 'src/app/services/user-rest.service';
import { CommonItemDetailsComponent } from '../common-item-details/common-item-details.component';
import { ImageCaptureDialogComponent } from '../image-capture-dialog/image-capture-dialog.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent extends CommonItemDetailsComponent<SimpleEmployee> implements OnInit {
  private _qrCodeUrl: string;
  private _faceImageUrl: string;
  private _passwordForm: FormGroup;

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

  public get passwordForm(): FormGroup {
    return this._passwordForm;
  }
  //#endregion

  constructor(
    navigator: NavigatorService<SimpleEmployee>,
    broker: ItemDetailsBrokerService<SimpleEmployee>,
    restService: UserRestService,
    formBuilder: FormBuilder,
    private _dialogService: MatDialog) {
    super(navigator, broker, restService, formBuilder);
    console.log('before');
    this._passwordForm = this.buildPasswordForm();
    console.log('after');
  }

  //#endregion Initialization
  protected buildForm(): FormGroup {
    return this._formBuilder.group({
      login: [this._initialItem.login, [Validators.required]],
      firstName: [this._initialItem.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this._initialItem.lastName, [Validators.required]],
      phoneNumber: [this._initialItem.phoneNumber, [Validators.required, this.phoneNumberValidator()]],
      email: [this._initialItem.email, [Validators.required, Validators.email]],
      position: [this._initialItem.position, [Validators.required]],
    })
  }

  private buildPasswordForm(): FormGroup {
    return this._formBuilder.group({
      password: [null, [Validators.required]],
      repeatPassword: [null, [this.matchPasswordValidator]]
    })
  }

  //#region Custom validators
  private phoneNumberValidator(): ValidatorFn {
    return (control: FormControl): { [key: string]: any | null } => control.value.toString().match(/[0-9]{9}/) == control.value ? { phoneNumber: true } : null;
  }

  private matchPasswordValidator = (): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any | null } => {
      console.log(control.root);
      const otherControlValue = control.root.get('password').value;
      console.log('sd');
      const controlValue = control.root.get('repeatPassword').value;
      console.log('sd2');

      return otherControlValue === controlValue ? null : { passwordMatches: true };
    }
  }
  //#endregion

  protected setEditables(): void {
    this._editables = new Map([
      ['login', false],
      ['firstName', false],
      ['lastName', false],
      ['phoneNumber', false],
      ['email', false],
      ['position', false]
    ])
  }
  //#endregion

  ngOnInit(): void {
    super.ngOnInit();
    this._passwordForm = this.buildPasswordForm();
    this.loadCredentials();
  }

  private loadCredentials() {
    this._loadingCounter++;
    this._error = false;
    (this._restService as UserRestService).getCredentials(this._itemId).pipe(
      take(1),
      tap((credentials: EmployeeCredentials) => {
        this._loadingCounter--;
        if (!!credentials) {
          console.log(credentials);
          this._faceImageUrl = credentials.faceImage;
          this._qrCodeUrl = credentials.qrImage;
        } else {
          console.log('error');
          this._error = true;
        }
      })
    )
      .subscribe()
  }

  public changePhoto(): void {
    this._dialogService.open(ImageCaptureDialogComponent)
      .afterClosed()
      .pipe(
        take(1),
        filter(result => !!result),
        tap(result => {
          this._faceImageUrl = result;
        })
      )
      .subscribe
  }

  //#region Helpers
  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('required')) return 'Value is required';
    if (control.hasError('email')) return 'Value must be a valid email';
    if (control.hasError('phoneNumber')) return 'Value must contain only digits';
    if (control.hasError('minLength')) return 'Value is too short';
    if (control.hasError('maxLength')) return 'Value is too long';
    if (control.hasError('passwordMatches')) return 'Passwords are not the same';
  }

  public getPasswordErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    if (control.hasError('passwordMatches')) return 'Passwords are not the same';
  }

  public getPositionString(position: Position): string {
    return PositionStringifier.getPositionString(position);
  }
  //#endregion
}
