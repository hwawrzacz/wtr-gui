import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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

  private _streamEmitterMode: boolean;
  private _frameEmitterMode: boolean;
  private _frameEmitionFrequency: number;
  private _frameEmitionInterval: number;

  @ViewChild('video') video: ElementRef;
  @ViewChild('imagePlaceholder') canvas: ElementRef;
  @Output('photoChange') private _photoChangeEmitter: EventEmitter<string>;
  @Output('streamChange') private _streamChangeEmitter: EventEmitter<MediaStream>;

  //#region Getters and setters
  /** If set to true, photo couldn't be taken manually, but it will 
   * be emittet after defined time elapsed, or for every 500ms if no 
   * time was specified */
  @Input('streamEmitterMode')
  set streamEmitterMode(value: boolean) {
    this._streamEmitterMode = value;
  }
  get streamEmitterMode(): boolean {
    return this._streamEmitterMode;
  }

  @Input('frameEmitterMode')
  set frameEmitterMode(value: boolean) {
    this._frameEmitterMode = value;
  }
  get frameEmitterMode(): boolean {
    return this._frameEmitterMode;
  }

  /** Determines interval in milliceconds in which new frame will be emitted. */
  @Input('frameEmitionFrequency')
  set frameEmitionFrequency(value: number) {
    this._frameEmitionFrequency = value;
  }

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
  //#endregion

  constructor(private _snackBarService: SnackBarService) {
    this._previewMode = true;
    this._devices$ = new BehaviorSubject(null);
    this._selectedDevice$ = new BehaviorSubject(null);
    this._photoChangeEmitter = new EventEmitter<string>();
    this._streamChangeEmitter = new EventEmitter<MediaStream>();
  }

  ngOnInit(): void {
    this.subscribeToSelectedDeviceChange();
    this.initializeDevicesList();
    this.setDefaultComponentValues();

    if (this._frameEmitterMode) {
      this.runFrameEmitionInterval();
    }
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

  private runFrameEmitionInterval(): void {
    this._frameEmitionInterval = window.setInterval(this.emitNewFrame, this._frameEmitionFrequency || 500);
  }

  private clearFrameEmitionInterval(): void {
    window.clearInterval(this._frameEmitionInterval);
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

        if (this._streamEmitterMode) {
          this.emitStreamChange();
        }
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
  public onTakePhoto(): void {
    this.takePhoto();
    this._previewMode = false;
    this._imageUrl = this.canvas.nativeElement.toDataURL();
    this.emitPhotoChange();
  }

  public takePhoto(): void {
    const width = this.video.nativeElement.innerWidth || 400;
    const height = this.video.nativeElement.innerHeight || 300;
    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0, width, height);
  }

  public emitNewFrame = (): void => {
    this.takePhoto();
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

  private stopCurrentStream(): void {
    if (this._videoStream) {
      this._videoStream.getVideoTracks().forEach(track => track.stop())
      this._videoStream.getAudioTracks().forEach(track => track.stop());
    }
  }

  private emitPhotoChange(): void {
    this._photoChangeEmitter.emit(this._imageUrl);
  }

  private emitStreamChange(): void {
    this._streamChangeEmitter.emit(this._videoStream);
  }

  ngOnDestroy(): void {
    this.stopCurrentStream();

    if (this._frameEmitterMode) {
      this.clearFrameEmitionInterval();
    }
  }
}
