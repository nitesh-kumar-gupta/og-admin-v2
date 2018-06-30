import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import { APIBasedServiceProvider } from './helper/api-based-request.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {
  public getLogSubject = new BehaviorSubject<String>('');
  companyTemplates: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public availableTemplates = [];
  constructor(private http: Http) {
    super();
    this.getAvailableTemplates().subscribe((data) => {
      this.availableTemplates = data;
    })
  }

  getBasicGraph(data): any {
    return this.http.post(`${this._url}/admin/graph`, data, this.post_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getCompanies(data): any {
    return this.http.post(`${this._url}/companies/all`, data, this.post_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getPlanTypes(): any {
    return this.http.get(`${this._url}/plan/usedPlans`, this.get_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getCompanyInfo(id: string) {
    return this.http.get(`${this._url}/companies/${id}`, this.get_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getChildCompanies(id: string) {
    return this.http.get(`${this._url}/admin/company/${id}/child-company`, this.get_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getCustomFeatures(id: string) {
    return this.http.get(`${this._url}/company/${id}/custom_features`, this.get_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getCompanyCouponDetails(email) {
    return this.http.get(`${this._url}/admin/company_couponcode/${email}`, this.get_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  updateCompany(company, immediateChange) {
    const growSumoUrl = company.referral.growsumo_url;
    if (growSumoUrl !== '' && !/^(f|ht)tps?:\/\//i.test(growSumoUrl)) {
      company.referral.growsumo_url = 'http://' + growSumoUrl;
    }
    company['immediateChange'] = immediateChange;
    return this.http.put(`${this._url}/admin/update/company/${company.id}`, company, this.put_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }
  showCacheKey(data: any) {
    // console.log("::In Cache Key fxn::")
    // const _url = APIBasedServiceProvider.APISwitch(source_api);
    //Need to make changes to api based service as drop down is added
    return this.http.post(`${this._url}/cache/index`, data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  clearCache(keys) {
    return this.http.delete(`${this._url}/cache/clear/`, { body: { urls: keys } })
      .pipe(
        map(this.extractData)
      );
  }
  generatePasswordLink(user: number) {
    return this.http.get(this._url + '/admin/gen_pwd_link/' + user).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getUserCompanies(user_id: any) {
    let getCompaniesUrl = this._url + '/users_companies/companies/user/' + user_id;
    return this.http.get(getCompaniesUrl, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  isCompanyMember(company_id: String, user_id: any) {
    let checkMembershipUrl = this._url + '/users_companies/companies/' + company_id + '/users/' + user_id;
    return this.http.get(checkMembershipUrl, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

  isSubDomainExist(company: String) {
    let companyurl = this._url + '/companies/sub_domain/' + company;
    return this.http.get(companyurl).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getEmailLogs(user: number, type: string) {
    return this.http.get(this._url + '/admin/user/emails/' + type + '/' + user, this.get_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getAllLeads(data: any) {
    return this.http.post(this._url + '/admin/leads', data, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getLog(source_api = 'default', data) {
    const url = APIBasedServiceProvider.APISwitch(source_api);
    return this.http.post(url + '/admin/getLog', data, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

  getlogType() {
    return this.getLogSubject.asObservable();
  }
  getAvailableTemplates() {
    return this.http.get(`${this._url}/admin/getAvailableTemplates`, this.get_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getApps(data): any {
    return this.http.post(this._url + '/admin/companies/getapps', data, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      )
  }

  deleteUser(user: any) {
    let URL = this._url + '/admin/remove/company/' + user.user_company._id + '/user/' + user._id;
    return this.http.delete(URL, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

  addNewMember(user: any, companyId: string) {
    let data = {
      name: user.memberName,
      email: user.memberEmail,
      role: user.memberRole
    };
    let URL = this._url + '/admin/add/company/' + companyId + '/user';
    return this.http.post(URL, data, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  updateTeam(data) {
    let users = [];
    let userCompanies = [];

    data.forEach(d => {
      let userCompany = {};
      let user = {};

      user['name'] = d['name'];
      user['_id'] = d['_id'];
      users.push(user);

      userCompany['_id'] = d.user_company._id;
      userCompany['role'] = d.user_company.role;
      userCompany['status'] = d.user_company.status;
      userCompany['active'] = d.user_company.active;
      userCompanies.push(userCompany);
    });

    return this.http.put(`${this._url}/admin/updateTeam`, { users, userCompanies }, this.put_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getCompanyFeatures(data) {
    return this.http.post(`${this._url}/company/company_features`, data, this.post_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getCompanyUsers(company_id: any) {
    let getBasicUrl = this._url + '/users_companies/' + company_id + '/users';
    let data = {};
    return this.http.post(getBasicUrl, data, this.post_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

  updateCompanyAddon(data: any, company_id: String) {
    return this.http.put(this._url + '/admin/company/addon/' + company_id, data, this.put_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getCompUsageCycle(id) {
    return this.http.get(`${this._url}/admin/getcompanyUsageCycle/${id}`, this.get_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getAllAdminLogs(company: any = null, data: any, subadminId: any = null, ) {
    let uri = '';
    if (company) {
      uri = this._url + "/admin/subadminlog/" + company
    }
    // else if(subadminId){
    //   uri = this._url + "/admin/subadminlog/"+subadminId
    //   }
    return this.http.post(uri, data, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  searchCompany(sub_domain) {
    return this.http.get(`${this._url}/admin/getCompanyBySubdomain/${sub_domain}`, this.get_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      )
  }

  duplicateApp(data) {
    return this.http.post(`${this._url}/admin/duplicateApp`, data, this.post_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      )
  }
  updateFeatures(data, iteratee) {
    return this.http.put(`${this._url}/company/update/company-${iteratee}`, data, this.put_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getCompanyTemplates() {
    return this.companyTemplates.asObservable();
  }
  getWebhookEventsByCompany(companyId) {
    return this.http.get(this._url + '/admin/companies/get_events/' + companyId, this.get_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getCompanyProjects(sub_domain: String) {
    let URL = this._url + '/admin/company_projects/';
    return this.http.post(URL, { company: sub_domain }, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

  getAppPromotionScore(appId) {
    return this.http.get(this._url + '/apps/score/' + appId, this.get_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getAppIntegrationLogs(data) {
    return this.http.post(this._url + '/admin/companies/get_apps_integration_logs', data, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getCompanyIntegrations(data) {
    return this.http.post(this._url + '/admin/companies/get_integrations', data, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

  getAppIntegrations(data) {
    return this.http.post(this._url + '/admin/companies/get_integration_apps', data, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getSiteSettings() {
    return this.http.get(this._url + '/admin/site/settings/', this.get_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  getPromoCheckListItems(dataTableAttr: any) {
    return this.http.post(this._url + '/admin/promolists', dataTableAttr, this.post_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  savePromoCheckListItems(data: Object) {
    return this.http.post(this._url + '/admin/promolist', data, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  updatePromoCheckListItems(id, data: Object) {
    return this.http.put(this._url + '/admin/promolist/' + id, data, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  deletePromoCheckListItems(id) {
    return this.http.delete(this._url + '/admin/promolist/' + id)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }


  getCouponsCode(data: any) {
    return this.http.post(this._url + '/coupon/lists', data, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  createPromo(data: any) {
    console.log(this.post_options(), ">>>>>>>>>>>>>>>>>>");
    return this.http.post(this._url + '/coupon/create', data, this.post_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  deletePromocode(couponId: string) {
    return this.http.put(this._url + '/coupon/delete/' + couponId, {}, this.put_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  viewPromocode(couponId: string) {
    return this.http.get(this._url + '/coupon/show/' + couponId, this.get_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  editPromocode(couponId: string, data: any) {
    return this.http.put(this._url + '/coupon/update/' + couponId, data, this.put_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  generateDealCoupon(data) {
    return this.http.post(this._url + '/webhook/deal/jvzoo', data, this.post_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  getSpecialCouponCodeLogs(params: any) {
    return this.http.post(this._url + '/admin/special_deal_log', params, this.post_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  getHellobar(data) {
    return this.http.post(this._url + '/admin/getAllHellobars', data, this.post_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  saveHellobar(data) {
    return this.http.put(this._url + '/admin/saveHellobar', data, this.put_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  deleteHellobar(hellobarId) {
    return this.http.delete(this._url + '/admin/' + hellobarId, this.delete_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getAllIntegrationLogs(data) {
    return this.http.post(this._url + '/admin/companies/getAllIntegrationLogs', data, this.post_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getIntegrationLogDetails(data): any {
    return this.http.post(this._url + '/admin/getIntegrationLogDetails', data, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  updateSiteSettings(data: any) {
    return this.http.put(this._url + '/admin/site/settings/', data, this.put_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  editMessage(data: any, type: string) {
    return this.http.put(this._url + '/selectedHellobar/' + type, data, this.put_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  saveAutoLoginToken(data: Object) {
    return this.http.post(this._url + '/admin/saveAutoLoginToken', data, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  removeAutoLoginToken(data: Object) {
    return this.http.put(this._url + '/admin/removeAutoLoginToken', data, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  updateAppsAnalytics() {
    return this.http.get(this._url + '/admin/updateCalcAnalytics')
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }



  getCompanySuccessRate(data): any {
    return this.http.post(this._url + '/admin/companies/successrate/', data, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  saveSuccessRateFilter(data) {
    return this.http.post(this._url + '/admin/success_rate/save_filter', data, this.post_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }


  getSavedFilters() {
    return this.http.get(this._url + '/admin/success_rate/get_filters', this.get_options())
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  exportDataToSheet(data) {
    return this.http.post(this._url + '/admin/exportToSheet', data, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getCompanyAppDetails(data): any {
    return this.http.post(this._url + '/admin/companies/get_apps_stats', data, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getCompanyUserDetails(data): any {
    return this.http.post(this._url + '/admin/companies/getusers/', data, this.options)
      .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }


}