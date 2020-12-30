import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FaceLoginDialogComponent } from 'src/app/components/dialogs/face-login-dialog/face-login-dialog.component';
import { PasswordLoginDialogComponent } from 'src/app/components/dialogs/password-login-dialog/password-login-dialog.component';
import { QrCodeLoginDialogComponent } from 'src/app/components/dialogs/qr-code-login-dialog/qr-code-login-dialog.component';
import { Section } from 'src/app/model/enums/section';
import { AuthService } from 'src/app/services/auth.service';
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
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    if (this._authService.isLoggedIn) {
      this._navigator.navigateToMainSection(Section.TASKS);
    } else {
      this.openFaceLoginDialog();
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
