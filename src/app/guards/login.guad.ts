import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {CookiesService} from '../services/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(public router: Router) {
  }

  canActivate() {
    if (CookiesService.readCookie('storage') == null) {
      return true;
    }
    this.router.navigate(['/admin/dashboard']);
    return false;
  }
}
