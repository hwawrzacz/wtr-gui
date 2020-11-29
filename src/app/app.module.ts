import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonListViewComponent } from './components/common-list-view/common-list-view.component';
import { CommonSearchBarComponent } from './components/common-search-bar/common-search-bar.component';
import { CommonTableComponent } from './components/common-table/common-table.component';
import { FilterSearchBarComponent } from './components/filter-search-bar/filter-search-bar.component';
import { FullScreenErrorComponent } from './components/full-screen-error/full-screen-error.component';
import { FullScreenLoaderComponent } from './components/full-screen-loader/full-screen-loader.component';
import { AppHeaderComponent } from './components/header/header.component';
import { ProjectTasksComponent } from './components/project-tasks/project-tasks.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UserSearchSelectComponent } from './components/user-search-select/user-search-select.component';
import { EmployeesListComponent } from './pages/employees-list/employees-list.component';
import { EmployeesTableComponent } from './pages/employees-list/employees-table.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { ProjectsTableComponent } from './pages/projects-list/projects-table.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { TasksTableComponent } from './pages/tasks-list/tasks-table.component';
import { WorkLogsTableComponent } from './components/work-logs-table/work-logs-table.component';
import { WorkLogsListComponent } from './components/work-logs-list/work-logs-list.component';


@NgModule({
  declarations: [
    AppComponent,
    CommonTableComponent,
    ProjectsListComponent,
    ProjectsTableComponent,
    TasksListComponent,
    StatisticsComponent,
    ProjectDetailsComponent,
    TaskDetailsComponent,
    LoginComponent,
    AppHeaderComponent,
    SidenavComponent,
    CommonListViewComponent,
    TasksTableComponent,
    EmployeesTableComponent,
    EmployeesListComponent,
    CommonSearchBarComponent,
    FilterSearchBarComponent,
    ProjectTasksComponent,
    UserSearchSelectComponent,
    FullScreenErrorComponent,
    FullScreenLoaderComponent,
    WorkLogsTableComponent,
    WorkLogsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
