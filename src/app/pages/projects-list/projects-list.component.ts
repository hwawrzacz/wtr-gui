import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonListViewComponent } from 'src/app/components/common-list-view/common-list-view.component';
import { ProjectCreationDialogComponent } from 'src/app/components/dialogs/project-creation-dialog/project-creation-dialog.component';
import { Filter } from 'src/app/model/filter';
import { Project } from 'src/app/model/project';
import { ProjectsListRestService } from 'src/app/services/rest/projects-list-rest.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['../../components/common-list-view/common-list-view.component.scss']
})
export class ProjectsListComponent extends CommonListViewComponent<Project> {
  constructor(
    restService: ProjectsListRestService,
    snackBarService: SnackBarService,
    dialogService: MatDialog,
  ) {
    super(restService, snackBarService, dialogService);

    this._pageTitle = "Projekty";
    this._themeItemNameSingle = "projekt";
  }

  public openItemCreationDialog(): void {
    this._dialogService.open(ProjectCreationDialogComponent)
      .afterClosed()
      .pipe(
        this.handleAfterClosed()
      )
      .subscribe();
  }

  public getRequiredFilter(): Filter[] {
    return [] as Filter[];
  }
}
