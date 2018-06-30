import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Datatable } from '../../classes/datatable.class';
import { AdminService } from '../../services/admin.service';
import { ScriptService } from '../../services/script.service';

declare var jQuery: any;
declare var moment: any;

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent extends Datatable implements OnInit, AfterViewInit {

  totalCount: any = 0;
  showFilter: boolean;
  conditions: Array<any> = [];
  condition: Object;
  operators: {};
  filterFields: { leads: { value: string; name: string; }[]; };
  data: Array<Object>;
  loadingLeads: boolean = false;
  loading: boolean = false;
  allLeads: Array<Object>;
  constructor(public _adminService: AdminService, public _script: ScriptService) {
    super();
    this.filterFields = {
      leads: [
        {
          value: 'email',
          name: 'Email'
        },
        {
          value: 'createdAt',
          name: 'Created At'
        }
      ]
    }
    this.operators = {
      email: this.stringOperators,
      createdAt: this.numberOperators
    }
    this.condition = {
      fields: this.filterFields,
      operators: this.operators,
      selected_field: 'email',
      selected_operator: 'equals',
      stringValue: '',
      numberValue: {
        value1: '0',
        value2: '1'
      },
      fixedvalue: ''
    };
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    this._script.load('datatables')
      .then((data) => {
        this.getAllLeads();
      })
      .catch((error) => {
        console.log('Script not loaded', error);
      });

    // console.log(this.date_from,'this.date_to',this.date_to);
  }

  getAllLeads(query = null) {
    this.loadingLeads = true;
    let self = this;
    self.loading = true;
    self.allLeads = [];
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      query: null,
    };
    if (query) {
      const que = query.map(q => ({
        selected_field: q.selected_field,
        selected_operator: q.selected_operator,
        stringValue: q.stringValue,
        numberValue: q.numberValue,
        fixedvalue: q.fixedvalue
      }));
      obj.query = que;
    }
    let getAllLeads = self._adminService.getAllLeads(obj)
      .subscribe(
        (success: any) => {
          this.loadingLeads = false;
          self.allLeads = success.leads;
          if (this.allLeads)
            this.totalCount = success.count
          self.loading = false;
          this.total_pages = Math.ceil(success.count / this.current_limit);
        },
        (error: any) => {
          this.loadingLeads = false;
          console.log('error leads', error);
          getAllLeads.unsubscribe();
        }
      );
  }
  dateFormat(date: any) {
    let d = new Date(date);
    return d.toString().split("GMT")[0];
  }

  addCondition() {
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  applyFilter() {
    this.current_page = 1;
    this.getAllLeads(this.conditions);
  }

  showFilters() {
    this.showFilter = !this.showFilter;
    this.conditions = [];
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
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
