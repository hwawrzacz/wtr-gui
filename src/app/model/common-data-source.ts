import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';

export class CommonDataSource<T> extends DataSource<T> {
  public data: BehaviorSubject<T[]>;

  constructor(data) {
    super();
    this.data = new BehaviorSubject<T[]>(data);
  }

  public refresh(data: T[]) {
    this.data.next(data || []);
  }

  connect(): Observable<T[]> {
    return this.data;
  }

  disconnect() { }
}