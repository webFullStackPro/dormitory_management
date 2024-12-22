import React, {useEffect} from "react";
import * as echarts from 'echarts';
import {Col, Row} from "antd";

const ChartList: React.FC = () => {

  const displayChart1 = () => {
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

  const displayChart2 = () => {
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

  useEffect(() => {
    displayChart1()
    displayChart2()
    return () => {
    };
  }, []);

  return (
    <>
      <Row gutter={10}>
        <Col span={11}>
          <div id="chart1" style={{height: 400, width: "100%"}}></div>
        </Col>
        <Col span={11}>
          <div id="chart2" style={{height: 400, width: "100%"}}></div>
        </Col>
      </Row>
    </>
  );
};

export default ChartList;