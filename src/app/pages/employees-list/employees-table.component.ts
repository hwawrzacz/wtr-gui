import { Component } from '@angular/core';
import { CommonTableComponent } from 'src/app/components/common-table/common-table.component';
import { Employee } from 'src/app/model/employee';
import { Position, PositionStringifier } from 'src/app/model/enums/position';

@Component({
  selector: 'app-employees-table',
  templateUrl: '../../components/common-table/common-table.component.html',
  styleUrls: ['../../components/common-table/common-table.component.scss']
})
export class EmployeesTableComponent extends CommonTableComponent<Employee> {
  constructor() {
    super();

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
        action: (id: number) => {
          console.log(`statistics for ${id}`);
        },
        color: 'primary',
        tooltip: 'Show statistics'
      },
      {
        icon: 'edit',
        action: (id: number) => {
          console.log(`edit ${id}`);
        },
        tooltip: 'Edit item'
      },
      {
        icon: 'delete',
        action: (id: number) => {
          console.log(`delete ${id}`);
        },
        color: 'warn',
        tooltip: 'Delete item'
      }
    ]
  }
}