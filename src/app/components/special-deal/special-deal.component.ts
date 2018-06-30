import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Datatable } from '../../classes/datatable.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ScriptService } from '../../services/script.service';
import { AdminService } from '../../services/admin.service';
import { COUPON_PRODUCT } from '../../constants/coupon.constants';
import { EmailValidator } from '../../validators/email.validator';

declare var jQuery;

@Component({
  selector: 'app-special-deal',
  templateUrl: './special-deal.component.html',
  styleUrls: ['./special-deal.component.css']
})
export class SpecialDealComponent extends Datatable implements OnInit,AfterViewInit {

  loading: boolean = true;
  dealCouponsLogs: any = [];
  selectedCoupon: any;
  DealCouponForm : FormGroup ;
  dealProduct = COUPON_PRODUCT;
  isError:boolean = false;
  modalError:string = "";
  buttonDisabled:boolean = true;
  totalCount:number;



  constructor(private _script:ScriptService,private adminService:AdminService,private fb: FormBuilder) {
    super();
    this.totalCount=0;
   }

  ngOnInit() {
    this.selectLog();
    this.dealCouponForm();
  }

  ngAfterViewInit(){
    this._script.load('datatables')
    .then((data) => {
    }).catch((error) => {
      console.log('Script not loaded', error);
    });

  }

  selectLog() {
    this.loading = true;
    this.adminService.getSpecialCouponCodeLogs(this.getParams()).subscribe(response => {
      this.loading = false;
      this.dealCouponsLogs = response.deal_coupons;
      this.totalCount=response.count;
      this.total_pages = Math.ceil(response.count / this.current_limit);
    });
  }

  getParams() {
    return {
      limit: this.current_limit,
      page: this.current_page - 1,
      search: this.search
    };
  }
  selectCoupon(index) {
    this.selectedCoupon = this.dealCouponsLogs[index];
    console.log(typeof this.selectedCoupon);
  }
  searchData() {
    super.searchData();
    this.selectLog();
  }

  generateKeys(obj) {
    console.log("obj", obj);
    return Object.keys(obj);
  }
  dealCouponForm(){
    this.DealCouponForm = this.fb.group({
         name : ['', Validators.compose([Validators.required])],
         email : ['', Validators.compose([Validators.required, EmailValidator.format])],
         product : ['', Validators.compose([Validators.required])],
         source: ['', Validators.compose([Validators.required])],
    });
    this.modalEvent("dealCouponCreate")
}

generateDealCoupon(){
  jQuery('#dealCouponButton').attr("disabled",true);
  let data = {
    ccustemail: this.DealCouponForm.value.email,
    ccustname: this.DealCouponForm.value.name,
    cproditem: this.DealCouponForm.value.product,
    source: this.DealCouponForm.value.source,
    ctransaction: "SALE",
    event_request: "Admin"
  }

  this.adminService.generateDealCoupon(data)
  .subscribe(response => {
      this.dealCouponForm();
      this.isError = true;
      this.modalError = response.coupon || response.message;
  },
  error=>{
    console.log(error)
  })
}

modalEvent(modal){
jQuery(`#${modal}`).on('shown.bs.modal', function (e) {
  this.isError = false;
});

jQuery(`#${modal}`).on('hidden.bs.modal', function () {
  console.log("hjkj");
    jQuery(this).find("input,textarea,select").val('').end();
});
}

}
