import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Datatable } from '../../classes/datatable.class';
import { UserService } from '../../services/user.service';
import { ScriptService } from '../../services/script.service';
import { CookiesService } from '../../services/cookies.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-email-logs',
  templateUrl: './email-logs.component.html',
  styleUrls: ['./email-logs.component.css']
})
export class EmailLogsComponent extends Datatable implements OnInit, AfterViewInit {
  data: Object = [];
  selected: any;
  loading: boolean = false;
  logType: string = 'email';
  totalCount: number;
  

  constructor(public _userService : UserService,public _script : ScriptService,
     public router : Router) {
    super();
    if (CookiesService.readCookie('storage')) {
      let storage = JSON.parse(CookiesService.readCookie('storage'));
      if (storage.user.sub_role !== null)
          this.router.navigate(['/admin/users']);
  }
  this.totalCount=0
   }

   ngOnInit(){
    
   }
   ngAfterViewInit() {
    this._script.load('datatables')
        .then((data) => {
            this.getEmails();
        })
        .catch((error) => {
            console.log('Script not loaded', error);
        });
}


 getEmails() {  
   this.loading = true;
  let obj = {
    limit: this.current_limit,
    page: this.current_page - 1,
    searchKey: this.search
  };
  this._userService.getEmailLogs(obj)
      .subscribe(
      (response: any) => {
        console.log("2")
          this.data = response.emails;
          this.totalCount=response.count
          this.total_pages = Math.ceil(response.count / this.current_limit);
         this.loading = false;
      },
      (response: any) => {
          console.log('Email error', response);
          this.loading = false;
      }
      );
}

getDealLogs(){
  this.loading = true;
  let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      searchKey: this.search
  };
  this._userService.getDealLogs(obj)
      .subscribe(
      (response: any) => {
          this.data = response.dealLogs;
          this.totalCount=response.count
          this.total_pages = Math.ceil(response.count / this.current_limit);
          this.loading = false;
      },
      (response: any) => {
          console.log('Email error', response);
           this.loading = false;
      }
      );
}


parseBody(body) {
  this.selected = this.logType == 'email' ? JSON.parse(body) :  body;
}
generateKeys(obj) {
  return Object.keys(obj);
}

selectLog(){
  switch(this.logType){
      case 'email': this.getEmails();
                      break;
      case 'deal': this.getDealLogs();
                  break;
      default: break;
  }
}

searchData() {
  super.searchData();
  this.selectLog();
}

logTypeChange(event: any) {
  this.logType = event.target.value;
  this.selectLog();
}


}
