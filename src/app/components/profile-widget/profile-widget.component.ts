import { Component, OnInit } from '@angular/core';
import { Section } from 'src/app/model/enums/section';
import { AuthService } from 'src/app/services/auth.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.scss']
})
export class ProfileWidgetComponent implements OnInit {
  get userId(): string | null {
    return this._authService.user ? this._authService.user._id : null
  }

  get userName(): string {
    const user = this._authService.user;
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  constructor(
    private _authService: AuthService,
    private _navigator: NavigatorService<any>,
    private _snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
  }

  public openProfileDetails() {
    if (this.userId) {
      this._navigator.navigateToDetails(Section.USERS, this.userId);
    }
    else {
      this._snackBarService.openErrorSnackBar('Nie można załadować profilu');
    }
  }

  public logout(): void {
    this._authService.logout();
  }
}
