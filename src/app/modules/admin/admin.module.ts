import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { ADMIN_ROUTES } from '../../routes/admin.route';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { ToolbarComponent } from '../../components/shared/toolbar/toolbar.component';
import { SidebarComponent } from '../../components/shared/sidebar/sidebar.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { CompaniesComponent } from '../../components/companies/companies.component';
import { CompanyComponent } from '../../components/companies/company/company.component';
import { CompanyDetailComponent } from '../../components/companies/company/components/company-detail/company-detail.component';
import { TeamDetailComponent } from '../../components/companies/company/components/team-detail/team-detail.component';
import { MembershipDetailComponent } from '../../components/companies/company/components/membership-detail/membership-detail.component';
import { FeaturesComponent } from '../../components/companies/company/components/features/features.component';
import { IntegrationsComponent } from '../../components/companies/company/components/integrations/integrations.component';
import { CompanyLogsComponent } from '../../components/companies/company/components/company-logs/company-logs.component';
import { UsageCycleComponent } from '../../components/companies/company/components/usage-cycle/usage-cycle.component';

@NgModule({
  imports: [
    RouterModule.forChild(ADMIN_ROUTES),
    CommonModule,
    FormsModule,
    AngularMultiSelectModule
  ],
  declarations: [
    AdminComponent,
    ToolbarComponent,
    SidebarComponent,
    DashboardComponent,
    FooterComponent,
    CompaniesComponent,
    CompanyComponent,
    CompanyDetailComponent,
    TeamDetailComponent,
    MembershipDetailComponent,
    FeaturesComponent,
    IntegrationsComponent,
    CompanyLogsComponent,
    UsageCycleComponent
  ]
})
export class AdminModule { }
