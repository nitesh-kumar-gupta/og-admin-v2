import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { map, catchError } from 'rxjs/operators';
import { Http } from '@angular/http';
import { SubDomainService } from './sub-domain.service';

@Injectable({
  providedIn: 'root'
})
export class MembershipService extends BaseService {

  constructor(public _http: Http,public _subDomainService:SubDomainService) { 
    super();
  }
  getplanSubscription(id: string = null) {
    let company = id ? id : this._subDomainService.subDomain.company_id;
    let getPlanUrl = this._url + '/subscriptions/' + company;
    return this._http.get(getPlanUrl, this.get_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getInvoices(id: string = null) {
    let company = id ? id : this._subDomainService.subDomain.company_id;
    let getPlanUrl = this._url + '/invoices/' + company;
    return this._http.get(getPlanUrl, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )

  }

  getInvoicesPdf(data: any, id: string = null) {
    let company = id ? id : this._subDomainService.subDomain.company_id;
    let getPlanUrl = this._url + '/invoices/' + company + '/pdf/' + data;
    return this._http.get(getPlanUrl, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )

  }
  getPaymentDetails(id: string = null) {
    let company = id ? id : this._subDomainService.subDomain.company_id;
    let getPlanUrl = this._url + '/customer/' + company + '/card';
    return this._http.get(getPlanUrl, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  updateAddon(data: any, companyId?: any) {
    let company = companyId ? companyId : this._subDomainService.subDomain.company_id;
    let url = this._url + '/subscription/updateAddon/' + company;
    return this._http.put(url, data, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
}
