import { Component } from '@angular/core';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { PositionStringifier } from 'src/app/helpers/parsers';
import { Position } from 'src/app/model/enums/position';
import { SimpleEmployee } from 'src/app/model/simple-employee';
import { EmployeeDetailsBrokerService } from 'src/app/services/item-details-broker.service';
import { NavigatorService } from 'src/app/services/navigator.service';

@Component({
  selector: 'app-employees-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class EmployeesTableComponent extends CommonTableComponent<SimpleEmployee> {
  constructor(navigator: NavigatorService<SimpleEmployee>, itemDetailsBroker: EmployeeDetailsBrokerService) {
    super(navigator, itemDetailsBroker);

    // this._detailsUrl = 'employees'
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
        propertyName: 'position',
        formatter: (value: Position) => PositionStringifier.getPositionString(value)
      },
    ];

    this._actionsDefinitions = [
      {
        icon: 'pie_chart',
        action: (id: string) => {
          console.log(`statistics for ${id}`);
        },
        color: 'primary',
        tooltip: 'Show statistics'
      },
      {
        icon: 'edit',
        action: (id: string) => {
          console.log(`edit ${id}`);
        },
        tooltip: 'Edit item'
      },
      {
        icon: 'delete',
        action: (id: string) => {
          console.log(`delete ${id}`);
        },
        color: 'warn',
        tooltip: 'Delete item'
      }
    ]
  }
}