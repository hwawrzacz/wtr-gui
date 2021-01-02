import { Component, OnInit } from '@angular/core';
import { stringifyUser } from 'src/app/helpers/parsers';
import { Position } from 'src/app/model/enums/position';
import { Project } from 'src/app/model/project';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {

  private _project: Project;

  get project(): Project {
    return this._project;
  }

  get managerString(): string {
    return stringifyUser(this._project.manager);
  }

  constructor() {
    this._project = {
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
    } as Project
  }

  ngOnInit(): void {
  }
}
