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
import { CacheLogsComponent } from '../../components/cache-logs/cache-logs.component';
import { EmailLogsComponent } from '../../components/email-logs/email-logs.component';
import { PromotionChecklistComponent } from '../../components/promotion-checklist/promotion-checklist.component';
import { CouponsComponent } from '../../components/coupons/coupons.component';
import { SpecialDealComponent } from '../../components/special-deal/special-deal.component';
import { HelloBarComponent } from '../../components/hello-bar/hello-bar.component';
import { EditHelloBarComponent } from '../../components/hello-bar/edit-hello-bar/edit-hello-bar.component';
import { IntegrationLogsComponent } from '../../components/integration-logs/integration-logs.component';
import { IntegrationLogDetailsComponent } from '../../components/integration-logs/integration-log-details/integration-log-details.component';
import { SearchCalcComponent } from '../../components/search-calc/search-calc.component';
import { SitesettingsComponent } from '../../components/sitesettings/sitesettings.component';
import { AutologinTokenComponent } from '../../components/sitesettings/autologin-token/autologin-token.component';
import { PromoGoalsComponent } from '../../components/sitesettings/promo-goals/promo-goals.component';
import { DealsComponent } from '../../components/sitesettings/deals/deals.component';
import { SuccessRateComponent } from '../../components/success-rate/success-rate.component';
import { CompanyDetailsComponent } from '../../components/success-rate/company-details/company-details.component';

@NgModule({
  imports: [
    RouterModule.forChild(ADMIN_ROUTES),
    CommonModule,
    FormsModule,
    AngularMultiSelectModule,
    ReactiveFormsModule
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
    UsageCycleComponent,
    CacheLogsComponent,
    EmailLogsComponent,
    PromotionChecklistComponent,
    CouponsComponent,
    SpecialDealComponent,
    HelloBarComponent,
    EditHelloBarComponent,
    IntegrationLogsComponent,
    IntegrationLogDetailsComponent,
    SearchCalcComponent,
    SitesettingsComponent,
    AutologinTokenComponent,
    PromoGoalsComponent,
    DealsComponent,
    SuccessRateComponent,
    CompanyDetailsComponent


  ]
})
export class AdminModule { }
