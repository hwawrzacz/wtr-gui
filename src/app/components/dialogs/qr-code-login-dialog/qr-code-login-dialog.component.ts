import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserQRCodeReader } from '@zxing/browser';
import { take, tap } from 'rxjs/operators';
import { CommonResponse } from 'src/app/model/responses';
import { User } from 'src/app/model/user';
import { UserCredentials } from 'src/app/model/user-credentials';
import { AuthService } from 'src/app/services/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-qr-code-login-dialog',
  templateUrl: './qr-code-login-dialog.component.html',
  styleUrls: ['./qr-code-login-dialog.component.scss']
})
export class QrCodeLoginDialogComponent implements OnInit {
  private _decoder: BrowserQRCodeReader;
  private _loggingCounter: number;

  get isLoggingIn(): boolean {
    return this._loggingCounter > 0;
  }

  get isLoggedIn(): boolean {
    return this._authService.isLoggedIn;
  }

  constructor(
    private _dialogRef: MatDialogRef<QrCodeLoginDialogComponent>,
    private _snackBarService: SnackBarService,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this._decoder = new BrowserQRCodeReader();
  }

  public handleQrScanSuccess(value: string): void {
    this._snackBarService.openSuccessSnackBar(value);
  }

  public async updateStreamToDecode(videoStream: MediaStream): Promise<void> {
    this._decoder.decodeFromStream(videoStream, undefined, this.handleQREncoded);
  }

  private handleQREncoded = (result: any) => {
    if (!!result) {
      const credentials = JSON.parse(result.text) as UserCredentials;
      if (!this.isLoggingIn && !this.isLoggedIn) {
        this._loggingCounter++;
        this.attemptLogin(credentials.login, credentials.password);
      }
    };
  }

  private attemptLogin(login: string, password: string) {
    this._authService.logIn(login, password)
      .pipe(
        take(1),
        tap((res: CommonResponse<any, User>) => {
          this._loggingCounter--;
          res.success ? this.closeDialog() : {}
        })
      ).subscribe();
  }

  public closeDialog(): void {
    this._dialogRef.close();
  }
}
