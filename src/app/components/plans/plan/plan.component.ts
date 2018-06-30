import { Component, OnInit, Input, Output, EventEmitter, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SelectComponent } from 'ng2-select';
import { PlanService } from '../../../services/plan.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  edit: boolean;
  @Input() data: any;
  planData: FormGroup;
  @Input() plansInfo: any = [];
  @Output() planAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() planUpdates: EventEmitter<any> = new EventEmitter<any>();
  @ViewChildren('selects') selections: SelectComponent[];
  loading = false;
  errorMessage = '';
  constructor(private _fb: FormBuilder, private _planService: PlanService) {
    this.edit = false;
  }
  planDetails: any = {
    users: 0,
    calculators: 0,
    templates: 0,
    visits: 0
  }
  cycles = [
    { id: 'month', text: 'month(s)' },
    { id: 'year', text: 'year(s)' },
    { id: 'week', text: 'week(s)' }
  ]
  ngOnInit() {
    this.planData = this._fb.group(this.getFormFields());
  }
  ngOnChanges() {
    this.planDetails = Object.assign({}, this.data);
  }
  getFormFields() {
    return {
      _id: ['new_plan', Validators.compose([Validators.required, this.planIdFormat])],
      name: ['New Plan', Validators.required],
      invoice_name: ['', Validators.required],
      plan_type: 'default',
      source_plan: [''],
      companies: [0, Validators.required],
      leads: [0, Validators.required],
      visits: [0, Validators.required],
      templates: [0, Validators.required],
      calculators: 0,
      users: [0, Validators.required],
      description: [''],
      price: ['', Validators.required],
      period: ['', Validators.required],
      period_unit: ['', Validators.required]
    }
  }
  planIdFormat(control: FormControl) {
    let id = control.value;
    if (!/^\b([^_.])+?_(m|y|w|d)(_{1}.+)?\b/.test(id)) {
      return { invalidIdFormat: true };
    }
    return null;
  }
  updatePlan(details) {
    const login = <HTMLButtonElement>document.getElementById('btn-saveUser');
    login.disabled = true;
    login.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    let isDetailsChanged = false;
    let keys = Object.keys(details);
    for (let i = 0; i < keys.length; i++) {
      if (details[keys[i]] != this.data[keys[i]]) {
        isDetailsChanged = true;
        break;
      }
    }
    if (isDetailsChanged) {
      this.loading = true;
      let $ref = this._planService.updatePlan(details).subscribe(result => {
        login.disabled = false;
        login.innerHTML = 'Update';
        this.loading = false;
        this.planUpdates.emit(result);
        $ref.unsubscribe();
      }, error => {
        login.disabled = false;
        login.innerHTML = 'Update';
        this.loading = false;
        $ref.unsubscribe();
      })
    } else {
      //alert('no changes')
      login.disabled = false;
      login.innerHTML = 'Update';
    }
  }
  onPlanTypeSelected(e) {
    this.planData.get('plan_type').setValue(e.id);
  }
  createPlan(data, createButton, closeButton) {
    console.log(data);
    createButton.textContent = 'Please Wait....';
    createButton.disabled = true;
    data['price'] = data['price'] * 100;
    this._planService.createPlan(data).subscribe(result => {
      if (result['isPeriodBased'] == false) {
        alert('Plan Id should contains either one of these[_y,_d,_m]');
      }
      createButton.textContent = 'Create';
      createButton.disabled = false;
      closeButton.click();
      this.planAdded.emit(result);
      this.errorMessage = 'no_error';
    }, error => {
      console.log(error.error.err_message);
      this.errorMessage = error.error.err_message;
      createButton.textContent = 'Create';
      createButton.disabled = false;
    });
  }
  onPlanSelected(e) {
    this.planData.get('source_plan').setValue(e.id);
  }
  onPlanDeselect(e) {
    this.planData.get('source_plan').setValue('');
  }
  resetForm() {
    this.planData.reset({
      calculators: 0, companies: 0, leads: 0, visits: 0, templates: 0, users: 0
    });
    console.log(this.selections);
    this.selections.forEach(s => {
      s.active = [];
    })

  }
  getTypes() {
    return this.plansInfo.planTypes.map(t => ({ id: t._id, text: t._id }));
  }
  getPlanNames() {
    return this.plansInfo.planTypes.reduce((acc, t) => {
      if (t['names'] && t['names'].length)
        return [...acc, ...t['names']];
      return acc;
    }, [])
  }
  editBack() {
    this.edit = !this.edit;
  }
}
