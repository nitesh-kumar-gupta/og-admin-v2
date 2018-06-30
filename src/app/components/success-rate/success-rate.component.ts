import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Datatable } from '../../classes/datatable.class';

import { FormControl } from '@angular/forms';
import { ScriptService } from '../../services/script.service';
import { AdminService } from '../../services/admin.service';
import { MembershipService } from '../../services/membership.service';
import { CookiesService } from '../../services/cookies.service';
import { FilterOperators } from '../../interfaces/filter-operators.interface';
import { Subscription } from 'rxjs';
import { debounceTime, switchMap ,distinctUntilChanged } from 'rxjs/operators';




declare var moment: any;
declare var jQuery: any;

@Component({
  selector: 'app-success-rate',
  templateUrl: './success-rate.component.html',
  styleUrls: ['./success-rate.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SuccessRateComponent extends Datatable implements OnInit {

  totalCount: number;
  momentJs: any;
  loading = false;
  paymentLoading = false;
  showAdvancedFilter = false;
  scriptLoaded = false;
  showFilter: boolean=false;

  company: Array<any> = [];
  input = new FormControl();

  isInvoiceExist = false;
  invoices: any = [];
  invoiceNo: any;

  sortKey = '_id'; // default sort parameters
  sortOrder = -1; // -1 for ascending order

  currentSelectedFilter: any = "";
  filters: Array<any> = []; // represents each filter
  savedFilters: Array<any> = [];
  filtersPostData: Array<any> = [];

  filter = {
    company: [
      {
        value :'name',
        name:'name'
      },
      {
        value :'number_of_calculators',
        name:'number_of_calculators'
      },
      {
        value :'leads',
        name:'leads'
      },
      {
        value :'last_lead_generated',
        name:'last_lead_generated'
      },
      {
        value :'visits',
        name:'visits'
      },
      {
        value :'sign_up',
        name:'sign_up'
      },
      {
        value :'plan',
        name:'plan'
      },
      {
        value : 'appsumo_created',
        name: 'appsumo_created'
      },
      {
        value :'conversion_rate',
        name:'conversion_rate'
      },
      {
        value :'trial',
        name:'trial'
      },
      {
        value :'next_payment',
        name:'next_payment'
      },
      {
        value :'percent_cycle_over',
        name:'percent_cycle_over'
      },
      {
        value :'request_cancellation',
        name:'request_cancellation'
      },
      {
        value : 'billing_unit',
        name: 'billing_unit'
      }
   ],
    app: [
      {
        value : 'name',
        name: 'name'
      },
      {
        value : 'status',
        name: 'status'
      },
      {
        value : 'created_at',
        name: 'created_at'
      },
      {
        value : 'latest_publish',
        name: 'latest_publish'
      },
      
   ],
    user: [
      {
        value : 'web_session',
        name: 'web_session'
      }
    ],

    types: {
      name: 'string',
      number_of_calculators: 'number',
      leads: 'number',
      visits: 'number',
      last_lead_generated: 'date',
      sign_up: 'date',
      plan: 'string',
      appsumo_created: 'bool',
      conversion_rate: 'number',
      trial: 'string',
      next_payment: 'date',
      percent_cycle_over: 'number',
      request_cancellation: 'bool',
      status: 'string',
      created_at: 'date',
      latest_publish: 'date',
      billing_unit: 'string',
      web_session: 'number'
    },

    operators: {
      leads: FilterOperators.numberOperators,
      visits: FilterOperators.numberOperators,
      name: FilterOperators.stringOperators,
      number_of_calculators: FilterOperators.numberOperators,
      sign_up: FilterOperators.numberOperators,
      appsumo_created: ['equals', 'not equal to'],
      plan: FilterOperators.stringOperators,
      status: FilterOperators.stringOperators,
      created_at: FilterOperators.numberOperators,
      latest_publish: FilterOperators.numberOperators,
      conversion_rate: FilterOperators.numberOperators,
      trial: FilterOperators.stringOperators,
      next_payment: FilterOperators.numberOperators,
      percent_cycle_over: FilterOperators.numberOperators,
      request_cancellation: ['equals', 'not equal to'],
      last_lead_generated: FilterOperators.numberOperators,
      billing_unit: FilterOperators.stringOperators,
      web_session: FilterOperators.numberOperators
    },
    selected_property: '', // initially select name
    selected_operator: '',
    select_property_type: '',
    visible: true
  }; // model for a single filter

  public subscriptions: Subscription = new Subscription();

  public sub_role: String = null;

  constructor(public _script:ScriptService,public adminService: AdminService,
  public _membershipService:MembershipService) {
    super();

    this.momentJs = moment;
    if (CookiesService.readCookie('storage')) {
      let storage = JSON.parse(CookiesService.readCookie('storage'));
      this.sub_role = storage.user.sub_role;
    }
   }

  ngOnInit() {

    this.addFilter();

    this.loading = true;
    this.subscriptions.add(this.input.valueChanges.pipe(debounceTime(1500),distinctUntilChanged()
      ,switchMap(data => {
        super.searchData();
        return this.searchData();
      }))
      .subscribe((response) => {
        this.updateCompanySuccessRate(response);
      }, err => this.loading = false));

    this.adminService.getSavedFilters().subscribe(filters => {
      this.savedFilters = filters;
    })
  
  }

  ngAfterViewInit() {
    this._script.load('datatables', 'daterangepicker')
      .then((data) => {
        this.scriptLoaded = true;
      }).catch((error) => {
      console.log('Script not loaded', error);
    });
  }

  
  addFilter() {
    this.filters.push(JSON.parse(JSON.stringify(this.filter))); // passing filter by value
    this.filtersPostData.push({}); // initialize an empty request object
  }

  removeFilter(index) {
    this.filters[index].visible = false;
    this.filtersPostData[index] = {};
  }

  onSavedFilterChange() {
    let filter = JSON.parse(this.currentSelectedFilter.filter_string);
    this.filters = [];
    filter.forEach((value, index) => {
      this.addFilter();
      this.filters[index].selected_property = value.property;
      this.filters[index].select_property_category = value.type;
      this.filters[index].selected_operator = value.operator;

      //set post data
      this.filtersPostData[index]['property'] = value.property;
      this.filtersPostData[index]['type'] = value.type;
      this.filtersPostData[index]['operator'] = value.operator;
    });
    this.showAdvancedFilter = true;
  }

  setFilterProperty(target, index) {
    this.filtersPostData[index]['property'] = this.filters[index].selected_property;
    let type = target.options[target.options.selectedIndex].className;
    this.filtersPostData[index]['type'] = type;
    this.filters[index].selected_property_type = type;

    this.filters[index].selected_operator = ''; // reset operator value
  }

  setFilterOperator(value, index) {
    this.filtersPostData[index]['operator'] = value;
    this.filters[index].selected_operator = value;
  }

  setFilterValue(value, index) {
    this.filtersPostData[index]['value'] = [];
    this.filtersPostData[index]['value'][0] = value;
  }

  setDateStart(date: any, index) {
    this.filtersPostData[index]['value'] = [];
    this.filtersPostData[index]['value'][0] = date.start_date;
  }

  setDateRange(date: any, index) {
    this.filtersPostData[index]['value'] = [];
    this.filtersPostData[index]['value'][0] = date.start_date;
    this.filtersPostData[index]['value'][1] = date.end_date;
  }

  getRequestParams(): any {
    return {
      limit: this.current_limit,
      page: this.current_page - 1,
      search_key: this.search,
      sort_order: this.sortOrder,
      sort_key: this.sortKey,
      filter: this.parseFilterData()
    };
  }

  addCondition() {
    this.filters.push(JSON.parse(JSON.stringify(this.filter)));
  }

  

  parseFilterData() {
    // filter empty objects
    let filteredData = this.filtersPostData.filter(value =>
      value.property && value.type && value.operator && value.value);

    // group by types - {app:[],company:[]}
    let groupedByData = {};
    for (let i = 0; i < filteredData.length; i++) {
      let current = filteredData[i];

      if (groupedByData[current.type] === undefined) {
        groupedByData[current.type] = [];
      }
      groupedByData[filteredData[i].type].push(current);
    }

    return groupedByData;
  }

  filterResults() {
    super.searchData();
    this.getCompanySuccessData();
  }

  getCompanySuccessData() {
    this.loading = true;

    this.subscriptions.add(this.adminService.getCompanySuccessRate(this.getRequestParams())
      .subscribe((response) => {
        this.updateCompanySuccessRate(response);
      }, err => this.loading = false));
  }

  getPaymentsInfo(companyId) {
    this.paymentLoading = true;
    // get invoices
    this.getInvoices(companyId);
  }

  sort(columnSortKey) {
    this.sortKey = columnSortKey;
    if (this.sortOrder === -1) {
      this.sortOrder = 1;
    } else {
      this.sortOrder = -1;
    }

    super.searchData();
    this.getCompanySuccessData();
  }

  toggleCompanyDetails(company: any) {
    company.showDetails = !company.showDetails;
  }

 
  updateCompanySuccessRate(response: any) {
    this.company = response.successRate;
    this.totalCount=response.count;
    this.total_pages = Math.ceil(response.count / this.current_limit);
    this.loading = false;
  }

  saveFilter(filterName, filterDescription) {
    let filteredData = this.filtersPostData.filter(value => {
      return !(Object.keys(value).length === 0);
    });

    let postData = {
      name: filterName.value,
      description: filterDescription.value,
      filterString: JSON.stringify(filteredData)
    };
    this.adminService.saveSuccessRateFilter(postData).subscribe(response => {
      jQuery("#saveFilterModal").modal("hide");
      filterName.value = '';
      filterDescription.value = '';
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getInvoices(companyId) {
    this.invoices = [];
    this.invoiceNo = 0;
    this._membershipService.getInvoices(companyId)
      .subscribe(
        (invoices: any) => {
          this.paymentLoading = false;
          invoices.list.forEach((invoiceList: any) => {
            this.invoiceNo++;
            invoiceList.invoice.invoiceNo = this.invoiceNo;
            this.isInvoiceExist = true;
            // console.log(invoiceList.invoice.id, 'invoice');
            this._membershipService.getInvoicesPdf(invoiceList.invoice.id, companyId)
              .subscribe(
                (data: any) => {
                  // console.log('Get Pdf', data);
                  invoiceList.invoice.href = data.download.download_url;
                  invoiceList.invoice.date = moment.unix(invoiceList.invoice.date).format('DD-MM-YYYY');
                },
                (error: any) => {
                  console.log('Issue in pdf', error);
                }
              );
            this.invoices.push(invoiceList.invoice);
          });
        },
        (error: any) => {
          console.log('Error in getting invoices', error);
        }
      );
  }

  // Check the obj has the keys in the order mentioned. Used for checking JSON results.
  checkObjHasKeys(object, ...keys): boolean {
    return keys.reduce((a, b) => (a || {})[b], object) !== undefined;
  }


  searchData() {
    this.loading = true;
    super.searchData();
    return this.adminService.getCompanySuccessRate(this.getRequestParams());
  }

  removeCondition(index: number) {
    this.filters.splice(index, 1);
  }
  applyFilter() {
    this.searchData();
    this.getCompanySuccessData();
    
  }
  showFilters() {
    this.showFilter = !this.showFilter;
    this.filters = [];
    this.filters.push(JSON.parse(JSON.stringify(this.filter)));
    console.log("asss",this.filters)
  }

  initDatePcker(pos: number) {
    const obj = {
      'startDate': moment(new Date()).subtract(10, 'days').format('MM/DD/YYYY'),
      'endDate': moment(new Date()).format('MM/DD/YYYY'),
      'opens': 'left',
      'drops': 'down',
      'autoApply': true,
    };
    if (this.filters[pos].selected_field === 'sign_up' || this.filters[pos].selected_field === 'subscription_updated') {
      this.filters[pos].numberValue = {
        value1: moment(new Date()).subtract(1, 'days').format('MM/DD/YYYY'),
        value2: moment(new Date()).format('MM/DD/YYYY')
      };
      if (this.filters[pos].selected_operator !== 'between') {
        obj['singleDatePicker'] = true;
      }
      setTimeout(() => {
        jQuery('.dpkr_' + pos).daterangepicker(obj, (start, end, label) => {
          this.filters[pos].numberValue = {
            value1: start.format('MM/DD/YYYY'),
            value2: end.format('MM/DD/YYYY')
          };
        });
      }, 1000);
    } else {
      this.filters[pos].numberValue = {
        value1: '0',
        value2: '1'
      };
    }
  }


}
