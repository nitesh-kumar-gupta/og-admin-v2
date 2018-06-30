import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ScriptService } from '../../services/script.service';
import { Datatable } from '../../classes/datatable.class';
import { SelectComponent, SelectItem } from 'ng2-select';
import { FeaturesService } from '../../services/features.service';
import { PlanService } from '../../services/plan.service';

declare var jQuery: any;
declare var moment: any;

@Component({
  selector: 'app-all-features',
  templateUrl: './all-features.component.html',
  styleUrls: ['./all-features.component.css']
})
export class AllFeaturesComponent extends Datatable implements OnInit {
  showFilter: any;
  conditions: any;
  condition: any;
  operators: any;
  filterFields: { feature: { value: string; name: string; }[]; };
  totalCount: any;
  selectedItem: String = 'features';
  @ViewChildren('selections') public ngSelect: SelectComponent[];
  featureForm: FormGroup;
  edit: boolean;
  loadingFeatures: Boolean = false;
  errorMessage = '';
  plans = [];
  selectedPlans = [];
  disableSelection: Boolean = false;
  oldFeature: any = {};
  constructor(public featuresService: FeaturesService,
    public _planService: PlanService,
    public _script: ScriptService) {
    super();
    this.filterFields = {
      feature: [
        {
          value: '_id',
          name: 'Feature'
        },
        {
          value: 'name',
          name: 'Name',
        },
        {
          value: 'heading',
          name: 'Heading'
        },
        {
          value: 'description',
          name: 'Description'
        },
        {
          value: 'createdAt',
          name: 'Created At'
        },
        {
          value: 'launch_date',
          name: 'Launch Date'
        }
      ]
    }
    this.operators = {
      _id: this.stringOperators,
      name: this.stringOperators,
      heading: this.stringOperators,
      description: this.stringOperators,
      createdAt: this.numberOperators,
      launch_date: this.numberOperators
    }
    this.condition = {
      fields: this.filterFields,
      operators: this.operators,
      selected_field: '_id',
      selected_operator: 'equals',
      stringValue: '',
      numberValue: {
        value1: '0',
        value2: '1'
      },
      fixedvalue: ''
    };
  }
  features: any = [];
  ngOnInit() {
    this.featureForm = this.featuresService.getForm();
    this._planService.getPlanTypes().subscribe((data) => {
      console.log(data);
      Object.keys(data).forEach((key: any) => {
        this.plans.push(...(data[key].map(obj => {
          obj['id'] = obj['_id'];
          obj['text'] = obj['name'];
          delete obj['_id'];
          delete obj['name'];
          delete obj['plan_type'];
          return obj;
        })));
      });
      console.log(this.plans);
    })
    this.getFeatures();
  }
  getFeatures(query = null) {
    this.loadingFeatures = true;
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      query: null
    };
    if (query) {
      const que = query.map(q => ({
        selected_field: q.selected_field,
        selected_operator: q.selected_operator,
        stringValue: q.stringValue,
        numberValue: q.numberValue,
        multiSelectSelected: q.multiSelectSelected,
        fixedvalue: q.fixedvalue
      }));
      obj.query = que;
    }
    let $ref = this.featuresService.getFeatures(obj)
      .subscribe(response => {
        this.loadingFeatures = false;
        this.features = response['features'];
        if (this.features)
          this.totalCount = response.count
        this.total_pages = Math.ceil(response.count / this.current_limit);
        $ref.unsubscribe();
      }, error => {
        $ref.unsubscribe();
      })
  }
  fileChange(event) {
    this.featuresService.fileReader(event).subscribe(csv => {
      //console.log(csv);
      let features = this.csvToFeatures(csv);
      console.log(features);
      this.addFeatures(features);
    }, error => {
      console.log(error);
    })
  }
  csvToFeatures(csv) {
    let lines = csv.split('\n');
    let keys = lines[0].split(',').map(key => key.trim());
    lines.splice(0, 1);
    lines = lines.reduce((acc, line, index) => {
      let values = line.split(',').map(val => val.trim());
      let validLine = values.some(value => value);
      let invalid = false;
      let validationKeys = ['_id'];
      if (validLine) {
        let obj = keys.reduce((acc, key, index) => {
          if (invalid) return;
          acc[key] = values[index];
          if (key == 'plans') {
            acc[key] = values[index] ? values[index].split(' ') : [];
          }
          if (key == 'parent_feature' && values[index] == 'null') {
            acc[key] = null;
          }
          if (validationKeys.includes(key) && !values[index]) {
            acc = {};
            invalid = true;
          }
          return acc;
        }, {});
        obj && obj['_id'] && acc.push(obj);
      }
      return acc;
    }, []);
    return lines;
  }
  editFeature(index) {
    this.featuresService.setForm(this.features[index]);
    this.oldFeature = JSON.parse(JSON.stringify(this.features[index]));
    this.edit = true;
  }
  addfeature(obj) {
    obj['parent_feature'] = obj['parent_feature'] || null;
    obj['plans'] = this.selectedPlans;
    this.disableSelection = true;
    this.addFeatures([obj]);
  }
  addFeatures(arr) {
    if (Object.prototype.toString.call(arr) == '[object Array]' && arr.length > 0) {
      this.featuresService.addFeatures(arr).subscribe((data) => {
        console.log(data);
        if (data && data['invalidFeatures'].length) {
          this.errorMessage = `Feature already exist or parent feature doesn't exists`;
          return;
        }
        this.featureAdded();
        this.getFeatures();
      }, error => {
        this.disableSelection = false;
        this.errorMessage = error.error.err_message;
      })
    }
  }
  removeFeature(feature) {
    this.featuresService.removeFeature(feature).subscribe(data => {
      console.log(data);
      this.getFeatures();
    })
  }
  updatefeature(obj) {
    console.log(obj);
    // return;
    let keys = Object.keys(obj).reduce((acc, key) => {
      if (this.oldFeature[key] != obj[key]) {
        acc.push(key);
      }
      return acc
    }, []);
    if (keys.length) {
      obj['parent_feature'] = obj['parent_feature'] || null;
      this.featuresService.updateFeature({ feature: obj, oldFeature: this.oldFeature, keys })
        .subscribe((data) => {
          console.log(data);
          this.featureAdded();
          this.getFeatures();
        }, error => {
          this.errorMessage = error.error.err_message;
        });
    } else {
      console.log('no-changes');
    }
  }
  featureAdded() {
    jQuery("#add-feature").modal('hide');
    this.resetPlans();
    this.errorMessage = '';
  }
  currentSelections(event) {
    console.log(event);
    this.selectedPlans = event.map(obj => {
      return obj['id'];
    });
  }
  resetPlans() {
    if (this.ngSelect) {
      this.ngSelect.forEach(s => (s.active = []));
      this.selectedPlans = [];
    }
    this.disableSelection = false;
    this.errorMessage = '';
  }
  mediaType(e) {
    this.featureForm.get('media_type').setValue(e.id);
  }


  addCondition() {
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  applyFilter() {
    this.current_page = 1;
    this.getFeatures(this.conditions);
  }

  showFilters() {
    this.showFilter = !this.showFilter;
    this.conditions = [];
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }
  initDatePcker(pos: number) {
    const obj = {
      'startDate': moment(new Date()).subtract(10, 'days').format('MM/DD/YYYY'),
      'endDate': moment(new Date()).format('MM/DD/YYYY'),
      'opens': 'left',
      'drops': 'down',
      'autoApply': true,
    };
    if (this.conditions[pos].selected_field === 'createdAt' || this.conditions[pos].selected_field === 'launch_date') {
      this.conditions[pos].numberValue = {
        value1: moment(new Date()).subtract(1, 'days').format('MM/DD/YYYY'),
        value2: moment(new Date()).format('MM/DD/YYYY')
      };
      if (this.conditions[pos].selected_operator !== 'between') {
        obj['singleDatePicker'] = true;
      }
      setTimeout(() => {
        jQuery('.dpkr_' + pos).daterangepicker(obj, (start, end, label) => {
          this.conditions[pos].numberValue = {
            value1: start.format('MM/DD/YYYY'),
            value2: end.format('MM/DD/YYYY')
          };
        });
      }, 1000);
    } else {
      this.conditions[pos].numberValue = {
        value1: '0',
        value2: '1'
      };
    }
  }
}
