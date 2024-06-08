import { Routes } from '@angular/router';
import { TodoListComponent } from './pages/todo-list/todo-list.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard, alreadyAuthGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: 'home', component: TodoListComponent, canActivate: [authGuard]},
  { path: 'login', component: LoginComponent, canActivate: [alreadyAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [alreadyAuthGuard] },
  { path: '**', redirectTo: 'home' }
];
