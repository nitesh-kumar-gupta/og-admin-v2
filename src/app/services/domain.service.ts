import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { map, catchError } from 'rxjs/operators';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DomainService extends BaseService {

  token: string;
  response: any;
  constructor(public _http: Http) {
    super();
  }

  getDomains(data: any) {
    let getDomainsUrl = this._url + '/reserved/domains';
    return this._http.post(getDomainsUrl, data, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )

  }

  addDomain(domain: string, type: string) {
    let getDomainsUrl = this._url + '/reserved/domains/create';
    let data = {
      sub_domain: domain,
      access: type
    };
    return this._http.post(getDomainsUrl, data, this.post_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

  deleteDomain(domainId: string) {
    let getDomainsUrl = this._url + '/reserved/domain/delete/' + domainId;
    return this._http.delete(getDomainsUrl, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

}
