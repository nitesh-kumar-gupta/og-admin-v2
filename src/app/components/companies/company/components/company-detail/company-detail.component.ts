import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AdminService } from '../../../../../services/admin.service';
import { forkJoin } from 'rxjs';
import { Company } from '../../../../../models/company.model';
import { Router } from '@angular/router';
import * as _ from 'lodash';
@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit, OnDestroy {
  @Input() companyId: string;
  generateKeys = Object.keys;
  company: Company;
  editCompany: Company;
  tempComp: any;
  childCompanies: any[];
  immediateChange: boolean;
  companyFeature: any;
  companyCouponDetail: any[];
  subscribes: any[];
  viewCoupon: any;
  edit: boolean;
  cbPlanValue: Array<Object>;
  constructor(private adminService: AdminService, private router: Router) {
    this.subscribes = [];
    this.company = null;
    this.editCompany = null;
    this.childCompanies = [];
    this.companyFeature = null;
    this.companyCouponDetail = [];
    this.viewCoupon = null;
    this.edit = false;
    this.immediateChange = false;
  }

  ngOnInit() {
    console.log(this.companyId)
    if (this.companyId) {
      this.subscribes.push(this.getCompanyDetails());
      this.subscribes.push(this.getPlanTypes());
    }
  }

  ngOnDestroy() {
    this.subscribes.forEach((subscribe) => {
      subscribe.unsubscribe();
    });
  }

  getCompanyDetails() {
    return forkJoin([
      this.adminService.getCompanyInfo(this.companyId),
      this.adminService.getChildCompanies(this.companyId),
      this.adminService.getCustomFeatures(this.companyId)]).subscribe((success: any) => {
        console.log('success[2] ', success[2]);
        this.tempComp = {
          company: success[0].company,
          companyFeature: JSON.parse(JSON.stringify(success[2]))
        };
        this.company = new Company(this.tempComp.company);
        this.editCompany = new Company(this.tempComp.company);
        this.subscribes.push(this.getCompanyCouponDetails());
        if (success[1].length > 0) {
          success[1].forEach((company) => {
            this.childCompanies.push(company);
          });
        }
        this.companyFeature = JSON.parse(JSON.stringify(this.tempComp.companyFeature));
      }, (error: any) => {
        console.error('getCompanyDetail Error: ', error);
      });
  }

  getPlanTypes() {
    return this.adminService.getPlanTypes().subscribe((success: any) => {
      this.cbPlanValue = [];
      success.list.forEach((plan) => {
        const obj = {
          id: plan.plan.id,
          itemName: plan.plan.name
        };
        this.cbPlanValue.push(obj);
      });
    }, (error: any) => {
      console.error('getPlanTypes error', error);
    });
  }

  navigateToCompany(companyId) {
    this.router.navigate(['/admin/company', companyId]);
    window.location.reload();
  }

  getCompanyCouponDetails() {
    const email = this.company.billing.chargebee_customer_id.slice(0, this.company.billing.chargebee_customer_id.lastIndexOf('.'));
    return this.adminService.getCompanyCouponDetails(email).subscribe((success) => {
      this.companyCouponDetail = success;
    }, (error: any) => {
      console.error('getCompanyCouponDetails error', error);
    });
  }

  saveCompanyChanges() {
    const login = <HTMLButtonElement>document.getElementById('btn-saveCompany');
    login.disabled = true;
    login.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    if (!_.isEqual(this.company, this.editCompany)) {
      this.adminService.updateCompany(this.editCompany, this.immediateChange).subscribe((success: any) => {
        login.disabled = false;
        login.innerHTML = 'Save';
        this.editBack();
      }, (error: any) => {
        console.error('saveCompanyChanges error comp ', error);
        login.disabled = false;
        login.innerHTML = 'Save';
      });
    }
    else {
      login.disabled = false;
      login.innerHTML = 'Save';
    }
    if (!_.isEqual(this.companyFeature, this.tempComp.companyFeature)) {
    }
  }

  editBack() {
    this.getCompanyDetails()
    this.edit = !this.edit;
    this.editCompany = new Company(this.tempComp.company);
    this.companyFeature = JSON.parse(JSON.stringify(this.tempComp.companyFeature));
  }
}
