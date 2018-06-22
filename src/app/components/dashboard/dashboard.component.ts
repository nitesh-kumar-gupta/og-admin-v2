import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScriptService } from '../../services/script.service';
import { ChartService } from '../../services/chart.service';
import { AdminService } from '../../services/admin.service';
import * as moment from 'moment';
declare let Chart: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscribes: any[];
  graphData: any;
  constructor(private scriptService: ScriptService,
    private chartService: ChartService,
    private adminService: AdminService) {
      this.subscribes = [];
      scriptService.load('chartjs').then((data) => {
        this.subscribes.push(this.getGraphData());
      }).catch((error) => {
        console.error('script Load error: ', error);
      });
      this.graphData = null;
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscribes.forEach((subscribe) => {
      subscribe.unsubscribe();
    });
  }

  getGraphData() {
    const thisYear = (new Date()).getFullYear();
    const dateData: any = {
      start_date: moment(new Date('1/1/' + thisYear)).format('YYYY-MM-DD'),
      end_date: moment(new Date()).format('YYYY-MM-DD')
    };
    return this.adminService.getBasicGraph(dateData).subscribe((success: any) => {
      this.graphData = success;
      this.initializeCharts();
    }, (error: any) => {
      console.error('graph data error', error);
    });
  }

  initializeCharts() {
    const barChartUsers = <HTMLCanvasElement>document.getElementById('barChartUsers');
    const barChartCompanies = <HTMLCanvasElement>document.getElementById('barChartCompanies');
    const barChartPieces = <HTMLCanvasElement>document.getElementById('barChartPieces');
    const lineCahrtUCP = <HTMLCanvasElement>document.getElementById('lineCahrtUCP');
    this.barChart(barChartUsers, 'Users', this.graphData.users);
    this.barChart(barChartCompanies, 'Companies', this.graphData.companies);
    this.barChart(barChartPieces, 'Apps', this.graphData.apps);
    const gData = {
      legend: ['Users', 'Companies', 'Apps'],
      labels: [],
      values: []
    };
    let val = [];
    this.graphData.users.forEach((user) => {
      if (!gData.labels.includes(user._id)) {
        gData.labels.push(user._id);
      }
      val.push(user.total);
    });
    gData.values.push(val);

    val = [];
    this.graphData.companies.forEach((company) => {
      if (!gData.labels.includes(company._id)) {
        gData.labels.push(company._id);
      }
      val.push(company.total);
    });
    gData.values.push(val);

    val = [];
    this.graphData.apps.forEach((app) => {
      if (!gData.labels.includes(app._id)) {
        gData.labels.push(app._id);
      }
      val.push(app.total);
    });
    gData.values.push(val);
    this.lineChart(lineCahrtUCP, gData);
  }

  barChart(context, title, data) {
    const gData = {
      labels: [],
      values: []
    };
    data.forEach((d) => {
      gData.labels.push(d._id);
      gData.values.push(d.total);
    });
    this.chartService.barChart(context, title, gData.labels, gData.values );
  }

  lineChart(context, data) {
    const gData = {
      legend: data.legend,
      labels: data.labels,
      values: data.values
    };
    this.chartService.lineChart(context, gData.legend, gData.labels, gData.values);
  }
}
