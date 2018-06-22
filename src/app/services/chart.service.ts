import { Injectable } from '@angular/core';
declare let Chart: any;
@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor() { }
  barChart(context, title, labels, data) {
    let color = this.random_rgba();
    let Color = [];
    for(let i = 0; i < data.length; i++) {
      Color.push(color);
    }
    new Chart(context, {
      type: 'bar',
      options: {
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              color: '#2d3035'
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              color: '#2d3035'
            }
          }]
        },
        legend : {
          display: false
        },
        title: {
          display: true,
          text: title
        }
      },
      data: {
        labels: labels,
        datasets: [
          {
            label: title,
            backgroundColor: Color,
            hoverBackgroundColor: Color,
            borderColor: Color,
            borderWidth: 1,
            data: data,
          }
        ]
      }
    });
  }


  lineChart(context,legends, labels, data) {
    let datasets = [];
    let dArray = [];
    for(let i = 0; i < data.length; i++) {
      dArray = dArray.concat(data[i]);
      let color = this.random_rgba();
      let ds = {
        label: legends[i],
        fill: true,
        lineTension: 0.3,
        backgroundColor: "transparent",
        borderColor: color,
        pointBorderColor: color,
        pointHoverBackgroundColor: color,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        borderWidth: 2,
        pointBackgroundColor: color,
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 0,
        pointRadius: 1,
        pointHitRadius: 0,
        data: data[i],
        spanGaps: false
      };
      datasets.push(ds);
    };
    new Chart(context, {
      type: 'line',
        options: {
          scales: {
            xAxes: [{
              display: true,
              gridLines: {
                color: '#2d3035'
              }
            }],
            yAxes: [{
              ticks: {
                max: Math.max.apply(null, dArray),
                min: 0,
                stepSize: Math.floor(Math.max.apply(null, dArray)/10)
              },
              display: true,
              gridLines: {
                color: '#2d3035'
              }
            }]
          },
          legend: {
            display: true
          }
        },
        data: {
          labels: labels,
          datasets: datasets
        }
    });
  }

  random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 0.7 + ')';
  }
}
