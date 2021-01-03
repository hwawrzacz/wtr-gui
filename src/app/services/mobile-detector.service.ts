import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectorService implements OnDestroy {
  private _isMobile: boolean;
  private readonly MOBILE_WIDTH_BREAKPOINT = 768;

  get isMobile(): boolean {
    return this._isMobile;
  }

  constructor() {
    this.checkMobility();
    window.addEventListener('resize', this.checkMobility);
  }

  private checkMobility = (): void => {
    const userAgent = navigator.userAgent;
    // const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent);
    const widthCheck = window.innerWidth < this.MOBILE_WIDTH_BREAKPOINT;
    this._isMobile = widthCheck;
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkMobility);
  }
}
