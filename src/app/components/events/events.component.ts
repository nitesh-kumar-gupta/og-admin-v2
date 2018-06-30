import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Datatable } from '../../classes/datatable.class';
import { ScriptService } from '../../services/script.service';
import { EventsService } from '../../services/events.service';

declare var jQuery: any
declare var window: any;
declare var bootbox: any;
declare var moment: any;

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent extends Datatable implements OnInit {
  totalCount: any;
  enumValues: any;
  eventTypeValue: Array<Object>;
  showFilter: boolean;
  conditions: Array<any> = [];
  condition: Object;
  operators: {};
  filterFields: { event: { value: string; name: string; }[]; };
  data: Object = [];
  edit: boolean;
  errorMessage = '';
  events: any = [];
  eventForm: FormGroup;
  loadingEvents: boolean = false;
  loader = false;
  mt = moment;
  newEvent: any;
  selectedItem: any;
  scriptLoaded: boolean = false;
  showAdvancedFilter: boolean = false;
  filters: any = [];
  filter = {
    event: [
      { name: "Event Name", id: "event_name" },
      { name: "Description", id: "description" },
      { name: "Event Type", id: "event_type" },
      { name: "Launch Date", id: "launch_date" },
      { name: "Created At", id: "created_at" }
    ],
    selected_property: "",
    selected_operator: "",
    selected_property_category: "",
    selected_property_type: "",
    selected_value: {},
    visible: true
  };
  @ViewChild('fileUpload') fileUpload: any;

  constructor(private _eventsService: EventsService, private fb: FormBuilder, private _script: ScriptService) {
    super();
    this.totalCount = 0;
    this.filterFields = {
      event: [
        {
          value: 'event_name',
          name: 'Event name'
        },
        {
          value: 'description',
          name: 'Description'
        },
        {
          value: 'event_type',
          name: 'Event Type'
        },
        {
          value: 'launch_date',
          name: 'Launch Date'
        },
        {
          value: 'createdAt',
          name: 'Created At'
        }
      ]
    }
    this.eventTypeValue = [
      {
        id: 'premium',
        itemName: 'PREMIUM'
      },
      {
        id: 'standard',
        itemName: 'STANDARD'
      }
    ]

    this.operators = {
      event_name: this.stringOperators,
      description: this.stringOperators,
      event_type: this.fixedValueOperator,
      launch_date: this.numberOperators,
      createdAt: this.numberOperators
    }
    this.enumValues = {
      event_type: this.eventTypeValue
    }
    this.condition = {
      fields: this.filterFields,
      operators: this.operators,
      selected_field: 'event_name',
      selected_operator: 'equals',
      multiselectItems: this.enumValues,
      stringValue: '',
      numberValue: {
        value1: '0',
        value2: '1'
      },
      multiSelectSelected: [],
      fixedvalue: ''
    };
  }

  ngOnInit() {
    this.eventForm = this.fb.group({
      event_name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      description: ['', Validators.compose([Validators.required, Validators.maxLength(150)])],
      media: ['', Validators.compose([])],
      event_type: ['', Validators.required],
      launch_date: [''],
      launch_time: ['']
    });
    this.getEvents();
  }

  ngAfterViewInit() {
    this._script.load('daterangepicker')
      .then((data) => {
        console.log("daterangepicker::", data);
        this.scriptLoaded = true;
      })
  }

  getEvents(query = null) {
    this.loadingEvents = true;
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
    this._eventsService.getEvents(obj).subscribe((data) => {
      this.loadingEvents = false;
      this.total_pages = Math.ceil(data.count / this.current_limit);
      this.events = data.events;
      if (this.events)
        this.totalCount = data.count
      this.errorMessage = ''
    }, (error) => {
      this.loadingEvents = false;
      this.errorMessage = error.message;
      window.toastNotification("Failed to Load Events")
    })
  }

  changeButtonProps(ref, prop = {}) {
    Object.keys(prop).forEach(key => {
      ref[key] = prop[key];
    })
  }

  createEvent(data, btnRef: any = '') {
    btnRef && this.changeButtonProps(btnRef, { textContent: 'Please wait...', disabled: true });
    data.launch_date = new Date(data.launch_date).toISOString();
    this.newEvent = this._eventsService.createEvent(data)
      .subscribe((response) => {
        this.getEvents();
        btnRef && this.changeButtonProps(btnRef, { textContent: 'Add', disabled: false });
        jQuery('#add-event').modal('hide')
        this.errorMessage = '';
        window.toastNotification("Created a New Event Successfully...");
      }, error => {
        btnRef && this.changeButtonProps(btnRef, { textContent: 'Add', disabled: false });
        this.errorMessage = error.error.err_message;
      });
  }
  editEvent(index) {
    this.selectedItem = this.events[index];
    this.eventForm.get('event_name').setValue(this.selectedItem.event_name)
    this.eventForm.get('description').setValue(this.selectedItem.description)
    this.eventForm.get('media').setValue(this.selectedItem.media)
    this.eventForm.get('event_type').setValue(this.selectedItem.event_type)
    this.eventForm.get('launch_date').setValue(this.selectedItem.launch_date)
    this.eventForm.get('launch_time').setValue(this.selectedItem.launch_time)

    this.selectedItem['launch_date'] && (jQuery('.input-daterange-datepicker').data('daterangepicker').setStartDate(moment(this.selectedItem['launch_date']).add(0, 'days').format('MM/DD/YYYY')),
      jQuery('.input-daterange-datepicker').data('daterangepicker').setEndDate(moment(this.selectedItem['launch_date']).utc().add(0, 'days').format('MM/DD/YYYY')));
    this.selectedItem['launch_date'] || (jQuery('.input-daterange-datepicker').data('daterangepicker').setStartDate(moment(new Date()).add(0, 'days').format('MM/DD/YYYY')),
      jQuery('.input-daterange-datepicker').data('daterangepicker').setEndDate(moment(new Date()).utc().add(0, 'days').format('MM/DD/YYYY'))
    );

    this.edit = true;
    this.errorMessage = '';
    this.loader = false;
  }
  updateEvent(data, btnRef: any = '') {
    var updatedData = {
      _id: this.selectedItem['_id'],
      event_name: data.event_name,
      description: data.description,
      launch_date: new Date(data.launch_date).toISOString(),
      launch_time: data.launch_time,
      event_type: data.event_type,
      media: data.media
    };
    if (data.event_name != this.selectedItem.event_name || data.launch_date != this.selectedItem.launch_date) {
      updatedData['check'] = true;
    } else {
      updatedData['check'] = false
    }
    btnRef && this.changeButtonProps(btnRef, { textContent: 'Please wait...', disabled: true });
    this._eventsService.updateEvent(updatedData)
      .subscribe((response) => {
        this.getEvents();
        btnRef && this.changeButtonProps(btnRef, { textContent: 'Update', disabled: false });
        jQuery('#add-event').modal('hide')
        this.errorMessage = '';
        window.toastNotification("Event Updated Successfully...")
      }, error => {
        btnRef && this.changeButtonProps(btnRef, { textContent: 'Update', disabled: false });
        this.errorMessage = error.error.err_message;
      });
  }
  removeEvent(event, index) {
    let self = this;
    bootbox.dialog({
      size: 'small',
      message: `<div class="bootbox-body-left">
    <div class="mat-icon">
    <i class="fa fa-warning"></i>
    </div>
    </div>
    <div class="bootbox-body-right">
    <p class="one-line-para">Are you sure you want to delete this Event?</p>
    </div>
    `,
      buttons: {
        cancel: {
          label: "Cancel",
          className: "btn-cancel btn-cancel-hover",
        },
        success: {
          label: "OK",
          className: "btn btn-ok btn-hover",
          callback: function () {
            self._eventsService.removeEvent(event['_id']).subscribe((data) => {
              self.getEvents()
              this.errorMessage = ''
              window.toastNotification("Event Removed Successfully......")
            }, (error) => {
              this.errorMessage = error.message
            })
          }
        }
      }
    });
  }
  upload(files: FileList, imgSrc: any) {
    // let file: File = files.item(0);
    // if (file.type.startsWith('image/')) {
    //   this.loader = true;
    //   this.uploadImageToServer(file);
    // }
  }
  uploadImageToServer(url) {
    // this._adminService.uploadGif(url).subscribe((data) => {
    //   this.loader = false;
    //   this.eventForm.get('media').setValue(data);
    // }, error => {
    //   this.loader = false;
    //   this.eventForm.get('media').setValue('');
    //   console.log("err", error.error);
    //   // this.errorMessage = error.error.err_message;
    // })
  }
  setLaunchDate(date) {
    console.log("date", date);
    this.eventForm.get('launch_date').setValue(date['start_date']);
  }

  addCondition() {
    this.conditions.push(JSON.parse(JSON.stringify(this.condition)));
  }

  removeCondition(index: number) {
    this.conditions.splice(index, 1);
  }

  applyFilter() {
    this.current_page = 1;
    this.getEvents(this.conditions);
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
