import ReactECharts from 'echarts-for-react';
import { useState, useEffect } from 'react';

export default function Chart(props: {
	heartrate: number[];
	timestamp: number[];
	ma :number[];
  show: boolean

  }) {
  
	const [height, setHeight] = useState(window.innerHeight - 250);

	useEffect(() => {
		const handleResize = () => {
			setHeight(window.innerHeight - 100);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
  const option = {

    toolbox: {
	  right: 100,
      feature: {
        saveAsImage: {},
        dataZoom: {},
        restore: {}
      }
    },
    tooltip: {},

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
        name: 'Moving Average',
		symbol: 'none',

        type: 'line',
        data: props.ma&&props.timestamp?.map((v, i) => [Number(v) * 1000, Number(props.ma[i])])
      }
    ]
  };
console.log(props.heartrate)
console.log(props.ma)

	return (
		<ReactECharts
			option={option}
			style={{ height: height, width: '100%' }}
			lazyUpdate={true}
		/>
	);
}
