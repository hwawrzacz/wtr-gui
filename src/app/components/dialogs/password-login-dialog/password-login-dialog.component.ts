import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take, tap } from 'rxjs/operators';
import { Encrypter } from 'src/app/helpers/encrypter';
import { CommonResponse } from 'src/app/model/responses';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password-login-dialog',
  templateUrl: './password-login-dialog.component.html',
  styleUrls: ['./password-login-dialog.component.scss']
})
export class PasswordLoginDialogComponent implements OnInit {
  private _form: FormGroup;
  private _isLogging: boolean;

  get form(): FormGroup {
    return this._form;
  }

  get isLogging(): boolean {
    return this._isLogging;
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _dialogRef: MatDialogRef<PasswordLoginDialogComponent>,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this._form = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this._formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  public login(): void {
    this._isLogging = true;
    const login = this._form.get('login').value;
    const password = this._form.get('password').value;
    const passwdEncr = Encrypter.encrypt(password);

    this._authService.logIn(login, passwdEncr)
      .pipe(
        take(1),
        tap((res: CommonResponse<any, User>) => {
          this._isLogging = false;
          res.success ? this.closeDialog() : {};
        })
      )
      .subscribe();
  }

  public getErrorMessage(controlName: string): string {
    const control = this._form.get(controlName);
    // Validators
    if (!!control && control.hasError('required')) return 'Pole jest wymagane.';
    if (!!control && control.hasError('maxLength')) return 'Wartość jest za długa.';
    return null;
  }

  public closeDialog(): void {
    this._dialogRef.close();
  }
}
