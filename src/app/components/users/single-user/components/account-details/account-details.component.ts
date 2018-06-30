import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AdminService } from '../../../../../services/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { User } from '../../../../../models/user.model';
import { UserService } from '../../../../../services/user.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  @Input() companies: any[];
  userId: any;
  set_pwd_link: any;
  generateKeys = Object.keys;
  user: User;
  editUser: User;
  tempUser: any;
  subscribes: any[];
  edit: boolean;
  constructor(private _adminService: AdminService, private router: Router, public route: ActivatedRoute, private _userService: UserService) {
    this.user = null;
    this.editUser = null;
    this.subscribes = [];
    this.edit = false;
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
  }


  ngOnInit() {
    if (this.userId) {
      this.subscribes.push(this.getUserDetails());
    }
  }

  ngOnDestroy() {
    console.log(this.subscribes)
    this.subscribes.forEach((subscribe) => {
      subscribe.unsubscribe();
    });
  }

  getUserDetails() {
    return this._userService.getUser(this.userId)
      .subscribe((result) => {
        this.tempUser = {
          user: result,
        };
        this.user = new User(this.tempUser.user);
        this.editUser = new User(this.tempUser.user);
      });

  }

  generatePwdLink() {
    this._adminService.generatePasswordLink(this.userId)
      .subscribe((result: any) => {
        this.set_pwd_link = result;
        document.getElementById("json").innerHTML = this.set_pwd_link
      });
  }
  saveUserChanges() {
    const login = <HTMLButtonElement>document.getElementById('btn-saveUser');
    login.disabled = true;
    login.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    if (!_.isEqual(this.user, this.editUser)) {
      this._userService.updateUser(this.editUser).subscribe((success: any) => {
        login.disabled = false;
        login.innerHTML = 'Save';
        this.editBack()
      }, (error: any) => {
        console.error('saveUserChanges error comp ', error);
        login.disabled = false;
        login.innerHTML = 'Save';
      });
    } else {
      login.disabled = false;
      login.innerHTML = 'Save';
    }
  }
  editBack() {
    this.getUserDetails()
    this.edit = !this.edit;
    this.editUser = new User(this.tempUser.user);
  }

}
