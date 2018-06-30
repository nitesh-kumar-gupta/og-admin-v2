
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/catch';
// import { User } from './../models/user';
import {BaseService} from './base.service';
import { BehaviorSubject } from 'rxjs';
import { map, catchError} from 'rxjs/operators';
// import { SubDomain } from './../interfaces/subdomain.interface';
// import { SubDomainService } from './subdomain.service';

@Injectable({
    providedIn: 'root'
  })
export class PlanService extends BaseService {
  planTemplates:BehaviorSubject<any> = new BehaviorSubject<any>([])
  isPlanSelected:Boolean = false;
  constructor(public _http: Http) {
    super();
  }

  getPlanTypes() {
    const url = `${this._url}/plan/types`;
    return this._http.get(url, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getPlanFeatures(plan: String) {
    let getPlanUrl = this._url + '/planfeature/' + plan;
    return this._http.get(getPlanUrl, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  updateCompanyFeatures(planId, data: any) {
    return this._http.put(this._url + '/updateAllCompanyFeatures/' + planId, data, this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  updatePlanFeatures(plan: String, data: any) {
    let planUrl = this._url + '/planfeature/active/' + plan;

    return this._http.put(planUrl, data, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getPlans() {
    let planUrl = this._url + '/userplans';
    return this._http.get(planUrl, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getPlanLimits(company_id: string) {
    let planUrl = this._url + '/plan/planlimits/' + company_id;
    return this._http.get(planUrl, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  createPlan(data: any) {
    const url = `${this._url}/plans`;
    return this._http.post(url, data, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  deletePlan(id) {
    const url = `${this._url}/plan/${id}`;
    return this._http.delete(url, this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  fetchPlanListFromAPIs(apiURL) {
    const url = `${apiURL}/plan-list`;
    return this._http.get(url, this.get_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  fetchPlanDataFromAPI(apiURL, planIds) {
    const url = `${apiURL}/plans/export`;
    return this._http.post(url, planIds, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  saveFetchedPlanData(data) {
    return this._http.post(`${this._url}/plans/import`, data, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getAllCompanyFeaure(plan) {
    return this._http.get(`${this._url}/company/getAllCompanyFeatures/${plan}`, this.get_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  getPlanPremades(plan){
    return this._http.get(`${this._url}/plans/getPremadePlans/${plan}`,this.get_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  updatePlanPremades(data){
    return this._http.post(`${this._url}/plans/updatePremadePlans`,data,this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  getPlanTemplates(){
    return this.planTemplates.asObservable();
  }
  getAllPlans(){
    return this._http.get(`${this._url}/plans/get/all/planfeatures`,this.get_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  updateFeatures(data){
    return this._http.put(`${this._url}/plans/${data['plan']}/updateFeature`,data,this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  updatePlan(data){
    return this._http.put(`${this._url}/plan/updatePlan`,data)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  getIntialPlanData(){
    return this._http.get(`${this._url}/plans/pfeature/initialPlanData`)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
  fetchPlanFeatures(plan){
     return this._http.get(`${this._url}/plans/${plan}/planFeatures`)
     .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
}
