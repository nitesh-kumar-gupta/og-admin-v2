import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Datatable } from '../../classes/datatable.class';

import { FormControl } from '@angular/forms';
import { ScriptService } from '../../services/script.service';
import { AdminService } from '../../services/admin.service';
import { MembershipService } from '../../services/membership.service';
import { CookiesService } from '../../services/cookies.service';
import { FilterOperators } from '../../interfaces/filter-operators.interface';
import { Subscription } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';




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
  conditions: Array<any> = [];
  condition: Object;
  momentJs: any;
  loading = false;
  paymentLoading = false;
  showAdvancedFilter = false;
  scriptLoaded = false;
  showFilter: boolean = false;
  operators: {};

  company: Array<any> = [];
  input = new FormControl();

  isInvoiceExist = false;
  invoices: any = [];
  invoiceNo: any;

  sortKey = '_id'; // default sort parameters
  sortOrder = -1; // -1 for ascending order

  // currentSelectedFilter: any = "";
  filters: Array<any> = []; // represents each filter
  savedFilters: Array<any> = [];
  filtersPostData: Array<any> = [];
  filterFields: any;

  public subscriptions: Subscription = new Subscription();

  public sub_role: String = null;

  constructor(public _script: ScriptService, public adminService: AdminService,
    public _membershipService: MembershipService) {
    super();

    this.momentJs = moment;
    if (CookiesService.readCookie('storage')) {
      let storage = JSON.parse(CookiesService.readCookie('storage'));
      this.sub_role = storage.user.sub_role;
    }

    this.filterFields = {
      company: [
        {
          value: 'name',

          name: 'name'
        },
        {
          value: 'current_usage.calc',
          name: 'number_of_calculators'
        },
        {
          value: 'current_usage.total_leads',
          name: 'leads'
        },
        {
          value: 'last_lead.last_added',
          name: 'last_lead_generated'
        },
        {
          value: 'current_usage.total_traffic',
          name: 'visits'
        },
        {
          value: 'billing.chargebee_plan_id',
          name: 'plan'
        },
        {
          value: 'is_appsumo_created',
          name: 'appsumo_created'
        },
        {
          value: 'current_usage.total_conversion_rate',
          name: 'conversion_rate'
        },
        {
          value: 'billing.chargebee_subscription_status',
          name: 'trial'
        },
        {
          value: 'billing.subscription.end',
          name: 'next_payment'
        },
        {
          value: 'billing.subscription.percent_cycle_over',
          name: 'percent_cycle_over'
        },
        {
          value: 'cancellation.cancelled_by_user',
          name: 'request_cancellation'
        },
        {
          value: 'billing.subscription.billing_unit',
          name: 'billing_unit'
        }
      ],
      app: [
        {
          value: 'name',
          name: 'name'
        },
        {
          value: 'status',
          name: 'status'
        },
        {
          value: 'createdAt',
          name: 'created_at'
        },
        {
          value: 'updatedAt',
          name: 'latest_publish'
        },

      ],
      user: [
        {
          value: 'session_count',
          name: 'web_session'
        }
      ]
    }

    this.operators = {
      'current_usage.total_leads': this.numberOperators,
      'current_usage.total_traffic': this.numberOperators,
      name: this.stringOperators,
      'current_usage.calc': this.numberOperators,
      createdAt: this.numberOperators,
      is_appsumo_created:this.booleanValues,
      'billing.chargebee_plan_id': this.stringOperators,
      status: this.stringOperators,
      'updatedAt': this.numberOperators,
      'current_usage.total_conversion_rate': this.numberOperators,
      'billing.chargebee_subscription_status': this.stringOperators,
      'billing.subscription.end': this.numberOperators,
      'billing.subscription.percent_cycle_over': this.numberOperators,
      'cancellation.cancelled_by_user': this.booleanValues,
      ' last_lead.last_added': this.numberOperators,
      'billing.subscription.billing_unit': this.stringOperators,
      session_count: this.numberOperators
    }
    this.condition = {
      fields: this.filterFields,
      operators: this.operators,
      selected_field: 'name',
      selected_operator: 'equals',
      // selectItem: true,
      stringValue: '',
      numberValue: {
        value1: '0',
        value2: '1'
      },
      // multiSelectSelected: [],
      fixedvalue: ''
    }; // model for a single filter

  }

  ngOnInit() {

    this.addFilter();
    this.getCompanySuccessData();
    this.loading = true;
    this.subscriptions.add(this.input.valueChanges.pipe(debounceTime(1500), distinctUntilChanged()
      , switchMap(data => {
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
    this.conditions.push(JSON.parse(JSON.stringify(this.condition))); // passing filter by value
    this.filtersPostData.push({}); // initialize an empty request object
  }

 

 

  addCondition() {
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }




  getCompanySuccessData(query = null) {
    this.loading = true;
    const data = {
      limit: this.current_limit,
      page: this.current_page - 1,
      query: null
    };


    if (query) {
      const que = query.map(q => ({
        selected_field: q.selected_field,
        selected_operator: q.selected_operator,
        stringValue: q.stringValue,
        numberValue: q.numberValue,
        multiSelectSelected: q.multiSelectSelected,
        fixedvalue: q.fixedvalue
      }));
      data.query = que;
    }
    

    this.subscriptions.add(this.adminService.getCompanySuccessRate(data)
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
    console.log(">>>>>>>Datamine", response)
    this.company = response.successRate;
    this.totalCount = response.count;
    this.total_pages = Math.ceil(response.count / this.current_limit);
    this.loading = false;
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


  searchData(query = null) {

    this.loading = true;
    const data = {
      limit: this.current_limit,
      page: this.current_page - 1,
      query: null
    };
    if (query) {
      const que = query.map(q => ({
        selected_field: q.selected_field,
        selected_operator: q.selected_operator,
        stringValue: q.stringValue,
        numberValue: q.numberValue,
        multiSelectSelected: q.multiSelectSelected,
        fixedvalue: q.fixedvalue
      }));
      data.query = que;
    }
    super.searchData();
    return this.adminService.getCompanySuccessRate(data);
  }


  applyFilter() {
    this.searchData(this.conditions);
    this.getCompanySuccessData(this.conditions);

  }
  showFilters() {
    this.showFilter = !this.showFilter;
    this.conditions = [];
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
    console.log("asss", this.filters)
  }

  initDatePcker(pos: number) {
    const obj = {
      'startDate': moment(new Date()).subtract(10, 'days').format('MM/DD/YYYY'),
      'endDate': moment(new Date()).format('MM/DD/YYYY'),
      'opens': 'left',
      'drops': 'down',
      'autoApply': true,
    };
    if (this.conditions[pos].selected_field ===  'last_lead.last_added' || this.conditions[pos].selected_field === 'createdAt' || this.conditions[pos].selected_field === 'billing.subscription.end' || this.conditions[pos].selected_field === 'updatedAt' ) {
      this.conditions[pos].numberValue = {
        value1: moment(new Date()).subtract(1, 'days').format('MM/DD/YYYY'),
        value2: moment(new Date()).format('MM/DD/YYYY')
      };
      if (this.conditions[pos].selected_operator !== 'between') {
        obj['singleDatePicker'] = true;
      }
      setTimeout(() => {
        jQuery('.dpkr_' + pos).daterangepicker(obj, (start, end, label) => {
          this.conditions[pos].numberValue = {
            value1: start.format('MM/DD/YYYY'),
            value2: end.format('MM/DD/YYYY')
          };
        });
      }, 1000);
    } else {
      this.conditions[pos].numberValue = {
        value1: '0',
        value2: '1'
      };
    }
  }


}
