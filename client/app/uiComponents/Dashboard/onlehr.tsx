import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import ReactECharts from 'echarts-for-react';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useStore } from '@/app/store/store';

export default function Chart() {

const {userLogedin, fetcher} = useStore((state)=> state)
const {data, error, isLoading} = useSWR<any, any>(userLogedin&& `/api/heartrate/${userLogedin}?startdate=1694176140&enddate=1694262240`, fetcher)

console.log(data)

  const option = {

    toolbox: {
      right: 200,
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
    data: ['ضربان قلب', 'میانگین وزنی'],
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
        name: 'ضربان قلب',
		symbol: 'none',
    

        type: 'line',
        data: data?.timestamps?.map((v:any, i:any) => [Number(v) * 1000, Number(data.heartrate[i])])
      },
	//   {
    //     name: 'MovingAverage',
	// 	symbol: 'none',

    //     type: 'line',
    //     data: props.timestamp?.map((v, i) => [Number(v) * 1000, Number(props.ma[i])])
    //   }
    ]
  };


	return (

    <div className=" mx-auto ">
    
      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
           <CardTitle>نمودار ضربان قلب</CardTitle>
            <CardDescription>ضربان در دقیقه</CardDescription>
        </CardHeader>
        <CardContent className="">
          
            {isLoading ? <div>در حال بارگیری ... </div> :
            <ReactECharts option={option} style={{ height: innerHeight - 500, width:innerWidth-150 }} />
            }

          
        </CardContent>
        <CardFooter>
          <p>کانفیگوریشن چارت</p>
        </CardFooter>
      </Card>
    
</div>
	);
}