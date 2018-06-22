import { Component, OnInit } from '@angular/core';
import { helperService } from '../../../services/helper.service';
import { environment } from '../../../../environments/environment';
import { CookiesService } from '../../../services/cookies.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }

  logout() {
    localStorage.clear();
    CookiesService.eraseCookie('storage');
    window.location.href = environment .APP_DOMAIN;
  }
}
