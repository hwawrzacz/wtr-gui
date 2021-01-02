import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { PositionStringifier, stringifyUser } from 'src/app/helpers/parsers';
import { User } from 'src/app/model/user';
import { SingleUserRestService } from 'src/app/services/rest/single-user-rest.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  private _user: User;
  private _image: string;
  private _isLoading: boolean;
  private _error: boolean;

  @Input('user')
  set user(value: User) {
    this._user = value;
  }
  get user(): User {
    return this._user;
  }

  get image(): string {
    return this._image;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }
  get error(): boolean {
    return this._error;
  }

  get position(): string {
    return PositionStringifier.getPositionString(this._user.role);
  }

  get userString(): string {
    return stringifyUser(this._user);
  }

  constructor(private _userRestService: SingleUserRestService) { }

  ngOnInit(): void {
    this.getImageFromCredentials();
  }

  private getImageFromCredentials(): void {
    this._isLoading = true;
    this._error = false;
    this._userRestService.getCredentials(this._user._id)
      .pipe(
        tap(res => {
          if (res.success) {
            this._isLoading = false;
            this._image = res.details.facePhoto;
          } else {
            this._isLoading = false;
            this._error = true;
          }
        })
      )
      .subscribe();
  }

}
