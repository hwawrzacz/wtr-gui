import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'projects', component: ProjectsListComponent },
  { path: 'tasks', component: TasksListComponent },
  { path: 'projects/:id', component: ProjectDetailsComponent },
  { path: 'tasks/:id', component: TaskDetailsComponent },
  { path: 'users', component: UsersListComponent },
  { path: 'users/:id', component: UserDetailsComponent },
  { path: 'statistics', component: StatisticsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
