import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { PremadeLayoutManager } from '../../../../../../classes/premade-layout-manager';
import { AdminService } from '../../../../../../services/admin.service';
declare var window: any;
@Component({
  selector: 'app-company-premades',
  templateUrl: './company-premades.component.html',
  styleUrls: ['./company-premades.component.css']
})
export class CompanyPremadesComponent extends PremadeLayoutManager implements OnInit {
  edit: boolean = false;
  @Input() data: any = {}
  constructor(public _adminService: AdminService) {
    super();
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
    this._adminService.getCompanyTemplates()
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
  modifyTemplates(templates, premades) {
    return templates.map(template => {
      let temp = this.getModifiedTemplateName(template._id);
      template['sub_features'] = premades.filter(calc => calc['template'] == temp);
      return template;
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.data, this.templates);
    this.loading = true;
    if (this.data && this.data.premades) {
      this.loading = false;
      this.premades = JSON.parse(JSON.stringify(this.data.premades));
      let templates = JSON.parse(JSON.stringify(this.templates));
      this.templates = this.modifyTemplates(templates, this.premades);
      delete this.premades;
      this.edit_mode = false;
    }
  }


  pushChanges(feature) {
    // console.log(feature);
    let index = this.changedFeatures.findIndex(obj => (obj['_id'] === feature['_id']));
    (index == -1) && this.changedFeatures.push(feature);
    (index != -1 && this.changedFeatures[index]['active'] == feature['active']) && this.changedFeatures.splice(index, 1);
    console.log(this.changedFeatures);
  }
  updateCalcs(features) {
    const login = <HTMLButtonElement>document.getElementById('btn-saveUser');
    login.disabled = true;
    login.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    console.log(features);
    if (!features.length) {
      return;
    }
    this.loading = true;
    this._adminService.updateFeatures({ plan: this.data['plan'], features, company: this.data['company'] }, 'premades')
      .subscribe((data) => {
        login.disabled = false;
        login.innerHTML = 'Update';
        this.loading = false;
        this.editBack();
        this.loading = false
        window.toastNotification('Premade Cals Updated');
        this.errorMessage = '';
        this.changedFeatures = [];
      }, error => {
        login.disabled = false;
        login.innerHTML = 'Update';
        this.loading = false;
        this.loading = false;
        this.restoreState(this.templates, features);
        this.errorMessage = error.error.err_message;
        this.changedFeatures = [];
      })
  }
  editBack() {
    this.edit = !this.edit
  }
}
