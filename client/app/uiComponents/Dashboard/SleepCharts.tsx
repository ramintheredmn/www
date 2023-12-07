
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
// Set moment to use the Jalaali calendar
import { Label } from '@/components/ui/label'
import {Datepicker, Chartpref} from './Chartprefs';
import { TbZoomReset } from "react-icons/tb";
import dynamic from 'next/dynamic';

ChartJS.register(zoomPlugin);
moment.loadPersian({dialect:'persian-modern',  usePersianDigits: true });

function Sleepp(
  
    {timestamps, sleepP, sleepPerror, sleepPisLoading} : 
  
    {timestamps: number[] | undefined,
    sleepP: number[] | undefined, sleepPerror: any,
    sleepPisLoading: any,
    chartType: string }
    
    
    ){
  
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
            label: 'احتمال خواب',
            data: sleepP,
            borderColor: 'rgb(75, 192, 192)',
            pointRadius: 0,
            fill: true,
            tension: 0.1
          }
        ]
      };
    
      return (
        <main className='flex flex-col items-center justify-center'>
          <section className='flex-grow w-full h-full'>
            {sleepPerror? 
            <div> خطایی رخ داد </div>: sleepPisLoading? <div>در حال بارگذاری </div> 
            : 
            
            <Line 
            
            ref={chartRef}

            
            data={data}
            options={options} />}
  
            </section>
            <Chartpref resetZoom={resetZoom}/>
  
        </main>
      )
    }
  
  
    //------------------ the main component
  
  
  export default function Sleep (){
  
    const [chartType, setChartType] = react.useState('sleepp')
    const {userLogedin, dateRange, fetcher} = useStore((state) => state)
    const [avalibleDates, setAvailibleDates] = react.useState(null!)
  
    // use effect hook to fetch the first and last data for the user
    react.useEffect(()=> {
      fetch(`/api/latest_timestamp/${userLogedin}`)
        .then(res=> res.json())
        .then(data => setAvailibleDates(data))
    }, [userLogedin])
  
    // get sleep data, and parse the received data into its parts
  
    interface sleepdata {
      timestamps: number[],
      sleepP: number[],
      sleepB: number[]
      error?: any,
      isLoading?: any
    }
    const {data: sleepData, error: sleepError, isLoading: sleepisLoading} = useSWR<sleepdata>(userLogedin? `/api/sleep/${userLogedin}?rangedate=${JSON.stringify(dateRange)}`: null, fetcher)
  
    const timestamps = sleepData?.timestamps;
    const sleepP = sleepData?.sleepP;
    const sleepB = sleepData?.sleepB;
  
  
  
    return (
      <main className='flex flex-col items-center justify-center font-pinar-re'>
  
  
  
          <div className='flex flex-row items-center space-x-3'>
            <Label>نوع چارت را انتخاب کنید</Label>
            <select className=' rounded-md' onChange={(e)=> setChartType(e.target.value)} defaultValue='sleepp'>
            <option value="sleepp">احتمال خواب</option>
            <option value="sleepb">خواب باینری</option>
            <option value="step">قدم</option>
            </select>
          </div>
          <section className='flex-grow w-3/4 h-3/4 items-center'>
  
              {chartType === 'sleepp' ? 
              <Sleepp key={chartType} timestamps={timestamps} sleepP={sleepP} sleepPisLoading={sleepisLoading} sleepPerror={sleepError} chartType={chartType}/>
              :
              <div>other chart</div> 
                }
          </section>
  
  
  
            {/* chart configuration section */}
          <section className='w-1/2'>
            <Card className=''>
            <CardContent className='p-4 flex flex-col items-center justify-center space-y-3'>
            <h1 className='font-pinar-bl text-2xl'>تنظیمات نمودار </h1>
            {sleepData?.error &&
            <p className='text-xl font-pinar-bo text-red-700'> {JSON.stringify(sleepData.error)}</p>
  
            }
            {sleepData?.error &&
              <p>در صورت نیاز به انتخاب یک روز، روی آن روز دوبار بزنید تا به عنوان بازه ثبت شود</p>
  
            }
            <Datepicker/>
             
              </CardContent>
            </Card>
            </section>
      </main>
    )
  }