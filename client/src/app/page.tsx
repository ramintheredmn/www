'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSWR, {preload} from 'swr';
import Chart from "@/components/endUI/Chart";
import { ComboboxDemo } from "@/components/endUI/UseridCombobox";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { DatePickerWithRange } from "@/components/endUI/Datepicker";
import ECGPlot from "@/components/endUI/Sleepchart";
import axios from 'axios'
import Stepchart from "@/components/endUI/Stepchart";

const preFetcher = (url:string) => fetch(url).then(res=>res.json())
const fetcher = async (url:string) => {
  const response = await axios.get(url);
  return response.data;
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
  const [sleepUserid, setSleepuserid] = useState("")
  const { data: userData, error, isLoading } = Fetch(userid? `/api/heartrate/${userid}/86400`: null);
  const [maon, setMaon] = useState(false);
  const [windowsize, setWindowsize] = useState(5);
  const { data: userMa, error: errorma, isLoading: isMAloading } = Fetch(maon?`/api/windowsize/${userid}/${windowsize}/86400`: null);
  const [hrshow, setHrshow] = useState(true)
  const {data: stepData, error: stepError, isLoading: stepLoading} = Fetch(sleepUserid? `/api/steps/${sleepUserid}`: null)
  const [stepShow, setStepshow] = useState(false)
  //console.log(userMa)
  let content;
  if (!userid) {
    content = <div><h1>Select user id</h1></div>;
  } else if (isLoading || (maon && isMAloading)) {
    content = <div>Loading...</div>;
  } else if (error || (maon && errorma)) {
    content = <div>Failed</div>;
  } else {
    content = <div className="w-screen"><Chart heartrate={userData?.heartrate} timestamp={userData?.timestamps} ma={userMa?.ma} show={hrshow} /></div>;
  }

  preload(userid?`/api/sleep/${userid}`: null, preFetcher )
  const {data: sleepData, error: sleepError, isLoading: isSleepL} = useSWR(sleepUserid?`/api/sleep/${sleepUserid}`: null, fetcher)


  return (
    <main className="w-[70vh]screen h-screen  justify-items-center content-center p-0 mt-2">
      <Tabs defaultValue="heartrate" className="flex flex-col justify-items-center items-center w-[70vh]screen rounded">
        <TabsList>
          <TabsTrigger value="heartrate">Heart Rate Analyze</TabsTrigger>
          <TabsTrigger value="slac">Activity and Sleep</TabsTrigger>
        </TabsList>
        <TabsContent value="heartrate">
          <section className="flex flex-col h-full items-center content-center w-screen">
            <section id="chartoptions"  className="flex flex-wrap w-[80vh] items-center justify-between">
              <div className="mt-2 p-2">
                <ComboboxDemo userid={userid} setUserid={setUserid} />
              </div>
              <div className="">
                <Checkbox onCheckedChange={() => setMaon(!maon)} />
                <input 
                  className="w-20 ml-3 p-2 rounded-sm bg-black text-white" 
                  type='number' 
                  value={windowsize} 
                  onChange={(e) => setWindowsize(Number(e.target.value))} 
                /></div>

                <div className="flex flex-row items-center justify-center ml-3">
                  <Checkbox onCheckedChange={()=> {setHrshow(hrshow?false:true)} }/>
                  <p className="flex-grow w-20 ml-3"> disable raw heart rate  </p> 
                  </div>
                <div className="flex-1  w-25"><DatePickerWithRange/></div>
              
            </section>
            <div className="h-[70vh]screen w-[70vh]screen content-center self-center place-content-center place-items-center place-self-center">{content}</div>
            
          </section>
        </TabsContent>
        <TabsContent value="slac">
        
        <section className="flex flex-col items-center content-center w-screen">
          
          <section className="flex flex-row items-center justify-between gap-2">
          <ComboboxDemo userid={sleepUserid} setUserid={setSleepuserid} />
          <Checkbox onCheckedChange={()=> setStepshow(stepShow?false:true)}/>
          <p>show steps data</p>


          </section>
          <div className="h-[70vh]screen w-[70vh]screen content-center self-center place-content-center place-items-center place-self-center">
            {sleepUserid? 
              isSleepL? <div>Loading...</div>
              :
              <div className="w-screen"><ECGPlot data={sleepData} /></div>
              :
              <div>select user id</div>
              }
            {sleepUserid?

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
