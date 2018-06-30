import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { map, catchError } from 'rxjs/operators';
import { Http } from '@angular/http';
import { SubDomain } from '../interfaces/subdomain.interface';
import { CookiesService } from './cookies.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  token: string;
  response: any;
  subDomain: SubDomain;
  constructor(
    public http: Http
  ) {
    super();
  }
  getAllUsers(data: any) {
    let getUsersUrl = this._url + '/admin/users';
    return this.http.post(getUsersUrl, data).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  addUserFromAdmin(data: any) {
    let details = {
      'user': {
        'emails': {
          'email': data.useremail
        },
        'name': data.username,
        'password': data.userPassword,
        'is_admin_created': true,
      },
      'company': {
        'sub_domain': data.companySubDomain,
        'name': data.companyName,
        'is_admin_created': true
      },
      'is_admin': {
        'chargebee_customer_id': data.chargebeeId,
        'chargebee_subscription_id': data.chargebeeSubsId,
        'plan_id': data.plan
      }
    };
    return this.http.post(this._url + '/admin/signup', details).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  getUser(id) {
    let getUserUrl = this._url + '/users/' + id;
    return this.http.get(getUserUrl).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  updateUser(user){
    return this.http.put(this._url + '/users/' + user.id, user).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )
  }
  userApproval(companyId: any = null, userId: any = null, fromadmin: any = null) {
    let userid;
    let cid;
    if (fromadmin) {
      userid = userId;
      cid = companyId;
      console.log(cid);
    } else {
      let storage: any = CookiesService.readCookie('storage');
      storage = JSON.parse(storage);
      cid = storage.company_id;
      userid = storage.user._id;
      if (companyId)
        cid = companyId;
    }


    return this.http.put(this._url + '/users/' + userid + '/companies/' + cid + '/join', this.put_options()).pipe(
      map(this.extractData),
      catchError(this.handleError)
    )

  }
}
