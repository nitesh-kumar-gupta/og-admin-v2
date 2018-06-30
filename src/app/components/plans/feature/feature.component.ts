import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { PlanService } from '../../../services/plan.service';
import { PremadeLayoutManager } from '../../../classes/premade-layout-manager';
declare var window: any;

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent extends PremadeLayoutManager implements OnInit {
  edit: boolean;
  @Input() data: any = {}
  @Output() featureUpdates: EventEmitter<any> = new EventEmitter<any>();
  features: any = [];
  edit_mode = false;
  changedFeatures: any = [];
  loading: Boolean = false;
  errorMessage = '';
  componentInfo: any = {};
  constructor(public _planService: PlanService) {
    super();
    this.edit = false;
  }
  ngOnInit() {
    console.log("!!@#", this.data.features)
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.data && this.data.features) {
      this.features = JSON.parse(JSON.stringify(this.data.features));
      this.edit_mode = false;
    }
  }

  pushChanges(feature) {
    let index = this.changedFeatures.findIndex(obj => (obj['_id'] === feature['_id']));
    (index == -1 && feature['parent_feature']) && this.changedFeatures.push(feature);
    if (index == -1 && !feature['parent_feature']) {
      let obj = { _id: feature['_id'], parent_feature: null, name: feature['name'], active: feature['active'] };
      // let addableFeatures = feature['sub_features'].filter(obj=>(obj['active']!=feature['active']));
      this.changeStatus(feature['sub_features'], feature.active);
      //this.changedFeatures.push(obj,...feature['sub_features']);
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
      // if(feat['active']!=status){
      feat.active = status;
      // }
    })
  }
  updateFeatures(features) {
    if (!features.length) {
      return;
    }
    this.loading = true;

    this._planService.updateFeatures({ plan: this.data['plan']['_id'], featuresToUpdate: features, iteratee: 'features' })
      .subscribe(data => {
        this.loading = false;
        if (data && data['features'].length) {
          this.featureUpdates.emit(features);
        }
        window.toastNotification('features Updated');
        this.errorMessage = '';
        this.changedFeatures = [];
      }, error => {
        this.loading = false;
        this.restoreState(this.features, features);
        this.errorMessage = error.error.err_message;
        this.changedFeatures = [];
      });
  }
  editBack() {
    this.edit = !this.edit;
  }
}
