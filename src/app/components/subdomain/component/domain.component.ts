import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Datatable } from '../../../classes/datatable.class';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ScriptService } from '../../../services/script.service';
import { DomainService } from '../../../services/domain.service';
import { Domains } from '../../../models/domains';
import { environment } from '../../../../environments/environment';

declare var jQuery: any;

@Component({
	selector: 'app-domain',
	templateUrl: './domain.component.html',
	styleUrls: ['./domain.component.css']
})
export class DomainComponent extends Datatable implements OnInit, AfterViewInit {
	totalCount: any;
	loading: boolean = false;
	subdomainExtension: string = '';
	SubDomainForm: FormGroup;
	Domains: Domains[] = [];
	error: boolean = false;
	errorMessage: string = '';
	@Input() category: string;

	constructor(public fb: FormBuilder,
		public _domainService: DomainService,
		public _script: ScriptService) {
		super();
	}

	ngOnInit() {
		// console.log(this.category,"this is the category");
		this.SubDomainForm = this.fb.group({
			Subdomain: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9]*$')])]
		});
		this.subdomainExtension = '.' + environment.APP_EXTENSION;
		this.error = false;
		this.errorMessage = '';
	}


	ngAfterViewInit() {
		this._script.load('datatables')
			.then((data) => {
				//console.log('scripts loaded successfully');             
				this.getDomains();
			})
			.catch((error) => {
				//console.log('Script not loaded', error);
			});
	}

	getDomains() {
		let self = this;
		let obj = {
			type: this.category,
			limit: this.current_limit,
			page: this.current_page - 1,
			searchKey: this.search
		};
		this.loading = true;
		let getDomains = self._domainService.getDomains(obj)
			.subscribe(
				(success: any) => {
					this.loading = false;
					this.Domains = [];
					this.total_pages = Math.ceil(success.count / this.current_limit);
					this.totalCount = success.count
					success.domains.forEach((domain: any) => {
						this.Domains.push(new Domains(domain));
					});
				},
				(error: any) => {
					getDomains.unsubscribe();
					this.error = true;
					this.errorMessage = error.error.err_message;
					this.loading = false;
				}
			);
	}

	addSubDomain() {
		this.error = false;
		this.errorMessage = '';
		let self = this;
		let addSubDomain = self._domainService.addDomain(this.SubDomainForm.value.Subdomain, this.category)
			.subscribe(
				(success: any) => {
					this.Domains.push(new Domains(success));
					jQuery('#' + this.category + 'SubDomainForm input').val('');
					jQuery('#' + this.category + 'SubdomainDiv').addClass('is-empty');
				},
				(error: any) => {
					addSubDomain.unsubscribe();
					this.error = true;
					if (error.error.code === 'E_UNIQUE_UNIDENTIFIED_VALIDATION')
						this.errorMessage = "Domain already exist";
					else
						this.errorMessage = error.error.err_message;
				}
			);
	}

	hideError() {
		this.error = false;
		this.errorMessage = '';
	}

	deleteDomain(domain: any, i: any) {
		this.error = false;
		this.errorMessage = '';
		let self = this;
		let deleteDomain = self._domainService.deleteDomain(domain.id)
			.subscribe(
				(success: any) => {
					this.Domains.splice(i, 1);
				},
				(error: any) => {
					deleteDomain.unsubscribe();
					this.error = true;
					this.errorMessage = error.error.err_message;
				}
			);
	}

	paging(num: number) {
		super.paging(num);
		this.getDomains();
	}

	limitChange(event: any) {
		super.limitChange(event);
		this.getDomains();
	}

	searchData() {
		super.searchData();
		this.getDomains();
	}


}
