import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Datatable } from '../../classes/datatable.class';
import { ScriptService } from '../../services/script.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-integration-logs',
  templateUrl: './integration-logs.component.html',
  styleUrls: ['./integration-logs.component.css']
})
export class IntegrationLogsComponent extends Datatable implements OnInit,AfterViewInit {

  loading: boolean = false;
  scriptLoaded: boolean = false;
  integrationLogs: Array<any> = [];
  calcName: String;
  companyName: String;
  selectedIntegration: String;
  configuration: string = '';
  keysGetter: any = Object.keys;
  totalCount:number;

  integrations: any = {
    SALESFORCE: 'salesforce',
    SLACK: 'slack',
    MARKETO: 'marketo',
    MAILCHIMP: 'mailchimp',
    GET_RESPONSE: 'getresponse',
    ACTIVE_CAMPAIGN: 'active_campaign',
    AWEBER: 'aweber',
    HUBSPOT: 'hubspot',
    EMMA: 'emma',
    DRIP: 'drip',
    PARDOT: 'pardot',
    CAMPAIGNMONITOR: 'campaignmonitor',
    INTERCOM: 'intercom',
    SENDLANE: 'sendlane'
  };

  constructor(private scriptService :ScriptService,private adminService :AdminService ) {
    super();
    this.totalCount=0;
   }

  ngOnInit() {
    this.loading = true;
  }

  ngAfterViewInit(){
    this.scriptService.load('datatables')
    .then((data) => {
      this.scriptLoaded = true;
    })
    .catch((error) => {
      console.log('script load error', error);
    });
  this.getIntegrationLogs();

  }
  resetFilters() {
    this.calcName = '';
    this.companyName = '';
    this.selectedIntegration = '';
    this.configuration = '';
  }
  showDetails(integrationLog) {
    integrationLog.showDetails = !integrationLog.showDetails;
  }
  getIntegrationLogs() {
    this.loading = true;
    this.adminService.getAllIntegrationLogs(this.getParams()).subscribe((response: any) => {
      this.integrationLogs = response.logs;
      this.totalCount=response.count;
      this.total_pages = Math.ceil(response.count / this.current_limit);
      this.loading = false;
    }, err => {
      this.loading = false
    });
  }

  
  getParams(): any {
    return {
      limit: this.current_limit,
      page: this.current_page - 1,
      filter: {
        app: this.calcName,
        company: this.companyName,
        configuration: this.configuration,
        integration: this.selectedIntegration
      }
    };
  }

}
