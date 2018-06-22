import { Routes } from '@angular/router';
import { AdminComponent } from '../modules/admin/admin.component';
import { AdminGuard } from '../guards/admin.guard';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { CompaniesComponent } from '../components/companies/companies.component';
import { CompanyComponent } from '../components/companies/company/company.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AdminGuard]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        canActivate: [AdminGuard]
      },
      {
        path: 'companies',
        component: CompaniesComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'company/:id',
        component: CompanyComponent,
        canActivate: [AdminGuard]
      }
    ]
  }
];
