import { Component, Renderer, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { environment } from "../../../../environments/environment";
import { Datatable } from "../../../classes/datatable.class";
import { UserService } from "../../../services/user.service";
import { ScriptService } from "../../../services/script.service";
import { EmailValidator } from "../../../validators/email.validator";

declare var jQuery: any;
declare var moment:any;

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent extends Datatable implements AfterViewInit {
  totalCount: any=0;
  showFilter: boolean;
  conditions: Array<any> = [];
  condition: Object;
  operators: {};
  filterFields: { user: { value: string; name: string; }[]; };
  data: Array<Object>;
  extension: string = environment.APP_EXTENSION;
  addUserForm: FormGroup;
  error: boolean = false;
  filters: any = [];
  showAdvancedFilter: boolean = false
  errorMessage: string = "";
  loadingUsers: boolean = false;
  filter = {
    company: [
      { name: "Name", id: "name" },
      { name: "Created At", id: "created_at" },
      { name: "Admin Created", id: "is_admin_created" },
      { name: "Active", id: "active" },
      { name: "Email", id: "emails.email" },
      { name: "Company", id: "userCompany" }
    ],

    selected_property: "",
    selected_operator: "",
    selected_property_category: "",
    selected_property_type: "",
    selected_value: {},
    visible: true
  };

  constructor(
    public userService: UserService,
    public renderer: Renderer,
    public router: Router,
    public _script: ScriptService,
    public fb: FormBuilder
  ) {
    super();
    this.addUserForm = this.fb.group({
      username: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ],
      useremail: [
        "",
        Validators.compose([Validators.required, EmailValidator.format])
      ],
      userPassword: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)])
      ],
      companyName: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ],
      companySubDomain: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.pattern("^[a-zA-Z0-9]*$")
        ])
      ],
      chargebeeId: [""],
      chargebeeSubsId: [""],
      plan: [""]
    });
    this.filterFields = {
      user: [
        {
          value: 'name',
          name: 'Name'
        },
        {
          value: 'location',
          name: 'Location'
        },
        {
          value: 'email',
          name: 'email'
        },
        {
          value: 'phone',
          name: 'Phone'
        },
        {
          value: 'can_create_new_company',
          name: 'Can Create New Company'
        },
        {
          value: 'is_admin_created',
          name: 'Is Admin Created'
        },
        {
          value: 'active',
          name: 'Active'
        },
        {
          value: 'session_count',
          name: 'Session Count'
        },
        {
          value: 'createdAt',
          name: 'Created At'
        }
      ]
    }
    this.operators = {
      name: this.stringOperators,
      location: this.stringOperators,
      email: this.stringOperators,
      phone: this.stringOperators,
      can_create_new_company: this.booleanValues,
      is_admin_created: this.booleanValues,
      active: this.booleanValues,
      session_count: this.numberOperators,
      createdAt: this.numberOperators
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
    };
  }

  ngAfterViewInit() {
    this._script
      .load("datatables")
      .then(data => {
        this.getAllUsers();
      })
      .catch(error => {
        console.log("Script not loaded", error);
      });

    jQuery(".modal").on("hidden.bs.modal", function () {
      this.error = false;
      this.errorMessage = "";
    });
  }

  getAllUsers(query = null) {
    this.loadingUsers = true;
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      query: null
      // searchKey: this.search,
      // filter: this.parseFilterData()
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
    this.userService.getAllUsers(obj).subscribe(
      (response: any) => {
        this.data = response.users;
        if(this.data)
        this.totalCount=response.count
        this.total_pages = Math.ceil(response.count / this.current_limit);
        this.loadingUsers = false;
      },
      (response: any) => {
        this.loadingUsers = false;
        console.log("all users error", response);
      }
    );
    jQuery(document).on("click", ".editUser", function () {
      let user_id = jQuery(this).data("user-id");
      window.location.href = window.location.origin + "/admin/user/" + user_id;
    });
  }
  addUser() {
    let self = this;
    jQuery("#adminAddUser")
      .text("Please wait..")
      .attr("disabled", true);
    let addUser = this.userService
      .addUserFromAdmin(this.addUserForm.value)
      .subscribe(
        (success: any) => {
          // console.log('adus', success.user._id);
          jQuery("#adminAddUser")
            .text("Add")
            .attr("disabled", false);
          self.error = false;
          self.errorMessage = "";
          jQuery("#add-user").modal("hide");
          let url = environment.APP_DOMAIN + "/admin/user/" + success.user._id;
          jQuery(location).attr("href", url);
        },
        (error: any) => {
          self.error = true;
          self.errorMessage = error.error.err_message;
          jQuery("#adminAddUser")
            .text("Add")
            .attr("disabled", false);
          addUser.unsubscribe();
        }
      );
  }

  navigateUser(id: string) {
    this.router.navigate(["/admin/user/" + id]);
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
    this.getAllUsers(this.conditions);
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
  // searchData() {
  //   super.searchData();
  //   this.getAllUsers();
  // }
  // addFilter() {
  //   this.filters.push(Object.assign({}, this.filter)); // passing filter by value
  // }
  // clearFilters() {
  //   this.filters.forEach(filter => (filter.visible = false));
  // }
  // removeFilter(index) {
  //   this.filters[index].visible = false;
  // }
  // setFilterProperty(target, index) {
  //   this.filters[index].selected_property_category =
  //     target.options[target.options.selectedIndex].className;
  //   this.filters[index].selected_property_type = "string";
  //   this.filters[index].selected_value = ""; // reset selected value
  //   this.filters[index].selected_operator = ''; // reset operator value
  // }

  // selected(event, index, type) {
  //   if (typeof this.filters[index].selected_value === "string") {
  //     this.filters[index].selected_value = {};
  //   }
  //   if (!Array.isArray(this.filters[index].selected_value[type])) {
  //     this.filters[index].selected_value[type] = [];
  //   }
  //   this.filters[index].selected_value[type].push(event.id);
  // }
  // select(event, index) {
  //   if (event.hasOwnProperty("start_date")) {
  //     this.filters[index].selected_value = event;
  //   } else {
  //     this.filters[index].selected_value = event.id;
  //   }
  // }
  // selectOperator(event, index) {
  //   if (event.id === "-1") {
  //     this.filters[index].selected_value = event.id;
  //     this.filters[index].selected_operator = event.id;
  //   } else {
  //     this.filters[index].selected_value = "";
  //     this.filters[index].selected_operator = event.id;
  //   }
  // }

  // removed(event, index, type) {
  //   if (event === "all") {
  //     this.filters[index].selected_value[type] = [];
  //   }
  //   let i = this.filters[index].selected_value[type].indexOf(event);
  //   this.filters[index].selected_value[type].splice(i, 1);
  // }
  // parseFilterData() {
  //   return this.filters
  //     .filter(
  //       el =>
  //         el.visible &&
  //         el.selected_property &&
  //         el.selected_property_category &&
  //         el.selected_property_type &&
  //         el.selected_value
  //     )
  //     .map(el => {
  //       let val = {
  //         property: el.selected_property,
  //         type: el.selected_property_category,
  //         value: el.selected_value,
  //         operator: el.selected_operator
  //       };

  //       return val;
  //     });
  // }

}

