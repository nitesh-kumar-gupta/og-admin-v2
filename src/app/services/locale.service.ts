import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { map, catchError } from 'rxjs/operators';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class LocaleService extends BaseService {

  constructor(public _http:Http) {
    super();
   }
   get(langCode?: any) {
    return this._http.post(this._url + '/locale/get_locale', { langCode: langCode }).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

  add(data: any) {
    return this._http.post(this._url + '/locale/add_locale', data ).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

  update(data: any) {
    return this._http.post(this._url + '/locale/update_locale', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }

  remove(langCode: any) {
    return this._http.post(this._url + '/locale/remove_locale', {langCode:langCode}).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
}
