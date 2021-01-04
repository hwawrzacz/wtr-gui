import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export interface SnackBarData {
  message: string;
  details?: string;
  actionText?: string;
  actionFn?: (param: any) => void;
  actionIcon?: string;
}

@Component({
  selector: 'app-common-snack-bar',
  templateUrl: './common-snack-bar.component.html',
  styleUrls: ['./common-snack-bar.component.scss']
})
export class CommonSnackBarComponent {
  private _message: string;
  private _details: string;
  private _actionIcon: string;
  private _actionText: string;
  private _actionFn: (param?: any) => void;

  get isError(): boolean {
    return this._snackClass == 'error';
  }

  get message(): string {
    return this._message;
  }

  get details(): string {
    return this._details;
  }

  get icon(): string {
    return this._icon;
  }

  get actionText(): string {
    return this._actionText;
  }

  get actionFn(): (param?: any) => void {
    return this._actionFn;
  }

  get actionIcon(): string {
    return this._actionIcon;
  }

  get snackClass(): string {
    return this._snackClass;
  }

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) data: SnackBarData,
    @Inject('icon') private _icon: string,
    @Inject('snackClass') private _snackClass: string,
    private _snackBarRef: MatSnackBarRef<CommonSnackBarComponent>,
  ) {
    this._message = data.message;
    this._details = data.details;
    this._actionText = data.actionText;
    this._actionFn = data.actionFn;
    this._actionIcon = data.actionIcon;
  }

  public closeSnackBar() {
    this._snackBarRef.dismiss();
  }

  public fireAction(): void {
    this._actionFn ? this._actionFn() : this.closeSnackBar()
  }
}
