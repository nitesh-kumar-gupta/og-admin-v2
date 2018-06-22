import { Response, Headers, RequestOptions } from '@angular/http';
import {throwError} from 'rxjs';
import { environment } from './../../environments/environment';
import { CookiesService } from './cookies.service';
export class BaseService {
  protected storage: any;
  protected _url = environment.API;
  protected headers: any;
  protected options: any;

  constructor() {
    this.storage = CookiesService.readCookie('storage');
    if (this.storage) {
      this.storage = JSON.parse(this.storage);
      this.headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'JWT ' + this.storage.token });
    } else {
      this.headers = new Headers({ 'Content-Type': 'application/json' });
    }
    this.options = new RequestOptions({ headers: this.headers });
  }

  protected post_options() {
    return new RequestOptions({ headers: this.headers, method: 'post' });
  }

  protected delete_options() {
    return new RequestOptions({headers: this.headers, method: 'delete'});
  }

  protected get_options(){
    return new RequestOptions({ headers: this.headers, method: 'get'});
  }

  protected put_options() {
    return new RequestOptions({headers: this.headers, method: 'put'});
  }

  protected patch_options() {
    return new RequestOptions({ headers: this.headers, method: 'patch' });
  }

  protected extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  protected handleError(error: Response) {
    let body = error.json();
    if (body.error && body.error.code === 'TokenExpiredError') {
      let expires = "";
      let domain  = environment.APP_EXTENSION;
      let days = -1;
      let value = '';
      if (days) {
        let date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toUTCString();
      }
      document.cookie = "storage="+value+expires+"; domain="+domain+"; path=/";
      window.location.href = environment.APP_DOMAIN;
    }
    return throwError(body);
  }

}