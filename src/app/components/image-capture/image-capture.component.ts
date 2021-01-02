import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
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
  private _previewMode: boolean;
  private _imageUrl: string;
  private _videoStream: MediaStream;
  private _devices$: BehaviorSubject<MediaDevice[]>;
  private _selectedDevice$: BehaviorSubject<MediaDevice>;

  private _streamEmitterMode: boolean;
  private _frameEmitterMode: boolean;
  private _frameEmitionFrequency: number;
  private _frameEmitionInterval: number;

  @ViewChild('video') private _video: ElementRef;
  @ViewChild('videoWrapper') private _videoWrapper: ElementRef;
  @ViewChild('image') private _image: ElementRef;
  @ViewChild('canvas') private _canvas: ElementRef;
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

  constructor(
    private _snackBarService: SnackBarService,
    private _changeDetector: ChangeDetectorRef,
    private _renderer: Renderer2,
  ) {
    this._previewMode = true;
    this._devices$ = new BehaviorSubject(null);
    this._selectedDevice$ = new BehaviorSubject(null);
    this._photoChangeEmitter = new EventEmitter<string>();
    this._streamChangeEmitter = new EventEmitter<MediaStream>();
  }

  ngOnInit(): void {
    this.setDefaultComponentValues();

    if (this._frameEmitterMode) {
      this.runFrameEmitionInterval();
    }
  }

  ngAfterViewInit() {
    this.subscribeToSelectedDeviceChange();
    this._video.nativeElement.addEventListener('loadedmetadata', this.updateVideoSize);
    if (!this.streamEmitterMode && !this.frameEmitterMode) {
      this.setImageSize(0, 0);
    }
    this.initializeDevicesList();
  }

  //#region Initializers 
  public setDefaultComponentValues(): void {
    this._previewMode = true;
    this._imageUrl = null;
  }

  public reinitializeCanvas(width = 400, height = 300): void {
    this._canvas.nativeElement.width = width;
    this._canvas.nativeElement.height = height;
  }

  private initializeDevicesList(): void {
    navigator.permissions.query({ name: 'camera' })
      .then(res => {
        if (res.state == 'prompt') {
          // Force prompt
          navigator.mediaDevices.getUserMedia({ video: { deviceId: 'forcedTrickyRequest' } });
        } else if (res.state == 'granted') {
          this.enumerateDevices();
        } else {
          this._snackBarService.openErrorSnackBar('Nie można uzyskać dostępu do kamery.', 'Nie przyznano uprawnień');
        }
        res.onchange = (e: any) => {
          if (e.target.state === 'granted') {
            this.enumerateDevices();
          } else {
            this._snackBarService.openErrorSnackBar('Nie można uzyskać dostępu do kamery.');
          }
        }
      })
      .catch(err => {
        this._snackBarService.openErrorSnackBar('Nie można uzyskać dostępu do kamery.', err);
      });;
  }

  private enumerateDevices(): void {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const filteredDevices = devices
          .filter(dvc => dvc.kind === 'videoinput')
          .map(dvc => ({ deviceId: dvc.deviceId, label: dvc.label }));

        if (filteredDevices) {
          this._devices$.next(filteredDevices);
          this._selectedDevice$.next(this._devices$.value[0]);
        } else {
          this._snackBarService.openErrorSnackBar('Brak dostępnych urządzeń. Spróbuj innej metody logowania.');
        }
      })
      // TODO: Handle error properly
      .catch(err => {
        console.warn(err);
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
      video: { deviceId: this._selectedDevice$.value.deviceId },
      audio: false
    } as MediaStreamConstraints;

    navigator.permissions.query({ name: 'camera' })
      .then(res => {
        if (res.state != 'denied') {
          navigator.mediaDevices.getUserMedia(specificDeviceConstraints)
            .then(stream => {
              this.stopCurrentStream();
              this._videoStream = stream;

              if (this._streamEmitterMode) {
                this.emitStreamChange();
              }

              /** After fixing not showing camera permission dialog, the new problem appeared: 
               * For some reason camera preview and input devices selection were not populated with data.
               * The Abracadabra below somehow fixes this. The trick must be applied exactly like that. */
              this._changeDetector.detectChanges();
              setTimeout(() => this._changeDetector.detectChanges(), 0);
            })
            .catch(err => {
              this._snackBarService.openErrorSnackBar('Nie można uzyskać dostępu do listy urządzeń. Sprawdź uprawnienia w ustawieniach przeglądarki.', err);
            });
        }
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
    this._imageUrl = this._canvas.nativeElement.toDataURL();
    this.emitPhotoChange();
  }

  public takePhoto(): void {
    const width = this._videoWrapper.nativeElement.offsetWidth || 400;
    const height = this._videoWrapper.nativeElement.offsetHeight || 300;
    this.setImageSize(width, height);
    this.reinitializeCanvas(width, height);
    this._canvas.nativeElement.getContext('2d').drawImage(this._video.nativeElement, 0, 0, width, height);
  }

  private setImageSize(width: number, height: number): void {
    this._renderer.setStyle(this._image.nativeElement, 'width', `${width}px`);
    this._renderer.setStyle(this._image.nativeElement, 'height', `${height}px`);
  }

  private updateVideoSize = (): void => {
    console.log('video updated');

    // Remove previous vide size, so video wrapper could adjust its size to video size based on its source
    this._renderer.removeStyle(this._video.nativeElement, 'width');
    this._renderer.removeStyle(this._video.nativeElement, 'height');
    /** Get size of new video. As video have had removed its previously set properties 
     * it has size of inner source now */
    const width = this._videoWrapper.nativeElement.offsetWidth;
    const height = this._videoWrapper.nativeElement.offsetHeight;
    /** Apply new size to video element to avoid blinking when image is being reloaded (on retakePhoto) */
    this._renderer.setStyle(this._video.nativeElement, 'width', `${width}px`);
    this._renderer.setStyle(this._video.nativeElement, 'height', `${height}px`);
  }

  public emitNewFrame = (): void => {
    this.takePhoto();
    this._imageUrl = this._canvas.nativeElement.toDataURL();
    this.emitPhotoChange();
  }

  public retakePhoto(): void {
    this.setDefaultComponentValues();
    this.setImageSize(0, 0);
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

    this._video.nativeElement.removeEventListener('loadedmetadata', this.updateVideoSize);
  }
}
