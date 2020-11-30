import { Position } from "./enums/position";
import { Priority } from './enums/priority';
import { Status } from "./enums/status";
import { WorkLog, WorkLogType } from './work-log';

export const mockProjects = [
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

export const mockTasks = [
  {
    id: 1,
    title: 'Zadanie 1',
    description: 'Lorem ipsum dolor sit amet something else',
    status: Status.IN_PROGRESS,
    priority: Priority.HIGH,
    workers: [1, 2, 3, 4],
    projectId: 1,
    reporter: {
      id: 1,
      login: 'jowick',
      firstName: 'John',
      lastName: 'Wick',
      position: Position.MANAGER,
      email: 'j.wick@somecompany.com',
      phoneNumber: '345 534 345'
    },
    creationDate: Date.now() - 12837823,
    dutyDate: Date.now()
  },
  {
    id: 2,
    title: 'Zadanie 2',
    description: 'Lorem ipsum dolor sit amet something else',
    status: Status.NEW,
    priority: Priority.MEDIUM,
    workers: [1, 2, 3, 4],
    projectId: 1,
    reporter: {
      id: 2,
      login: 'stespie',
      firstName: 'Steven',
      lastName: 'Spierlberg',
      position: Position.MANAGER,
      email: 's.spielberg@somecompany.com',
      phoneNumber: '345 534 345'
    },
    creationDate: Date.now() - 12837823,
    dutyDate: Date.now()
  },
]

export const mockEmployees = [
  {
    id: 1,
    login: 'jowick',
    firstName: 'John',
    lastName: 'Wick',
    position: Position.MANAGER,
    email: 'j.wick@somecompany.com',
    phoneNumber: '345 534 345'
  },
  {
    id: 2,
    login: 'stespie',
    firstName: 'Steven',
    lastName: 'Spierlberg',
    position: Position.MANAGER,
    email: 's.spielberg@somecompany.com',
    phoneNumber: '345 534 345'
  },
  {
    id: 3,
    login: 'asan',
    firstName: 'Adam',
    lastName: 'Sandler',
    position: Position.MANAGER,
    email: 'a.sandler@somecompany.com',
    phoneNumber: '345 534 345'
  },
  {
    id: 4,
    login: 'seacon',
    firstName: 'Sean',
    lastName: 'Connery',
    position: Position.MANAGER,
    email: 's.connery@somecompany.com',
    phoneNumber: '345 534 345'
  },
  {
    id: 5,
    login: 'camdiaz',
    firstName: 'Cameron',
    lastName: 'Diaz',
    position: Position.MANAGER,
    email: 'c.diaz@somecompany.com',
    phoneNumber: '345 534 345'
  },
]

export const mockWorkLogs = [
  {
    id: '234',
    taskId: 1,
    employee: {
      id: '1',
      login: 'jowick',
      firstName: 'John',
      lastName: 'Wick',
      position: Position.MANAGER,
      email: 'j.wick@somecompany.com',
      phoneNumber: '345 534 345'
    } as any,
    dateTime: 12341235134,
    type: WorkLogType.WORK,
  } as WorkLog,
  {
    id: '234',
    taskId: 1,
    employee: {
      id: '1',
      login: 'jowick',
      firstName: 'John',
      lastName: 'Wick',
      position: Position.MANAGER,
      email: 'j.wick@somecompany.com',
      phoneNumber: '345 534 345'
    } as any,
    dateTime: 12341235544,
    type: WorkLogType.BREAK,
  } as WorkLog,
  {
    id: '234',
    taskId: 1,
    employee: {
      id: '1',
      login: 'jowick',
      firstName: 'John',
      lastName: 'Wick',
      position: Position.MANAGER,
      email: 'j.wick@somecompany.com',
      phoneNumber: '345 534 345'
    } as any,
    dateTime: 12341235874,
    type: WorkLogType.WORK,
  } as WorkLog,

];