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
import { IntegrationsComponent } from '../../components/companies/company/components/integrations/integrations.component';
import { CompanyLogsComponent } from '../../components/companies/company/components/company-logs/company-logs.component';
import { UsageCycleComponent } from '../../components/companies/company/components/usage-cycle/usage-cycle.component';
import { EventsComponent } from '../../components/events/events.component';
import { SubdomainComponent } from '../../components/subdomain/subdomain.component';
import { DomainComponent } from '../../components/subdomain/component/domain.component';
import { LocaleComponent } from '../../components/locale/locale.component';
import { SingleUserComponent } from '../../components/users/single-user/single-user.component';
import { AccountDetailsComponent, CalculatorsComponent, MembershipDetailsComponent, OtherDetailsComponent, TeamDetailsComponent } from '../../components/users/single-user/components';
import { UserLogsComponent } from '../../components/users/single-user/components/user-logs/user-logs.component';
import { AllUsersComponent } from '../../components/users/all-users/all-users.component';
import { LeadsComponent } from '../../components/leads/leads.component';
import { LogComponent } from '../../components/log/log.component';
import { PremadesComponent } from '../../components/premades/premades.component';
import { AllFeaturesComponent } from '../../components/all-features/all-features.component';
import { SelectModule } from 'ng2-select';
import { PlansComponent } from '../../components/plans/plans.component';
import { PlanComponent } from '../../components/plans/plan/plan.component';
import { PremadeComponent } from '../../components/plans/premade/premade.component';
import { FeatureComponent } from '../../components/plans/feature/feature.component';
import { FeatureLayoutManagerComponent } from '../../components/shared/feature-layout-manager/feature-layout-manager.component';
import { JSONCompare } from '../../services/helper/json-compare';
import { CompanyFeaturesComponent } from '../../components/companies/company/components/features/company-features/company-features.component';
import { CompanyPremadesComponent } from '../../components/companies/company/components/features/company-premades/company-premades.component';
import { CompanyCalculatorsComponent } from '../../components/companies/company/components/features/company-calculators/company-calculators.component';
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
    ReactiveFormsModule,
    SelectModule
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
    IntegrationsComponent,
    CompanyLogsComponent,
    UsageCycleComponent,
    EventsComponent,
    CacheLogsComponent,
    DomainComponent,
    SubdomainComponent,
    LocaleComponent,
    AllUsersComponent,
    SingleUserComponent,
    AccountDetailsComponent,
    CalculatorsComponent,
    MembershipDetailsComponent,
    OtherDetailsComponent,
    TeamDetailsComponent,
    UserLogsComponent,
    LeadsComponent,
    LogComponent,
    PremadesComponent,
    AllFeaturesComponent,
    PlansComponent,
    PlanComponent,
    PremadeComponent,
    FeatureComponent,
    FeatureLayoutManagerComponent,
    SearchCalcComponent,
    CompanyFeaturesComponent,
    CompanyPremadesComponent,
    CompanyCalculatorsComponent,
    EmailLogsComponent,
    PromotionChecklistComponent,
    CouponsComponent,
    SpecialDealComponent,
    HelloBarComponent,
    EditHelloBarComponent,
    IntegrationLogsComponent,
    IntegrationLogDetailsComponent,
    SitesettingsComponent,
    AutologinTokenComponent,
    PromoGoalsComponent,
    DealsComponent,
    SuccessRateComponent,
    CompanyDetailsComponent
  ],
  providers:[JSONCompare]
    

})
export class AdminModule { }
