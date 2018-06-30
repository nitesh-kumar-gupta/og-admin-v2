import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/catch';
import { BaseService } from './base.service';
import { Company } from './../models/company.model';
import { UsersCompany } from './../models/userCompany';
import { map, catchError} from 'rxjs/operators';
// import { CurrentCompany } from './../models/company';

import { User } from './../models/user';
@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseService {
  token: string;
  response: any;
  companyTemplates:BehaviorSubject<any>= new BehaviorSubject<any>([]);
  // currentCompany: CurrentCompany;
  constructor(public _http: Http) {
    super();
  }

  // setCurrentCompany(company: any){
  //   this.currentCompany = new CurrentCompany(company);
  // }

  isCompanyMember(company_id: String, user_id: any)  {
    let checkMembershipUrl = this._url + '/users_companies/companies/' + company_id + '/users/' + user_id;
    return this._http.get(checkMembershipUrl, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getFirstCompany(user_id: any)  {
    let getFirstCompany = this._url + '/users_companies/users/' + user_id;
    return this._http.get(getFirstCompany, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getCompanies() {
    let getCompaniesUrl = this._url + '/users_companies/companies';
    return this._http.get(getCompaniesUrl, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getCompanyUsers(company_id: any) {
    let getBasicUrl = this._url + '/users_companies/' + company_id + '/users';
    let data = {};
    return this._http.post(getBasicUrl, data, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  getCompanyUsersForEmail(company_id: any) {
    return this._http.get(this._url + '/users_companies/' + company_id + '/users', this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  getUserCompanies(user_id: any) {
    let getCompaniesUrl = this._url + '/users_companies/companies/user/' + user_id;
    return this._http.get(getCompaniesUrl, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  isCompanyExist(company: String) {
    let companyurl = this._url + '/companies/name/' + company;
    return this._http.get(companyurl)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  // isSubDomainExist (company :String) : Observable<Company> {
  //   let storage;
  //   let companyurl;
  //   if (this.readCookie('storage')) {
  //      storage = JSON.parse(this.readCookie('storage'));
  //   }
  //   if(storage){
  //     companyurl= this._url + '/companies/user/'+storage.user._id+'/sub_domain/' + company;
  //   }else{
  //     companyurl= this._url + '/companies/sub_domain/' + company;
  //   }
  //   return this._http.get(companyurl)
  //                     .map(this.extractData)
  //                     .catch(this.handleError);
  // }

  isSubDomainExist(company: String){
    let companyurl = this._url + '/companies/sub_domain/' + company;
    return this._http.get(companyurl)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  addUser(data: any, company_id: any) {
    let details = {
      'email': data.userEmail,
      'name': data.userName,
      'role': data.userRole
    };
    return this._http.post(this._url + '/users_companies/' + company_id, details, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );

  }

  createCompany(data: any){
    let companyurl = this._url + '/companies';
    let details = {
      'name': data.companyname,
      'sub_domain': data.domain,
      'agency': data.agency,
      'parent_company': data.parent_company
    };
    // console.log("PARENT COMPANY",data);
    return this._http.post(companyurl, details, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  searchCompany(company: String){
    let companyurl = this._url + '/companies/list/' + company;
    return this._http.get(companyurl, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  joinCompany(companyId: String)  {
    let companyUrl = this._url + '/users_companies';
    let details = {
      'company_id': companyId
    };
    return this._http.post(companyUrl, details, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  leaveCompany(compId: any)  {
    let getBasicUrl = this._url + '/users_companies/' + compId;
    return this._http.delete(getBasicUrl, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  removeUser(companyId: any, userId: any)  {
    let getBasicUrl = this._url + '/users_companies/companies/' + companyId + '/users/' + userId;
    return this._http.delete(getBasicUrl, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  approveUser(userId: any, companyId: any, userRole: any)  {
    let getBasicUrl = this._url + '/users_companies/approve';
    let admin = false;
    if (userRole === 'ADMIN')
      admin = true;
    let details = {
      'user_id': userId,
      'company_id': companyId,
      'admin': admin
    };
    return this._http.put(getBasicUrl, details, this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  makeAdmin(companyId: any, userId: any)  {
    let getBasicUrl = this._url + '/users_companies/' + companyId + '/admin';
    let details = {
      'user_id': userId,
      'admin': true
    };
    return this._http.put(getBasicUrl, details, this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  makeManager(companyId: any, userId: any)  {
    let getBasicUrl = this._url + '/users_companies/' + companyId + '/admin';
    let details = {
      'user_id': userId,
      'admin': false
    };
    return this._http.put(getBasicUrl, details, this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
      
  }
  saveCallSchedule(data: any){
    let ls: string = localStorage.getItem('storage');
    let storage: any = JSON.parse(ls);
    let details = {
      'leads': {
        'total': data.leads
      },
      'traffic': {
        'frequency': data.traffic
      },
      'agency': data.companyType
    };
    return this._http.put(this._url + '/companies/' + storage.company._id, details, this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  updateCompany(compId: any, company: any, isAdmin: boolean = false) {
    let companyUrl = this._url + '/companies/' + compId;
    let details: any = {};
    if (isAdmin) {
      details = {
        'name': company.name,
        'sub_domain': company.sub_domain,
        'agency': company.agency,
        'is_admin_created': company.is_admin_created,
        'billing': {
          'chargebee_plan_id': company.chargebee_plan_id,
          'chargebee_subscription_id': company.chargebee_subscription_id,
          'chargebee_customer_id': company.chargebee_customer_id,
          'stripe_customer_id': company.stripe_customer_id
        },
        'current_limit': {
          'leads': company.current_limit_leads,
          'traffic': company.current_limit_traffic
        },
        'integration': company.integration ? company.integration : false
      };
    } else {
      details = {
        'name': company.companyname,
        'sub_domain': company.domain,
        'cname': company.cname,
        'agency': company.agency
        // 'traffic':{
        //   'frequency':company.traffic
        // },
        // 'leads':{
        //   'total':company.leads
        // }
      };
    }
    return this._http.put(companyUrl, details, this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  //Get Apps
  getCompanyProjects(id: String) {
    let URL = this._url + '/dashboard/company_projects/';
    return this._http.post(URL, { company: id }, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getCompanyHomeProjects(id: String) {
    let URL = this._url + '/dashboard/company_home_projects/' + id;
    return this._http.get(URL)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getLiveCompanyProjects(company_id: String) {
    let URL = this._url + '/dashboard/live_projects/' + company_id;
    return this._http.get(URL, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getProjectsStats(id: String) {
    let URL = this._url + '/analytic/projects_stats/' + id;
    return this._http.get(URL, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getAllCompanies(data: any) {
    let getCompaniesUrl = this._url + '/companies/all';
    return this._http.post(getCompaniesUrl, data, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getCompanyInfo(id: number) {
    let URL = this._url + '/companies/' + id;
    return this._http.get(URL, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );

  }

  //Get Templates
  getTemplates() {
    let getPlanUrl = this._url + '/dashboard/get_templates';
    return this._http.get(getPlanUrl)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  generateApiKey(compId: string) {
    let details = {
      'id': compId
    };
    return this._http.post(this._url + '/apikey/create', details, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getHellobarMessage() {
    return this._http.get(this._url + '/selectedHellobar', this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  verifyCustomDomain(data: any) {
    return this._http.post(this._url + '/verify/customdomain', data, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  resendInvitation(user: any, company: any){
    let verifyUrl = this._url + '/users_companies/' + company + '/resendInviteUserEmail/' + user;
    return this._http.get(verifyUrl, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  checkCnameExist(company :any){
    let URL = this._url + '/companies/cname/'  + company;
      return this._http.get(URL, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getCompanyPremades(company){
    company['special_jv']=company['integration'];
    return this._http.post(`${this._url}/company/premade_calcs`,company,this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  updateCompanyPremades(data){
    return this._http.post(`${this._url}/company/update_premades`,data,this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  getCompanyTemplates(){
    return this.companyTemplates.asObservable();
  }
  getCustomFeatures(company_id){
    return this._http.get(`${this._url}/company/${company_id}/custom_features`)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  getCompanyFeatures(data){
    return this._http.post(`${this._url}/company/company_features`,data,this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  updateFeatures(data,iteratee){
    return this._http.put(`${this._url}/company/update/company-${iteratee}`,data,this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  getPlanTypes() {
    const url = `${this._url}/plan/usedPlans`;
    return this._http.get(url, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
}
