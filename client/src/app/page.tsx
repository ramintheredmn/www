'use client'
import { DateRange } from "react-day-picker";
import { addDays, endOfDay, format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR, {preload} from 'swr';
import Chart from "@/components/ui/endUI/Chart";
import { ComboboxDemo } from "@/components/ui/endUI/UseridCombobox";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { DatePickerWithRange } from "@/components/ui/endUI/Datepicker";
import ECGPlot from "@/components/ui/endUI/Sleepchart";
import Stepchart from "@/components/ui/endUI/Stepchart";
import { Button } from "@/components/ui/button";
import { AlertDialogDemo } from "@/components/ui/endUI/Calender";


const preFetcher = (url:string) => fetch(url).then(res=>res.json())
const fetcher = async (url:string) => {
  const response = await fetch(url);
  return response.json();
};
function Fetch(url: string| null): any {
  const { data, error, isLoading } = useSWR(url? url: null, fetcher, { refreshInterval: 60*5*1000 });
  return {
    data,
    error,
    isLoading,
  };
}

export default function Home() {
  const [userid, setUserid] = useState("");

  const {data: dataDate, error: dateError, isLoading: dateLoading} = Fetch(userid? `/api/latest_timestamp/${userid}`:null)
  const [date, setDate] = useState({
    from: new Date(),
    to: endOfDay(new Date()),
  })

  const { data: userData, error, isLoading } = Fetch(userid? `/api/heartrate/${userid}?startdate=${Math.floor(date?.from?.getTime() / 1000)}&enddate=${Math.floor(date?.to?.getTime() / 1000)}`: null);
  console.log(dataDate)
  const [maon, setMaon] = useState(false);
  const [windowsize, setWindowsize] = useState(5);
  const { data: userMa, error: errorma, isLoading: isMAloading } = Fetch(maon?`/api/windowsize/${userid}/${windowsize}/86400`: null);
  const [hrshow, setHrshow] = useState(true)
  const {data: stepData, error: stepError, isLoading: stepLoading} = Fetch(userid? `/api/steps/${userid}`: null)
  const [stepShow, setStepshow] = useState(false)


  //console.log(userMa)
  let content;
  if (!userid) {
    content = <div><h1>Select user id</h1></div>;
  } else if (isLoading || (maon && isMAloading)) {
    content = <div>Loading...</div>;
  } else if (error || (maon && errorma)) {
    content = <div>error in fetching data <br/> check your internet connection if not resolved contact admin</div>;
  } else {
    content = userData?<div className="w-screen"><Chart heartrate={userData?.heartrate} timestamp={userData?.timestamps} ma={userMa?.ma} show={hrshow} /></div>: <div>No data in selected time interval</div>;
  }


  
  const {data: sleepData, error: sleepError, isLoading: isSleepL} = useSWR(userid?`/api/sleep/${userid}`: null, fetcher)


  return (
    <main className="w-[70vh]screen h-screen  justify-items-center content-center p-0 mt-2">
      <Tabs defaultValue="heartrate" className="flex flex-col justify-items-center items-center w-[70vh]screen rounded">
        <TabsList>
          <TabsTrigger value="heartrate">Heart Rate Analyze</TabsTrigger>
          <TabsTrigger value="slac">Activity and Sleep</TabsTrigger>
        </TabsList>
        <TabsContent value="heartrate">
          <section className="flex flex-col h-full items-center content-center w-screen">
            <section id="chartoptions"  className="flex flex-col p-2 items-center justify-center">
              <div className="flex flex-row">
                <ComboboxDemo userid={userid} setUserid={setUserid} />
                <div className="flex flex-col items-center">
                <Checkbox onCheckedChange={()=> {}}/>
                <p>use calender</p>
                </div>
                
                <AlertDialogDemo date={date} setDate={setDate} calendershow={true}/>
              </div>

              <section className="mt-3 flex flex-row items-center justify-center space-x-2">
                <p>moving average</p>
                <Checkbox onCheckedChange={() => setMaon(!maon)} />
                <input 
                  className="w-20 ml-3 p-2 rounded-sm bg-black text-white" 
                  type='number' 
                  value={windowsize} 
                  onChange={(e) => setWindowsize(Number(e.target.value))} 
                />
                
                <Checkbox onCheckedChange={()=> {setHrshow(hrshow?false:true)} }/>
                <p className="w-20 ml-3"> disable raw heart rate  </p> 
               
              </section> 
            </section>
            <div className="h-[70vh]screen w-[70vh]screen content-center self-center place-content-center place-items-center place-self-center">{content}</div>
            
          </section>
        </TabsContent>
        <TabsContent value="slac">
        
        <section className="flex flex-col items-center content-center w-screen">
          
          <section className="flex flex-row items-center justify-between gap-2">
          {/* <ComboboxDemo userid={sleepUserid} setUserid={setSleepuserid} /> */}
          <Checkbox onCheckedChange={()=> setStepshow(stepShow?false:true)}/>
          <p>show steps data</p>


          </section>
          <div className="h-[70vh]screen w-[70vh]screen content-center self-center place-content-center place-items-center place-self-center">
            {userid? 
              isSleepL? <div>Loading...</div>
              :
              <div className="w-screen"><ECGPlot data={sleepData} /></div>
              :
              <div>select user id</div>
              }
            {userid?

              stepShow?
              stepLoading? <div>Loading...</div>
              :
              <div className="w-screen"><Stepchart steps={stepData?.steps} timestamp={stepData?.timestamps}/></div>
              :
              <div> </div>
              :
              null
              }

          </div>

        </section>

        </TabsContent>
      </Tabs>
    </main>
  );
}