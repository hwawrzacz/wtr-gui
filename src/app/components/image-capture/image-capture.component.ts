import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { SnackBarService } from 'src/app/services/snack-bar.service';

export interface MediaDevice {
  deviceId: string;
  label: string;
}

@Component({
  selector: 'app-image-capture',
  templateUrl: './image-capture.component.html',
  styleUrls: ['./image-capture.component.scss']
})
export class ImageCaptureComponent implements OnInit, AfterViewInit, OnDestroy {
  private _streamLoadingCounter: number;
  private _previewMode: boolean;
  private _imageUrl: string;
  private _videoStream: MediaStream;
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

  get videoStream(): MediaStream {
    return this._videoStream;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get devices(): MediaDevice[] {
    return this._devices$.value;
  }

  get selectedDevice(): MediaDevice {
    return this._selectedDevice$.value;
  }

  @Output('photoChange') photoChangeEventEmitter: EventEmitter<string>;
  //#endregion

  constructor(private _snackBarService: SnackBarService) {
    this._previewMode = true;
    this._devices$ = new BehaviorSubject(null);
    this._selectedDevice$ = new BehaviorSubject(null);
    this.photoChangeEventEmitter = new EventEmitter<string>();
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
    this._imageUrl = '';
    this._previewMode = true;
  }

  public reinitializeCanvas(): void {
    const width = 400;
    const height = 300;
    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;
  }

  private initializeDevicesList(): void {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const filteredDevices = devices
          .filter(dvc => dvc.kind === 'videoinput')
          .map(dvc => ({ deviceId: dvc.deviceId, label: dvc.label }));

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
    const specificDeviceConstraints = {
      video: { deviceId: { exact: this._selectedDevice$.value.deviceId } },
      audio: false
    } as MediaStreamConstraints;

    navigator.mediaDevices.getUserMedia(specificDeviceConstraints)
      .then(stream => {
        this.stopCurrentStream();
        this._videoStream = stream;
        this._streamLoadingCounter--;
      })
      // TODO: Handle error properly
      .catch(err => {
        this._snackBarService.openErrorSnackBar('Nie można uzyskać dostępu do listy urządzeń. Sprawdź uprawnienia w ustawieniach przeglądarki.');
        console.error(err);
        this._streamLoadingCounter--;
      });
  }

  public onInputDeviceChange(deviceId: string): void {
    this._selectedDevice$.next(this.devices.find(device => device.deviceId == deviceId) || this.devices[0]);
  }
  //#endregion

  //#region Photo handlers
  public takePhoto(): void {
    const width = this.video.nativeElement.innerWidth || 400;
    const height = this.video.nativeElement.innerHeight || 300;
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, width, height);
    this._previewMode = false;
    this._imageUrl = this.canvas.nativeElement.toDataURL();
    this.emitPhotoChange();
  }

  public retakePhoto(): void {
    this.setDefaultComponentValues();
    this.reinitializeCanvas();
    this._imageUrl = null;
    this.emitPhotoChange();
  }
  //#endregion

  private emitPhotoChange(): void {
    this.photoChangeEventEmitter.emit(this._imageUrl);
  }

  private stopCurrentStream(): void {
    if (this._videoStream) {
      this._videoStream.getVideoTracks().forEach(track => track.stop())
      this._videoStream.getAudioTracks().forEach(track => track.stop());
    }
  }

  ngOnDestroy(): void {
    this.stopCurrentStream();
  }
}
