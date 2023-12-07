'use client'
import * as react from 'react'
import useSWR from 'swr'
import { useStore } from '../../store/store'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import moment from 'moment-jalaali';
import { Type } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {Datepicker, Chartpref} from './Chartprefs';
import dynamic from 'next/dynamic';

ChartJS.register(zoomPlugin);
moment.loadPersian({dialect:'persian-modern',  usePersianDigits: true });



// the default component that will be rendered 

export default function HeartRatechart () {



    const {userLogedin, dateRange, fetcher} = useStore((state) => state)

    interface hData { 
        timestamps: number[],
        heartrate: number,
        error: any,
        isLoading: any
    }
    const {data: hData, error: hError, isLoading: hisLoading} = useSWR<hData>(userLogedin? `/api/heartrate/${userLogedin}?rangedate=${JSON.stringify(dateRange)}`: null, fetcher)
    const timestamps = hData?.timestamps
    const heartrate = hData?.heartrate


    const chartRef = react.useRef<any>(null);

    const resetZoom = () => {
      chartRef.current?.resetZoom();
    };
    const labels = timestamps?.map(timestamp => moment(Number(timestamp) * 1000).format('jYYYY/jM/jD HH:mm'));
    const options: any = {
      // ... other options
      plugins: {
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x',
          },
          pan: {
            enabled: true,
            mode: 'x',
          },
        },
      },
    };
    const data = {
      labels,
      datasets: [
        {
          label: 'ضربان قلب',
          data: heartrate,
          borderColor: 'rgb(75, 192, 192)',
          pointRadius: 0,
          fill: false,
          tension: 0.1
        }
      ]
    };
  
    return (
      <main className='flex flex-col items-center justify-center font-pinar-re'>

        <section className='flex-grow w-3/4 h-3/4 ml-4'>

                {hError ?
                    <div> خطایی رخ داد </div> : hisLoading ? <div>در حال بارگذاری </div>
                        :

                        <Line
                            ref={chartRef}
                            style={{

                                width: '75%',
                                height: '75%'
                            }}

                            data={data}
                            options={options} />
                        }



                        <Chartpref resetZoom={resetZoom} />
        </section>

        <section className='flex-grow w-1/2'>
          <Card className=''>
          <CardContent className='p-4 flex flex-col items-center justify-center space-y-3'>
          <h1 className='font-pinar-bl text-2xl'>تنظیمات نمودار </h1>
          {hData?.error &&
          <p className='text-xl font-pinar-bo text-red-700'> {JSON.stringify(hData.error)}</p>

          }
          {hData?.error &&
            <p>در صورت نیاز به انتخاب یک روز، روی آن روز دوبار بزنید تا به عنوان بازه ثبت شود</p>

          }
          <Datepicker/>
           
            </CardContent>
          </Card>
          </section>

        
      
          
      </main>
    )
  }
