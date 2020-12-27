import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonSearchBarComponent } from './components/common-search-bar/common-search-bar.component';
import { CommonTableComponent } from './components/common-table/common-table.component';
import { ConfirmationDialogComponent } from './components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ProjectCreationDialogComponent } from './components/dialogs/project-creation-dialog/project-creation-dialog.component';
import { TaksCreationDialogComponent } from './components/dialogs/taks-creation-dialog/taks-creation-dialog.component';
import { UserCreationDialogComponent } from './components/dialogs/user-creation-dialog/user-creation-dialog.component';
import { FilterSearchBarComponent } from './components/filter-search-bar/filter-search-bar.component';
import { FullScreenErrorComponent } from './components/full-screen-error/full-screen-error.component';
import { FullScreenLoaderComponent } from './components/full-screen-loader/full-screen-loader.component';
import { AppHeaderComponent } from './components/header/header.component';
import { ImageCaptureDialogComponent } from './components/image-capture-dialog/image-capture-dialog.component';
import { ImageCaptureComponent } from './components/image-capture/image-capture.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import { PasswordChangeDialogComponent } from './components/password-change-dialog/password-change-dialog.component';
import { ProjectAutocompleteComponent } from './components/project-autocomplete/project-autocomplete.component';
import { ProjectTasksComponent } from './components/project-tasks/project-tasks.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
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
import { LoginComponent } from './pages/login/login.component';
import { LoginModule } from './pages/login/login.module';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { ProjectsTableComponent } from './pages/projects-list/projects-table.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { TasksTableComponent } from './pages/tasks-list/tasks-table.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UsersTableComponent } from './pages/users-list/users-table.component';
import { UserPipe } from './pipes/user.pipe';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

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

    StatisticsComponent,
    ProjectTasksComponent,
    WorkLoggerComponent,
    CommonSearchBarComponent,
    FilterSearchBarComponent,
    FullScreenErrorComponent,
    FullScreenLoaderComponent,
    ImageCaptureComponent,
    ImageCaptureDialogComponent,
    ImageUploaderComponent,
    PasswordChangeDialogComponent,
    UserCreationDialogComponent,
    ProjectCreationDialogComponent,
    UserPipe,
    UsersAutocompleteComponent,
    TaksCreationDialogComponent,
    ProjectAutocompleteComponent,
    WorkersPanelComponent,
    SuccessSnackBarComponent,
    ErrorSnackBarComponent,
    InfoSnackBarComponent,
    CommonSnackBarComponent,
    WarningSnackBarComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    LoginModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    ScrollingModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    HttpClientModule,
    MatProgressBarModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatTabsModule,
    ZXingScannerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
