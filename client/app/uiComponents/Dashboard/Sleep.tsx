import { useStore } from "@/app/store/store"
import useSWR from "swr"

export default function Sleep(){
    const {userLogedin, fetcher} = useStore((state)=> state)
    useSWR




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