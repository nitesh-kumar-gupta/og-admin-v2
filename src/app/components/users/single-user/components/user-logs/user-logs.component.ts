import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { ScriptService } from '../../../../../services/script.service';

declare var jQuery: any;

@Component({
    selector: 'app-user-logs',
    templateUrl: './user-logs.component.html',
    styleUrls: ['./user-logs.component.css']
})
export class UserLogsComponent implements OnInit {

    noOutbox: boolean = false;
    noInbox: boolean = false;
    id: number;
    inbox: any = null;
    outbox: any = null;
    constructor(public _adminService: AdminService, public route: ActivatedRoute, public _script: ScriptService) {
        this.route.params.subscribe(params => {
            this.id = params['id'];
        });
    }


    ngOnInit() {
        //console.log('User Logs invoked');
    }

    ngAfterViewInit() {
        this._script.load('datatables')
            .then((data) => {
                this.get_emails_inbox();
                this.get_emails_outbox();
            })
            .catch((error) => {
                console.log('Script not loaded', error);
            });
    }


    get_emails_inbox() {
        if (this.inbox == null) {
            this._adminService.getEmailLogs(this.id, 'inbox')
                .subscribe((result) => {
                    this.inbox = result;
                    if (this.inbox.length == 0) {
                        this.noInbox = true
                    }
                    setTimeout(function () {
                        jQuery('#inbox-datatable').DataTable();
                    }, 200);

                });
        }
    }

    get_emails_outbox() {
        if (this.outbox == null) {
            this._adminService.getEmailLogs(this.id, 'outbox')
                .subscribe((result) => {
                    this.outbox = result;
                    if (this.outbox.length == 0) {
                        this.noOutbox = true
                    }
                    setTimeout(function () {
                        jQuery('#outbox-datatable').DataTable();
                    }, 200);
                });
        }
    }
}
