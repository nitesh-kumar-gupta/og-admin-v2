import { Component, OnInit } from '@angular/core';
import { CookiesService } from '../../../services/cookies.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user: any;
  constructor() {
    this.user = null;
  }
  ngOnInit() {
    const storage = CookiesService.readCookie('storage');
    if (storage) {
      this.user = JSON.parse(storage).user;
    }
  }

}
