import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PlanService } from '../../services/plan.service';

declare var bootbox: any;

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {

  @ViewChild('selectBox') selectBox: ElementRef;
  plansData: any = new Map();
  constructor(public _planService: PlanService) { }
  selectedPlan: any;
  templates: any = [];
  plansInfo: any = {};
  loading: Boolean = false;

  ngOnInit() {
    this.getPlanFeatures();
  }
  getPlanFeatures() {
    this.loading = true;
    this._planService.getIntialPlanData().subscribe((data) => {
      console.log("new data", data);
      this.loading = false;
      this.plansInfo['planTypes'] = data['planTypes'];
      this.selectedPlan = data['pfeatures'];
      this.plansInfo.isPlanSelected = false;
      (this.selectedPlan) && (this.templates = this.getFeatures(this.selectedPlan['features'], 'templates'));
      this.plansData.set(this.selectedPlan['plan']['_id'], this.selectedPlan);
    }, error => {
      this.loading = false;

    })
    // this._planService.getAllPlans().subscribe(data => {
    //   console.log(data);
    //   this.loading=false;
    //   this.plansData = data;
    //   (this.plansData.length) && (this.selectedPlan = this.plansData[0],
    //     this.plansInfo.planTypes=this.getPlanTypes(),
    //     this.plansInfo.planNames=this.getPlanNames());
    //     this.plansInfo.isPlanSelected = false;
    //     this.plansInfo.mappedPlanTypes=this.mapPlansAccTypes(this.plansData);
    //   (this.selectedPlan) && (this.templates = this.getFeatures(this.selectedPlan['features'], 'templates'));
    // },error=>{
    //   this.loading=false;
    //   console.log(error.error);
    // })
  }
  planChanged(plan) {
    if (plan == -1) {
      this.plansInfo.isPlanSelected = false;
      return;
    }
    this.plansInfo.isPlanSelected = true;
    if (!this.plansData.has(plan)) {
      this.fetchPlanFeatures(plan);
      // this.selectedPlan = this.plansData.find(planData => {
      //   return (planData['plan']['_id'] === plan)
      // });
      // this.templates = this.getFeatures(this.selectedPlan['features'], 'templates');

    } else {
      this.selectedPlan = this.plansData.get(plan);
      this.templates = this.getFeatures(this.selectedPlan['features'], 'templates');
    }
  }
  fetchPlanFeatures(plan) {
    // this.loading=true;
    this._planService.fetchPlanFeatures(plan).subscribe((data) => {
      // this.loading=false;
      if (data['plan']) {
        this.selectedPlan = data;
        (this.selectedPlan) && (this.templates = this.getFeatures(this.selectedPlan['features'], 'templates'));
        this.plansData.set(this.selectedPlan['plan']['_id'], this.selectedPlan);
      }
    }, error => {
      this.loading = false;
      console.log("Error", error.error.err_message);
    });
  }
  // updateSelectedPlan(changes) {
  //   if (changes.length > 0) {
  //     this.templates = this.getFeatures(changes, 'templates');
  //   }
  // }
  getPlanTypes() {
    return this.plansData.reduce((acc, obj) => {
      if (!acc.includes(obj['plan']['plan_type']))
        acc.push(obj['plan']['plan_type']);
      return acc;
    }, [])
  }
  getPlanNames() {
    return this.plansData.map(plan => ({ id: plan['plan']['_id'], text: plan['plan']['name'] }));
  }
  emitChanges(changes) {
    changes = changes.filter(obj => obj['parent_feature'] === 'templates');
    changes.length && this._planService.planTemplates.next(changes);
  }
  getFeatures(features, parentFeature) {
    let item = features.find(feature => {
      return feature['_id'] === parentFeature;
    });
    return (item ? item['sub_features'] : []);
  }
  changeSelection(data) {
    if (data['isPlanExists']) {
      this.popUp('Plan created in ChargeBee');
      // this.selectedPlan=this.plansData.find(plan=>{
      //   return (plan['plan']['_id']===data['plan']);
      // });
      this.selectedPlan = this.plansData.get(data['plan']);
    } else {
      // this.plansData.push(data);
      // this.plansInfo['mappedPlanTypes'][data['plan']['plan_type']].push({id:data['plan']['_id'],text:data['plan']['name']})
      // this.plansInfo.planNames.push({id:data['plan']['_id'],text:data['plan']['name']});   
      // this.selectedPlan=this.plansData[this.plansData.length-1];   
      this.plansData.set(data['plan']['_id'], data);
      this.selectedPlan = data;
      let typeIndex = this.plansInfo.planTypes.findIndex((type) => type['_id'] === data['plan']['plan_type']);
      (typeIndex != -1) && (this.plansInfo.planTypes[typeIndex]['names'].push({ id: data['plan']['_id'], text: data['plan']['name'] }))
    }

    // this.plansInfo.planTypes=[...this.plansInfo.planTypes];
    this.plansInfo.isPlanSelected = true;
    setTimeout(() => {
      this.selectBox.nativeElement.value = this.selectedPlan['plan']['_id'];
    }, 0);
    console.log('>>>>>>>>>>>>>>>>>>>>>', this.selectBox.nativeElement.value);
    this.templates = this.getFeatures(this.selectedPlan['features'], 'templates');
  }
  popUp(message) {
    bootbox.dialog({
      closeButton: false,
      message: `<button type="button" class="bootbox-close-button close" data-dismiss="modal"
                                 aria-hidden="true" style="margin-top: -10px;">
                                 <i class="material-icons">close</i></button>
                              <div class="bootbox-body-left">
                                    <div class="mat-icon">
                                      <i class="material-icons">error</i>
                                    </div>
                                </div>
                                <div class="bootbox-body-right">
                                  <p>${message}</p>
                                </div>
                    `,
      buttons: {
        success: {
          label: "OK",
          className: "btn btn-ok btn-hover",
          callback: function () {
          }
        }
      }
    });
  }
  updatePlan(data) {
    let planData = this.plansData.get(data['_id']);
    planData && (planData['plan'] = data, this.plansData.set(data['_id'], planData));
    // let planIndex =  this.plansData.findIndex(p=>(p['plan']['_id']===data['_id']));
    // planIndex!=-1 && (this.plansData[planIndex]['plan']=data);
  }
  mapPlansAccTypes(plans) {
    return plans.reduce((acc, p) => {
      acc[p['plan']['plan_type']] ?
        acc[p['plan']['plan_type']].push({ id: p['plan']['_id'], text: p['plan']['name'] }) :
        (acc[p['plan']['plan_type']] = [{ id: p['plan']['_id'], text: p['plan']['name'] }]);
      return acc;
    }, {});
  }

}
