import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-capture-dialog',
  templateUrl: './image-capture-dialog.component.html',
  styleUrls: ['./image-capture-dialog.component.scss']
})
export class ImageCaptureDialogComponent implements OnInit {
  private _imageUrl: string

  get imageExists(): boolean {
    return !!this._imageUrl;
  }

  constructor(private _dialog: MatDialogRef<ImageCaptureDialogComponent>) { }

  ngOnInit(): void {
  }

  public onPhotoChange(imageSrc: string): void {
    this._imageUrl = imageSrc;
  }

  public onSave(): void {
    console.log(this._imageUrl);
    this._dialog.close(this._imageUrl);
  }

  public onClose(): void {
    this._dialog.close(null)
  }

}
