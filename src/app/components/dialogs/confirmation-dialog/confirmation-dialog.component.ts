import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  warn?: boolean;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  private _title: string;
  private _message: string;
  private _confirmText: string;
  private _warn: boolean;

  get title(): string {
    return this._title;
  }

  get message(): string {
    return this._message;
  }

  get confirmText(): string {
    return this._confirmText;
  }

  get warn(): boolean {
    return this._warn;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) data: ConfirmationDialogData,
    private _dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {
    this._title = data.title;
    this._message = data.message;
    this._confirmText = data.confirmText;
    this._warn = data.warn;
  }

  ngOnInit(): void {
  }

  public confirm(): void {
    this._dialogRef.close(true);
  }

  public discard(): void {
    this._dialogRef.close(false);
  }
}
