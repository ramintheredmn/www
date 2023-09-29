import ReactECharts from 'echarts-for-react';

export default function Stepchart(props: {
	steps: number[];
	timestamp: number[];
	

  }) {
  

  const option = {

    toolbox: {
	  right: 100,
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
    data: ['steps'],
},

    xAxis: {
      type: "time"
    },
    yAxis: {
      type: 'value',

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
        name: 'steps',
		symbol: 'none',
    

        type: 'bar',
        data: props.timestamp?.map((v, i) => [Number(v) * 1000, Number(props.steps[i])])
      },

    ]
  };
//console.log(props.steps)
//console.log(props.ma)

	return (
		<ReactECharts
			option={option}
			style={{ height: 0.45*innerHeight, width: '100%'  }}
			lazyUpdate={true}
		/>
	);
}
