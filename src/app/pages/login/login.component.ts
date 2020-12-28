import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FaceLoginDialogComponent } from 'src/app/components/dialogs/face-login-dialog/face-login-dialog.component';
import { QrCodeLoginDialogComponent } from 'src/app/components/dialogs/qr-code-login-dialog/qr-code-login-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private _dialogService: MatDialog) { }

  ngOnInit(): void {
    this.openFaceLoginDialog();
  }

  public openFaceLoginDialog(): void {
    this._dialogService.open(FaceLoginDialogComponent)
  }

  public openQrCodeLoginDialog(): void {
    this._dialogService.open(QrCodeLoginDialogComponent)
  }
}
