import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges } from '@angular/core';
import { PremadeLayoutManager } from '../../../../../../classes/premade-layout-manager';
import { AdminService } from '../../../../../../services/admin.service';

@Component({
  selector: 'app-company-features',
  templateUrl: './company-features.component.html',
  styleUrls: ['./company-features.component.css']
})
export class CompanyFeaturesComponent extends PremadeLayoutManager implements OnInit {

  edit: boolean = false;
  @Input() data: any = {}
  @Output() featureUpdates: EventEmitter<any> = new EventEmitter<any>();
  features: any = [];
  edit_mode = false;
  changedFeatures: any = [];
  loading: Boolean = false;
  errorMessage = '';
  componetInfo: any = {};
  constructor(public _adminService: AdminService) {
    super();
  }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    this.loading = true;
    if (this.data && this.data.features) {
      this.loading = false;

      this.features = JSON.parse(JSON.stringify(this.data.features));
      this.edit_mode = false;
    }
  }

  pushChanges(feature) {
    let index = this.changedFeatures.findIndex(obj => (obj['_id'] === feature['_id']));
    (index == -1 && feature['parent_feature']) && this.changedFeatures.push(feature);
    if (index == -1 && !feature['parent_feature']) {
      let obj = { _id: feature['_id'], name: feature['name'], parent_feature: null, active: feature['active'] };
      this.changeStatus(feature['sub_features'], feature.active);
      feature['sub_features'].forEach(element => {
        let i = this.changedFeatures.findIndex(obj => (obj['_id'] === element['_id']));
        i !== -1 && (this.changedFeatures[i] = element);
        i === -1 && this.changedFeatures.push(element);
      });
      this.changedFeatures.push(obj);
    }
    if (index != -1 && feature['parent_feature']) {
      this.changedFeatures.splice(index, 1);
    }
    if (index != -1 && !feature['parent_feature']) {
      this.changedFeatures.splice(index, 1);
      this.changeStatus(feature['sub_features'], feature.active);
      feature['sub_features'].forEach(element => {
        let i = this.changedFeatures.findIndex(obj => (obj['_id'] === element['_id']));
        i != -1 && this.changedFeatures.splice(i, 1);
      });
    }
    console.log(this.changedFeatures);
  }
  changeStatus(subFeatures, status) {
    subFeatures.forEach((feat) => {
      feat.active = status;
    })
  }
  updateFeatures(features) {
    const login = <HTMLButtonElement>document.getElementById('btn-saveUser');
    login.disabled = true;
    login.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    if (!features.length) {
      return;
    }
    this.loading = true;
    this._adminService.updateFeatures({ plan: this.data['plan'], features, company: this.data['company'] }, 'features')
      .subscribe(data => {
        login.disabled = false;
        login.innerHTML = 'Update';
        this.loading = false;
        this.editBack();
        if (data && data['features']) {
          this.featureUpdates.emit(this.changedFeatures);
        }
        this.errorMessage = '';
        // window.toastNotification('Features Updated');
        this.changedFeatures = [];
      }, error => {
        login.innerHTML = 'Update';
        this.loading = false;
        this.loading = false;
        this.restoreState(this.features, features);
        this.errorMessage = error.error.err_message;
        this.changedFeatures = [];
      });
  }
  editBack() {
    this.edit = !this.edit
  }

}
