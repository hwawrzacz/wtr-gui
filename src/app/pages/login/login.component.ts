import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FaceLoginDialogComponent } from 'src/app/components/dialogs/face-login-dialog/face-login-dialog.component';
import { PasswordLoginDialogComponent } from 'src/app/components/dialogs/password-login-dialog/password-login-dialog.component';
import { QrCodeLoginDialogComponent } from 'src/app/components/dialogs/qr-code-login-dialog/qr-code-login-dialog.component';
import { Section } from 'src/app/model/enums/section';
import { LoginService } from 'src/app/services/login.service';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private _dialogService: MatDialog,
    private _navigator: NavigatorService<any>,
    private _loginService: LoginService,
  ) { }

  ngOnInit(): void {
    // this.openFaceLoginDialog();
    if (this._loginService.isLoggedIn) {
      this._navigator.navigateToMainSection(Section.TASKS);
    } else {
      this.openQrCodeLoginDialog();
    }
  }

  public openFaceLoginDialog(): void {
    this._dialogService.open(FaceLoginDialogComponent)
  }

  public openQrCodeLoginDialog(): void {
    this._dialogService.open(QrCodeLoginDialogComponent)
  }

  public openPasswordLoginDialog(): void {
    this._dialogService.open(PasswordLoginDialogComponent)
  }
}
