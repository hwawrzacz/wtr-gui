import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonSnackBarComponent, SnackBarData } from '../common-snack-bar/common-snack-bar.component';

@Component({
  selector: 'app-action-snack-bar',
  templateUrl: '../common-snack-bar/common-snack-bar.component.html',
  styleUrls: ['../common-snack-bar/common-snack-bar.component.scss']
})
export class ActionSnackBarComponent extends CommonSnackBarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) data: SnackBarData,
    snackBarRef: MatSnackBarRef<ActionSnackBarComponent>,
  ) {
    super(data, 'system_update', 'success', snackBarRef)
  }
}