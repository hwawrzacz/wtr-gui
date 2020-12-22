import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { InputImageParser } from 'src/app/helpers/input-image-parser';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent {
  @ViewChild('fileInput') private _fileInput: ElementRef;
  @Output('imageChanged') private _imageChangeEmitter: EventEmitter<string>;

  constructor() {
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
                tap(imageUrl => this.emitImageChange(imageUrl))
              ).subscribe()
          } else {
            // TODO: Handle error
            console.warn('cannot read file');
          }
        })
      ).subscribe()
  }

  private emitImageChange(value: string): void {
    this._imageChangeEmitter.emit(value);
  }
}
