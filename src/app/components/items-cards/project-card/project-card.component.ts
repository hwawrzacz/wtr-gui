import { Component, Input, OnInit } from '@angular/core';
import { stringifyUser } from 'src/app/helpers/parsers';
import { Project } from 'src/app/model/project';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  private _dutyDate: Date;
  private _project: Project;

  @Input('project')
  set project(value: Project) {
    this._project = value;
    this._dutyDate = new Date(value.dutyDate)
  }
  get project(): Project {
    return this._project;
  }

  get managerString(): string {
    return stringifyUser(this._project.idManager as User);
  }

  get dutyDate(): string {
    return this._dutyDate.toLocaleDateString('pl-PL');
  }

  constructor() { }

  ngOnInit(): void { }
}
