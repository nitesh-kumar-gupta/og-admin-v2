import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit {

  loading: boolean = false;
  id: any;
  companies: any[];
  constructor(private _adminService: AdminService, public route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

  ngOnInit() {
    this.loading = true;
    this._adminService.getUserCompanies(this.id).subscribe((result) => {
      console.log("this companies rae", result)
      this.companies = result;
      this.loading = false;
    });
  }

}
