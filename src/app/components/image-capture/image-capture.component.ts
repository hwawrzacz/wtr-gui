import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-capture',
  templateUrl: './image-capture.component.html',
  styleUrls: ['./image-capture.component.scss']
})
export class ImageCaptureComponent implements OnInit {
  private _previewMode: boolean;
  private _imageSrc: string;
  private _videoSource: MediaStream;

  //#region Getters and setters
  get previewMode(): boolean {
    return this._previewMode;
  }
  set previewMode(value: boolean) {
    this._previewMode = value;
  }

  get imageSrc(): string {
    return this._imageSrc;
  }

  get videoSource(): MediaStream {
    return this._videoSource;
  }
  //#endregion

  constructor() { }

  ngOnInit(): void {
    console.log('image access requested');
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(source => {
        console.log('stream loaded');
        this._videoSource = source;
      })
      // TODO: Handle error properly
      .catch(err => console.warn(err))
  }

  public togglePreviewMode(): void {
    this._previewMode = !this.previewMode;
  }

  public takePhoto(): void {
    console.log("take photo");
  }

  public savePhoto(): void {
    console.log("save photo");
  }

  public retakePhoto(): void {
    this.reinitializeComponent();
  }

  public reinitializeComponent(): void {
    this._imageSrc = '';
    this._previewMode = false
  }
}
