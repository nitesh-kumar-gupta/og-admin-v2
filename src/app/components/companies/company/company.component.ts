import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyId: string;
  constructor(private route: ActivatedRoute) {
    this.companyId = null;
    this.route.params.subscribe(params => {
      this.companyId = params.id;
    });
  }

  ngOnInit() {
  }
}
