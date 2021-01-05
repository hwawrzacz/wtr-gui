import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppCommonModule } from './app-common-module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonMaterialModule } from './common-material.module';
import { CommonSearchBarComponent } from './components/common-search-bar/common-search-bar.component';
import { CommonTableComponent } from './components/common-table/common-table.component';
import { ConfirmationDialogComponent } from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ProjectCreationDialogComponent } from './components/dialogs/project-creation-dialog/project-creation-dialog.component';
import { TaskCreationDialogComponent } from './components/dialogs/task-creation-dialog/task-creation-dialog.component';
import { UserCreationDialogComponent } from './components/dialogs/user-creation-dialog/user-creation-dialog.component';
import { FilterSearchBarComponent } from './components/filter-search-bar/filter-search-bar.component';
import { FullScreenErrorComponent } from './components/full-screen-error/full-screen-error.component';
import { AppHeaderComponent } from './components/header/header.component';
import { ImageCaptureDialogComponent } from './components/image-capture-dialog/image-capture-dialog.component';
import { ImageCaptureModule } from './components/image-capture/image-capture.module';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { ProjectCardComponent } from './components/items-cards/project-card/project-card.component';
import { TaskCardComponent } from './components/items-cards/task-card/task-card.component';
import { UserCardComponent } from './components/items-cards/user-card/user-card.component';
import { PasswordChangeDialogComponent } from './components/password-change-dialog/password-change-dialog.component';
import { ProfileWidgetComponent } from './components/profile-widget/profile-widget.component';
import { ProjectAutocompleteComponent } from './components/project-autocomplete/project-autocomplete.component';
import { ProjectTasksComponent } from './components/project-tasks/project-tasks.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ActionSnackBarComponent } from './components/snack-bars/action-snack-bar/action-snack-bar.component';
import { CommonSnackBarComponent } from './components/snack-bars/common-snack-bar/common-snack-bar.component';
import { ErrorSnackBarComponent } from './components/snack-bars/error-snack-bar/error-snack-bar.component';
import { InfoSnackBarComponent } from './components/snack-bars/info-snack-bar/info-snack-bar.component';
import { SuccessSnackBarComponent } from './components/snack-bars/success-snack-bar/success-snack-bar.component';
import { WarningSnackBarComponent } from './components/snack-bars/warning-snack-bar/warning-snack-bar.component';
import { ProjectTasksTableComponent } from './components/tables/project-tasks-table.component';
import { UsersAutocompleteComponent } from './components/users-autocomplete/users-autocomplete.component';
import { WorkLoggerComponent } from './components/work-logger/work-logger.component';
import { WorkLogsListComponent } from './components/work-logs-list/work-logs-list.component';
import { WorkLogsTableComponent } from './components/work-logs-table/work-logs-table.component';
import { WorkersPanelComponent } from './components/workers-panel/workers-panel.component';
import { MatPaginatorPolishTranslation } from './helpers/mat-paginator-translator-pl';
import { LoginComponent } from './pages/login/login.component';
import { LoginModule } from './pages/login/login.module';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { ProjectsTableComponent } from './pages/projects-list/projects-table.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { TasksTableComponent } from './pages/tasks-list/tasks-table.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UsersTableComponent } from './pages/users-list/users-table.component';
import { UserPipe } from './pipes/user.pipe';
import { AuthInterceptor } from './services/interceptors/auth.interceptor';
import { ErrorInterceptor } from './services/interceptors/error.interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AppHeaderComponent,
    SidenavComponent,

    ProjectDetailsComponent,
    TaskDetailsComponent,
    UserDetailsComponent,

    CommonTableComponent,
    ProjectsTableComponent,
    ProjectTasksTableComponent,
    TasksTableComponent,
    WorkLogsTableComponent,
    UsersTableComponent,

    ProjectsListComponent,
    TasksListComponent,
    UsersListComponent,
    WorkLogsListComponent,
    ProjectCardComponent,
    TaskCardComponent,
    UserCardComponent,

    ProjectTasksComponent,
    WorkLoggerComponent,
    CommonSearchBarComponent,
    FilterSearchBarComponent,
    FullScreenErrorComponent,
    ImageCaptureDialogComponent,
    ImageUploaderComponent,
    PasswordChangeDialogComponent,
    UserCreationDialogComponent,
    ProjectCreationDialogComponent,
    UserPipe,
    UsersAutocompleteComponent,
    TaskCreationDialogComponent,
    ProjectAutocompleteComponent,
    WorkersPanelComponent,
    SuccessSnackBarComponent,
    ErrorSnackBarComponent,
    InfoSnackBarComponent,
    ActionSnackBarComponent,
    CommonSnackBarComponent,
    WarningSnackBarComponent,
    ConfirmationDialogComponent,
    ProfileWidgetComponent,
  ],
  imports: [
    MatDialogModule,
    CommonMaterialModule,
    AppCommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ScrollingModule,
    HttpClientModule,
    ImageCaptureModule,
    LoginModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MatPaginatorIntl, useValue: new MatPaginatorPolishTranslation() },
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
