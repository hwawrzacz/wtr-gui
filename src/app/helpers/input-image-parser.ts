import { BehaviorSubject, Observable, of } from 'rxjs';

export class InputImageParser {
  constructor(private _image) { }

  public convertToUrl(): Observable<string> {
    const imageUrl$ = new BehaviorSubject(null);
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (event: ProgressEvent) => {
      const imageUrl = (event.target as FileReader).result as string;
      imageUrl$.next(imageUrl);
    });
    fileReader.readAsDataURL(this._image);

    return imageUrl$;
  }
}