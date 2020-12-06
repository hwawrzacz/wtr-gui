import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-capture-dialog',
  templateUrl: './image-capture-dialog.component.html',
  styleUrls: ['./image-capture-dialog.component.scss']
})
export class ImageCaptureDialogComponent implements OnInit {
  private _imageSrc: string

  constructor(private _dialog: MatDialogRef<ImageCaptureDialogComponent>) { }


  ngOnInit(): void {
  }

  public onImageTaken(imageSrc: string): void {
    this._imageSrc = imageSrc
  }

  public onSave(): void {
    this._dialog.close(this._imageSrc);
  }

  public onClose(): void {
    this._dialog.close(null)
  }

}
