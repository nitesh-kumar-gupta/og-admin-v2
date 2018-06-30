import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { map, catchError } from 'rxjs/operators';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class EventsService extends BaseService {

  constructor(private _http: Http) {
    super()
  }
  getEvents(data) {
    return this._http.post(this._url + '/admin/getEvents', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }
  createEvent(data) {
    return this._http.post(this._url + '/admin/createEvent', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }
  updateEvent(data) {
    return this._http.put(this._url + '/admin/updateEvent', data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }
  removeEvent(event_id) {
    return this._http.delete(this._url + '/admin/removeEvent/' + event_id).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }
}
