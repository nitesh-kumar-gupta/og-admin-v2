import { Component, OnInit } from '@angular/core';
import { Datatable } from '../../classes/datatable.class';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { ScriptService } from '../../services/script.service';
import { CookiesService } from '../../services/cookies.service';

declare var jQuery:any;
declare var window:any;

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent extends Datatable implements OnInit {

  scriptLoaded = false;
  apiSelect: string;
  logs: Array<String>;
  message: String;
  folderName: String;
  dateme: string;
  firsTime = true;
  selected: any;
  isLoading = false;
  searchQuery: string;
  searchON = true;
  apiSwitched: boolean;
  dataIsObject = false;
  
  constructor(public _script: ScriptService, public _adminService: AdminService,
    public router: Router) {
    super();
    if (CookiesService.readCookie('storage')) {
      let storage = JSON.parse(CookiesService.readCookie('storage'));
      if (storage.user.sub_role !== null)
        this.router.navigate(['/admin/users']);
    }
  }

  ngOnInit() {
    this.loadScripts(); // remomve this
    this._adminService.getlogType().subscribe((data) => {
      this.folderName = data || 'errorLogs';
      let dateObj = new Date();
      let dateString = this.formateDate(dateObj);
      this.dateme = dateString; // here
      this.requestForLog(this.dateme, this.folderName);
    });

    let $cont = jQuery('#logContainer');
    $cont[0].scrollTop = $cont[0].scrollHeight;
  };
  loadScripts() {
    this._script.load('datatables', 'daterangepicker')
      .then((data) => {
        this.scriptLoaded = true;
        // this.requestForLog(this.dateme, this.folderName);
      })
      .catch((error) => {
        console.log('Script not loaded', error);
      });

    jQuery('.modal').on('hidden.bs.modal', function () {
      this.error = false;
      this.errorMessage = '';
    });
    jQuery('.daterangepicker').click(() => {
      alert('select date');
    })
  }

  requestForLog(dateString, folder) {
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      // searchKey: this.search,
      selectedDate: dateString,
      folder: folder,
      searchKey: this.searchQuery,
      isFirstTime: this.firsTime
    };
    this.isLoading = true;
    this.message = 'loading...';
    this._adminService.getLog(this.apiSelect, obj).subscribe((response) => {
      this.logs = response.logs;
      this.apiSwitched = false;
      this.isLoading = false;
      this.searchON = false;
      this.total_pages = Math.ceil(response.count / this.current_limit);
      this.message = '';
    }, (error) => {
      this.errorHandler();
    });
  }

  errorHandler() {
    if (this.apiSwitched) {
      window.toastNotification("API Not Responding!...");
    } else {
      window.toastNotification("No log found!...");
    }
    this.isLoading = false;
    this.searchON = true; // disabling search while true
    this.logs = [];
  }

  formateDate(d) {
    let month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  onDateSelect(date: any) {
    this.firsTime = true;
    this.searchQuery = "";
    this.reset();
    this.dateme = date.start_date;
    this.requestForLog(this.dateme, this.folderName);
  }

  onRefresh() {
    this.firsTime = true;
    this.searchQuery = "";
    let dateObj = new Date();
    this.setDateInDatePicker(dateObj);
    this.reset();
    this.dateme = this.formateDate(dateObj);
    this.requestForLog(this.dateme, this.folderName);
  }

  setDateInDatePicker(date) {
    jQuery('.input-daterange-datepicker.datepicker-outer[name=daterange]').val(
      `${("0" + (date.getMonth() + 1)).slice(-2)}/${("0" + date.getDate()).slice(-2)}/${date.getFullYear()}`
    );
  }
  paging(num: number) {
    this.firsTime = false;
    super.paging(num);
    this.requestForLog(this.dateme, this.folderName);
  }
  //
  previous() {
    this.firsTime = false;
    super.prevPage();
    this.requestForLog(this.dateme, this.folderName);
  }
  //
  next() {
    this.firsTime = false;
    super.nextPage();
    this.requestForLog(this.dateme, this.folderName);
  }

  limitChange(event: any) {
    this.firsTime = false;
    super.limitChange(event);
    this.requestForLog(this.dateme, this.folderName);
  }

  searchData() {
    if (this.searchQuery || this.searchQuery.length > 2 || this.searchQuery.length === 0) {
      super.searchData();
      this.firsTime = false;
      this.requestForLog(this.dateme, this.folderName);
    }
  }

  apiChange() {
    this.apiSwitched = true;
    this.onRefresh();
  }

  parseBody(body, logType) {
    if (!body || body === "undefined" || logType === 'err_data') {
      this.dataIsObject = false;
      this.selected = body || "Data is not available."
    } else {
      this.dataIsObject = true;
      this.selected = JSON.parse(body);
    }
  }
  generateKeys(obj) {
    return Object.keys(obj);
  }

  createDate(body) {
    let date = body.trim().split(/[\s-\/:]+/);
    return new Date(date);
  }

}
