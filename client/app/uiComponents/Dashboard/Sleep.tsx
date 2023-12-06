'use client'
import * as react from 'react'
import useSWR from 'swr'
import { useStore } from '../../store/store'
import Chart from 'react-apexcharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import fa from "apexcharts/dist/locales/fa.json"
import datetime from 'react-apexcharts'
import moment from 'moment-jalaali';
import DatePicker from 'react-multi-date-picker'
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import { DateObject } from 'react-multi-date-picker'
import { Type } from 'lucide-react'
// Set moment to use the Jalaali calendar
moment.loadPersian({dialect:'persian-modern',  usePersianDigits: true });


export default function Sleep(){
    // define the variables
  const {userLogedin, fetcher} = useStore((state)=> state)

    // responsible chart width
  const [windowWidth, setWindowWidth] = react.useState(window.innerWidth);

    
  const [avalibleDates, setAvailibleDates] = react.useState(null!)

  // use effect hook to fetch the first and last data for the user
  react.useEffect(()=> {
    fetch(`/api/latest_timestamp/${userLogedin}`)
      .then(res=> res.json())
      .then(data => setAvailibleDates(data))
  }, [userLogedin])
  
  const [value, setValue] = react.useState([
    new DateObject(),
    new DateObject().subtract(1, 'days')

  ])


  console.log(JSON.stringify(value), typeof(value))
  // get sleep data, and parse the received data into its parts


  const {data, error, isLoading} = useSWR(userLogedin? `/api/sleep/${userLogedin}?rangedate=${JSON.stringify(value)}`: null, fetcher) 
  const timestamps:Number[] = data?.timestamps;
  const sleepP:Number[] = data?.sleepP;
  const sleepB: Number[] = data?.sleepB;
  //const {data: stepData, error: stepError, isLoading: stepLoading} = useSWR(userLogedin? ``)
  react.useEffect(() => {
    // Function to handle window resize
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures this runs once on mount

  // Adjust chart width based on the window width
  const chartWidth = windowWidth * 75/100 - 150;
  
  const options = {
    
    
    chart: {
      locales: [fa],
      defaultLocale: 'fa',
    },
    yaxis: {
      min: 0,
      max: 0.2,
    },
    xaxis: {
      type: 'datetime',
      labels: {
      formatter: function (value) {
        // Convert the timestamp to a Jalaali date string
        return moment(value).format('jYYYY/jM/jD HH:mm');
      }
    }

      
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy HH:mm'
        }
  
      }
  }
  const series = [
    {
      name: "series-1",
      type: 'area',
      data: timestamps?.map((v,i) => [Number(v)*1000, Number(sleepP[i]).toFixed(2)])
    },

  ];


    return (
    
    <main className='flex flex-col items-center justify-center font-pinar-re relative'>

          
      <div className=''>{error? <div> خطایی رخ داد </div>: isLoading? <div>در حال بارگذاری </div> :<Chart options={options} series={series} width={chartWidth} height={500} />}</div>

      <Card className='w-1/2 '>
       <CardContent className='p-4 flex flex-col items-center justify-center space-y-3'>
      <h1 className='font-pinar-bl text-2xl'>تنظیمات نمودار </h1>
      {data?.error && 
      <p className='text-xl font-pinar-bo text-red-700'> {JSON.stringify(data.error)}</p>
      
      }
      {data?.error && 
        <p>در صورت نیاز به انتخاب یک روز، روی آن روز دوبار بزنید <br></br> تا به عنوان بازه ثبت شود</p>
      
      }
        <div className="flex flex-row" style={ {direction:"rtl"}}>
          
          <p>بازه زمانی : </p>
          <DatePicker
            calendar={persian}
            range
            rangeHover
            value={value}
            onChange={setValue}
            locale={persian_fa}
            calendarPosition="bottom-right"
          
            />
        </div>
        </CardContent>
      </Card>
      

    </main>
    )
}