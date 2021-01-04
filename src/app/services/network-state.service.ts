import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SnackBarService } from './snack-bar.service';

export enum NetworkState {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

@Injectable({
  providedIn: 'root'
})
export class NetworkStateService implements OnDestroy {
  public networkState$: BehaviorSubject<NetworkState>;

  constructor(private _snackBarService: SnackBarService) {
    const networkState = this.getCurrentNetworkState();
    this.networkState$ = new BehaviorSubject<NetworkState>(networkState);
    this.subscribeToOfflineChanges();
  }

  private getCurrentNetworkState(): NetworkState {
    return navigator.onLine
      ? NetworkState.ONLINE
      : NetworkState.OFFLINE;
  }

  private subscribeToOfflineChanges(): void {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = (): void => {
    this.networkState$.next(NetworkState.ONLINE);
    this._snackBarService.openSuccessSnackBar('Przywrócono połączenie z internetem.');
  }

  private handleOffline = (): void => {
    this.networkState$.next(NetworkState.OFFLINE);
    this._snackBarService.openInfoSnackBar('Brak połączenia z internetem.', 'Większość funkcji nie będzie działać.');
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOnline);
  }
}
