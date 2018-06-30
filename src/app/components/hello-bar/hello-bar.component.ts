import { Component, OnInit } from '@angular/core';
import { Datatable } from '../../classes/datatable.class';
import { AdminService } from '../../services/admin.service';

declare var moment: any;

@Component({
  selector: 'app-hello-bar',
  templateUrl: './hello-bar.component.html',
  styleUrls: ['./hello-bar.component.css']
})
export class HelloBarComponent extends Datatable implements OnInit {

  loading: boolean = false;
  createHelloBar: boolean = false;
  totalCount:number;
  momentJs: any;
  hellobarData: Array<any> = [];
  selectedHellobar: any = null;

  constructor(private adminService : AdminService) { 
    super();
    this.totalCount=0;
  }

  ngOnInit() {
    this.momentJs = moment;
    this.getHellobar();
  }

  editHellobar(hellobar) {
    this.selectedHellobar = hellobar;
    this.createHelloBar = true;
  }

  deletehellobar(hellobar) {
    this.adminService.deleteHellobar(hellobar._id).subscribe(data => {
      this.getHellobar();
    });
  }

  goBack() {
    this.createHelloBar = false;
    this.getHellobar();
  }

  createNewHellobar() {
    this.createHelloBar = true;
    this.selectedHellobar = null;
  }

  showHellobar() {
    this.getHellobar();
    this.createHelloBar = false;
  }

  getHellobar() {
    this.loading = true;
    this.adminService.getHellobar({
      limit: this.current_limit,
      page: this.current_page - 1
    }).subscribe(data => {
      console.log(data);
      this.totalCount=data.count;
      this.total_pages = Math.ceil(data.count / this.current_limit);
      this.loading = false;
      this.hellobarData = data.hellobar;
    })
  }

}
