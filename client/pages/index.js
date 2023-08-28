'use client';
import { list } from 'postcss';
import { data } from 'autoprefixer';
import { useEffect, useState, useRef } from 'react';
import React from 'react';
import axios from 'axios';


import Navabr from './components/navbar';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

// ... rest of your code, classes, and functions

class Chart extends React.Component {
  render() {
    const { userHeartRate, userTimestamp, size } = this.props;

    return (
      <div>
        <Plot
          data={[
            {
              x: userTimestamp,
              y: userHeartRate,
              type: 'scatter',
              marker: { color: 'red' },
            },
          ]}
          layout={{
            width: size.width,
            height: 600,
            autosize: true,  // Automatically adjust to fit container
            title: 'HeartRate over time',
          }}
          config={{ responsive: true }}
        />
      </div>
    );
  }
}






export default function Home() {
  const [userHeartRate, setUserHeartRate] = useState([]);
  const [userTimestamp, setUserTimestamp] = useState([]);

  return(
    <>
    <div className='w-full h-full'>
    <Navabr title="Homepage" />
    </div>
    </>
  )
}

