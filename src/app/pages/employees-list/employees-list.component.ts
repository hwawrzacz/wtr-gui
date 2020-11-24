import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { Employee } from 'src/app/model/model';
import { EmployeesRestService } from 'src/app/services/employees-rest.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss']
})
export class EmployeesListComponent extends CommonListViewComponent<Employee> {
  constructor(http: HttpClient) {
    super();

    this._pageTitle = 'Employees'
    this._themeItemNameSingle = 'employee';
    this._restService = new EmployeesRestService(http);
  }

}
