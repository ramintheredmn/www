import React from 'react';
import ReactECharts from 'echarts-for-react';

// type data ={
//     "combined": [Number[]]
//     "timestamp"
// }

const ECGPlot = ({ data }: any) => {

    if (!data || !data.timestamps || !data.sleepP) {
        return <div>Loading...</div>;
      }
    // Parse the combined data
    const combined = data?.combined;

    // Extract timestamps, wake, rem, and nrem data
    // using the seprate timestamp list for x axis
    const timestamps:Number[] = data?.timestamps;
    const sleepP:Number[] = data?.sleepP;
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
            data: ['Sleep'],
        },
        xAxis: {
            type: 'time',
            
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 1,
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
                name: 'Sleep',
                type: 'line',
                stack: 'percentage',
                
                symbol: 'none',
                areaStyle: {
                    opacity: 1,

                  },
                  emphasis: {
                    focus: 'series'
                  },

                data: timestamps?.map((v,r)=>[Number(v)*1000, sleepP[r]])
            },


        ],
    };

    return <ReactECharts option={option} style={{ height: 0.5*innerHeight, width: '100%'  }} />;
};

export default ECGPlot;