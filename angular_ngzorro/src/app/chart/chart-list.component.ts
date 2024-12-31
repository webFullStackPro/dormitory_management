import {AfterViewInit, Component} from '@angular/core';
import {SharedModule} from '../shared.module';
import * as echarts from 'echarts';

@Component({
  selector: 'chart',
  imports: [
    SharedModule
  ],
  templateUrl: './chart-list.component.html',
  standalone: true
})
export class ChartListComponent implements AfterViewInit {

  constructor(
  ) {}

  ngAfterViewInit(): void {
    this.displayChart1()
    this.displayChart2()
  }

  displayChart1() {
    const chartDom = document.getElementById('chart1');
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '费用汇总',
        subtext: '2010',
        left: 'center',
        top: 'top',
        textStyle: {
          fontSize: 20
        },
        subtextStyle: {
          fontSize: 14
        }
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [11820, 12300, 11550, 9930, 7530, 11220, 10130],
          type: 'bar'
        }
      ]
    };

    myChart.setOption(option);
  }

  displayChart2() {
    const chartDom = document.getElementById('chart2');
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '宿舍房间比例',
        subtext: '2010',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '宿舍房间比例',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 123, name: '二人间' },
            { value: 256, name: '四人间' },
            { value: 489, name: '六人间' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    myChart.setOption(option);
  }
}
