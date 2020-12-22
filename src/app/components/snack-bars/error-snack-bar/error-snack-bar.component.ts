import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { CommonSnackBarComponent, SnackBarData } from '../common-snack-bar/common-snack-bar.component';

@Component({
  selector: 'app-error-snack-bar',
  templateUrl: '../common-snack-bar/common-snack-bar.component.html',
  styleUrls: ['../common-snack-bar/common-snack-bar.component.scss']
})
export class ErrorSnackBarComponent extends CommonSnackBarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) data: SnackBarData,
    snackBarRef: MatSnackBarRef<ErrorSnackBarComponent>,
  ) {
    super(data, 'error', 'error', snackBarRef)
  }
}
