import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { EmployeesListComponent } from './pages/employees-list/employees-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectsListComponent },
  { path: 'tasks', component: TasksListComponent },
  { path: 'projects/:id', component: ProjectDetailsComponent },
  { path: 'tasks/:id', component: TaskDetailsComponent },
  { path: 'users', component: EmployeesListComponent },
  // { path: 'users/:id', component: EmployeesDetailsComponent },
  { path: 'statistics', component: StatisticsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
