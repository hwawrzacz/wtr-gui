import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Filter } from 'src/app/model/filter';
import { Task } from 'src/app/model/task';
import { AuthService } from 'src/app/services/auth.service';
import { MobileDetectorService } from 'src/app/services/mobile-detector.service';
import { NavigatorService } from 'src/app/services/navigator.service';
import { TasksListRestService } from 'src/app/services/rest/tasks-list-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { CommonListViewComponent } from '../common-list-view/common-list-view.component';

@Component({
  selector: 'app-project-tasks-list',
  templateUrl: './project-tasks.component.html',
  styleUrls: ['./project-tasks.component.scss']
})
export class ProjectTasksComponent extends CommonListViewComponent<Task> implements OnInit {
  private _projectId: number;

  @Input('projectId')
  set projectId(value: number) {
    this._projectId = value;
  }

  constructor(
    restService: TasksListRestService,
    snackBarService: SnackBarService,
    dialogService: MatDialog,
    authService: AuthService,
    mobileDetector: MobileDetectorService,
    navigator: NavigatorService<Task>,
  ) {
    super(restService, snackBarService, dialogService, authService, mobileDetector, navigator);

    this._detailsUrl = 'tasks';
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  protected getRequiredFilter(): Filter[] {
    return [{ name: 'idProject', values: [`${this._projectId}`] }] as Filter[];
  }

  public openItemCreationDialog(): void { return }
}
