import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CookiesService } from '../../services/cookies.service';

@Component({
  selector: 'app-sitesettings',
  templateUrl: './sitesettings.component.html',
  styleUrls: ['./sitesettings.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SitesettingsComponent implements OnInit {

  @Input() promoGoals: any[];

  constructor(public router:Router) { }

  ngOnInit() {

    
    if (CookiesService.readCookie('storage')) {
      let storage = JSON.parse(CookiesService.readCookie('storage'));
      if (storage.user.sub_role !== null) {
        this.router.navigate(['/admin/users']);
      }
    }
  }
  getPromoGoals(goals) {
    this.promoGoals = goals;
  }

}
