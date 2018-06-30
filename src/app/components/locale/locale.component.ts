import { Component, OnInit } from '@angular/core';
import { ScriptService } from '../../services/script.service';
import { LocaleService } from '../../services/locale.service';

@Component({
    selector: 'app-locale',
    templateUrl: './locale.component.html',
    styleUrls: ['./locale.component.css']
})
export class LocaleComponent implements OnInit {

    data: any = {
        language: 'Spanish',
        langCode: 'sp',
        fields: {
            isRequired: 'is requalala',
            isMandatory: 'is Mandota',
            test: 'hihi'
        }
    }
    dataKeys: any[] = [];
    allLangs: any[] = [];
    language: string;
    langCode: string;
    msg: string;
    tabType: string = 'add';
    constructor(public _script: ScriptService, public localeService: LocaleService) {
    }

    ngOnInit() {
        this.updateAllLanguages();
        this.selectLanguage('en');
    }

    updateAllLanguages() {
        this.allLangs = [];
        this.localeService.get().subscribe(
            response => {
                response.forEach(element => {
                    this.allLangs.push({ langCode: element.langCode, language: element.language });
                });
            },
            error => { console.log('error', error) }
        );
    }

    selectLanguage(langCode: any) {
        this.langCode = langCode;
        this.localeService.get(langCode).subscribe(
            response => {
                this.data = {};
                this.language = response.language;
                this.langCode = response.langCode;
                Object.keys(response.fields).forEach(e => {
                    if (e != '_id')
                        this.data[e] = response.fields[e];
                });
                this.dataKeys = Object.keys(this.data);
            },
            error => { console.log('error', error) }
        );
    }

    update() {
        if (this.langCode != 'en') {
            let data = {};
            data['language'] = this.language;
            data['langCode'] = this.langCode;
            data['fields'] = this.data;
            this.localeService.update(data).subscribe(
                response => { if (response) this.msg = 'Updated'; else this.msg = 'Select a language to update'; this.updateAllLanguages(); },
                error => { console.log('error', error) }
            );
        } else
            this.msg = 'You cannot update English Language';

    }

    add() {
        let data = {};
        data['language'] = this.language;
        data['langCode'] = this.langCode;
        data['fields'] = this.data;
        this.localeService.add(data).subscribe(
            response => { this.msg = 'Language Added Successfully'; this.updateAllLanguages(); },
            e => { this.msg = e.error.err_message + '.Enter a unique Language Code'; }
        );
    }

    delete() {
        if (this.langCode != 'en') {
            this.localeService.remove(this.langCode).subscribe(
                response => {
                    this.updateAllLanguages();
                    this.msg = 'Language deleted';
                    this.selectLanguage('en');
                },
                error => { console.log('error', error) }
            );
        } else
            this.msg = 'You cannot remove English Language';
    }


}
