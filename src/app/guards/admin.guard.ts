import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {CookiesService} from '../services/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(public router: Router) {
  }
  canActivate() {
    let storag = CookiesService.readCookie('storage');
    if(storag) {
      let storage = JSON.parse(storag);
      if (CookiesService.readCookie('storage') !== null && storage.user.role == "ADMIN") {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}