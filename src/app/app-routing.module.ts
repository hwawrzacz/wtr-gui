import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectsListComponent } from './pages/projects-list/projects-list.component';
import { TaskDetailsComponent } from './pages/task-details/task-details.component';
import { TasksListComponent } from './pages/tasks-list/tasks-list.component';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './services/guards/auth.guard';
import { UsersGuard } from './services/guards/users.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectsListComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TasksListComponent, canActivate: [AuthGuard] },
  { path: 'projects/:id', component: ProjectDetailsComponent, canActivate: [AuthGuard] },
  { path: 'tasks/:id', component: TaskDetailsComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard, UsersGuard] },
  { path: 'users/:id', component: UserDetailsComponent, canActivate: [AuthGuard, UsersGuard] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
