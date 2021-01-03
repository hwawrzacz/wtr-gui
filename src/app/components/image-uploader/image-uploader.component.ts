import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent, of } from 'rxjs';
import { catchError, filter, take, tap } from 'rxjs/operators';
import { InputImageParser } from 'src/app/helpers/input-image-parser';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent {
  @ViewChild('fileInput') private _fileInput: ElementRef;
  @Output('imageChanged') private _imageChangeEmitter: EventEmitter<string>;

  constructor(private _snackBarService: SnackBarService) {
    this._imageChangeEmitter = new EventEmitter<string>();
  }

  public triggerPhotoUpload(): void {
    this.subscribeToFileChange();
    this._fileInput.nativeElement.click();
  }

  private subscribeToFileChange(): void {
    fromEvent(this._fileInput.nativeElement, 'change')
      .pipe(
        take(1),
        tap((event: Event) => {
          const target = event.target as any
          if (target.files && target.files[0]) {
            const imageParser = new InputImageParser(target.files[0]);
            imageParser.convertToUrl()
              .pipe(
                filter(res => !!res),
                take(1),
                tap(imageUrl => this.emitImageChange(imageUrl)),
                catchError(err => of(this._snackBarService.openErrorSnackBar('Nie udało się odczytać pliku.', err)))
              ).subscribe();
          } else {
            this._snackBarService.openErrorSnackBar('Nie udało się załadować pliku.');
          }
        })
      ).subscribe()
  }

  private emitImageChange(value: string): void {
    this._imageChangeEmitter.emit(value);
  }
}
