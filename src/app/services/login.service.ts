import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, catchError} from 'rxjs/operators';
import { BaseService } from './base.service';
@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService{

  constructor(private http: Http) {
    super();
  }

  login(credintials: Object) : any {
    return this.http.post(this._url + '/auth/login', credintials, this.post_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
}
