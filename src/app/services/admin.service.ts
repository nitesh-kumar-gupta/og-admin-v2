import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, catchError} from 'rxjs/operators';
import { BaseService } from './base.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {

  public getLogSubject = new BehaviorSubject<String>('');
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

 // showCacheKey(source_api = 'default',data:any){
    showCacheKey(data:any){
    // console.log("::In Cache Key fxn::")
  //  const _url = APIBasedServiceProvider.APISwitch(source_api);
  //Need to make changes to api based service as drop down is added
    return this.http.post(`${this._url}/cache/index`,data).pipe(
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

  addNewMember(user: any, companyId: string) {
    let data = {
      name: user.memberName,
      email: user.memberEmail,
      role: user.memberRole
    };
    let URL = this._url + '/admin/add/company/' + companyId + '/user';
    return this.http.post(URL, data, this.options)
    .pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }
  deleteUser(user: any) {
    let URL = this._url + '/admin/remove/company/' + user.user_company._id + '/user/' + user._id;
    return this.http.delete(URL, this.options)
    .pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
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

    return this.http.put(`${this._url}/admin/updateTeam`, { users, userCompanies }, this.put_options())
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
  getApps(data): any {
    return this.http.post(this._url + '/admin/companies/getapps', data, this.options)
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

  removeAutoLoginToken(data: Object){
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

  searchCompany(sub_domain) {
    return this.http.get(`${this._url}/admin/getCompanyBySubdomain/${sub_domain}`, this.get_options())
    .pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  duplicateApp(data) {
    return this.http.post(`${this._url}/admin/duplicateApp`, data, this.post_options())
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

  getAvailableTemplates() {
    return this.http.get(`${this._url}/admin/getAvailableTemplates`, this.get_options())
    .pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

}
