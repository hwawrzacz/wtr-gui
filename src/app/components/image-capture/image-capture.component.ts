import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class ImageCaptureComponent implements OnInit, AfterViewInit {
  private _streamLoadingCounter: number;
  private _previewMode: boolean;
  private _imageSrc: string;
  private _videoSrc: MediaStream;
  private _devices$: BehaviorSubject<MediaDevice[]>;
  private _selectedDevice$: BehaviorSubject<MediaDevice>;

  @ViewChild('video') video: ElementRef;
  @ViewChild('imagePlaceholder') canvas: ElementRef;

  //#region Getters and setters
  get streamLoading(): boolean {
    return this._streamLoadingCounter > 0;
  }

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
    this.subscribeToSelectedDeviceChange();
    this.initializeDevicesList();
    this.setDefaultComponentValues();
  }

  ngAfterViewInit() {
    this.reinitializeCanvas()
  }

  //#region Initializers 
  public setDefaultComponentValues(): void {
    this._imageSrc = '';
    this._previewMode = true;
  }

  public reinitializeCanvas(): void {
    this.canvas.nativeElement.width = 0;
    this.canvas.nativeElement.height = 0;
  }

  private initializeDevicesList(): void {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const filteredDevices = devices
          .filter(dvc => dvc.kind === 'videoinput')
          .map(dvc => ({ id: dvc.deviceId, label: dvc.label }));

        this._devices$.next(filteredDevices);
        this._selectedDevice$.next(this._devices$.value[0]);
      })
      // TODO: Handle error properly
      .catch(err => {
        console.warn(err);
        this._streamLoadingCounter--;
      });
  }

  private subscribeToSelectedDeviceChange(): void {
    this._selectedDevice$.pipe(
      filter(dvcs => !!dvcs),
      tap(() => this.reloadCameraPreview())
    ).subscribe()
  }
  //#endregion

  //#region Media device handlers
  private reloadCameraPreview(): void {
    const constraints = {
      video: { deviceId: { exact: this._selectedDevice$.value.id } },
      audio: false
    } as MediaStreamConstraints;

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        this._videoSrc = stream;
        this._streamLoadingCounter--;
      })
      // TODO: Handle error properly
      .catch(err => {
        console.warn(err);
        this._streamLoadingCounter--;
      });
  }

  public onInputDeviceChange(deviceId: string): void {
    this._streamLoadingCounter++;
    this._selectedDevice$.next(this.devices.find(device => device.id == deviceId) || this.devices[0]);
  }
  //#endregion

  //#region Photo handlers
  public takePhoto(): void {
    const width = this.video.nativeElement.innerWidth || 400;
    const height = this.video.nativeElement.innerHeight || 300;
    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, width, height);
    this._previewMode = false;
  }

  public savePhoto(): void {
    this._imageSrc = this.canvas.nativeElement.toDataURL();
  }

  public retakePhoto(): void {
    this.setDefaultComponentValues();
    this.reinitializeCanvas();
  }
  //#endregion
}
