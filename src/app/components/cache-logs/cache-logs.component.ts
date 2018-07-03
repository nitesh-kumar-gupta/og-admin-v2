import { Component, OnInit } from '@angular/core';
import { Datatable } from '../../classes/datatable.class';
import { AdminService } from '../../services/admin.service';

declare var bootbox: any;
@Component({
  selector: 'app-cache-logs',
  templateUrl: './cache-logs.component.html',
  styleUrls: ['./cache-logs.component.css']
})
export class CacheLogsComponent extends Datatable implements OnInit {

  searchText: string;
  main: any;
  keyValues: any;
  pages: number;
  subscribes: any = [];
  totalCache: number;
  loading: boolean;
  KeyName: any;

  constructor(private adminService: AdminService) {
    super();
    this.pages = 1;
    this.totalCache = 0
    this.loading = true;

  }

  ngOnInit() {
    // this.subscribes.push(this.getCacheLogs())
    this.getCacheLogs();
  }

  getCacheLogs() {
    this.loading = true;
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
    };
    this.adminService.showCacheKey(obj)
      .subscribe(success => {
        for (let i = 0; i < success.data.length; i++)
          success.data[i] = JSON.parse(success.data[i])
        this.keyValues = success.data;
        this.main = this.keyValues;
        this.totalCache = success.count;
        this.pages = Math.ceil(success.count / this.current_limit);
        
        console.log(this.pages, success.count, this.current_limit)
        this.loading = false;
      }, (error: any) => {
        // window.toastNotification("Failed to load cache...")
        console.error('getCacheLogs error', error);

      })
  }

  KeyValueDisplay(id, keyName) {
    let self = this;
    self.KeyName = keyName
    console.log("id is:", id, "keyName:", keyName, "value is: ", self.keyValues[id].value)
    document.getElementById("json").innerHTML =
      JSON.stringify(self.keyValues[id].value, null, 2)
  }

  searchData() {
    if (this.searchText !== '' || this.searchText !== undefined) {
      this.searchText = this.searchText.trim();
      this.keyValues = this.main.filter((ele) => {
        return ((ele.key.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1))
      });
    }
  }
  deleteCache(index, keyName) {
    let self = this;
    let keys = []
    keys.push(keyName)
    bootbox.dialog({
      size: 'small',
      message: `<div class="bootbox-body-left">
<div class="mat-icon">
<i class="fa fa-warning"></i>
</div>
</div>
<div class="bootbox-body-right">
<p class="one-line-para">Are you sure you want to delete this cache?</p>
</div>
`,
      buttons: {
        cancel: {
          label: "Cancel",
          className: "btn-cancel btn-cancel-hover",
        },
        success: {
          label: "OK",
          className: "btn btn-ok btn-hover",
          callback: function () {
            self.adminService.clearCache(keys)
              .subscribe(data => {
                if (data) {
                  // window.toastNotification('Cache deleted Succesfully...');
                  window.alert("Cache deleted Successfully")
                  self.keyValues.splice(index, 1)
                }
                else {
                  window.alert("Failed to delete cache")
                  // window.toastNotification('Failed to delete Cache...');
                }
              }, error => {
                window.alert("Failed to delete cache")
                // window.toastNotification('Failed to delete Cache...');
              })
          }
        }
      }
    });

  }


}