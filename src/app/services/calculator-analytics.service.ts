import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, catchError} from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CalculatorAnalytics extends BaseService {

  constructor(public _http: Http) {
    super();
  }

  getTrafficStats(data: any) {
    let URL = this._url + '/analytic/calculator_stats';
    return this._http.post(URL, data, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  exportToSheet(data: any) {
    let URL = this._url + '/analytic/export_to_sheet';
    return this._http.post(URL, data, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  exportToSheetAsync(data: any) {
    let URL = this._url + '/analytic/export_to_sheet_async';
    return this._http.post(URL, data, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  //getleads
  getAvgOfLeads(data: any){
    return this._http.post(
      this._url + '/analytic/get_leads_avg',
      data,
      this.post_options()
    )
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getStats(key: any){
    return this._http.post(
      this._url + '/analytic/get_stats',
      key,
      this.post_options()
    )
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getLeadsCount(companyId: any){
    return this._http.get(
      this._url + '/analytic/leads/count/' + companyId
    )
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getFunnels(calcId: string){
    return this._http.post(
      this._url + '/funnel/get_funnels',
      { calc: calcId },
      this.post_options()
    )
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getQuestionStatsData(funnelId: string){
    return this._http.post(
      this._url + '/funnel/get_questions_data',
      { funnel: funnelId },
      this.post_options()
    )
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getStatsData(funnelId: string){
    return this._http.post(
      this._url + '/funnel/get_stats_data',
      { funnel: funnelId },
      this.post_options()
    )
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

}
