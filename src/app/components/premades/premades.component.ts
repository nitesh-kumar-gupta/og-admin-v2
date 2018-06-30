import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { ScriptService } from '../../services/script.service';
import { Datatable } from '../../classes/datatable.class';
import { PremadesService } from '../../services/premades.service';

declare var jQuery: any;
declare var moment: any;
@Component({
  selector: 'app-premades',
  templateUrl: './premades.component.html',
  styleUrls: ['./premades.component.css']
})
export class PremadesComponent extends Datatable implements OnInit {
  totalCount: any;
  tierFilter: Array<Object>;
  industryFilter: Array<Object>;
  typeFilter: Array<Object>;
  templateFilter: Array<Object>;
  enumValues: any;
  eventTypeValue: Array<Object>;
  showFilter: boolean;
  conditions: Array<any> = [];
  condition: Object;
  operators: {};
  filterFields: { premades: { value: string; name: string; }[]; };
  loadingPremades: boolean;
  edit: boolean;
  selectedItem: any;
  calculatorForm: FormGroup;
  calculators: any = [];
  rejectedCalcs: any = [];
  $subscription;
  errorMessage = '';;
  loader = false;
  mt = moment;

  domain = '';
  fetchedApps = [];
  @ViewChild('fileUpload') fileUpload: any;
  industries = ['Auto', 'Education', 'Finance', 'Health & Fitness'
    , 'Legal', 'Marketing & Advertising', 'Publishing'
    , 'Quintessential', 'Real Estate & Construction', 'Technology'
    , 'Travel', 'TV and Entertainment', 'Trending'];
  templates = [];
  // templates= [
  //   ['one-page-card-new','Chicago'],
  //   ['sound-cloud-v3','Londoner'],
  //   ['template-seven','Seattle'],
  //   ['inline-temp-new','Greek'],
  //   ['experian','Tokyo'],
  //   ['template-five','Madrid'],
  //   ['template-six','Stockholm'],
  //   ['template-eight',]
  // ];
  scriptLoaded = false;
  constructor(public _fb: FormBuilder,
    public premadeService: PremadesService,
    public _adminService: AdminService,
    public _script: ScriptService) {
    super();
    this.filterFields = {
      premades: [
        {
          value: 'title',
          name: 'Name'
        },
        {
          value: 'tier',
          name: 'Tier'
        },
        {
          value: 'type',
          name: 'Type'
        },
        {
          value: 'template',
          name: 'Template'
        },
        {
          value: 'industry',
          name: 'Industry'
        },
        {
          value: 'launch_date',
          name: 'Launch date'
        },
        {
          value: 'createdAt',
          name: 'Created At'
        },
        // {
        //   value:'count',
        //   name:'App Count'
        // }
      ]
    }
    this.typeFilter = [
      {
        id: 'Outcome Quiz',
        itemName: 'OUTCOME QUIZ'
      },
      {
        id: 'Calculator',
        itemName: 'CALCULATOR'
      },
      {
        id: 'Graded Quiz',
        itemName: 'GRADED QUIZ'
      },
      {
        id: 'Poll',
        itemName: 'POLL'
      },
    ]
    this.industryFilter = [];
    this.industries.forEach((industry) => {
      const obj = {
        id: industry,
        itemName: industry
      }
      this.industryFilter.push(obj)
    })
    this.tierFilter = [
      {
        id: 'standard',
        itemName: 'STANDARD'
      },
      {
        id: 'premium',
        itemName: 'PREMIUM'
      }
    ]
    this.operators = {
      title: this.stringOperators,
      tier: this.fixedValueOperator,
      type: this.fixedValueOperator,
      template: this.fixedValueOperator,
      industry: this.fixedValueOperator,
      launch_date: this.numberOperators,
      createdAt: this.numberOperators
    }
  }

  ngOnInit() {

    this.calculatorForm = this.premadeService.getForm();
    this.getCalculators();
  }
  ngAfterViewInit() {
    this._script.load('daterangepicker')
      .then((data) => {
        console.log(data);
        this.scriptLoaded = true;
      })
  }
  getCalculators(query = null) {
    this.loadingPremades = true;
    let obj = {
      limit: this.current_limit,
      page: this.current_page - 1,
      searchKey: this.search,
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
    this.premadeService.getCalculators(obj).subscribe((response) => {
      this.loadingPremades = false;
      this.total_pages = Math.ceil(response.count / this.current_limit);
      this.calculators = response.calculators;
      if (this.calculators)
        this.totalCount = response.count
      this.errorMessage = '';
      this.templates = this._adminService.availableTemplates;
      this.templateFilter = [];
      this.templates.forEach((template) => {
        const obj = {
          id: template.selector,
          itemName: template.name
        };
        this.templateFilter.push(obj)
      })
      this.enumValues = {
        tier: this.tierFilter,
        type: this.typeFilter,
        template: this.templateFilter,
        industry: this.industryFilter
      }
      this.condition = {
        fields: this.filterFields,
        operators: this.operators,
        selected_field: 'title',
        selected_operator: 'equals',
        multiselectItems: this.enumValues,
        stringValue: '',
        numberValue: {
          value1: '0',
          value2: '1'
        },
        multiSelectSelected: [],
        fixedvalue: ''
      }
    }, error => {
      this.loadingPremades = false;
      this.errorMessage = error.message;
      console.log("Error: ", error);
    })
  }
  addCalculator(data, btn) {
    let calculatorData = Object.assign(data, this.extractData(data['live_url']));
    if (calculatorData['subdomain'] && calculatorData['calcName']) {
      this.requestToAdd([calculatorData], false, btn);
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Not Valid urls..';
    }
  }
  updateCalculator(data, btnRef) {
    btnRef && this.changeButtonProps(btnRef, { textContent: 'Please wait...', disabled: true });

    this.$subscription = this.premadeService.updateCalculator(Object.assign({}, this.selectedItem, data, this.extractData(data['live_url'])))
      .subscribe((response) => {
        console.log("Response", response);
        if (Object.keys(response).length == 0) {
          this.calculatorRejected();
          return;
        }
        else
          this.calculatorAdded();
        this.getCalculators();
        btnRef && this.changeButtonProps(btnRef, { textContent: 'Update', disabled: false });

      }, error => {
        this.errorMessage = error.error.err_message;
        btnRef && this.changeButtonProps(btnRef, { textContent: 'Update', disabled: false });

      });

  }
  calculatorRejected() {
    this.errorMessage = 'This calculator does not exists';
    this.calculatorForm.get('live_url').setValue('');
  }
  calculatorAdded() {
    jQuery("#add-calc").modal('hide');
    this.errorMessage = '';
  }
  requestToAdd(calculators, multi = false, btnRef: any = '') {
    if (calculators.length > 0) {
      (btnRef) &&
        this.changeButtonProps(btnRef, { textContent: 'Please wait...', disabled: true });
      this.$subscription = this.premadeService.addPremadeCalc(calculators).subscribe((response) => {
        console.log(response['not_created'])
        let rejects = response['not_created'].map(obj => {
          return obj['live_url'];
        })
        this.rejectedCalcs = [...this.rejectedCalcs, ...rejects];
        if (!multi && rejects.length > 0) {
          this.calculatorRejected();
          return;
        }
        if (!multi && response['created'].length == 1) {
          this.calculatorAdded();
          this.rejectedCalcs = [];
        };
        this.calculatorForm.reset();
        this.getCalculators();
        (btnRef) &&
          this.changeButtonProps(btnRef, { textContent: 'Add' });
      }, error => {
        this.errorMessage = error.error.message;
        this.changeButtonProps(btnRef, { textContent: 'Add' });
      })
      this.errorMessage = '';
    } else {
      this.errorMessage = 'There is no calculators to add';
    }
  }
  changeButtonProps(ref, prop = {}) {
    Object.keys(prop).forEach(key => {
      ref[key] = prop[key];
    })
  }
  fileChange(event) {
    this.rejectedCalcs = [];
    let files: FileList = event.target.files;
    if (files && files.length > 0) {
      let file: File = files.item(0);
      if (file.type == 'text/csv') {
        let reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
          let csv: string = reader.result;
          this.csvToCalculators(csv);
        }
        this.errorMessage = '';
      } else this.errorMessage = 'Only Csv files are allowed...';

    } else this.errorMessage = 'No file selected..';

  }
  csvToCalculators(csv) {
    let lines = csv.split('\n');
    if (lines.length > 0) {
      let calculators = lines.reduce((acc, line) => {
        let row = line.split(',');
        if (row[1] && !this.testliveUrl(row[1])) {
          this.rejectedCalcs.push(row[1]);
          return acc;
        }
        if (!row[1]) return acc;
        let template = this.getTemplateType(row[4], 'name');
        let obj = {
          title: row[0],
          live_url: row[1],
          media: row[2],
          type: (typeof (row[3]) == 'string' || row[3]) ? (row[3].trim() ? row[3] : 'Calculator') : 'Calculator',
          template: template,
          industry: (typeof (row[5]) == 'string' || row[5]) ? (row[5].trim() ? row[5] : 'Auto') : 'Auto',
          tier: (typeof (row[6]) == 'string' || row[6]) ? (row[6].trim() ? row[6] : 'standard') : 'standard',
          description: row[7]
        };
        obj = Object.assign(obj, this.extractData(obj['live_url']));
        if (obj['subdomain'] && obj['calcName']) acc.push(obj);
        else if (obj && Object.keys(obj).length > 1) {
          this.rejectedCalcs.push(row[1]);
        }
        return acc;
      }, []);
      this.errorMessage = '';
      console.log(calculators);
      this.requestToAdd(calculators, true);
    } else {
      this.errorMessage = "No data in this file";
    }
  }
  extractData(value) {
    if (!value) return {};
    let obj = {};
    value = value.replace(/^(http|https|ftp)?(:\/\/)/igm, '');
    let arr = value.split('/');
    obj['calcName'] = arr[1];
    obj['subdomain'] = arr[0] ? arr[0].split('.')[0] : null;
    return obj;
  }
  testliveUrl(url) {
    return (/^(http|https|ftp)?(:\/\/)?([a-zA-Z0-9]+){3,}(\.)(outgrow|rely)(\.)(local|us|co|co.in)\/([a-zA-Z0-9_-]+)$/.test(url));
  }

  dateFormat(date: any) {
    let d = new Date(date);
    return d.toString().split('GMT')[0];
  }

  // searchData() {
  //   super.searchData();
  //   this.getCalculators();
  // }
  removeCalculator(id) {
    this.premadeService.removeCalculator(id).subscribe((data) => {
      this.getCalculators();
    })
  }
  getTemplateType(name, prop) {
    if (!name) return this.templates[0][(prop == 'selector') ? 'name' : 'selector'];
    let item = this.templates.find((value) => {
      if (prop == 'name') {
        return value[prop] == `The ${name}`
      }
      return value[prop] == name;
    })
    return item[(prop == 'selector') ? 'name' : 'selector'];
  }
  editCalculator(index) {
    console.log(this.calculators[index]);
    this.selectedItem = this.calculators[index];
    console.log(this.selectedItem);
    this.premadeService.setForm(this.selectedItem);
    // this.selectedItem['launch_date'] && (jQuery('.input-daterange-datepicker').data('daterangepicker').setStartDate(moment(this.selectedItem['launch_date']).utc().add(0, 'days').format('MM/DD/YYYY')),
    // jQuery('.input-daterange-datepicker').data('daterangepicker').setEndDate(moment(this.selectedItem['launch_date']).utc().add(0, 'days').format('MM/DD/YYYY')));
    // this.selectedItem['launch_date'] || (jQuery('.input-daterange-datepicker').data('daterangepicker').setStartDate(moment(new Date()).utc().add(0, 'days').format('MM/DD/YYYY')),
    // jQuery('.input-daterange-datepicker').data('daterangepicker').setEndDate(moment(new Date()).utc().add(0, 'days').format('MM/DD/YYYY'))
    // );

    this.edit = true;
    this.errorMessage = '';
    this.loader = false;
  }
  upload(files: FileList, imgSrc: any) {
    // console.log(files);
    // let file: File = files.item(0);
    // if (file.type.startsWith('image/')) {
    //   this.loader = true;
    //   //let reader: FileReader = new FileReader();
    //   this.uploadImageToServer(file);
    // reader.readAsDataURL(file);
    // reader.onload = (e:any) => {
    //     console.log(e.target.result);
    //     imgSrc.src=e.target.result;

    // }
    // reader.addEventListener('progress',e=>{
    //   if(e.lengthComputable){
    //     console.log(e.loaded);

    //   }
    // },false);
    // this.errorMessage='';
    // }
  }
  // uploadImageToServer(url) {
  //   this._adminService.uploadGif(url).subscribe((data) => {
  //     this.loader = false;
  //     console.log(data);
  //     this.calculatorForm.get('media').setValue(data);
  //   }, error => {
  //     this.loader = false;
  //     this.calculatorForm.get('media').setValue('');
  //     console.log(error.error);
  //     this.errorMessage = error.error.err_message;
  //   })
  // }
  // setLaunchDate(date) {
  //   console.log(date);
  //   this.calculatorForm.get('launch_date').setValue(date['start_date']);
  // }
  // fetchApps(id){
  //   this._adminService.getAppsCreatedByPremade(id).subscribe(res=>{
  //     this.fetchedApps = res;
  //     // this.domain=this.getDomain();
  //   },error=>{

  //  })
  // }
  // getLink(sub_domain,url){
  //   return `${environment.PROTOCOL}${sub_domain}.${environment.LIVE_EXTENSION}/${url}`;
  // }

  addCondition() {
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  applyFilter() {
    this.current_page = 1;
    this.getCalculators(this.conditions);
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

