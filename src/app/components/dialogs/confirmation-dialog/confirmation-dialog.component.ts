import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
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

  get title(): string {
    return this._title;
  }

  get message(): string {
    return this._message;
  }

  get confirmText(): string {
    return this._confirmText;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) data: ConfirmationDialogData,
    private _dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {
    this._title = data.title;
    this._message = data.message;
    this._confirmText = data.confirmText;
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
