import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Filter } from '../model/filter';
import { Position } from '../model/model';
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
        manager: {
          id: 1,
          login: 'jowick',
          firstName: 'John',
          lastName: 'Wick',
          position: Position.MANAGER,
          email: 'j.wick@somecompany.com',
          phoneNumber: '345 534 345'
        },
        workers: [1, 2, 3, 4],
        creationDate: Date.now() - 12837823,
        dutyDate: Date.now()
      },
      {
        id: 2,
        stringId: 'PROJ_2',
        title: 'Dwa projekt',
        description: 'Taki drugi projekt z trochę mniejszym szokiem, ale jednak nadal trochę',
        manager: {
          id: 2,
          login: 'stespie',
          firstName: 'Steven',
          lastName: 'Spierlberg',
          position: Position.MANAGER,
          email: 's.spielberg@somecompany.com',
          phoneNumber: '345 534 345'
        },
        workers: [3, 7, 4, 6, 10, 22],
        creationDate: Date.now() - 12837823,
        dutyDate: Date.now()
      },
      {
        id: 3,
        stringId: 'PROJ_3',
        title: 'Pobieranie danych',
        description: 'Inny projekt, który służy tylko i wyłącznie temu, żeby pokazać jak są pobierane dane.',
        manager: {
          id: 3,
          login: 'asan',
          firstName: 'Adam',
          lastName: 'Sandler',
          position: Position.MANAGER,
          email: 'a.sandler@somecompany.com',
          phoneNumber: '345 534 345'
        },
        workers: [1, 3, 7, 8, 4, 5],
        creationDate: Date.now() - 12123823,
        dutyDate: Date.now()
      },
      {
        id: 4,
        stringId: 'PROJ_4',
        title: 'Zabawowe przygotowanie do pracy',
        description: 'Projekt numer cztery powstał z pomyśleniem o fantastycznym serwisie, który jest bardzo przyazny.',
        manager: {
          id: 4,
          login: 'seacon',
          firstName: 'Sean',
          lastName: 'Connery',
          position: Position.MANAGER,
          email: 's.connery@somecompany.com',
          phoneNumber: '345 534 345'
        },
        workers: [3, 4, 5, 7, 8],
        creationDate: Date.now() - 23422252,
        dutyDate: Date.now()
      },
      {
        id: 5,
        stringId: 'PROJ_5',
        title: 'Finale grande',
        description: 'Ten projekt ma taką cechę, że jest ostatni na liście (chyba, że lista się zmieni albo zostanie posortowana)',
        manager: {
          id: 5,
          login: 'camdiaz',
          firstName: 'Cameron',
          lastName: 'Diaz',
          position: Position.MANAGER,
          email: 'c.diaz@somecompany.com',
          phoneNumber: '345 534 345'
        },
        workers: [9, 8, 7, 6, 5, 4, 3, 2],
        creationDate: Date.now() - 23422252,
        dutyDate: Date.now()
      }
    ];
  }
}
