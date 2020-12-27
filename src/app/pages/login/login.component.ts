import { Component, OnInit } from '@angular/core';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private _devices: MediaDeviceInfo[];
  private _selectedDevice: MediaDeviceInfo;

  get mediaDevices(): MediaDeviceInfo[] {
    return this._devices;
  }

  get selectedDevice(): MediaDeviceInfo {
    return this._selectedDevice || null;
  }
  set selectedDevice(value: MediaDeviceInfo) {
    console.log(value);
    this._selectedDevice = value;
  }

  constructor(private _snackBarService: SnackBarService) { }

  ngOnInit(): void {
  }

  public handleQrScanSuccess(value: string): void {
    this._snackBarService.openSuccessSnackBar(value);
  }

  public updateMediaDevices(devices: MediaDeviceInfo[]): void {
    this._devices = devices;
    if (!this.selectedDevice && !!devices && devices.length > 0) this._selectedDevice = devices[0];
    console.log(devices);
  }

  public onInputDeviceChange(device: MediaDeviceInfo): void {
    // console.log(device);
    this.selectedDevice = device;
  }
}
