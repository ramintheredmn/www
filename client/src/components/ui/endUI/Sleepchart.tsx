import React from 'react';
import ReactECharts from 'echarts-for-react';

// type data ={
//     "combined": [Number[]]
//     "timestamp"
// }

const ECGPlot = ({ data, steps }: any) => {
  console.log(steps)

    if (!data || !data.timestamps || !data.sleepP) {
        return <div>Loading...</div>;
      }
    // Parse the combined data
    const combined = data?.combined;

    // Extract timestamps, wake, rem, and nrem data
    // using the seprate timestamp list for x axis
    const timestamps:Number[] = data?.timestamps;
    const sleepP:Number[] = data?.sleepP;
    const step:Number[] = steps?.steps;
    const hourstep: Number[] = steps?.hourstep;
    const hourtamp: Number[] = steps?.hourtamp;
    // const nremData:Number[]  = combined?.map((entry: Number[]) => entry[1]);

    // console.log(data)

    // Prepare ECharts option
    const option = {

        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
            },
        },
        legend: {
            data: ['steps', 'Sleep', 'hoursteps'],
        },
        xAxis: {
            type: 'time',
            
        },
        yAxis: [


          {
            name: 'Sleep',
            type: 'value'
          },
          {
            name: 'hoursteps',
            nameLocation: 'start',
            alignTicks: true,
            type: 'value',
            inverse: true
          }
        ],
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
            order:1,
    
            type: 'bar',
            barStyle: {
              width: 10
            },
            data: timestamps?.map((v,r)=>[Number(v)*1000, step[r]])
          },
            {
                name: 'Sleep',
                type: 'line',
                smooth: true,           
                symbol: 'none',

                areaStyle: {
                    opacity: 0.5,

                  },
                  emphasis: {
                    focus: 'series'
                  },

                data: timestamps?.map((v,r)=>[Number(v)*1000, Number(sleepP[r])*100])
            },

            {
              name: 'hoursteps',
              symbol: 'none',
          
              yAxisIndex: 1,

              type: 'line',
              smooth: true,
              areaStyle: {
                opacity: 0.5
              },
              data: hourtamp?.map((v,r)=>[Number(v)*1000, Number(hourstep[r])])
            },


        ],
    };

    return <ReactECharts option={option} style={{ height: innerHeight-250, width: '100%'  }} />;
};

export default ECGPlot;