import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService extends BaseService{
  planTemplates:BehaviorSubject<any> = new BehaviorSubject<any>([])
  constructor(public http:Http) {
    super();
   }
  getPlanTypes() {
    const url = `${this._url}/plan/types`;
    return this.http.get(url, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getIntialPlanData(){
    return this.http.get(`${this._url}/plans/pfeature/initialPlanData`).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  fetchPlanFeatures(plan){
     return this.http.get(`${this._url}/plans/${plan}/planFeatures`).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  updatePlan(data){
    return this.http.put(`${this._url}/plan/updatePlan`,data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  createPlan(data: any) {
    const url = `${this._url}/plans`;
    return this.http.post(url, data, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  updateFeatures(data){
    return this.http.put(`${this._url}/plans/${data['plan']}/updateFeature`,data,this.put_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getPlanTemplates(){
    return this.planTemplates.asObservable();
  }
  getPlanLimits(company_id: string) {
    let planUrl = this._url + '/plan/planlimits/' + company_id;
    return this.http.get(planUrl, this.options).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
}
