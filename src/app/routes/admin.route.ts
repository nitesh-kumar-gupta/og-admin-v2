import { Routes } from '@angular/router';
import { AdminComponent } from '../modules/admin/admin.component';
import { AdminGuard } from '../guards/admin.guard';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { CompaniesComponent } from '../components/companies/companies.component';
import { CompanyComponent } from '../components/companies/company/company.component';
import { CacheLogsComponent } from '../components/cache-logs/cache-logs.component';
import { EmailLogsComponent } from '../components/email-logs/email-logs.component';
import { PromotionChecklistComponent } from '../components/promotion-checklist/promotion-checklist.component';
import { CouponsComponent } from '../components/coupons/coupons.component';
import { SpecialDealComponent } from '../components/special-deal/special-deal.component';
import { HelloBarComponent } from '../components/hello-bar/hello-bar.component';
import { IntegrationLogsComponent } from '../components/integration-logs/integration-logs.component';
import { SearchCalcComponent } from '../components/search-calc/search-calc.component';
import { SitesettingsComponent } from '../components/sitesettings/sitesettings.component';
import { SuccessRateComponent } from '../components/success-rate/success-rate.component';

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
      },
      {
        path: 'cache-logs',
        component: CacheLogsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'emailLogs',
        component: EmailLogsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'promotion-checklist',
        component: PromotionChecklistComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'couponcode',
        component: CouponsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'specialDeals',
        component: SpecialDealComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'hello-bar',
        component: HelloBarComponent,
        // canActivate: [AdminGuard]
      },
      {
        path: 'integration-logs',
        component: IntegrationLogsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'searchcalc',
        component: SearchCalcComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'sitesettings',
        component: SitesettingsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'successrate',
        component: SuccessRateComponent,
        canActivate: [AdminGuard]
      },
    ]
  }
];
