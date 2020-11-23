import { Component } from '@angular/core';
import { Priority, PriorityStringifier } from 'src/app/model/enums/priority';
import { Status, StatusStringifier } from 'src/app/model/enums/status';
import { Filter } from 'src/app/model/filter';
import { CommonSearchBarComponent } from '../common-search-bar/common-search-bar.component';

@Component({
  selector: 'app-filter-search-bar',
  templateUrl: './filter-search-bar.component.html',
  styleUrls: ['./filter-search-bar.component.scss']
})
export class FilterSearchBarComponent extends CommonSearchBarComponent {

  constructor() {
    super();
  }

  get statuses(): Status[] {
    return StatusStringifier.statusList;
  }

  get priorities(): Priority[] {
    return PriorityStringifier.prioritiesList;
  }

  public getStatusString(value: Status): string {
    return StatusStringifier.getStatusString(value);
  }

  public getPriorityString(value: Priority): string {
    return PriorityStringifier.getPriorityString(value);
  }

  public onStatusFilterChange(event): void {
    const statuses = event.value
    this.onFilterChange('status', statuses)
  }

  public onPriorityFilterChange(event): void {
    const priorities = event.value
    this.onFilterChange('priority', priorities)
  }

  private onFilterChange(name: string, values: string[]): void {
    if (values.length > 0) {
      this.updateFilter(name, values);
    } else {
      this.removeFilter(name);
    }
    this.debounceQueryChange();
  }

  private updateFilter(name: string, value: string[]) {
    if (this.queryHasFilter(name)) {
      this.replaceFilterValue(name, value);
    } else {
      const filter: Filter = { name: name, value: value };
      this._query.filters.push(filter);
    }
  }

  private queryHasFilter(name: string): boolean {
    return !!this._query.filters ? this._query.filters.filter(f => f.name === name).length > 0 : false;
  }

  private replaceFilterValue(name: string, value: string[]) {
    this._query.filters.find(f => f.name === name).value = value;
  }

  private removeFilter(name: string) {
    if (!!this._query.filters) {
      this._query.filters = this._query.filters.filter(f => f.name !== name);
    }
  }
}
