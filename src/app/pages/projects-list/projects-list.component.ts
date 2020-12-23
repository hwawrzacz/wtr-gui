import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { ProjectCreationDialogComponent } from 'src/app/components/dialogs/project-creation-dialog/project-creation-dialog.component';
import { Project } from 'src/app/model/project';
import { ProjectsListRestService } from 'src/app/services/rest/projects-list-rest.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss']
})
export class ProjectsListComponent extends CommonListViewComponent<Project> {
  constructor(
    restService: ProjectsListRestService,
    snackBar: MatSnackBar,
    dialogService: MatDialog,
  ) {
    super(restService, snackBar, dialogService);

    this._pageTitle = "Projects";
    this._themeItemNameSingle = "project";
  }

  public openItemCreationDialog(): void {
    this._dialogService.open(ProjectCreationDialogComponent)
      .afterClosed()
      .pipe(
        this.handleAfterClosed()
      )
      .subscribe();
  }
}
