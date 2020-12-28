import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-face-login-dialog',
  templateUrl: './face-login-dialog.component.html',
  styleUrls: ['./face-login-dialog.component.scss']
})
export class FaceLoginDialogComponent implements OnInit {
  private _imageUrl: string;
  private _isLogging: boolean;

  get imageUrl(): string {
    return this._imageUrl;
  }

  get isLogging(): boolean {
    return this._isLogging;
  }

  constructor(private _dialogRef: MatDialogRef<FaceLoginDialogComponent>, private _loginService: LoginService) { }

  ngOnInit(): void {
    this._isLogging = false;
  }

  public updateImageUrl(imageUrl: string): void {
    this._imageUrl = imageUrl;
  }

  public logIn(): void {
    this._loginService.faceLogIn(this._imageUrl);
  }

  public closeDialog(): void {
    this._dialogRef.close();
  }
}
