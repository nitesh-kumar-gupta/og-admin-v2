import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Datatable } from '../../../../../classes/datatable.class';
import { FormControl } from '@angular/forms';
import { ScriptService } from '../../../../../services/script.service';
import { AdminService } from '../../../../../services/admin.service';
import { Subscription } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.css']
})
export class IntegrationsComponent extends Datatable implements AfterViewInit {

  @Input() company: any;
  keysGetter = Object.keys;
  input = new FormControl();
  subscriptions: Subscription = new Subscription();

  integrationConfig: any;
  selectedIntegrationConfig: any = {};

  appConfig: any = {};
  selectedIntegration: any;
  selectedAppIntegrations: any;

  integrationLogs: any = {};
  selectedAppLog: any = {};

  constructor(public _script: ScriptService, public adminService: AdminService) {
    super();
  }

  ngAfterViewInit(): void {
    this._script.load('datatables')
      .then((data) => {
      }).catch((error) => {
        console.log('Script not loaded', error);
      });
    console.log(this.input)
    this.subscriptions.add(this.input.valueChanges.pipe(debounceTime(500),
      distinctUntilChanged(),
      switchMap(data => {
        super.searchData();
        return this.adminService.getAppIntegrationLogs({
          company_id: this.company.id,
          search: this.search
        });
      }))
      .subscribe((response) => {
        this.integrationLogs = response;
      }));
  }

  getIntegrationsConfig() {
    this.adminService.getCompanyIntegrations({ company_id: this.company.id }).subscribe(data => {
      this.integrationConfig = data;
    });
  }

  getAppIntegrationsConfig() {
    this.adminService.getAppIntegrations({ company_id: this.company.id }).subscribe(data => {
      this.appConfig = data;
    });
  }

  getIntegrationLogs() {
    this.adminService.getAppIntegrationLogs({ company_id: this.company.id, search: this.search })
      .subscribe(data => {
        this.integrationLogs = data;
      });
  }
}
