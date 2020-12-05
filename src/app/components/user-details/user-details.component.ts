import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { take, tap } from 'rxjs/operators';
import { PositionStringifier } from 'src/app/helpers/parsers';
import { EmployeeCredentials } from 'src/app/model/employee-credentials';
import { Position } from 'src/app/model/enums/position';
import { SimpleEmployee } from 'src/app/model/simple-employee';
import { ItemDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { UserRestService } from 'src/app/services/user-rest.service';
import { CommonItemDetailsComponent } from '../common-item-details/common-item-details.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent extends CommonItemDetailsComponent<SimpleEmployee> implements OnInit {
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
    navigator: NavigatorService<SimpleEmployee>,
    broker: ItemDetailsBrokerService<SimpleEmployee>,
    restService: UserRestService,
    formBuilder: FormBuilder) {
    super(navigator, broker, restService, formBuilder);
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

  //#region Custom validators
  private phoneNumberValidator(): ValidatorFn {
    return (control: FormControl) => control.value.toString().match(/[0-9]{9}/) == control.value ? { phoneNumber: true } : null;
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

  public passwordsMatch(): boolean {
    return true;
  }
}
