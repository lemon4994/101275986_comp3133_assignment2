import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { EmployeesList } from './pages/employees-list/employees-list';
import { EmployeeAdd } from './pages/employee-add/employee-add';
import { EmployeeView } from './pages/employee-view/employee-view';
import { EmployeeEdit } from './pages/employee-edit/employee-edit';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'employees', component: EmployeesList },
  { path: 'employees/add', component: EmployeeAdd },
  { path: 'employees/view/:id', component: EmployeeView },
  { path: 'employees/edit/:id', component: EmployeeEdit }
];
