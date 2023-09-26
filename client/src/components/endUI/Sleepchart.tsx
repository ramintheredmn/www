import React from 'react';
import ReactECharts from 'echarts-for-react';

const ECGPlot = ({ data }) => {
    // Parse the combined data
    const combined = data?.combined;

    // Extract timestamps, wake, rem, and nrem data
    const timestamps = combined?.map(entry => entry[0]);
    const wakeData = combined?.map(entry => entry[1]);
    const remData = combined?.map(entry => entry[2]);
    const nremData = combined?.map(entry => entry[3]);

    // Prepare ECharts option
    const option = {
        title: {
            text: 'Sleep Stage Probabilities',
        },
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
            type: 'category',
            data: timestamps,
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 1,
        },
        series: [
            {
                name: 'Wake',
                type: 'line',
                stack: 'percentage',
                areaStyle: {},
                data: wakeData,
            },
            {
                name: 'REM',
                type: 'line',
                stack: 'percentage',
                areaStyle: {},
                data: remData,
            },
            {
                name: 'NREM',
                type: 'line',
                stack: 'percentage',
                areaStyle: {},
                data: nremData,
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 500 }} />;
};

export default ECGPlot;