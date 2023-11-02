import ReactECharts from 'echarts-for-react';
import { useState, useEffect } from 'react';

export default function Chart(props: {
	heartrate: number[];
	timestamp: number[];
	ma :number[];
  show: boolean
  loading: boolean;

  }) {

const [chartshow, setChartshow] = useState(true)
  
!props.timestamp&& setChartshow(false)

  const option = {

    toolbox: {
    top: 20,
	  right: 400,
      feature: {
        saveAsImage: {},
        dataZoom: {},
        restore: {}
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
          type: 'cross',
      },
  },
  legend: {
    data: ['Heartrate', 'MovingAverage'],
},

    xAxis: {
      type: "time"
    },
    yAxis: {
      type: 'value',
	  min: 40,
	  
	  
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 20
      }
    ],
    series: [
      {
        name: 'Heartrate',
		symbol: 'none',
    

        type: 'line',
        data: props.show?props.timestamp?.map((v, i) => [Number(v) * 1000, Number(props.heartrate[i])]): null
      },
	  {
        name: 'MovingAverage',
		symbol: 'none',

        type: 'line',
        data: props.ma&&props.timestamp?.map((v, i) => [Number(v) * 1000, Number(props.ma[i])])
      }
    ]
  };
//console.log(props.heartrate)
//console.log(props.ma)

	return (
    <div>
    {chartshow ?
  <ReactECharts option={option} style={{ height: innerHeight-250, width: '100%'  }} />
  :
      !props.loading&&
      'No data in selected time interval for this user id'
  }
  </div> 
	);
}