import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { PlanService } from '../../../services/plan.service';
import { PremadeLayoutManager } from '../../../classes/premade-layout-manager';
declare var window: any;

@Component({
  selector: 'app-premade',
  templateUrl: './premade.component.html',
  styleUrls: ['./premade.component.css']
})
export class PremadeComponent extends PremadeLayoutManager implements OnInit {
  edit: boolean;
  @Input() data: any = {}
  constructor(public _planService: PlanService) {
    super();
    this.edit = false;
  }

  premades: any = [];
  changedFeatures: any = [];
  errorMessage = '';
  @Input() templates: any = [];
  loading: Boolean = false;
  edit_mode = false;
  componentInfo = {
    type: 'premades'
  }
  ngOnInit() {
    this._planService.getPlanTemplates()
      .subscribe(changedTemplates => {
        changedTemplates.forEach((template) => {
          let tempIndex = this.templates.findIndex(obj => obj['_id'] === template['_id']);
          if (tempIndex != -1) {
            this.templates[tempIndex]['active'] = template['active'];
            this.templates[tempIndex]['sub_features'].forEach((calc) => {
              if (calc['active'] != template['active']) {
                calc['active'] = template['active'];
                this.pushChanges(calc);
              }
            })
          }
        });
        this.updateCalcs(this.changedFeatures);
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.data, this.templates);
    if (this.data && this.data.premades) {
      this.premades = JSON.parse(JSON.stringify(this.data.premades));
      let templates = JSON.parse(JSON.stringify(this.templates));
      this.templates = this.modifyTemplates(templates, this.premades);
      delete this.premades;
      this.edit_mode = false;
    }
  }
  modifyTemplates(templates, premades) {
    return templates.map(template => {
      let temp = this.getModifiedTemplateName(template._id);
      template['sub_features'] = premades.filter(calc => calc['template'] == temp);
      return template;
    })
  }

  pushChanges(feature) {
    let index = this.changedFeatures.findIndex(obj => (obj['_id'] === feature['_id']));
    (index == -1) && this.changedFeatures.push(feature);
    (index != -1 && this.changedFeatures[index]['active'] == feature['active']) && this.changedFeatures.splice(index, 1);
    console.log(this.changedFeatures);
  }
  updateCalcs(calcs) {
    console.log(calcs);
    if (!calcs.length) {
      return;
    }
    this.loading = true;
    const login = <HTMLButtonElement>document.getElementById('btn-saveUser');
    login.disabled = true;
    login.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    this._planService.updateFeatures({ plan: this.data['plan']['_id'], featuresToUpdate: calcs, iteratee: 'premades' })
      .subscribe((data) => {
        login.disabled = false;
        login.innerHTML = 'Save';
        this.loading = false
        window.toastNotification('Premade Cals Updated');
        this.errorMessage = '';
        this.changedFeatures = [];
      }, error => {
        login.disabled = false;
        login.innerHTML = 'Save';
        // this.loading = false;
        // this.restoreState(this.premades,calcs);
        // this.errorMessage=error.error.err_message;
        // this.changedFeatures=[];
        this.loading = false;
        this.restoreState(this.templates, calcs);
        this.errorMessage = error.error.err_message;
        this.changedFeatures = [];
      })
  }
  editBack() {
    this.edit = !this.edit;
  }
}
