import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonSnackBarComponent, SnackBarData } from '../common-snack-bar/common-snack-bar.component';

@Component({
  selector: 'app-success-snack-bar',
  templateUrl: '../common-snack-bar/common-snack-bar.component.html',
  styleUrls: ['../common-snack-bar/common-snack-bar.component.scss']
})
export class SuccessSnackBarComponent extends CommonSnackBarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) data: SnackBarData,
    snackBarRef: MatSnackBarRef<SuccessSnackBarComponent>,
  ) {
    super(data, 'check_circle', 'success', snackBarRef)
  }
}
