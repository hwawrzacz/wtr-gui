import { Component, OnInit } from '@angular/core';
import { Section } from 'src/app/model/enums/section';
import { LoginService } from 'src/app/services/login.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.scss']
})
export class ProfileWidgetComponent implements OnInit {
  get userId(): string | null {
    return this._loginService.user ? this._loginService.user._id : null
  }

  get userName(): string {
    const user = this._loginService.user;
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  constructor(
    private _loginService: LoginService,
    private _navigator: NavigatorService<any>,
    private _snackBarService: SnackBarService,
  ) { }

  ngOnInit(): void {
  }

  public openProfileDetails() {
    this.userId
      ? this._navigator.navigateToDetails(Section.USERS, this.userId)
      : this._snackBarService.openErrorSnackBar('Nie można załadować profilu');
  }

  public logout(): void {
    this._loginService.logOut();
  }
}
