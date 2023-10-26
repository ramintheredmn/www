import React from 'react';
import ReactECharts from 'echarts-for-react';

const BinaryECGPlot = ({ data }: any) => {
  if (!data || !data.timestamps || !data.sleepB) {
    return (
      <div className='mt-3 flex justify-center'>
        NO data in the selected time interval for this user id
      </div>
    );
  }

  const timestamps: Number[] = data?.timestamps;
  const binarySleep: Number[] = data?.sleepB;

  const option = {
    legend: {
      data: ['Binary Sleep'],
    },
    xAxis: {
      type: 'time',
    },
    yAxis: [
      {
        name: 'Binary Sleep',
        type: 'category', // Use category type for the y-axis
        data: ['Wake', 'Sleep'], // Specify the categories
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 20,
      },
    ],
    series: [
      {
        name: 'Binary Sleep',
        type: 'line',
        smooth: true,
        symbol: 'none',
        emphasis: {
          focus: 'series',
        },
        data: timestamps.map((v, r) => [Number(v) * 1000, binarySleep[r]]),
        // Directly map the binarySleep values, keeping them as 0 and 1
        yAxisIndex: 0, // Assign this series to the first y-axis
      },
    ],
  };

  return (
    <div>
      {!timestamps ? (
        'no data in the selected time interval'
      ) : (
        <ReactECharts option={option} style={{ height: 'calc(100vh - 250px)', width: '100%' }} />
      )}
    </div>
  );
};

export default BinaryECGPlot;
