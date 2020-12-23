import { CommonArrayResponse } from "./common-array-response";
import { Position } from "./enums/position";
import { Priority } from './enums/priority';
import { Status } from "./enums/status";
import { Project } from './project';
import { Task } from './task';
import { User } from "./user";
import { WorkLog, WorkLogType } from './work-log';

export const mockProjects: CommonArrayResponse<Project> = {
  items: [
    {
      _id: '1',
      stringId: 'PROJ_1',
      title: 'Jeden projekt',
      description: 'Taki niezwykły projekt, że to to prostu szok i niedowierzanie',
      manager: {
        _id: '1',
        login: 'jowick',
        firstName: 'John',
        lastName: 'Wick',
        role: Position.MANAGER,
        email: 'j.wick@somecompany.com',
        phoneNumber: '345 534 345'
      },
      workers: ['1', '2', '3', '4'],
      creationDate: "2020-12-08T23:00:00.000Z",
      dutyDate: "2020-12-08T23:00:00.000Z"
    },
    {
      _id: '2',
      stringId: 'PROJ_2',
      title: 'Dwa projekt',
      description: 'Taki drugi projekt z trochę mniejszym szokiem, ale jednak nadal trochę',
      manager: {
        _id: '2',
        login: 'stespie',
        firstName: 'Steven',
        lastName: 'Spierlberg',
        role: Position.MANAGER,
        email: 's.spielberg@somecompany.com',
        phoneNumber: '345 534 345'
      },
      workers: ['3', '7', '4', '6', '10', '22'],
      creationDate: "2020-12-08T23:00:00.000Z",
      dutyDate: "2020-12-08T23:00:00.000Z"
    },
    {
      _id: '3',
      stringId: 'PROJ_3',
      title: 'Pobieranie danych',
      description: 'Inny projekt, który służy tylko i wyłącznie temu, żeby pokazać jak są pobierane dane.',
      manager: {
        _id: '3',
        login: 'asan',
        firstName: 'Adam',
        lastName: 'Sandler',
        role: Position.MANAGER,
        email: 'a.sandler@somecompany.com',
        phoneNumber: '345 534 345'
      },
      workers: ['1', '3', '7', '8', '4', '5'],
      creationDate: "2020-12-08T23:00:00.000Z",
      dutyDate: "2020-12-08T23:00:00.000Z"
    },
    {
      _id: '4',
      stringId: 'PROJ_4',
      title: 'Zabawowe przygotowanie do pracy',
      description: 'Projekt numer cztery powstał z pomyśleniem o fantastycznym serwisie, który jest bardzo przyazny.',
      manager: {
        _id: '4',
        login: 'seacon',
        firstName: 'Sean',
        lastName: 'Connery',
        role: Position.MANAGER,
        email: 's.connery@somecompany.com',
        phoneNumber: '345 534 345'
      },
      workers: ['3', '4', '5', '7', '8'],
      creationDate: "2020-12-08T23:00:00.000Z",
      dutyDate: "2020-12-08T23:00:00.000Z"
    },
    {
      _id: '5',
      stringId: 'PROJ_5',
      title: 'Finale grande',
      description: 'Ten projekt ma taką cechę, że jest ostatni na liście (chyba, że lista się zmieni albo zostanie posortowana)',
      manager: {
        _id: '5',
        login: 'camdiaz',
        firstName: 'Cameron',
        lastName: 'Diaz',
        role: Position.MANAGER,
        email: 'c.diaz@somecompany.com',
        phoneNumber: '345 534 345'
      },
      workers: ['9', '8', '7', '6', '5', '4', '3', '2'],
      creationDate: "2020-12-08T23:00:00.000Z",
      dutyDate: "2020-12-08T23:00:00.000Z"
    }
  ]
} as CommonArrayResponse<Project>;

export const mockTasks: CommonArrayResponse<Task> = {
  items: [
    {
      _id: '1',
      stringId: 'PROJN_T1',
      projectStringId: 'PROJ_N',
      title: 'Zadanie 1',
      description: 'Lorem ipsum dolor sit amet something else',
      status: Status.IN_PROGRESS,
      priority: Priority.HIGH,
      workers: ['1', '2', '3', '4'],
      idProject: 1,
      reporter: {
        _id: '1',
        login: 'jowick',
        firstName: 'John',
        lastName: 'Wick',
        role: Position.MANAGER,
        email: 'j.wick@somecompany.com',
        phoneNumber: '345 534 345'
      },
      creationDate: "2020-12-08T23:00:00.000Z",
      dutyDate: "2020-12-08T23:00:00.000Z"
    },
    {
      _id: '2',
      stringId: 'PROJN_T1',
      projectStringId: 'PROJ_N',
      title: 'Zadanie 2',
      description: 'Lorem ipsum dolor sit amet something else',
      status: Status.NEW,
      priority: Priority.MEDIUM,
      workers: ['1', '2', '3', '4'],
      idProject: 1,
      reporter: {
        _id: '2',
        login: 'stespie',
        firstName: 'Steven',
        lastName: 'Spierlberg',
        role: Position.MANAGER,
        email: 's.spielberg@somecompany.com',
        phoneNumber: '345 534 345'
      },
      creationDate: "2020-12-08T23:00:00.000Z",
      dutyDate: "2020-12-08T23:00:00.000Z"
    },
  ]
} as CommonArrayResponse<Task>;

export const mockUsers: CommonArrayResponse<User> = {
  items: [
    {
      _id: '1',
      login: 'jowick',
      firstName: 'John',
      lastName: 'Wick',
      role: Position.MANAGER,
      email: 'j.wick@somecompany.com',
      phoneNumber: '345 534 345'
    },
    {
      _id: '2',
      login: 'stespie',
      firstName: 'Steven',
      lastName: 'Spierlberg',
      role: Position.MANAGER,
      email: 's.spielberg@somecompany.com',
      phoneNumber: '345 534 345'
    },
    {
      _id: '3',
      login: 'asan',
      firstName: 'Adam',
      lastName: 'Sandler',
      role: Position.MANAGER,
      email: 'a.sandler@somecompany.com',
      phoneNumber: '345 534 345'
    },
    {
      _id: '4',
      login: 'seacon',
      firstName: 'Sean',
      lastName: 'Connery',
      role: Position.MANAGER,
      email: 's.connery@somecompany.com',
      phoneNumber: '345 534 345'
    },
    {
      _id: '5',
      login: 'camdiaz',
      firstName: 'Cameron',
      lastName: 'Diaz',
      role: Position.MANAGER,
      email: 'c.diaz@somecompany.com',
      phoneNumber: '345 534 345'
    },
  ]
} as CommonArrayResponse<User>;

export const mockWorkLogs: CommonArrayResponse<WorkLog> = {
  items: [
    {
      id: '234',
      taskId: 1,
      user: {
        id: '1',
        login: 'jowick',
        firstName: 'John',
        lastName: 'Wick',
        role: Position.MANAGER,
        email: 'j.wick@somecompany.com',
        phoneNumber: '345 534 345'
      } as any,
      dateTime: 12341235134,
      type: WorkLogType.BREAK,
    } as WorkLog,
    {
      id: '234',
      taskId: 1,
      user: {
        id: '1',
        login: 'jowick',
        firstName: 'John',
        lastName: 'Wick',
        role: Position.MANAGER,
        email: 'j.wick@somecompany.com',
        phoneNumber: '345 534 345'
      } as any,
      dateTime: 12341235544,
      type: WorkLogType.BREAK,
    } as WorkLog,
    {
      id: '234',
      taskId: 1,
      user: {
        id: '1',
        login: 'jowick',
        firstName: 'John',
        lastName: 'Wick',
        role: Position.MANAGER,
        email: 'j.wick@somecompany.com',
        phoneNumber: '345 534 345'
      } as any,
      dateTime: 12341235874,
      type: WorkLogType.BREAK,
    } as WorkLog,
  ]
} as CommonArrayResponse<WorkLog>;