import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

export interface MediaDevice {
  id: string;
  label: string;
}

@Component({
  selector: 'app-image-capture',
  templateUrl: './image-capture.component.html',
  styleUrls: ['./image-capture.component.scss']
})
export class ImageCaptureComponent implements OnInit {
  private _previewMode: boolean;
  private _imageSrc: string;
  private _videoSrc: MediaStream;
  private _devices$: BehaviorSubject<MediaDevice[]>;
  private _selectedDevice$: BehaviorSubject<MediaDevice>;

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

  get videoSrc(): MediaStream {
    return this._videoSrc;
  }

  get devices(): MediaDevice[] {
    return this._devices$.value;
  }

  get selectedDevice(): MediaDevice {
    return this._selectedDevice$.value;
  }
  //#endregion

  constructor() {
    this._previewMode = true;
    this._devices$ = new BehaviorSubject(null);
    this._selectedDevice$ = new BehaviorSubject(null);
  }

  ngOnInit(): void {
    this.initializeDevicesList();
    this.subscribeToSelectedDeviceChange();
  }

  private initializeDevicesList(): void {
    navigator.mediaDevices
      .enumerateDevices()
      .then(devices => {
        const filteredDevices = devices
          .filter(dvc => dvc.kind === 'videoinput')
          .map(dvc => ({ id: dvc.deviceId, label: dvc.label }));

        this._devices$.next(filteredDevices);
        this._selectedDevice$.next(this._devices$.value[0]);
      })
      // TODO: Handle error properly
      .catch(err => console.warn(err));
  }

  private subscribeToSelectedDeviceChange(): void {
    this._selectedDevice$.pipe(
      filter(dvcs => !!dvcs),
      tap(() => this.reloadCameraPreview())
    ).subscribe()
  }

  private reloadCameraPreview(): void {
    const constraints = {
      video: { deviceId: { exact: this._selectedDevice$.value.id } },
      audio: false
    } as MediaStreamConstraints;

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        this._videoSrc = stream;
      })
      // TODO: Handle error properly
      .catch(err => console.warn(err));
  }

  public onInputDeviceChange(deviceId: string): void {
    this._selectedDevice$.next(this.devices.find(device => device.id == deviceId) || this.devices[0]);
  }

  public togglePreviewMode(): void {
    this._previewMode = !this.previewMode;
  }

  public takePhoto(): void {
    console.log("take photo");
    this._previewMode = false
  }

  public savePhoto(): void {
    console.log("save photo");
  }

  public retakePhoto(): void {
    this.reinitializeComponent();
  }

  public reinitializeComponent(): void {
    this._imageSrc = '';
    this._previewMode = true
  }
}
