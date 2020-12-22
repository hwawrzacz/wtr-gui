import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonSnackBarComponent, SnackBarData } from '../common-snack-bar/common-snack-bar.component';

@Component({
  selector: 'app-info-snack-bar',
  templateUrl: '../common-snack-bar/common-snack-bar.component.html',
  styleUrls: ['../common-snack-bar/common-snack-bar.component.scss']
})
export class InfoSnackBarComponent extends CommonSnackBarComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) data: SnackBarData,
    snackBarRef: MatSnackBarRef<InfoSnackBarComponent>,
  ) {
    super(data, 'info', '', snackBarRef)
  }
}
