'use client'

import { addDays, endOfDay, format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR, {preload} from 'swr';
import Chart from "@/components/ui/endUI/Chart";
import { ComboboxDemo } from "@/components/ui/endUI/UseridCombobox";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import ECGPlot from "@/components/ui/endUI/Sleepchart";
import Stepchart from "@/components/ui/endUI/Stepchart";
import { Button } from "@/components/ui/button";
import { AlertDialogDemo } from "@/components/ui/endUI/Calender";
import { Tabbedcard } from "@/components/ui/endUI/Logincard";
import { Chartconfig } from "@/components/ui/endUI/Configchart";
import { ActivityChartconfig } from "@/components/ui/endUI/Configchartactivity";

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

  const [seecontent, setSeecontent] = useState(false);
  const [userid, setUserid] = useState("");

  const {data: dataDate, error: dateError, isLoading: dateLoading} = Fetch(userid? `/api/latest_timestamp/${userid}`:null)
  console.log(dataDate)
  const [date, setDate] = useState({
    from: new Date(),
    to: endOfDay(new Date()),
  })

  const { data: userData, error, isLoading } = Fetch(userid? `/api/heartrate/${userid}?startdate=${Math.floor(date?.from?.getTime() / 1000)}&enddate=${Math.floor(date?.to?.getTime() / 1000)}`: null);
  //console.log(dataDate)
  const [maon, setMaon] = useState(false);
  const [windowsize, setWindowsize] = useState(5);
  const { data: userMa, error: errorma, isLoading: isMAloading } = Fetch(maon?`/api/windowsize/${userid}/${windowsize}?startdate=${Math.floor(date?.from?.getTime() / 1000)}&enddate=${Math.floor(date?.to?.getTime() / 1000)}`: null);
  const [hrshow, setHrshow] = useState(true)
  const {data: stepData, error: stepError, isLoading: stepLoading} = Fetch(userid? `/api/steps/${userid}?startdate=${Math.floor(date?.from?.getTime() / 1000)}&enddate=${Math.floor(date?.to?.getTime() / 1000)}`: null)
  const [stepcheck, setstepCheck] = useState(false)
  const {data: sleepData, error: sleepError, isLoading: isSleepLoading} = Fetch(userid? `/api/sleep/${userid}?startdate=${Math.floor(date?.from?.getTime() / 1000)}&enddate=${Math.floor(date?.to?.getTime() / 1000)}`: null)
  const [sublogininfo, setSublogininfo] = useState({
    useridLogin: '',
    password: '',
    role: '',
  })

  const [hourstep, setHourstep] = useState(false)

  //console.log(userMa)
  let content;
  if (!userid) {
    content = <div><h1 className="mt-2 text-gray-50">Select user id</h1></div>;
  } else if (isLoading || (maon && isMAloading)) {
    content = <div>Loading...</div>;
  } else if (error || (maon && errorma)) {
    content = <div>error in fetching data <br/> check your internet connection if not resolved contact admin</div>;
  } else {
    content = userData?<div className="w-screen"><Chart heartrate={userData?.heartrate} timestamp={userData?.timestamps} ma={userMa?.ma} show={hrshow} /></div>: <div>No data in selected time interval</div>;
  }


  


  return (
    
    <>
    
    <main className="flex flex-col items-center w-screen h-screen p-0 mt-2 sticky">


      {!seecontent?


      <div className="w-1/2 h-screen">
        <Tabbedcard setSub={setSublogininfo} sub={sublogininfo} setSeecontent={setSeecontent} />

      </div>


      :
        (sublogininfo.useridLogin == 'admin' && sublogininfo.password == 'admin')?
        
        
      <Tabs defaultValue="heartrate" className="flex flex-col items-center justify-center w-3/4 rounded">
        <TabsList>
          <TabsTrigger value="heartrate">Heart Rate Analyze</TabsTrigger>
          <TabsTrigger value="slac">Activity and Sleep</TabsTrigger>
          <TabsTrigger value="info">{userid?`${userid} info`: 'choose user id'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="heartrate">
            <section id="chartoptions"  className="flex flex-col items-center justify-center space-y-3 mt-3">


              <div className="flex flex-row items-center space-x-1">
                <ComboboxDemo userid={userid} setUserid={setUserid} />
                <AlertDialogDemo date={date} setDate={setDate}/>
              </div>
              <div>
                <Chartconfig hrshow={hrshow} setHrshow={setHrshow}
                             maon={maon} setMaon={setMaon}
                             windowsize={windowsize} setWindowsize={setWindowsize}
                             userid={userid}/>
              </div>
              
            </section>

            {
              userid?

              <section className="flex flex-col items-center justify-center">
                
                <div>{content}</div>
                <p>
                  
                  {
                  
    
               (userData?.timestamps[0] || userData?.timestamps[userData.timestamps.length - 1]) == null?
               `No data in selected timeinterval for this usesr id`
                :
                
                `showing the result from ${new Date(Number(userData?.timestamps[0]) * 1000)} to ${new Date(Number(userData?.timestamps[userData.timestamps.length - 1])*1000)}`} </p>
                
              </section>

              :
              'select user id'

            }
            
        </TabsContent>
        <TabsContent value="slac">
        
        <section className="flex flex-col items-center content-center w-screen">
          
          <section className="flex flex-row items-center justify-between gap-2">
          {/* <ComboboxDemo userid={sleepUserid} setUserid={setSleepuserid} /> */}
          <div className="flex flex-col">

          </div>

          <div className="flex flex-row">

          <ActivityChartconfig/>
          <AlertDialogDemo date={date} setDate={setDate}/>

          </div>

          

          
          
          </section>
          <div className="flex flex-col items-center justify-center">
            {userid? 
              isSleepLoading? <div>Loading...</div>
              :
              <div className="w-screen">
                
                <ECGPlot data={sleepData} steps={stepData} /></div>
              :
              <div>select user id</div>
              }


          </div>

        </section>

        </TabsContent>
        <TabsContent value='info'>

            <section className="mt-2 space-y-2">
              
                  <p className="font-semibold">Your mean heartrate : </p>
                  <p className="font-semibold">Your monthly mean heartrate : </p>
                  <p className="font-semibold">Your weekly mean heartrate : </p>
                  <p className="font-semibold"> daily mean HeartRate : </p>
                  <p className="font-semibold"> night mean heartrate : </p>
            </section>

        </TabsContent>
        
      </Tabs>

      :
      <section className="flex flex-col gap-2">

          <div>You dont have the permission</div>
          <Button onClick={()=> setSeecontent(false)}>Back to login</Button>
      </section>
      
    }
    
    </main>
    </>
  );
}