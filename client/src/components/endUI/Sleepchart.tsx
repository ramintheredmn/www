import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts'

// type data ={
//     "combined": [Number[]]
//     "timestamp"
// }

const ECGPlot = ({ data }: any) => {

    if (!data || !data.combined || !data.timestamp) {
        return <div>Loading...</div>;
      }
    // Parse the combined data
    const combined = data?.combined;

    // Extract timestamps, wake, rem, and nrem data
    // using the seprate timestamp list for x axis
    const timestamps:Number[] = data?.timestamp
    const wakeData:Number[]  = combined?.map((entry: Number[]) => entry[3]);
    const remData:Number[]  = combined?.map((entry: Number[]) => entry[1]);
    const nremData:Number[]  = combined?.map((entry: Number[]) => entry[2]);

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
            data: ['Wake', 'REM', 'NREM'],
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
                name: 'Wake',
                type: 'line',
                stack: 'percentage',
                
                symbol: 'none',
                areaStyle: {
                    opacity: 1,

                  },
                  emphasis: {
                    focus: 'series'
                  },

                data: timestamps.map((v,r) => [Number(v)*1000, wakeData[r]]),
            },
            {
                name: 'REM',
                type: 'line',
                stack: 'percentage',
                areaStyle: {
                    opacity: 1,

                  },
                  emphasis: {
                    focus: 'series'
                  },
                symbol: 'none',

                data: timestamps.map((v,r) => [Number(v)*1000, remData[r]]),
            },
            {
                name: 'NREM',
                type: 'line',
                stack: 'percentage',
                areaStyle: {
                    opacity: 1,

                  },
                  emphasis: {
                    focus: 'series'
                  },
                symbol: 'none',

                data: timestamps.map((v,r) => [Number(v)*1000, nremData[r]]),
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 500, width: '100%'  }} />;
};

export default ECGPlot;