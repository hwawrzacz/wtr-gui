import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonListViewComponent } from './components/common-list-view/common-list-view.component';
import { CommonTableComponent } from './components/common-table/common-table.component';
import { AppHeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { LoginComponent } from './pages/login/login.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectsTableComponent } from './pages/projects-list/projects-table.component';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TasksTableComponent } from './pages/tasks-list/tasks-table.component';
import { MatSelectModule } from '@angular/material/select';
import { CommonSearchBarComponent } from './components/common-search-bar/common-search-bar.component';
import { FilterSearchBarComponent } from './components/filter-search-bar/filter-search-bar.component';
import { EmployeesTableComponent } from './pages/employees-list/employees-table.component';
import { EmployeesListComponent } from './pages/employees-list/employees-list.component';
import { CommonItemDetailsComponent } from './components/common-item-details/common-item-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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
    CommonItemDetailsComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
