import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AdminService } from '../../../../../../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { ScriptService } from '../../../../../../services/script.service';
import { environment } from '../../../../../../../environments/environment';

declare var jQuery: any;

@Component({
  selector: 'app-company-calculators',
  templateUrl: './company-calculators.component.html',
  styleUrls: ['./company-calculators.component.css']
})
export class CompanyCalculatorsComponent implements AfterViewInit {
  id: string;
  calc_details: Object = [];
  generateKeys = Object.keys;
  event: any = {};

  @Input() company: any;

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private _script: ScriptService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngAfterViewInit() {
    this._script.load('datatables')
      .then((data) => {
        this.tableInit();
      })
      .catch((error) => {
        console.log('Script not loaded', error);
      });
    this.getEvent();
  }

  getEvent() {
    this.adminService.getWebhookEventsByCompany(this.company.id)
      .subscribe(response => {
        this.event = response;
      })
  }

  tableInit() {
    this.adminService.getCompanyProjects(this.company.sub_domain)
      .subscribe((result) => {
        console.log(this.calc_details)
        this.calc_details = this.getAppsFromFolders(result['folders'], result['leaves']);
        this.getAppsScore();
        setTimeout(function () {
          jQuery('#calc-datatable').DataTable();
        }, 200);
      },
        (error) => {
          console.log("error calc", error);
        });
  }

  link_maker(link: string) {
    let subdomain = this.company.sub_domain;
    let location = window.location.href;
    let domain = location.split('//')[1];
    if (environment.production) {
      domain = 'admin.outgrow.us';
    }
    domain = domain.split('/')[0];
    domain = subdomain + '.' + domain.split('.')[1] + '.' + domain.split('.')[2] + '/' + link;
    return domain;
  }

  calc_navigation(link: string) {
    let url = 'http://' + this.link_maker(link);
    var win = window.open(url, '_blank');
    win.focus();
  }

  getAppsScore() {
    for (let index in this.calc_details) {
      this.adminService.getAppPromotionScore(this.calc_details[index]._id)
        .subscribe(
          response => this.calc_details[index]['score'] = response.score || 0,
          error => console.log(error)
        )
    }
  }

  getAppsFromFolders(folderArr, leaves) {
    return [...leaves, ...folderArr.reduce((acc, folder) => {
      acc.push(...folder['apps']);
      return acc;
    }, [])]
  }
}
