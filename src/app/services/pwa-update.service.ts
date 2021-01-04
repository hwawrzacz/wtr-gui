import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { take, tap } from 'rxjs/operators';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {

  constructor(private _serviceWorkerUpdate: SwUpdate, private _snackBarService: SnackBarService) {
    this.checkForUpdates();
  }

  private checkForUpdates(): void {
    this._serviceWorkerUpdate.available
      .pipe(
        take(1),
        tap(res => {
          if (!!res && res.type === 'UPDATE_AVAILABLE') {
            const actionReload = () => window.location.reload();
            this._snackBarService.openActionSnackBar(
              'Dostępna jest aktualizacja.',
              actionReload,
              'Odśwież',
              'Odśwież stronę, aby załadować nową wersję.'
            );
          }
        })
      )
      .subscribe()
  }
}