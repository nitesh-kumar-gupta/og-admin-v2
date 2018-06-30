import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Datatable } from '../../classes/datatable.class';
import { Company } from '../../models/company.model';
import { ScriptService } from "../../services/script.service";
import {Angular2Csv} from 'angular2-csv/Angular2-csv';

import * as moment from 'moment';
import { CookiesService } from '../../services/cookies.service';
import { FormControl } from '@angular/forms';

declare let jQuery: any;
@Component({
  selector: 'app-search-calc',
  templateUrl: './search-calc.component.html',
  styleUrls: ['./search-calc.component.css']
})
export class SearchCalcComponent extends Datatable implements OnInit {
  pages: number;
  total_pages: number;
  showFilter: boolean;
  apps: Array<any> = [];
  // loading = true;
  loading: boolean = false;
  onlyLive: boolean = false;
  showAdvancedFilter = false;
  fetchAll: boolean = false;
  analyticsUpdateStatus = "";
  value: any;
  selectedApp: any;
  errorMessage: any = '';
  companyDetails: any;
  totalApps: number = 0;
  createdAtFilter: any = {
    start_date: moment("1970-01-01").format('YYYY-MM-DD'), //start of time
    end_date: moment().add(1, 'day').format('YYYY-MM-DD')
  };
  sortKey = '_id'; // default sort parameters
  sortOrder = -1; // -1 for ascending order

  templates: Array<any> = [{id: 'template-eight', text: 'The Venice'},
    {id: 'template-seven', text: 'The Seattle'}, {id: 'one-page-card-new', text: 'The Chicago'},
    {id: 'sound-cloud-v3', text: 'The Londoner'}, {id: 'inline-temp-new', text: 'The Greek'},
    {id: 'experian', text: 'The Tokyo'}, {id: 'template-five', text: 'The Madrid'},
    {id: 'template-six', text: 'The Stockholm'}];

  templateTypes: Array<string> = ['Recommendation', 'Numerical', 'Graded', 'Poll'];

  filters: Array<any> = [];
  filter: Object;
  searchCalc = new FormControl();
  public sub_role: string = null;

  constructor(private adminService: AdminService,private scriptService: ScriptService) {
    super();
    this.showFilter = false;
    this.total_pages= 0;
  //  this.pages = 1;
    this.filter = {
      company: [
        {
          value: 'sub_domain',
          name: 'Sub-domain'
        },
      ],
      App: [
        {
          value: 'header',
          name: 'header'
        },
        {
          value: 'sub_header',
          name: 'sub_header'
        }],
      template: [
          {
            value: 'layouts and experiences',
            name: 'layouts and experiences'
          }],
          selected_property: '',
    selected_operator: '',
    selected_property_category: '',
    selected_property_type: '',
    selected_value: {},
    visible: true,

  }
  if (CookiesService.readCookie('storage')) {
    let storage = JSON.parse(CookiesService.readCookie('storage'));
    this.sub_role = storage.user.sub_role;
  }
  }
  ngOnInit() {
    this.addFilter();
    this.searchApps();

    let self = this;
    var hi= document.getElementById('keyword')
if(hi){
   hi.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          self.current_page = 1;
          self.searchData().subscribe(data => self.showApps(data));
        }
      });
    }
    else{
      console.log("I am sorry!!")
    }
  }
  

  

  ngOnDestroy() {

  }
  selected(event, index, type) {
    if (typeof this.filters[index].selected_value === 'string') {
      this.filters[index].selected_value = {};
    }
    if (!Array.isArray(this.filters[index].selected_value[type])) {
      this.filters[index].selected_value[type] = [];
    }
    this.filters[index].selected_value[type].push(event.target.value);
    console.log(this.filters)
  }
  searchApps() {
    this.searchData().subscribe((response: any) => {
      this.showApps(response);
    }, err => {
      this.loading = false
    });
  }
  searchData() {
    this.loading = true;
    return this.adminService.getApps(this.getParams());
  }
  getParams(getAll?: boolean): any {
    return {
      limit: getAll ? null : this.current_limit,
      search_key: this.search,
      page: getAll ? null : (this.current_page - 1),
      only_live: this.onlyLive,
      filter: this.parseFilterData(),
      created_at_filter: this.createdAtFilter,
      sort_key: this.sortKey,
      sort_order: this.sortOrder
    };
  }
  showApps(response: any) {
    this.apps = response.apps;
    console.log('this.apps', this.apps);
    this.totalApps = response.count;
    this.total_pages = Math.ceil(this.totalApps / this.current_limit);

    for (let i = 0; i < this.apps.length; i++) {
      this.apps[i].createdAt = moment(this.apps[i].createdAt).fromNow().trim();
      this.apps[i].updatedAt = moment(this.apps[i].updatedAt).fromNow().trim();
      if (this.apps[i].analytics) {
        this.apps[i].analytics.updatedAt = moment(this.apps[i].analytics.updatedAt).fromNow().trim();
      }
      else {
        this.apps[i].analytics = {};
        this.apps[i].analytics['updatedAt'] = 'Not Modified';
      }
    }
    this.loading = false;
  }
  addFilter() {
    this.filters.push(Object.assign({}, this.filter)); // passing filter by value
  }
  addCondition() {
    this.filters.push(JSON.parse(JSON.stringify(this.filter)));
  }

  removeCondition(index: number) {
    this.filters.splice(index, 1);
  }

  applyFilter() {
    this.searchData();
    this.searchApps();
  }

  showFilters() {
    this.showFilter = !this.showFilter;
    this.filters = [];
    this.filters.push(JSON.parse(JSON.stringify(this.filter)));
    console.log("asss",this.filters)
  }
  getTemplateName(template) {
    return this.templates.find(t => t.id.includes(template));
  }
  
  setFilterProperty(target, index) {
    console.log("target",target)
    this.filters[index].selected_property_category = target.options[target.options.selectedIndex].className;
    this.filters[index].selected_property_type = 'string';
    this.filters[index].selected_operator = ''; // reset operator value
    this.filters[index].selected_value = ''; // reset selected value
  }
  parseFilterData() {
    return this.filters.filter(el => el.visible && el.selected_property &&
      el.selected_property_category && el.selected_property_type && el.selected_value)
      .map(el => {
        let val = {
          property: el.selected_property,
          type: el.selected_property_category,
          value: el.selected_value
        };
        if (val.type === 'template') {

          if (val.value.template.includes('all')) {
            val.value.template = [];
            this.templates.forEach(template => {
              val.value.template.push(template.id);
            });

          }
          if (val.value.templateType && val.value.templateType.includes('all')) {

            val.value.templateType = [];
            this.templateTypes.forEach(type => {
              val.value.templateType.push(type);
            });
          }
        }
        return val;
      });
  }
  setFilterOperator(value, index) {
    this.filters[index].selected_operator = value;
  }

  setApp(app) {
    this.selectedApp = app;
    (this.companyDetails && Object.keys(this.companyDetails).length > 0) && (this.companyDetails = {});
  }
  searchCompany(company) {
    this.errorMessage = '';
    if (company) {

      this.adminService.searchCompany(company.trim()).subscribe((data) => {
        this.companyDetails = data;
        this.companyDetails['check'] = false;
        this.errorMessage = 'no_error';
      }, (error: any) => {
        this.errorMessage = error.error.err_message;
      });
    } else {
      this.errorMessage = 'Enter company name';
    }
  }
  duplicateApp(event,app,company) {

    console.log(event.target.disabled,app,company);
    this.changeButtonState(event);
    this.adminService.duplicateApp({appData:app,companyData:company}).subscribe((data)=>{
      console.log(data);
      this.changeButtonState(event);
      jQuery('#copyCalc').modal('hide');
    }, (error) => {
      this.changeButtonState(event);
      this.errorMessage = error.error.err_message;
    })
  }
  changeButtonState(event){
    event.target.disabled = !event.target.disabled;
  }
    exportToCSV() {
    this.adminService.getApps(this.getParams(this.fetchAll)).subscribe(({apps}) => {
      let data = apps.map(app => {

        return {
        url: app.url,
        status: app.status,
        subdomain: app.company.sub_domain,
          template: this.getTemplateName(app.template) ? this.getTemplateName(app.template).text : '',
        templateType: app.templateType
      }
    });

    const options = {
      headers: ['url', 'status', 'sub domain', 'Layout', 'Experience']
    };
    new Angular2Csv(data, 'apps', options);
    });
  }

  sort(columnSortKey) {
    this.sortKey = columnSortKey;
    if (this.sortOrder === -1) {
      this.sortOrder = 1;
    } else {
      this.sortOrder = -1;
    }
    super.searchData();
    this.searchApps();
  }


  updateAnalytics() {
    this.adminService.updateAppsAnalytics().subscribe(data =>
      this.analyticsUpdateStatus = "success", err => this.analyticsUpdateStatus = "failed");
  }

  fetchLiveCalc() {
    this.onlyLive = !this.onlyLive;
    this.searchApps()
  }
}