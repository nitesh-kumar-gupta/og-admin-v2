import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { map, catchError } from 'rxjs/operators';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PremadesService extends BaseService {
  public premadeForm: FormGroup;

  constructor(public _http: Http, public _fb: FormBuilder) {
    super();
  }
  getForm() {
    this.premadeForm = this._fb.group(this.getFormFields());
    return this.premadeForm;
  }
  getFormFields() {
    return {
      title: ['', Validators.required],
      live_url: ['', Validators.compose([Validators.required, Validators.pattern(/^(http|https|ftp)?(:\/\/)?([a-zA-Z0-9]+){3,}(\.)(outgrow|rely)(\.)(local|us|co|co.in)\/([a-zA-Z0-9_-]+)$/)])],
      // media:['',Validators.compose([Validators.required,Validators.pattern(/^(http|https|ftp)?(:\/\/)?(www|ftp)?.?[a-z0-9-]+(.|:)([a-z0-9-]+)+([/?].*)?$/)])],
      media: ['', Validators.compose([])],
      type: ['', Validators.required],
      description: ['', Validators.required],
      industry: ['', Validators.required],
      template: ['', Validators.required],
      tier: ['', Validators.required],
      launch_date: [''],
      event_name: ['']
    }
  }
  addPremadeCalc(data) {
    return this._http.post(this._url + '/admin/addCalculators', data, this.post_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getCalculators(data) {
    return this._http.post(this._url + '/admin/getCalculators', data, this.post_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  removeCalculator(id) {
    return this._http.delete(this._url + '/admin/removeCalculator/' + id).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  updateCalculator(data) {
    return this._http.post(this._url + '/admin/updateCalc', data, this.post_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  setForm(obj: any) {
    this.premadeForm.get('title').setValue(obj.title);
    this.premadeForm.get('live_url').setValue(obj.liveApp.url);
    this.premadeForm.get('media').setValue(obj.media);
    this.premadeForm.get('type').setValue(obj.type);
    this.premadeForm.get('template').setValue(obj.template);
    this.premadeForm.get('tier').setValue(obj.tier);
    this.premadeForm.get('industry').setValue(obj.industry);
    this.premadeForm.get('description').setValue(obj.description);
    this.premadeForm.get('launch_date').setValue(obj.launch_date);
    this.premadeForm.get('event_name').setValue(obj.event_name);
  }
}
