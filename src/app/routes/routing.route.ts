import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { LoginComponent } from '../components/login/login.component';
import { LoginGuard } from '../guards/login.guad';
import { AdminGuard } from '../guards/admin.guard';
import { AdminModule } from '../modules/admin/admin.module';
import { AdminComponent } from '../modules/admin/admin.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'login',
    redirectTo: '',
    pathMatch: 'full',
    canActivate: [LoginGuard]
  },
  {
    path: 'admin',
    loadChildren: '../modules/admin/admin.module#AdminModule',
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [
      RouterModule.forRoot(routes),
      AdminModule
  ],
  exports: [
      RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
