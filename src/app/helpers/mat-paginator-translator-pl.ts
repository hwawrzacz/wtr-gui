import { MatPaginatorIntl } from '@angular/material/paginator';

export class MatPaginatorPolishTranslation extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = 'Liczba elementów na stronę:';
    this.previousPageLabel = 'Poprzednia strona';
    this.nextPageLabel = 'Następna strona';
    this.firstPageLabel = 'Pierwsza strona';
    this.lastPageLabel = 'Ostatnia strona';
  }

  public getRangeLabel = (page: number, pageSize: number, length: number): string => {
    return `${page * pageSize + 1} - ${Math.min(page * pageSize + pageSize, length)} z ${length}`;
  }
}