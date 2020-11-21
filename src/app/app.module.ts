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
import { ProjectsTableComponent } from './pages/projects/projects-table.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';


@NgModule({
  declarations: [
    AppComponent,
    CommonTableComponent,
    ProjectsComponent,
    ProjectsTableComponent,
    TasksComponent,
    StatisticsComponent,
    ProjectDetailsComponent,
    TaskDetailsComponent,
    LoginComponent,
    AppHeaderComponent,
    SidenavComponent,
    CommonListViewComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
