import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { PositionStringifier } from 'src/app/helpers/parsers';
import { CommonItem } from 'src/app/model/common-item';
import { Position } from 'src/app/model/enums/position';
import { SimpleUser } from 'src/app/model/simple-user';
import { NavigatorService } from 'src/app/services/navigator.service';
import { UserRestService } from 'src/app/services/user-rest.service';

@Component({
  selector: 'app-users-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class UsersTableComponent extends CommonTableComponent<SimpleUser> {
  constructor(navigator: NavigatorService<SimpleUser>) {
    super(navigator);

    this._detailsUrl = 'users'

    this._columnsDefinitions = [
      {
        defName: 'login',
        displayName: 'Login',
        propertyName: 'login',
      },
      {
        defName: 'firstName',
        displayName: 'First name',
        propertyName: 'firstName',
      },
      {
        defName: 'lastName',
        displayName: 'Last name',
        propertyName: 'lastName',
      },
      {
        defName: 'email',
        displayName: 'Email',
        propertyName: 'email',
      },
      {
        defName: 'position',
        displayName: 'Position',
        propertyName: 'role',
        formatter: (value: Position) => PositionStringifier.getPositionString(value)
      },
    ];

    this._actionsDefinitions = [
      {
        icon: 'pie_chart',
        action: (item: CommonItem) => {
          this.navigateToStatsWithData(item);
        },
        color: 'primary',
        tooltip: 'Show statistics'
      },
      {
        icon: 'edit',
        action: (item: CommonItem) => {
          this.navigateToDetailsWithData(item, true);
        },
        tooltip: 'Edit item'
      },
      {
        icon: 'delete',
        action: (item: CommonItem) => {
          this.delete(item._id);
          console.log(`delete ${item._id}`);
        },
        color: 'warn',
        tooltip: 'Delete item'
      }
    ]
  }
}