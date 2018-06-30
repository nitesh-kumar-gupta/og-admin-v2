import { Component, AfterViewInit, Output, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Observable, forkJoin } from 'rxjs';
import { AdminCompany } from '../../../models/company.model';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, AfterViewInit {
  templates: any = [];
  company_users: any[];
  id: any;
  company: any;
  custom_features: any;
  companyFeatures: any;
  childCompanies: any;

  constructor(
    public route: ActivatedRoute,
    public _adminService: AdminService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }
  ngOnInit() {
    this.getCompanyUser(this.id);
    this.getCompanyInfo(this.id);
  }

  ngAfterViewInit() {
    //  this.getCompanyInfo(this.id);
    // this.getCompanyUser(this.id);

  }

  getCompanyFeatures(company) {
    let $ref = this._adminService.getCompanyFeatures(company)
      .subscribe((data) => {
        this.companyFeatures = data;
        this.companyFeatures['company'] = this.company.id;
        this.companyFeatures.features && (this.templates = this.getFeatures(this.companyFeatures.features, 'templates'));
        $ref.unsubscribe();
      }, error => {
        $ref.unsubscribe();
      })
  }
  getCompanyUser(id: number) {
    this._adminService.getCompanyUsers(id)
      .subscribe(
        (response: any) => {
          this.company_users = response;
        });
  }

  getCompanyInfo(id: number) {
    forkJoin([
      this._adminService.getCompanyInfo(this.id),
      this._adminService.getCustomFeatures(this.id),
      this._adminService.getChildCompanies(this.id)])
      .subscribe((data: any) => {
        this.company = new AdminCompany(data[0].company);
        console.log("!!!", this.company)
        this.company['reset_period_list'] = data[0].reset_period_list;
        this.custom_features = data[1];
        this.getCompanyFeatures(this.company);
        this.childCompanies = data[2];
      }, error => {
        console.log("error");
      });
  }

  // updatecompany(data) {
  //   this.company = data;
  // }

  getFeatures(features, parentFeature) {
    let item = features.find(feature => {
      return feature['_id'] === parentFeature;
    });
    return (item ? item['sub_features'] : []);
  }

  emitChanges(changes) {
    changes = changes.filter(obj => obj['parent_feature'] === 'templates');
    changes.length && this._adminService.companyTemplates.next(changes);
  }
}
