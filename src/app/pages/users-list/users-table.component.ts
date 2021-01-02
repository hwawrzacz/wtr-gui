import { Component } from '@angular/core';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { PositionStringifier } from 'src/app/helpers/parsers';
import { CommonItem } from 'src/app/model/common-item';
import { Position } from 'src/app/model/enums/position';
import { SimpleUser } from 'src/app/model/simple-user';
import { AuthService } from 'src/app/services/auth.service';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-users-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class UsersTableComponent extends CommonTableComponent<SimpleUser> {
  constructor(
    navigator: NavigatorService<SimpleUser>,
    authService: AuthService,
  ) {
    super(navigator, authService);

    this._detailsUrl = 'users'

    this._columnsDefinitions = [
      {
        defName: 'login',
        displayName: 'Login',
        propertyName: 'login',
      },
      {
        defName: 'firstName',
        displayName: 'Imię',
        propertyName: 'firstName',
      },
      {
        defName: 'lastName',
        displayName: 'Nazwisko',
        propertyName: 'lastName',
      },
      {
        defName: 'email',
        displayName: 'Email',
        propertyName: 'email',
      },
      {
        defName: 'position',
        displayName: 'Stanowisko',
        propertyName: 'role',
        formatter: (value: Position) => PositionStringifier.getPositionString(value)
      },
    ];

    this._actionsDefinitions = [
      // {
      //   icon: 'pie_chart',
      //   action: (item: CommonItem) => {
      //     this.navigateToStatsWithData(item);
      //   },
      //   canDisplay: (): boolean => {
      //     return this.canShowStats();
      //   },
      //   color: 'primary',
      //   tooltip: 'Pokaż statystyki'
      // },
      // {
      //   icon: 'edit',
      //   action: (item: CommonItem) => {
      //     this.navigateToDetailsWithData(item, true);
      //   },
      //   tooltip: 'Edytuj element'
      // },
      {
        icon: 'delete',
        action: (item: CommonItem) => {
          this.delete(item._id);
        },
        canDisplay: (): boolean => {
          return this.canDelete();
        },
        color: 'warn',
        tooltip: 'Usuń element'
      }
    ]
  }
}