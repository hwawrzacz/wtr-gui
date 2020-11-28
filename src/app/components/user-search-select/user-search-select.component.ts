import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { debounceTime, tap } from 'rxjs/operators';
import { stringifyEmployee } from 'src/app/helpers/parsers';
import { FILTER_DEBOUNCE_TIMEOUT } from 'src/app/model/constants';
import { Employee } from 'src/app/model/employee';
import { Position } from 'src/app/model/enums/position';
import { Filter } from 'src/app/model/filter';
import { Query } from 'src/app/model/query';
import { SimpleEmployee } from 'src/app/model/simple-employee';
import { EmployeesRestService } from 'src/app/services/employees-rest.service';

@Component({
  selector: 'app-user-search-select',
  templateUrl: './user-search-select.component.html',
  styleUrls: ['./user-search-select.component.scss']
})
export class UserSearchSelectComponent {
  private _loadingCounter: number;
  private _singleSelection: boolean;
  private _employees: Employee[];
  private _filteredEmployees: Employee[];

  get isLoading(): boolean {
    return this._loadingCounter !== 0;
  }

  get singleSelection(): boolean {
    return this._singleSelection;
  }

  @Input('singleSelection')
  set singleSelection(value: boolean) {
    this._singleSelection = value;
  }

  @Output('selectionChange') selectionChangeEmitter: EventEmitter<Employee>;

  get filteredEmployees(): Employee[] {
    return this._filteredEmployees;
  }

  constructor(private _restService: EmployeesRestService) {
    this._loadingCounter = 0;
    this.selectionChangeEmitter = new EventEmitter<Employee>()
  }

  ngOnInit(): void {
    this.loadData();
  }

  //#region Initializers
  private loadData(): void {
    this._loadingCounter++;
    const filter = { name: 'position', value: [Position.MANAGER] } as Filter;
    const query = { searchString: '', filters: [filter] } as Query;
    this._restService.get(query).pipe(
      tap(items => {
        this._loadingCounter--;
        this._employees = items;
        this._filteredEmployees = this._employees;
      })
    ).subscribe();
  }
  //#endregion

  //#region On* functions
  public onKeyUp(event: any): void {
    const searchString = event.target.value;
    this.filterData(searchString);
  }

  public onSelectionChange(employee: Employee): void {
    console.log(`${employee.firstName} emit`);
    this.selectionChangeEmitter.emit(employee);

    if (this._singleSelection) {
      this.clearInput();
    }
  }
  //#endregion

  private filterData(query: string): void {
    this._filteredEmployees = this._employees.filter(employee => `${employee.login} ${employee.firstName} ${employee.lastName}`.includes(query));
  }

  private clearInput(): void {
    console.log('clear input')
  }

  //#region Helpers
  stringifyEmployee(employee: SimpleEmployee): string {
    return stringifyEmployee(employee);
  }
  //#endregion
}
