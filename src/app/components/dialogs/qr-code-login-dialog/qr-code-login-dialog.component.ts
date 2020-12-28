import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-qr-code-login-dialog',
  templateUrl: './qr-code-login-dialog.component.html',
  styleUrls: ['./qr-code-login-dialog.component.scss']
})
export class QrCodeLoginDialogComponent implements OnInit {
  private _devices: MediaDeviceInfo[];
  private _selectedDevice: MediaDeviceInfo;

  //#region Getters and setters
  get mediaDevices(): MediaDeviceInfo[] {
    return this._devices;
  }

  get selectedDevice(): MediaDeviceInfo {
    return this._selectedDevice || null;
  }
  //#endregion

  constructor(private _snackBarService: SnackBarService) { }

  ngOnInit(): void { }

  public handleQrScanSuccess(value: string): void {
    this._snackBarService.openSuccessSnackBar(value);
  }

  public updateMediaDevices(devices: MediaDeviceInfo[]): void {
    this._devices = devices;
    if (!this._selectedDevice && !!devices && devices.length > 0) this._selectedDevice = devices[0];
    console.log(devices);
  }

  public onInputDeviceChange(device: MediaDeviceInfo): void {
    this._selectedDevice = device;
  }
}
