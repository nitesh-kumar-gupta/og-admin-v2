import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Datatable } from '../../classes/datatable.class';
import { Company } from '../../models/company.model';
import * as moment from 'moment';
declare let jQuery: any;
@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent extends Datatable implements OnInit, OnDestroy {
  subscribes: any[];
  companies: Company[];
  loadingCompanies: boolean;
  totalCompanies: number;
  pages: number;
  showFilter: boolean;
  filterFields: any;
  dealReferredValue: Array<Object>;
  currentRefProgValue: Array<Object>;
  cbPlanValue: Array<Object>;
  subscStatus: Array<Object>;
  cardStatus: Array<Object>;
  operators: any;
  enumValues: any;
  conditions: Array<any> = [];
  condition: Object;
  constructor(private adminService: AdminService) {
    super();
    this.showFilter = false;
    this.subscribes = [];
    this.companies = [];
    this.loadingCompanies = true;
    this.totalCompanies = 0;
    this.pages = 1;
    this.filterFields = {
      company: [
        {
          value: 'name',
          name: 'Name'
        },
        {
          value: 'sub_domain',
          name: 'Sub-domain'
        },
        {
          value: 'createdAt',
          name: 'createdAt'
        },
        {
          value: 'api',
          name: 'API'
        },
        {
          value: 'current_limit.users',
          name: 'Number of Users'
        },
        {
          value: 'current_limit.companies',
          name: 'Number of Companies'
        },
        {
          value: 'current_limit.calculators',
          name: 'Number of Calculaters'
        },
        {
          value: 'deal_refered',
          name: 'Deal referred'
        },
        {
          value: 'current_referral_program',
          name: 'Current referral program'
        },
        {
          value: 'parent_company',
          name: 'Parent company'
        },
        {
          value: 'integration',
          name: 'Template Club'
        },
        {
          value: 'subscription_updated',
          name: 'Subscription Updated'
        },
        {
          value: 'is_admin_created',
          name: 'Is admin created'
        },
        {
          value: 'agency',
          name: 'Is Agency'
        },
        {
          value: 'cname.url',
          name: 'Cname URL'
        },
        {
          value: 'remove_leads_after_saving',
          name: 'Remove leads after Saving'
        },
        {
          value: 'GDPR',
          name: 'GDPR'
        }
      ],
      subscription: [
        {
          value: 'billing.chargebee_plan_id',
          name: 'Current plan Id'
        },
        {
          value: 'billing.chargebee_subscription_status',
          name: 'Current plan status'
        },
        {
          value: 'billing.chargebee_subscription_id',
          name: 'Subscription Id'
        },
        {
          value: 'billing.chargebee_customer_id',
          name: 'Customer Id'
        },
        {
          value: 'billing.customer_card_status',
          name: 'Card status'
        },
        {
          value: 'previousPlan.plan_id',
          name: 'Previous plan Id'
        },
        {
          value: 'previousPlan.subscription_status',
          name: 'Previous plan status'
        }
      ]
    };
    this.dealReferredValue = [
      {
        id: null,
        itemName: 'NONE'
      },
      {
        id: 'DEALFUEL',
        itemName: 'DEALFUEL'
      },
      {
        id: 'WARRIOR',
        itemName: 'WARRIOR'
      },
      {
        id: 'APPSUMO_BLACK',
        itemName: 'APPSUMO BLACK'
      },
      {
        id: 'WEBMASTER',
        itemName: 'WEBMASTER'
      },
      {
        id: 'AFFILATES',
        itemName: 'AFFILATES'
      },
      {
        id: 'JVZOO',
        itemName: 'JVZOO'
      },
      {
        id: 'PKS',
        itemName: 'PKS'
      },
      {
        id: 'BLACK_FRIDAY',
        itemName: 'BLACK FRIDAY'
      },
      {
        id: 'LTD',
        itemName: 'LTD'
      },
      {
        id: 'SPECIAL_PAYMENT',
        itemName: 'SPECIAL PAYMENT'
      }
    ];
    this.currentRefProgValue = [
      {
        id: 'REFERRALCANDY',
        itemName: 'REFERRALCANDY'
      },
      {
        id: 'LEADDYNO',
        itemName: 'LEADDYNO'
      },
      {
        id: 'GROWSUMO',
        itemName: 'GROWSUMO'
      }
    ];
    this.subscStatus = [
      {
        id: 'future',
        itemName: 'future'
      },
      {
        id: 'in_trial',
        itemName: 'in_trial'
      },
      {
        id: 'active',
        itemName: 'active',
      },
      {
        id: 'non_renewing',
        itemName: 'non_renewing'
      },
      {
        id: 'paused',
        itemName: 'paused'
      },
      {
        id: 'cancelled',
        itemName: 'cancelled'
      }
    ];
    this.cardStatus = [
      {
        id: null,
        itemName: 'no card'
      },
      {
        id: 'valid',
        itemName: 'valid'
      },
      {
        id: 'expiring',
        itemName: 'expiring'
      },
      {
        id: 'expired',
        itemName: 'expired'
      }
    ];
    this.cbPlanValue = [];
    this.operators = {
      name: this.stringOperators,
      sub_domain: this.stringOperators,
      createdAt: this.numberOperators,
      api: this.stringOperators,
      'current_limit.users': this.numberOperators,
      'current_limit.companies': this.numberOperators,
      'current_limit.calculators': this.numberOperators,
      deal_refered: this.fixedValueOperator,
      current_referral_program: this.fixedValueOperator,
      parent_company: this.fixedValueOperator,
      integration: this.fixedValueOperator,
      subscription_updated: this.numberOperators,
      is_admin_created: this.fixedValueOperator,
      agency: this.fixedValueOperator,
      'cname.url': this.stringOperators,
      remove_leads_after_saving: this.fixedValueOperator,
      GDPR: this.fixedValueOperator,
      'billing.chargebee_plan_id': this.fixedValueOperator,
      'billing.chargebee_subscription_status': this.fixedValueOperator,
      'billing.chargebee_subscription_id': this.stringOperators,
      'billing.chargebee_customer_id': this.stringOperators,
      'billing.customer_card_status': this.fixedValueOperator,
      'previousPlan.plan_id': this.fixedValueOperator,
      'previousPlan.subscription_status': this.fixedValueOperator
    };
  }

  ngOnInit() {
    this.subscribes.push(this.getCompanies());
    this.subscribes.push(this.getPlanTypes());
  }

  ngOnDestroy() {
    this.subscribes.forEach((subscribe) => {
      subscribe.unsubscribe();
    });
  }

  getCompanies(query = null) {
    this.loadingCompanies = true;
    console.log(this.current_page)
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
    this.companies = [];
    return this.adminService.getCompanies(data).subscribe((success: any) => {
      success.companies.forEach((company) => {
        this.companies.push(new Company(company));
      });
      this.totalCompanies = success.count;
      this.total_pages = Math.ceil(success.count / this.current_limit);
      this.loadingCompanies = false;
    }, (error: any) => {
      console.error('getCompanies error', error);
    });
  }

  addCondition() {
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  applyFilter() {
    this.current_page = 1;
    this.getCompanies(this.conditions);
  }

  showFilters() {
    this.showFilter = !this.showFilter;
    this.conditions = [];
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  getPlanTypes() {
    return this.adminService.getPlanTypes().subscribe((success: any) => {
      this.cbPlanValue = [];
      success.list.forEach((plan) => {
        const obj = {
          id: plan.plan.id,
          itemName: plan.plan.name
        };
        this.cbPlanValue.push(obj);
      });
      this.enumValues = {
        deal_refered: this.dealReferredValue,
        current_referral_program: this.currentRefProgValue,
        parent_company: this.booleanValues,
        integration: this.booleanValues,
        is_admin_created: this.booleanValues,
        agency: this.booleanValues,
        remove_leads_after_saving: this.booleanValues,
        GDPR: this.booleanValues,
        'billing.chargebee_plan_id': this.cbPlanValue,
        'billing.chargebee_subscription_status': this.subscStatus,
        'billing.customer_card_status': this.cardStatus,
        'previousPlan.plan_id': this.cbPlanValue,
        'previousPlan.subscription_status': this.subscStatus
      };
      this.condition = {
        fields: this.filterFields,
        operators: this.operators,
        selected_field: 'name',
        selected_operator: 'equals',
        multiselectItems: this.enumValues,
        stringValue: '',
        numberValue: {
          value1: '0',
          value2: '1'
        },
        multiSelectSelected: [],
        fixedvalue: ''
      };
      this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
    }, (error: any) => {
      console.error('getPlanTypes error', error);
    });
  }

  initDatePcker(pos: number) {
    const obj = {
      'startDate': moment(new Date()).subtract(10, 'days').format('MM/DD/YYYY'),
      'endDate': moment(new Date()).format('MM/DD/YYYY'),
      'opens': 'left',
      'drops': 'down',
      'autoApply': true,
    };
    if (this.conditions[pos].selected_field === 'createdAt' || this.conditions[pos].selected_field === 'subscription_updated') {
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
