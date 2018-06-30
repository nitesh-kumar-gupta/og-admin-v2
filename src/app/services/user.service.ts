import { Injectable} from '@angular/core';
import { Http } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/catch';
//import { environment } from './../../../environments/environment';
import { map, catchError} from 'rxjs/operators';
import { User } from './../models/user';
import { BaseService } from './base.service';
import { SubDomain } from './../interfaces/subdomain.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  token: string;
  response:any;
  subDomain: SubDomain;
  constructor(
    public _http: Http
  ) {
    super();
  }
  
  getUser(id:number) {
    let getUserUrl = this._url + '/users/'+id;
    return this._http.get(getUserUrl).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  leads(email :String) {
    localStorage.removeItem('storage');
    let data = {
      email: email
    };

    return this._http.post(this._url + '/leads', data, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  register(data :any ) {
    localStorage.removeItem('storage');
    let details =    {
      'user': {
        'emails': {
          'email': data.emails.email
        },
        'name'      : data.name,
        'password'  : data.password,
        'referralCode':data.referralCode
      },
      'company': {
        'sub_domain': data.domain,
        'name': data.companyname
      }
    };
    if(data.promoCode !== '') details['coupon'] = data.promoCode;
    if(data.affillates) details['affillates'] = data.affillates;
    return this._http.post(this._url + '/auth/signup', details, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  addUserFromAdmin(data :any ) {
    let details =    {
      'user': {
        'emails': {
          'email': data.useremail
        },
        'name': data.username,
        'password'  : data.userPassword,
        'is_admin_created' : true,
      },
      'company': {
        'sub_domain': data.companySubDomain,
        'name': data.companyName,
        'is_admin_created' : true
      },
      'is_admin':{
        'chargebee_customer_id':data.chargebeeId,
        'chargebee_subscription_id': data.chargebeeSubsId,
        'plan_id': data.plan
      }
    };
    return this._http.post(this._url + '/admin/signup', details, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }


  login(username: String, password: String, companyName: String) : any {
    let data = {
      'username'   : username,
      'password'   : password,
      'sub_domain' : companyName
    };

    return this._http.post(this._url + '/auth/login', data, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  updateBasicDetails (data: any, isAdmin : boolean = false) {
    console.log('data:', data);
    let storage:any = this.readCookie('storage');
    storage = JSON.parse(storage);
    let user_id = storage.user._id;
    if(isAdmin)
      user_id = data.id;

    return this._http.put(this._url + '/users/' + user_id, data, this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }


  getBasicDetails (user_id:string = null) {
    let storage:any = this.readCookie('storage');
    storage = JSON.parse(storage);
    if(user_id === null)
      user_id = storage.user._id;

    let getBasicUrl = this._url + '/users/' + user_id;
    return this._http.get(getBasicUrl)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getAllUsers(data : any) {
    let getUsersUrl = this._url + '/admin/users';
    return this._http.post(getUsersUrl,data,this.get_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  updatePassword(old_password : any, new_password : any) {
    let data = {
      'old_password': old_password,
      'new_password': new_password
    };
    let storage:any = this.readCookie('storage');
    storage = JSON.parse(storage);
    return this._http.put(this._url + '/users/password', data, this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  updateEmail(old_email : any, new_email : any, password: any) {
    let storage:any = this.readCookie('storage');
    storage = JSON.parse(storage);
    let data = {
      'emails': {
        'old_email': old_email,
        'new_email': new_email
      },
      'password': password

    };
    //console.log('email json',data);
    return this._http.put(this._url + '/users/email', data, this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  logout() {
    // console.log("inside user service  component");
    this.createCookie('storage',"",-1);
    this.createCookie('filepicker_token_json',"",-1);
    this.createCookie('status',"",-1);
    this.createCookie('role',"",-1);
    // console.log("cooooookkkieee",this.readCookie('storage'));
    return true;
  }

  saveDetail(data : any )  {
    let storage:any = this.readCookie('storage');
    storage = JSON.parse(storage);
    let details = {
      'company':{
        'name'       : data.companyname,
        'sub_domain' : data.domain
      },
      'emails': {
        'old_email'  : storage.email,
        'new_email'  : data.emails.email
      },
      'username'       : data.first_name,
      'password'       : data.password
    };
    return this._http.put(this._url + '/users/' + storage.user._id, details, this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );

  }

  setNewPassword(new_password : any) {
    let data = {
      'password': new_password
    };
    let storage : any = localStorage.getItem('verification');
    storage = JSON.parse(storage);
    return this._http.patch(this._url + '/users/password/'+storage.verification_id, data, this.patch_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );  }


  verfiyToken(data : any) {
    let verifyUrl = this._url + '/auth/verify/'+ data;
    return this._http.get(verifyUrl,this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );

  }

  verfiyEmail(data : any) {
    let verifyUrl = this._url + '/auth/verifyEmail/'+ data;
    return this._http.get(verifyUrl,this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  userApproval(companyId: any = null, userId: any = null, fromadmin: any = null) {
    let userid;
    let cid;
    if (fromadmin) {
      userid = userId;
      cid = companyId;
      console.log(cid);
    } else {
      let storage: any = this.readCookie('storage');
      storage = JSON.parse(storage);
      cid = storage.company_id;
      userid = storage.user._id;
      if (companyId)
        cid = companyId;
    }


    return this._http.put(this._url + '/users/' + userid + '/companies/' + cid + '/join', this.put_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );

  }

  forgetPassword(capctha : any,email:any){
    let details = {
      'response': capctha,
      'email'  : email.forgetemail
    };
    return this._http.post(this._url + '/users/forgetPassword', details, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );

  }

  generateToken(data:any)   {
    let getBasicUrl = this._url + '/users/token/' + data;
    return this._http.get(getBasicUrl)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getEmailLogs(data:any) {    
    let getUsersUrl = this._url + '/emailLogs';
    console.log("1")
    return this._http.post(getUsersUrl,data,this.get_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  getDealLogs(data:any) {
    return this._http.post(this._url + '/admin/dealLog',data,this.get_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  resendEmail(data : any) {
    let verifyUrl = this._url + '/resendVerificationEmail/'+ data;
    return this._http.get(verifyUrl,this.options)
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  updatebillingStatus(){
        let storage:any = this.readCookie('storage');
        storage = JSON.parse(storage);
        let user_id = storage.user._id;
       return this._http.get(this._url + '/user_companies/status/' + user_id, this.get_options())
       .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
    }
    updateUser(user){
      return this._http.put(this._url + '/users/' + user.id, user).pipe(
        map(this.extractData),
        catchError(this.handleError)
      )
    }

  changeUserCompany(subdomain: string) {
    return this._http.post(this._url + '/user_companies/change_company/', {company: subdomain}, this.post_options())
    .pipe(
        map(this.extractData),
        catchError(this.handleError)
      );
  }
}