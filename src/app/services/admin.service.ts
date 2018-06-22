import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, catchError} from 'rxjs/operators';
import { BaseService } from './base.service';
@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseService {

  constructor(private http: Http) {
    super();
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
}
