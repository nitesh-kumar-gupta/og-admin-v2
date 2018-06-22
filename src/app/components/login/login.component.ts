import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { CookiesService } from '../../services/cookies.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;
  isSubmitted: Boolean;
  subscribes: any[];
  error: Object = {
    status: false,
    message: ''
  };
  constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
    this.subscribes = [];
    this.isSubmitted = false;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscribes.forEach((subscribe) => {
      subscribe.unsubscribe();
    });
  }

  get formControle() {
    return this.formLogin.controls;
  }

  onLoginSubmit() {
    this.isSubmitted = true;
    if (this.formLogin.valid) {
      const login = <HTMLButtonElement>document.getElementById('btn-login');
      login.disabled = true;
      login.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
      const subscribe = this.loginService.login(this.formLogin.value).subscribe(
        (success: any) => {
          if (success.token) {
            let storage: any;
            if (success.user.role === 'ADMIN') {
              storage = {
                'token': success.token,
                'user': success.user
              };
              CookiesService.createCookie('storage', JSON.stringify(storage), 3);
              window.location.href = window.location.origin + '/admin';
            } else {
              this.error = {
                status: true,
                message: 'Please Enter Correct admin credentials'
              };
            }
          }
          login.disabled = false;
          login.innerHTML = 'Login';
        }, (error: any) => {
          console.error('Login Error: ', error);
          this.error = {
            status: true,
            message: error.error.message
          };
          login.disabled = false;
          login.innerHTML = 'Login';
        }
      );
      this.subscribes.push(subscribe);
    }
  }

}
