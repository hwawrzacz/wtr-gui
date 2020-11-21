import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Filter } from '../model/filter';
import { Pagination } from '../model/pagination';
import { Project } from '../model/project';

@Injectable({
  providedIn: 'root'
})
export class CommonRestService<T> {
  protected url: string;
  constructor(protected http: HttpClient) { }

  // TODO (HW): Remove any type annotation - it is just for testing purposes. Target anotation is T.
  // TODO (HW): Add common request
  public get(query: string, pagination?: Pagination, filters?: Filter[]): Observable<any> {
    return of(
      this.mockGetProjects()
        .filter(project => {
          return project.stringId.includes(query) || project.title.includes(query) || project.description.includes(query);
        })
    ).pipe(delay(2000));
  }

  // TODO (HW): Remove below
  private mockGetProjects(): Project[] {
    return [
      {
        id: 1,
        stringId: 'PROJ_1',
        title: 'Jeden projekt',
        description: 'Taki niezwykły projekt, że to to prostu szok i niedowierzanie',
        manager: 'John Wick',
        workersCount: 4,
      },
      {
        id: 2,
        stringId: 'PROJ_2',
        title: 'Dwa projekt',
        description: 'Taki drugi projekt z trochę mniejszym szokiem, ale jednak nadal trochę',
        manager: 'Steven Spielberg',
        workersCount: 7,
      },
      {
        id: 3,
        stringId: 'PROJ_3',
        title: 'Pobieranie danych',
        description: 'Inny projekt, który służy tylko i wyłącznie temu, żeby pokazać jak są pobierane dane.',
        manager: 'Adam Sandler',
        workersCount: 9,
      },
      {
        id: 4,
        stringId: 'PROJ_4',
        title: 'Zabawowe przygotowanie do pracy',
        description: 'Projekt numer cztery powstał z pomyśleniem o fantastycznym serwisie, który jest bardzo przyazny.',
        manager: 'Sean Connery',
        workersCount: 12,
      },
      {
        id: 5,
        stringId: 'PROJ_5',
        title: 'Finale grande',
        description: 'Ten projekt ma taką cechę, że jest ostatni na liście (chyba, że lista się zmieni albo zostanie posortowana)',
        manager: 'Cameron Diaz',
        workersCount: 3,
      }
    ];
  }
}
