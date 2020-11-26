import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonItemDetailsComponent } from 'src/app/components/common-item-details/common-item-details.component';
import { Employee } from 'src/app/model/employee';
import { Project } from 'src/app/model/project';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['../../components/common-item-details/common-item-details.component.scss', './project-details.component.scss']
})
export class ProjectDetailsComponent extends CommonItemDetailsComponent<Project> implements OnInit {
  readonly: boolean;
  private _form: FormGroup;

  constructor(router: Router, private _formBuilder: FormBuilder) {
    super(router);
    this.readonly = true;
    this.reinitializeForm();
  }

  //#region Getters and setters
  get stringId(): number | string {
    return this.itemId;
  }

  get form(): FormGroup {
    return this._form;
  }
  //#endregion

  ngOnInit(): void {
    super.ngOnInit();
  }

  private reinitializeForm(): void {
    this._form = this.buildForm();
  }

  private buildForm(): FormGroup {
    return this._formBuilder.group({
      // title: [this._item.title, [Validators.required]],
      // manager: [this._item.manager, [Validators.required]],
      // description: [this._item.description]
      title: ['Super duper title', [Validators.required]],
      manager: [2, [Validators.required]],
      description: ['In officia laboris aliqua deserunt ullamco magna exercitation in aute aliqua. In reprehenderit id commodo anim cupidatat dolore ullamco enim nostrud anim consequat nisi nulla. Tempor aliquip aliqua esse aliquip mollit nostrud do. Incididunt minim excepteur laborum et duis Lorem excepteur laboris in. Irure ex sit pariatur cillum commodo voluptate veniam nulla non duis minim eiusmod incididunt. Id aliquip pariatur ipsum laboris et ea. Nostrud pariatur et magna nisi ad non ea aute ipsum.']
    });
  }

  getMangers(): Observable<Employee[]> {
    return
  }
}
