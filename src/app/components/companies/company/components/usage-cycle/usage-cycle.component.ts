import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { AdminService } from '../../../../../services/admin.service';
import { Router } from '@angular/router';
import { ScriptService } from '../../../../../services/script.service';
import { Datatable } from '../../../../../classes/datatable.class';

declare var jQuery: any;
declare var moment: any;
@Component({
  selector: 'app-usage-cycle',
  templateUrl: './usage-cycle.component.html',
  styleUrls: ['./usage-cycle.component.css']
})
export class UsageCycleComponent extends Datatable implements OnInit, OnDestroy, AfterViewInit {
  totalcount: any;
  @Input() company: any;
  subscribes: any[];
  companyUsageCycle: any[];
  moment: any;
  loading: boolean;
  constructor(private _adminService: AdminService, private _router: Router, private _script: ScriptService) {
    super();
    this.subscribes = [];
    this.moment = moment;
    this.loading = true;
  }

  ngOnInit() {
    this.subscribes.push(this.getCompanyUsageCycle());
  }

  ngOnDestroy() {
    this.subscribes.forEach((subscribe) => {
      subscribe.unsubscribe();
    });
  }

  ngAfterViewInit() {

    this._script.load('datatables')
      .then((data) => {
        // this.companyType = 'all';
        // this.getAllCompany();
      }).catch((error) => {
        console.log('Script not loaded', error);
      });
  }

  getCompanyUsageCycle() {
    this.loading = true;
    return this._adminService.getCompUsageCycle(this.company.id).subscribe((success) => {
      this.companyUsageCycle = success;
      this.totalcount = success ? success.length : 0;
      this.loading = false;
    }, (error) => {
      console.log('get usage cycle error ', error);
    });
  }
}
