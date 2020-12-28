import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.scss']
})
export class ProfileWidgetComponent implements OnInit {

  get userName(): string {
    const user = this._loginService.user;
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  constructor(private _loginService: LoginService) { }

  ngOnInit(): void {
  }

  public logout(): void {
    this._loginService.logOut();
  }

}
