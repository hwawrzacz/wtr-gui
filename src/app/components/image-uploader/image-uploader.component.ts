import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { fromEvent, of } from 'rxjs';
import { catchError, filter, take, tap } from 'rxjs/operators';
import { InputImageParser } from 'src/app/helpers/input-image-parser';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MAX_IMAGE_SIZE_KB } from 'src/app/model/constants';

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
        tap((event: Event) => {
          const target = event.target as any
          if (target.files && target.files[0]) {
            const imageParser = new InputImageParser(target.files[0]);
            imageParser.convertToUrl()
              .pipe(
                filter(res => !!res),
                take(1),
                tap(imageUrl => {
                  if (imageUrl.length > MAX_IMAGE_SIZE_KB * 1000) {
                    this._snackBarService.openInfoSnackBar('Zdjęcie jest za duże. Maksymalny rozmiar to 3,5 MB');
                  } else {
                    this.emitImageChange(imageUrl)
                  }
                  this._fileInput.nativeElement.value = null;
                }),
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
